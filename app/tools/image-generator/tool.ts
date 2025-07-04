import { openai } from "@ai-sdk/openai";

export const dallEImageGeneratorTool = {
  name: "dall_e_image_generator",
  description: "Generate an image from a text prompt using GPT-Image-1.",
  parameters: {
    type: "object",
    properties: {
      prompt: { type: "string", description: "The image description prompt" },
    },
    required: ["prompt"],
  },
  execute: async ({ prompt }: { prompt: string }) => {
    const model = openai.image("gpt-image-1");
    const response = await model.doGenerate({
      prompt,
      n: 1,
      size: "1024x1024",
      aspectRatio: undefined,
      seed: undefined,
      providerOptions: {},
    });
    return { image: response.images[0] };
  },
}; 