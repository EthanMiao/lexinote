import { afterEach, describe, expect, it, vi } from "vitest";
import { LlmClient } from "@/features/ai-explanation/infrastructure/LlmClient";

describe("LlmClient", () => {
  const originalApiKey = process.env.OPENAI_API_KEY;
  const originalFetch = global.fetch;

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns structured fallback when OPENAI_API_KEY is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    const client = new LlmClient();

    await expect(
      client.explainWordForZhNative({
        word: "食べる",
        reading: "たべる",
        meaningZh: "吃；进食",
        partOfSpeech: "动词",
      })
    ).resolves.toMatchObject({
      actualUsage: expect.any(String),
      commonScenarios: expect.any(String),
      nuanceDifferences: expect.any(String),
      commonMistakes: expect.any(String),
    });
  });

  it("parses structured JSON output from the model response", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          actualUsage: "用于描述吃东西的动作。",
          commonScenarios: "吃饭、点餐、说明饮食行为。",
          nuanceDifferences: "和口语里的其他表达相比更基础直接。",
          commonMistakes: "容易漏掉变形和助词搭配。",
        }),
      }),
    }) as typeof fetch;

    const client = new LlmClient();

    await expect(
      client.explainWordForZhNative({
        word: "食べる",
        reading: "たべる",
        meaningZh: "吃；进食",
        partOfSpeech: "动词",
      })
    ).resolves.toEqual({
      actualUsage: "用于描述吃东西的动作。",
      commonScenarios: "吃饭、点餐、说明饮食行为。",
      nuanceDifferences: "和口语里的其他表达相比更基础直接。",
      commonMistakes: "容易漏掉变形和助词搭配。",
    });
  });

  it("falls back when the model response is not valid JSON", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: "这不是 JSON",
      }),
    }) as typeof fetch;

    const client = new LlmClient();

    await expect(
      client.explainWordForZhNative({
        word: "静か",
        reading: "しずか",
        meaningZh: "安静；安稳",
        partOfSpeech: "形容动词",
      })
    ).resolves.toMatchObject({
      actualUsage: expect.any(String),
      commonScenarios: expect.any(String),
      nuanceDifferences: expect.any(String),
      commonMistakes: expect.any(String),
    });
  });
});
