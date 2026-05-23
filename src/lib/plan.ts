/**
 * The single product. Kept as plain data (no Dinar import) so client components
 * can render the price without pulling money/server code into the browser bundle.
 * The amount is re-asserted server-side in the start route — never trust a price
 * that came from the client.
 */
export const PLAN = {
  id: 'pro',
  amountDinars: 5000,
  currency: 'DZD',
} as const;
