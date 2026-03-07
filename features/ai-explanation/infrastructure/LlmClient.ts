import { buildJaWordForZhNativePrompt } from "@/features/ai-explanation/prompts/jaWordForZhNative";
import type { AIExplanationOutput } from "@/shared/types/api";

export type ExplainInput = {
  word: string;
  reading: string | null;
  meaningZh: string;
  partOfSpeech: string | null;
};

function buildFallbackExplanation(input: ExplainInput): AIExplanationOutput {
  return {
    actualUsage: `「${input.word}」的核心意思是“${input.meaningZh}”，理解时先结合词性和常见搭配，不要只按中文单词一一对应。`,
    commonScenarios:
      "常见于日常会话、阅读和基础写作中。真正使用时要结合前后文判断语气和自然度。",
    nuanceDifferences:
      "和表面接近的词相比，差别通常出现在语气强弱、固定搭配和使用场景上，不能只看中文释义。",
    commonMistakes:
      "中文母语者容易直接按中文直译套用，也容易忽略读音、词性变化和固定搭配。",
  };
}

function parseExplanationOutput(text: string): AIExplanationOutput | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return null;
  }

  try {
    const parsed = JSON.parse(match[0]) as Partial<AIExplanationOutput>;
    if (
      typeof parsed.actualUsage !== "string" ||
      typeof parsed.commonScenarios !== "string" ||
      typeof parsed.nuanceDifferences !== "string" ||
      typeof parsed.commonMistakes !== "string"
    ) {
      return null;
    }

    return {
      actualUsage: parsed.actualUsage.trim(),
      commonScenarios: parsed.commonScenarios.trim(),
      nuanceDifferences: parsed.nuanceDifferences.trim(),
      commonMistakes: parsed.commonMistakes.trim(),
    };
  } catch {
    return null;
  }
}

export class LlmClient {
  async explainWordForZhNative(input: ExplainInput): Promise<AIExplanationOutput> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return buildFallbackExplanation(input);
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5.4",
        input: [
          {
            role: "system",
            content:
              "你是日语学习助手。面向中文母语者解释日语单词，简洁、准确、学习导向。输出中文。",
          },
          {
            role: "user",
            content: buildJaWordForZhNativePrompt(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM request failed: ${response.status}`);
    }

    const data = (await response.json()) as { output_text?: string };
    const parsed = parseExplanationOutput(data.output_text?.trim() || "");
    return parsed ?? buildFallbackExplanation(input);
  }
}
