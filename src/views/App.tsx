import { Box, Button, ContextView, Inline, Link, Select } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import BrandIcon from "./brand_icon.svg";
import { TextField } from "@stripe/ui-extension-sdk/ui/@sail/ui";

/**
 * This is a view that is rendered in the Stripe dashboard's customer detail page.
 * In stripe-app.json, this view is configured with stripe.dashboard.customer.detail viewport.
 * You can add a new view by running "stripe apps add view" from the CLI.
 */
const App = ({ userContext, environment }: ExtensionContextValue) => {
  return (
    <ContextView
      title="Send checkout link"
      brandColor="#F6F8FA" // replace this with your brand color
      brandIcon={BrandIcon} // replace this with your brand icon
    >
      
      <TextField
        name="amount"
        label="Amount"
        placeholder="100"
        />
      
      <Select
        name="currency"
        label="Currency"
        >
          <option value="aud">Australian Dollar</option>
          <option value="sgd">Singapore Dollar</option>
          <option value="usd">US Dollar</option>
          </Select>
        <TextField
        name="phone"
        label="Phone Number"
        placeholder="+614123456789"
        />
        <Button type ="primary" name="submit" css={{width: 'fill', alignX: 'center'}} onPress={()=>console.log(`Submit Button Pressed`)}>Send</Button>
     
      
    </ContextView>
  );
};

export default App;
