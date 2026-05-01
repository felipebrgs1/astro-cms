import { defineCollection, z } from "astro:content";
import { createLocalDb, getPublishedPosts, getPublishedPages } from "@astroweb/db";

const posts = defineCollection({
  loader: {
    name: "posts-db",
    load: async ({ store }) => {
      const db = createLocalDb();
      const allPosts = await getPublishedPosts(db);

      allPosts.forEach((post) => {
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
      const db = createLocalDb();
      const allPages = await getPublishedPages(db);

      allPages.forEach((page) => {
        store.set({
          id: page.slug,
          data: {
            title: page.title,
            createdAt: page.createdAt,
          },
          body: page.content,
        });
      });
    },
  },
  schema: z.object({
    title: z.string(),
    createdAt: z.string(),
  }),
});

export const collections = { posts, pages };
