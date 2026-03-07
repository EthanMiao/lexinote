import type {
  AIExplanationOutput,
  DictionaryEntry,
} from "@/shared/types/api";
import { LlmClient } from "@/features/ai-explanation/infrastructure/LlmClient";

export class AIExplanationService {
  constructor(private readonly llmClient: LlmClient) {}

  async explain(entry: DictionaryEntry): Promise<AIExplanationOutput> {
    return this.llmClient.explainWordForZhNative({
      word: entry.word,
      reading: entry.reading,
      meaningZh: entry.meaningZh,
      partOfSpeech: entry.partOfSpeech,
    });
  }
}
