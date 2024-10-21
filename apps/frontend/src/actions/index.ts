import { sendFeedback } from "../utils/send-feedback";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  sendFeedback: defineAction({
    input: z.object({
      sentiment: z.string(),
      url: z.string(),
      feedback: z.string(),
    }),
    handler: async (input) => {
      console.log(input);
      await sendFeedback({
        sentiment: input.sentiment,
        url: input.url,
        feedback: input.feedback,
      });
    },
  }),
};
