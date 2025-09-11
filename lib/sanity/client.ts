import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { ClientConfig, ClientPerspective } from "@sanity/client";

// Using known working configuration
const projectId = '6bhzpimk';
const dataset = 'dev';

const config: Omit<ClientConfig, "perspective"> & {
  perspective: ClientPerspective;
} = {
  projectId,
  dataset,
  apiVersion: "2024-03-07",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
  perspective: "published" as const,
};

export const client = createClient({
  ...config,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
