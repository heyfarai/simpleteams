import { Metadata } from "next";

const siteConfig = {
  name: "National Capital Hoops Circuit",
  description:
    "Elite basketball league in Ottawa featuring competitive divisions, player development, and championship tournaments. Register your team today.",
  url: "https://natcaphoops.com",
  ogImage: "/og-image.jpg",
  twitterImage: "/twitter-image.jpg",
  favicon: "/favicon.ico",
  keywords: [
    "basketball league ottawa",
    "ottawa basketball",
    "basketball tournaments",
    "youth basketball ottawa",
    "competitive basketball league",
    "basketball registration ottawa",
    "national capital hoops",
    "ottawa sports league",
    "basketball teams ottawa",
    "basketball divisions ottawa",
  ],
};

interface MetadataConfig {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

export function generateMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  noIndex = false,
  canonical,
}: MetadataConfig = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description;
  const pageImage = image.startsWith("http")
    ? image
    : `${siteConfig.url}${image}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description: pageDescription,
    keywords: siteConfig.keywords,
    authors: authors
      ? authors.map((name) => ({ name }))
      : [{ name: "National Capital Hoops Circuit" }],
    creator: "National Capital Hoops Circuit",
    publisher: "National Capital Hoops Circuit",
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    canonical: canonical || siteConfig.url,

    // Open Graph
    openGraph: {
      type,
      title: pageTitle,
      description: pageDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_CA",
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors || ["National Capital Hoops Circuit"],
        section,
        tags,
      }),
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      site: "@natcaphoops",
      creator: "@natcaphoops",
      title: pageTitle,
      description: pageDescription,
      images: [siteConfig.twitterImage],
    },

    // Additional meta tags
    other: {
      "geo.region": "CA-ON",
      "geo.placename": "Ottawa",
      "geo.position": "45.4215;-75.6972",
      ICBM: "45.4215, -75.6972",
      language: "en-CA",
      "revisit-after": "7 days",
      rating: "general",
      distribution: "global",
    },
  };
}

// Structured Data Generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "National Capital Hoops Circuit",
    alternateName: "NCHC",
    description:
      "Elite basketball league in Ottawa featuring competitive divisions, player development, and championship tournaments.",
    url: "https://natcaphoops.com",
    logo: `${siteConfig.url}/nchc-logo.webp`,
    image: `${siteConfig.url}/og-image.jpg`,
    email: "natcaphoops@gmail.com",
    sport: "Basketball",
    sameAs: ["https://www.instagram.com/natcaphoops/"],
    foundingDate: "2024",
    memberOf: {
      "@type": "Organization",
      name: "Basketball Canada",
    },
  };
}

export function generateGameSchema(game: {
  name: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  venueAddress?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: game.name,
    startDate: game.date,
    sport: "Basketball",
    competitor: [
      {
        "@type": "SportsTeam",
        name: game.homeTeam,
      },
      {
        "@type": "SportsTeam",
        name: game.awayTeam,
      },
    ],
    location: {
      "@type": "Place",
      name: game.venue,
      ...(game.venueAddress && {
        address: {
          "@type": "PostalAddress",
          streetAddress: game.venueAddress,
          addressLocality: "Ottawa",
          addressRegion: "ON",
          addressCountry: "CA",
        },
      }),
    },
    organizer: {
      "@type": "SportsOrganization",
      name: "National Capital Hoops Circuit",
    },
  };
}

export function generateTeamSchema(team: {
  name: string;
  description?: string;
  logo?: string;
  coach?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: "Basketball",
    ...(team.description && { description: team.description }),
    ...(team.logo && { logo: team.logo }),
    ...(team.coach && {
      coach: {
        "@type": "Person",
        name: team.coach,
      },
    }),
    memberOf: {
      "@type": "SportsOrganization",
      name: "National Capital Hoops Circuit",
    },
  };
}

export function generatePlayerSchema(player: {
  name: string;
  team?: string;
  position?: string;
  jerseyNumber?: number;
  photo?: string;
  height?: string;
  weight?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    ...(player.photo && { image: player.photo }),
    ...(player.team && {
      memberOf: {
        "@type": "SportsTeam",
        name: player.team,
      },
    }),
    ...(player.position && { jobTitle: player.position }),
    ...(player.jerseyNumber && {
      identifier: {
        "@type": "PropertyValue",
        name: "Jersey Number",
        value: player.jerseyNumber.toString(),
      },
    }),
    ...(player.height && {
      height: {
        "@type": "QuantitativeValue",
        value: player.height,
      },
    }),
    ...(player.weight && {
      weight: {
        "@type": "QuantitativeValue",
        value: player.weight,
        unitCode: "LBR",
      },
    }),
  };
}
