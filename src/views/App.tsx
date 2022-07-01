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
const CHECKOUT_SUCCESS_URL = 'https://whaddup-stripe-app.glitch.me/checkout/success';
const CHECKOUT_CANCEL_URL = 'https://whaddup-stripe-app.glitch.me/checkout/cancel';
const PRICE_ID = "price_1LDiupLqJpnKpuHTHiMArnYA";

/**
 * This is a view that is rendered in the Stripe dashboard's customer detail page.
 * In stripe-app.json, this view is configured with stripe.dashboard.customer.detail viewport.
 * You can add a new view by running "stripe apps add view" from the CLI.
 */
const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [customer, setCustomer] = useState();

  const submitHandler = async () => {
    const session = await stripe.checkout.sessions.create({
      success_url: CHECKOUT_SUCCESS_URL,
      cancel_url: CHECKOUT_CANCEL_URL,
      line_items: [
        {price: PRICE_ID, quantity: 1},
      ],
      customer: customer.id!,
      mode: 'payment',
    });

    console.log(session);

    await fetch(BACKEND_URL, {
      body: JSON.stringify({
        customerId: customer.id!
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      method: "post",
    });
  }

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const fetchedCustomer = await stripe.customers.retrieve(environment.objectContext!.id!);
        setCustomer(fetchedCustomer);
      } catch (error) {
        console.log("Error fetching setting: ", error);
      }
    };

    fetchCustomer();
  }, []);

  return (
    <ContextView
      title="Whazzapp!"
      brandColor="#2db843" // replace this with your brand color
      brandIcon={BrandIcon} // replace this with your brand icon
    >

      <TextField
        label="Product Name"
        name="productName"
        placeholder="Whazzapp!"
      />

      <Box
        css={{
          stack: 'x',
          gap: 'medium',

          alignX: 'start',
        }}>
        <Box css={{ width: '3/4', paddingTop: 'medium' }}>
          <TextField
            label="Amount"
            name="amount"
            placeholder="100"
          />
        </Box>
        <Box css={{ paddingTop: 'medium' }}>
          <Select
            name="currency"
            label="Currency"
          >
            <option value="aud">AUD</option>
            <option value="sgd">SGD</option>
            <option value="usd">USD</option>
          </Select>
        </Box>
      </Box>

      <TextField
        css={{ paddingTop: 'medium' }}
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="+614123456789"
        value={customer ? customer.phone : ""}
      />
      <Button type="primary" name="submit" css={{ width: 'fill', alignX: 'center', marginTop: 'medium' }} onPress={submitHandler}>Send</Button>

      <Table css={{ marginTop: "medium" }}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>22 Jun 22</TableCell>
            <TableCell>$44.00</TableCell>
            <TableCell><Badge type='neutral'>Sent</Badge> <Icon name="paymentLink" size='medium' css={{ paddingLeft: "small" }} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>21 Jun 22</TableCell>
            <TableCell>$12.00</TableCell>
            <TableCell><Badge type='info'>Read</Badge><Icon name="paymentLink" size='medium' css={{ paddingLeft: "small" }} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>18 Jun 22</TableCell>
            <TableCell>$22.22</TableCell>
            <TableCell><Badge type='positive'>Paid</Badge><Icon name="paymentLink" size='medium' css={{ paddingLeft: "small" }} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>15 Jun 22</TableCell>
            <TableCell>$499.00</TableCell>
            <TableCell><Badge type='negative'>Expired</Badge><Icon name="paymentLink" size='medium' css={{ paddingLeft: "small" }} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>1 Jun 22</TableCell>
            <TableCell>$24.82</TableCell>
            <TableCell><Badge type='urgent'>Error</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </ContextView>

  );
};

export default App;
