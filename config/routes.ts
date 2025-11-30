export const routes = {
  home: '/',
  products: '/products',
  productDetail: (id: string) => `/products/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  orderConfirmation: (orderId: string) => `/order-confirmation/${orderId}`,
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
} as const;

export const navigation = [
  { name: 'Home', href: routes.home },
  { name: 'Shop Blades', href: routes.products },
  { name: 'Contact', href: routes.contact },
];

export const footerLinks = {
  shop: [
    { name: 'All Products', href: routes.products },
    { name: 'Swords', href: `${routes.products}?category=swords` },
    { name: 'Katanas', href: `${routes.products}?category=katanas` },
    { name: 'Daggers', href: `${routes.products}?category=daggers` },
  ],
  company: [
    { name: 'About Us', href: routes.home },
    { name: 'Contact', href: routes.contact },
  ],
  legal: [
    { name: 'Privacy Policy', href: routes.privacyPolicy },
    { name: 'Terms of Service', href: routes.termsOfService },
  ],
};

export type Route = typeof routes[keyof typeof routes];


