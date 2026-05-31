/** Marketing category — consent-gated marketing communication type. */
export const MARKETING_CATEGORIES = [
  'promotions',
  'recommendations',
  'restock_alerts',
  'events',
] as const;

export type MarketingCategory = (typeof MARKETING_CATEGORIES)[number];

export const MARKETING_CATEGORY_LABELS: Record<MarketingCategory, string> = {
  promotions: 'Promotions',
  recommendations: 'Recommendations',
  restock_alerts: 'Restock Alerts',
  events: 'Events',
};

export const MARKETING_CATEGORY_DESCRIPTIONS: Record<MarketingCategory, string> = {
  promotions: 'sales, new products, seasonal offers',
  recommendations: 'personalized product suggestions',
  restock_alerts: 'wishlisted products back in stock',
  events: 'in-store event notifications at preferred store',
};

export function isMarketingCategory(value: string): value is MarketingCategory {
  return (MARKETING_CATEGORIES as readonly string[]).includes(value);
}
