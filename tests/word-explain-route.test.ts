import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/shared/utils/errors";

const explainWordMock = vi.fn();

vi.mock("@/features/word-lookup/application/WordLookupService", () => ({
  WordLookupService: class {
    explainWord = explainWordMock;
  },
}));

vi.mock("@/features/japanese-dictionary/application/JapaneseDictionaryService", () => ({
  JapaneseDictionaryService: class {},
}));

vi.mock(
  "@/features/japanese-dictionary/infrastructure/JapaneseDictionaryRepository",
  () => ({
    JapaneseDictionaryRepository: class {},
  })
);

vi.mock("@/features/ai-explanation/application/AIExplanationService", () => ({
  AIExplanationService: class {},
}));

vi.mock("@/features/ai-explanation/infrastructure/LlmClient", () => ({
  LlmClient: class {},
}));

describe("POST /api/words/explain", () => {
  beforeEach(() => {
    explainWordMock.mockReset();
  });

  it("returns 400 for invalid JSON", async () => {
    const { POST } = await import("@/app/api/words/explain/route");
    const request = new Request("http://localhost/api/words/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "request body must be valid JSON",
      },
    });
    expect(explainWordMock).not.toHaveBeenCalled();
  });

  it("returns the combined lookup response", async () => {
    explainWordMock.mockResolvedValue({
      entry: {
        word: "食べる",
        reading: "たべる",
        meaningZh: "吃；进食",
        partOfSpeech: "动词",
      },
      explanation: {
        actualUsage: "描述吃东西这个动作。",
        commonScenarios: "日常吃饭、点餐、描述饮食习惯。",
        nuanceDifferences: "和近义表达相比更基础直接。",
        commonMistakes: "容易忽略动词变形。",
      },
    });

    const { POST } = await import("@/app/api/words/explain/route");
    const request = new Request("http://localhost/api/words/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: "食べる" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      entry: {
        word: "食べる",
      },
      explanation: {
        actualUsage: "描述吃东西这个动作。",
      },
    });
    expect(explainWordMock).toHaveBeenCalledWith("食べる");
  });

  it("hides internal messages for non-exposed app errors", async () => {
    explainWordMock.mockRejectedValue(
      new AppError("DATABASE_URL is not configured", 503, "CONFIGURATION_ERROR")
    );

    const { POST } = await import("@/app/api/words/explain/route");
    const request = new Request("http://localhost/api/words/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: "食べる" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "CONFIGURATION_ERROR",
        message: "Service temporarily unavailable",
      },
    });
  });
});
