import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    movies: defineCollection({
      type: 'data',
      source: 'movies/**.json',
      schema: z.object({
            title: z.string(),
            src: z.string(),
            genre: z.string()
          })
      })
    }
})