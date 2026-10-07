export interface ClientProject {
  slug: string
  name: string
  logo: string
  category: string
  desc: string
}

export const PROJECTS: ClientProject[] = [
  {
    slug: 'bevick',
    name: 'Bevick Packaging Machineries',
    logo: '/clients/bevick.jpeg',
    category: 'Inventory Management System',
    desc: 'A custom inventory management system that tracks stock levels, machine parts, and product movement in real time — giving Bevick full visibility over their warehouse and sales.',
  },
  {
    slug: 'bluespring',
    name: 'Bluespring Total Connect Ltd.',
    logo: '/clients/bluespring.jpeg',
    category: 'Full Operating System',
    desc: 'An end-to-end operating system for a water and nylon factory — covering production, inventory, sales, distribution, staff, and reporting in a single platform.',
  },
  {
    slug: 'elim',
    name: 'Elim Table Water',
    logo: '/clients/elim.png',
    category: 'Full Operating System',
    desc: 'A complete business operating system for a table water company — managing production runs, stock, orders, deliveries, and finances from one dashboard.',
  },
  {
    slug: 'takehealth',
    name: 'TakeHealth',
    logo: '/clients/takehealth.svg',
    category: 'Website',
    desc: 'A 360° holistic wellness website showcasing TakeHealth\'s Health360+ Program — an adaptive plan combining fitness, function, and feelings for busy professionals, post-op clients, and athletes.',
  },
  {
    slug: 'gallant-grace',
    name: 'Gallant Grace Properties Limited',
    logo: '/clients/Gallant-grace.jpeg',
    category: 'Custom Software',
    desc: 'A tailored digital solution built to streamline Gallant Grace\'s real estate operations and support their growth.',
  },
  {
    slug: 'bodacious',
    name: 'Bodacious Skincare',
    logo: '/clients/bodascious.jpeg',
    category: 'E-commerce Website',
    desc: 'A modern e-commerce store for Bodacious Skincare — product catalogue, cart, and secure checkout that let customers shop their skincare range online.',
  },
  {
    slug: 'adedas',
    name: 'Adedas Multibusiness Ltd',
    logo: '/clients/adedas.jpeg',
    category: 'E-commerce Website',
    desc: 'An elegant e-commerce website for Adedas — showcasing their pure, nourishing, luxury products and letting customers browse and order online.',
  },
  {
    slug: 'fadesrek',
    name: 'Fadesrek Schools',
    logo: '/clients/fadesrek.jpg',
    category: 'School Website',
    desc: 'A school website for Fadesrek\'s primary and secondary schools — presenting the school, its programmes, admissions, and news to parents and students.',
  },
]

// Every logo shown in "Trusted by" strips, each linking to its project card on the About page.
export const CLIENT_LOGOS = PROJECTS.map(p => ({ name: p.name, src: p.logo, href: `/about#project-${p.slug}` }))
