import { NextResponse } from "next/server";
import { WordLookupService } from "@/features/word-lookup/application/WordLookupService";
import { JapaneseDictionaryService } from "@/features/japanese-dictionary/application/JapaneseDictionaryService";
import { JapaneseDictionaryRepository } from "@/features/japanese-dictionary/infrastructure/JapaneseDictionaryRepository";
import { AIExplanationService } from "@/features/ai-explanation/application/AIExplanationService";
import { LlmClient } from "@/features/ai-explanation/infrastructure/LlmClient";
import { AppError, ValidationError } from "@/shared/utils/errors";
import type { WordLookupRequest } from "@/shared/types/api";

export const runtime = "nodejs";

const wordLookupService = new WordLookupService(
  new JapaneseDictionaryService(new JapaneseDictionaryRepository()),
  new AIExplanationService(new LlmClient())
);

export async function POST(request: Request) {
  try {
    let body: Partial<WordLookupRequest>;

    try {
      body = (await request.json()) as Partial<WordLookupRequest>;
    } catch {
      throw new ValidationError("request body must be valid JSON");
    }

    if (typeof body.word !== "string") {
      throw new ValidationError("word must be a string");
    }

    const result = await wordLookupService.explainWord(body.word);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.exposeMessage
              ? error.message
              : "Service temporarily unavailable",
          },
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof Error) {
      console.error("POST /api/words/explain failed", error);
    }

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
