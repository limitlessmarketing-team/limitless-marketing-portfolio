import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { site } from "../site.config";
import "./globals.css";

/**
 * `viewport-fit: "cover"` is what makes env(safe-area-inset-*) resolve to real
 * values on notched iPhones. Without it the header can't cover the status-bar
 * strip and page content shows through above it while scrolling.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05070c",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? new URL(site.url).host;
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.jpg", metadataBase).toString();

  return {
    metadataBase,
    title: site.title,
    description: site.description,
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: "/favicon.svg",
    },
    openGraph: {
      title: site.title,
      description: site.description,
      siteName: site.name,
      type: "website",
      url: metadataBase.toString(),
      images: [{ url: socialImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [socialImage],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Deliberately ProfessionalService rather than LocalBusiness — no service area
 * or street address is claimed, so the brand reads as national, not regional.
 */
function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    image: `${site.url}/og.jpg`,
    telephone: site.phone.e164,
    email: site.email,
    priceRange: "$$",
    areaServed: "Worldwide",
    serviceType: "Website design and development",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: site.phone.e164,
      email: site.email,
      availableLanguage: "English",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Schema.org payload is built from local constants, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        {/* Analytics slot — set `plausibleDomain` in site.config.ts to enable.
            Cookie-free and GDPR-friendly, so no consent banner is required.
            Swap this block if you'd rather use GA4, Fathom or similar. */}
        {site.plausibleDomain && (
          <script
            defer
            data-domain={site.plausibleDomain}
            src="https://plausible.io/js/script.outbound-links.tagged-events.js"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
