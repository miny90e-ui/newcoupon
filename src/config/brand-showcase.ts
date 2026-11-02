// Product photos shown on a brand's home page banner instead of the stock category photo,
// keyed by store slug. Hand-picked from the brand's own shop; the images stay on the brand's
// Shopify CDN and `?width=` asks it for a right-sized copy.
export type Showcase = { backdrop: string; products: [string, string, string] };

const CLUCK = "https://cdn.shopify.com/s/files/1/0570/6655/3496/files";

export const BRAND_SHOWCASE: Record<string, Showcase> = {
  "my-cluck-hut": {
    backdrop: `${CLUCK}/stocking-cluckers-my-cluckin-gift-bundles-9234691.jpg?width=1100`,
    products: [
      `${CLUCK}/another-one-bites-the-crust-my-cluckin-holiday-jar-9917864.jpg?width=360`,
      `${CLUCK}/my-cluckin-holiday-jar-bundle-1190185.jpg?width=440`,
      `${CLUCK}/sleigh-my-name-sleigh-my-name-my-cluckin-holiday-jar-7726017.jpg?width=360`,
    ],
  },
};
