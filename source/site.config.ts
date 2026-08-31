/**
 * Single source of truth for everything you'll want to edit.
 * Change values here instead of hunting through JSX.
 */

export const site = {
  name: "Limitless Marketing Group",
  legalName: "Limitless Marketing Group",
  /** Used for canonical URLs, sitemap and JSON-LD. Update after you attach a custom domain. */
  url: "https://nolimitwebs.com",
  title: "Limitless Marketing Group | Website Portfolio",
  description:
    "Conversion-focused websites and free custom mockups for ambitious growing businesses.",
  phone: {
    display: "(801) 900-0277",
    /** E.164 — used for tel: and sms: links and structured data. */
    e164: "+18019000277",
  },
  email: "contact@limitlessxcollective.com",
  /**
   * Optional. Set to your domain (e.g. "limitlessmarketing.com") to enable
   * privacy-friendly Plausible analytics. Leave empty to ship no analytics at all.
   * Swap the script in app/layout.tsx if you prefer a different provider.
   */
  plausibleDomain: "",
} as const;

export const founders = {
  /** Shown in the "who you're working with" block. Set `show: false` to hide it. */
  show: true,
  people: [
    { name: "McKay Nelson", role: "Founder" },
    { name: "Sawyer Rawlings", role: "Founder" },
  ],
  bio: "You work directly with the people building your site — no account managers, no handoffs, no offshore team. Every project is designed and built start to finish by the same hands.",
} as const;

export type Project = {
  slug: string;
  name: string;
  /**
   * Real domain, shown under the card. Only rendered when `concept` is false —
   * a preview subdomain isn't worth showing, and printing a domain the project
   * doesn't actually live on would be a lie.
   */
  displayDomain: string | null;
  /** Where the card actually links. */
  href: string;
  /** One-line descriptor under the project name, e.g. "HVAC · Utah County". */
  sector: string;
  summary: string;
  tags: string[];
  /**
   * Screenshot path in `public/`, or `null` while one is still being captured —
   * the card then renders a designed "capture in progress" tile instead of a
   * broken or blank image.
   */
  image: string | null;
  /** Native pixel dimensions of `image`, so the browser reserves space (no layout shift). */
  imageWidth: number;
  imageHeight: number;
  /**
   * `true` for design concepts / mockups, `false` for shipped client sites.
   * Concept work gets an honest badge instead of implying a live engagement.
   */
  concept: boolean;
};

/**
 * Portfolio order is deliberate: our own live site on a real custom domain leads
 * as the credibility anchor, then the two home-service builds that mirror the
 * businesses this page gets sent to.
 *
 * To add a screenshot: drop a 16:9 file (≈1600×900) in `public/` and point
 * `image` at it. Until then `image: null` renders a designed capture tile.
 */
export const projects: Project[] = [
  {
    slug: "basalt-roofing",
    name: "Basalt Roofing Co.",
    sector: "Roofing & storm restoration",
    displayDomain: null,
    href: "https://basalt-roofing.vercel.app",
    summary:
      "A roofing company built on documentation — photo-logged inspections, spec-sheet installs and honest storm-claim assessments that turn homeowner distrust of roofers into the reason to call.",
    tags: ["Roofing", "Storm claims", "Free inspections"],
    image: "/basalt-preview.jpg",
    imageWidth: 1600,
    imageHeight: 900,
    concept: true,
  },
  {
    slug: "kestrel-heating-air",
    name: "Kestrel Heating & Air",
    sector: "HVAC service",
    displayDomain: null,
    href: "https://kestrel-heating-air.vercel.app",
    summary:
      "A family-owned HVAC company competing against national chains. Clear service pages, upfront trust signals and a single obvious next step make it easy for homeowners to pick up the phone.",
    tags: ["HVAC", "Multi-service", "Lead generation"],
    image: "/kestrel-preview.jpg",
    imageWidth: 1600,
    imageHeight: 900,
    concept: true,
  },
  {
    slug: "halstead-fence",
    name: "Halstead Fence Co.",
    sector: "Residential fencing",
    displayDomain: null,
    href: "https://halstead-fence.vercel.app",
    summary:
      "A Fort Collins fencing company positioned as the premium choice. A dark, refined look, real project spec cards and trust signals — written proposals, own crews, and a workmanship warranty — set it apart from chain-link competitors.",
    tags: ["Fencing", "Premium positioning", "Estimate requests"],
    image: "/halstead-preview.jpg",
    imageWidth: 1600,
    imageHeight: 900,
    concept: true,
  },
  {
    slug: "bluestem-landscape",
    name: "Bluestem Landscape Co.",
    sector: "Landscape design & build",
    displayDomain: null,
    href: "https://bluestem-landscape.vercel.app",
    summary:
      "A design-led landscaping company for Colorado's Front Range. A warm, editorial look, water-wise project stories and a consultation-first funnel position them as the considered choice — not the cheapest bid.",
    tags: ["Landscaping", "Design-led", "Consultation funnel"],
    image: "/bluestem-preview.jpg",
    imageWidth: 1600,
    imageHeight: 900,
    concept: true,
  },
  {
    slug: "formline-concrete",
    name: "Formline Concrete Co.",
    sector: "Custom concrete",
    displayDomain: null,
    href: "https://formline-concrete.vercel.app",
    summary:
      "A concrete contractor that competes on craft instead of price. An industrial-modern look, spec-sheet trust signals and a written-estimate promise turn a commodity trade into a premium buy.",
    tags: ["Concrete", "Premium positioning", "Written estimates"],
    image: "/formline-preview.jpg",
    imageWidth: 1600,
    imageHeight: 900,
    concept: true,
  },
  {
    slug: "alpenglow-painting",
    name: "Alpenglow Painting Co.",
    sector: "Painting & property care",
    displayDomain: null,
    href: "https://alpenglow-painting.vercel.app",
    summary:
      "An owner-run painting company needed a site that made craftsmanship obvious at a glance. Service breakdowns, a before-and-after gallery and a three-step process turn browsing homeowners into estimate requests.",
    tags: ["Residential", "Before / after gallery", "Estimate requests"],
    image: "/alpenglow-preview.jpg",
    imageWidth: 1600,
    imageHeight: 900,
    concept: true,
  },
];

export type Testimonial = {
  quote: string;
  author: string;
  /** e.g. "Owner, Kestrel Heating & Air" */
  role: string;
};

/**
 * Real client quotes only. The testimonial section renders nothing while this
 * array is empty, so the page never shows placeholder praise.
 *
 * Example:
 *   { quote: "Booked three jobs the first week.", author: "Sam R.", role: "Owner, Kestrel Heating & Air" }
 */
export const testimonials: Testimonial[] = [];

export const processSteps = [
  {
    number: "01",
    title: "Quick conversation",
    body: "We learn about your business, your customers, and what you want the website to accomplish.",
  },
  {
    number: "02",
    title: "Free custom mockup",
    body: "We design a tailored concept so you can see the real direction before you spend anything. No cost, no obligation.",
  },
  {
    number: "03",
    title: "Launch with confidence",
    body: "If you love it, we quote the project up front, refine the details, and turn the concept into your finished website.",
  },
] as const;

export const values = [
  {
    number: "01",
    title: "Look established",
    body: "A professional online presence builds trust before the first conversation.",
  },
  {
    number: "02",
    title: "Make it easy",
    body: "Clear messaging and intentional calls to action guide visitors toward contacting you.",
  },
  {
    number: "03",
    title: "Stand apart",
    body: "A custom design gives your business a distinct identity in a crowded market.",
  },
] as const;

export const signals = [
  "Clear strategy",
  "Premium design",
  "Built to convert",
  "Made for growing businesses",
] as const;

export const telHref = `tel:${site.phone.e164}`;
export const smsHref = `sms:${site.phone.e164}`;
export const mailHref = `mailto:${site.email}`;

/**
 * Where the contact form sends leads. The publishable key is safe to ship in
 * the page: it can INSERT into portfolio_leads and nothing else (see
 * ../supabase/README.md).
 */
export const leadCapture = {
  url: "https://sdpmvuedcfepbedntdev.supabase.co",
  table: "portfolio_leads",
  publishableKey: "sb_publishable_Bp9zkkMoU2Sg728Lzh1p1g_TsOqsBqn",
} as const;
