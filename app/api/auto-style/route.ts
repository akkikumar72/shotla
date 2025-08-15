import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import type { AutoStylePayload, GenerationConfig } from "@/types";

// Enhanced schema for the AI response
const aiStyleSchema = z.object({
  backgroundCss: z
    .string()
    .describe(
      "A complex, multi-layered CSS background property using linear-gradient, radial-gradient, and conic-gradient"
    ),
  backgroundName: z
    .string()
    .describe("A creative name for this background style"),
  description: z.string().describe("A brief description of the visual style"),
  canvasRadius: z
    .number()
    .min(0)
    .max(64)
    .describe("Canvas corner radius (0-64)"),
  frameBorderRadius: z
    .number()
    .min(0)
    .max(64)
    .describe("Window frame corner radius (0-64)"),
  padding: z.number().min(16).max(128).describe("Canvas padding (16-128)"),
  shadow: z.number().min(0).max(100).describe("Frame shadow intensity (0-100)"),
  windowHeaderStyle: z
    .enum(["dark", "light", "none"])
    .describe("Style of the macOS window header"),
  noise: z.boolean().describe("Apply a noise overlay"),
});

export async function POST(req: Request) {
  try {
    const payload: AutoStylePayload = await req.json();
    const { contents, generationConfig } = payload;

    if (!contents.inlineData?.data) {
      return Response.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Extract image data and system prompt
    const imageData = contents.inlineData.data;
    const systemPrompt = contents.text;

    const result = await generateObject({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this screenshot and create a stunning CSS background style that complements it. Make it vibrant, artistic, and visually striking.",
            },
            {
              type: "image",
              image: imageData,
            },
          ],
        },
      ],
      schema: aiStyleSchema,
    });

    return Response.json({
      success: true,
      style: result.object,
    });
  } catch (error) {
    console.error("Auto-style error:", error);
    return Response.json(
      {
        error: "Failed to generate style",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
