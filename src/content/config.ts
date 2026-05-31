import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.union([z.string(), z.date()]),
    tags: z.array(z.string()),
    readTime: z.string(),
  }),
});

export const collections = {
  posts: postsCollection,
};
