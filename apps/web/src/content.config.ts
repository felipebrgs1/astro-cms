import { defineCollection, z } from "astro:content";
import { createLocalDb, getPublishedPosts, getPublishedPages } from "@astroweb/db";

const posts = defineCollection({
  loader: {
    name: "posts-db",
    load: async ({ store }) => {
      const db = await createLocalDb();

      async function sync() {
        const allPosts = await getPublishedPosts(db);
        const currentIds = new Set<string>();

        allPosts.forEach((post) => {
          currentIds.add(post.slug);
          store.set({
            id: post.slug,
            data: {
              title: post.title,
              excerpt: post.excerpt ?? "",
              featuredImage: post.featuredImage ?? "",
              author: post.author ?? "",
              createdAt: post.createdAt,
            },
            body: post.content,
          });
        });

        // Remove posts that were deleted/unpublished
        for (const entry of store.entries()) {
          if (!currentIds.has(entry.id)) {
            store.delete(entry.id);
          }
        }
      }

      await sync();

      // Poll for changes every 2s in dev mode
      if (import.meta.env.DEV) {
        setInterval(sync, 2000);
      }
    },
  },
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    author: z.string().optional(),
    createdAt: z.string(),
  }),
});

const pages = defineCollection({
  loader: {
    name: "pages-db",
    load: async ({ store }) => {
      const db = await createLocalDb();

      async function sync() {
        const allPages = await getPublishedPages(db);
        const currentIds = new Set<string>();

        allPages.forEach((page) => {
          currentIds.add(page.slug);
          store.set({
            id: page.slug,
            data: {
              title: page.title,
              createdAt: page.createdAt,
            },
            body: page.content,
          });
        });

        for (const entry of store.entries()) {
          if (!currentIds.has(entry.id)) {
            store.delete(entry.id);
          }
        }
      }

      await sync();

      if (import.meta.env.DEV) {
        setInterval(sync, 2000);
      }
    },
  },
  schema: z.object({
    title: z.string(),
    createdAt: z.string(),
  }),
});

export const collections = { posts, pages };
