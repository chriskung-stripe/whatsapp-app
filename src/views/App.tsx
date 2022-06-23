import { Icon, Accordion, AccordionItem, Box, Badge, Button, ContextView, Divider, Inline, Link, Select, Table, TableHead, TableHeaderCell, TextField, TableRow, TableBody, TableCell } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import BrandIcon from "./whatsapp_icon.svg";

/**
 * This is a view that is rendered in the Stripe dashboard's customer detail page.
 * In stripe-app.json, this view is configured with stripe.dashboard.customer.detail viewport.
 * You can add a new view by running "stripe apps add view" from the CLI.
 */
const App = ({ userContext, environment }: ExtensionContextValue) => {
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
      gap:'medium',
      
      alignX:'start',
    }}>
    <Box css={{width:'3/4', paddingTop:'medium' }}>  
    <TextField
    label="Amount"
    name="amount"
    placeholder="100"
    />
</Box>
<Box css={{paddingTop:'medium' }}>  
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
       css={{ paddingTop:'medium' }}
    label="Phone Number"
    name="phone"
    type="tel"
    placeholder="+614123456789"
    />
        <Button type ="primary" name="submit" css={{width: 'fill', alignX: 'center', marginTop:'medium'}} onPress={()=>console.log(`Submit Button Pressed`)}>Send</Button>
   
    <Table css={{marginTop:"medium"}}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Payment Date</TableHeaderCell>
          <TableHeaderCell>Amount</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>22 Jun 22</TableCell>
          <TableCell>$44.00</TableCell>
          <TableCell><Badge type='neutral'>Sent</Badge> <Icon name="paymentLink" size='medium' css={{paddingLeft:"small"}}/></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>21 Jun 22</TableCell>
          <TableCell>$12.00</TableCell>
          <TableCell><Badge type='info'>Read</Badge><Icon name="paymentLink" size='medium' css={{paddingLeft:"small"}}/></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>18 Jun 22</TableCell>
          <TableCell>$22.22</TableCell>
          <TableCell><Badge type='positive'>Paid</Badge><Icon name="paymentLink" size='medium' css={{paddingLeft:"small"}}/></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>15 Jun 22</TableCell>
          <TableCell>$499.00</TableCell>
          <TableCell><Badge type='negative'>Expired</Badge><Icon name="paymentLink" size='medium' css={{paddingLeft:"small"}}/></TableCell>
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
