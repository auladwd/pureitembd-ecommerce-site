export function formatCurrency(amount: number): string {
  return `৳${amount.toFixed(2)}`;
}

export function calculateShipping(subtotal: number): number {
  const FREE_SHIPPING_THRESHOLD = 1000;
  const SHIPPING_COST = 80;

  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
