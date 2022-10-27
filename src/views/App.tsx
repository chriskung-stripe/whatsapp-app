import { Icon, Accordion, AccordionItem, Box, Badge, Button, ContextView, Divider, Inline, Link, Select, Table, TableHead, TableHeaderCell, TextField, TableRow, TableBody, TableCell } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useEffect, useState } from "react";
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';
import Stripe from 'stripe';

import BrandIcon from "./whatsapp_icon.svg";

// Initiate communication with the stripe client.
const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
})

const BACKEND_URL = "https://whaddup-stripe-app.glitch.me/api/messages";
const PRICES_BE_URL = "https://whaddup-stripe-app.glitch.me/api/prices";
const CHECKOUT_SUCCESS_URL = 'https://snow-copper-jingle.glitch.me/';
const CHECKOUT_CANCEL_URL = 'https://whaddup-stripe-app.glitch.me/checkout/cancel';
const PRICE_ID = "price_1LDiupLqJpnKpuHTHiMArnYA";

const REFRESH_INTERVAL = 3000;
const PAYMENT_LINK_WA_TEMPLATE = "stripe_payment_link_3";

/**
 * This is a view that is rendered in the Stripe dashboard's customer detail page.
 * In stripe-app.json, this view is configured with stripe.dashboard.customer.detail viewport.
 * You can add a new view by running "stripe apps add view" from the CLI.
 */
const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [customer, setCustomer] = useState();
  const [ledger, setLedger] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState();

  const submitHandler = async () => {
    const session = await stripe.checkout.sessions.create({
      success_url: CHECKOUT_SUCCESS_URL,
      cancel_url: CHECKOUT_CANCEL_URL,
      line_items: [
        { price: selectedPrice, quantity: 1 },
      ],
      customer: customer.id!,
      mode: 'payment',
    });

    await fetch(BACKEND_URL, {
      body: JSON.stringify({
        customerId: customer.id!,
        event: "Payment Link Sent",
        template: {
          name: PAYMENT_LINK_WA_TEMPLATE,
          language: { code: "en" },
          components: [
            {
              type: "button",
              sub_type: "url",
              index: 0,
              parameters: [
                {
                  type: "text",
                  text: session.url.replace(
                    "https://checkout.stripe.com/c/pay/",
                    ""
                  ),
                },
              ],
            },
          ],
        }
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      method: "post",
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCustomer, fetchedPrices] = await Promise.all([
          stripe.customers.retrieve(environment.objectContext!.id!),
          fetch(PRICES_BE_URL, {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }).then((resp) => resp.json())
        ])

        setCustomer(fetchedCustomer);
        setPrices(fetchedPrices);
      } catch (error) {
        console.log("Error fetching setting: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchLedger = await fetch(BACKEND_URL + `?customerId=${environment.objectContext!.id!}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      setLedger(await fetchLedger.json());
    }

    const intervalId = setInterval(async () => {  //assign interval to a variable to clear it.
      await fetchData();
    }, REFRESH_INTERVAL);

    fetchData();

    return () => clearInterval(intervalId); //This is important

  }, [])

  return (
    <ContextView
      title="Whazzapp!"
      brandColor="#2db843" // replace this with your brand color
      brandIcon={BrandIcon} // replace this with your brand icon
    >
      <Box css={{ weight: 400 }}>Sending to:</Box>
      <Box css={{ fontSize: "2em", weight: 400, paddingBottom: 'medium' }}>{customer ? customer.phone : "...loading"}</Box>
      <Select
        name="priceId"
        label="Select the Product &amp; Price"
        onChange={(e) => {
          setSelectedPrice(e.target.value);
        }}
      >
        <option value="">Choose an option</option>
        {prices.map((price, index) => {
          const displayPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: price.currency.toUpperCase() }).format(price.unit_amount / 100)
          return (
            <option key={index} value={price.id}>{price.product.name + " - " + displayPrice}</option>
          )
        })}
      </Select>

      <Button type="primary" name="submit" css={{ width: 'fill', alignX: 'center', marginTop: 'medium' }} onPress={submitHandler}>Send Checkout Link</Button>

      <Table css={{ marginTop: "medium" }}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Message</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ledger && ledger.map((item) => {
            let badgeType;

            switch (item.status) {
              case "read":
                badgeType = "positive";
                break;

              case "delivered":
                badgeType = "info";
                break;

              case "sent":
                badgeType = "warning";
                break;

              case "failed":
                badgeType = "negative";
                break;

              default:
                badgeType = "neutral";
                break;
            }

            const createdAtDisplay = new Intl.DateTimeFormat('en-US',
              { dateStyle: 'short', timeStyle: 'short' }).format(Date.parse(item.createdAt)
              );

            return (
              <TableRow key={item.id}>
                <TableCell>{item.event}</TableCell>
                {/* <TableCell>{item.createdAt}</TableCell> */}
                <TableCell>{createdAtDisplay}</TableCell>
                <TableCell><Badge type={badgeType}>{item.status}</Badge></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

    </ContextView>

  );
};

export default App;
