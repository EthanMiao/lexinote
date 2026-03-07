import { AIExplanationService } from "@/features/ai-explanation/application/AIExplanationService";
import { JapaneseDictionaryService } from "@/features/japanese-dictionary/application/JapaneseDictionaryService";
import type { WordLookupResponse } from "@/shared/types/api";
import { NotFoundError, ValidationError } from "@/shared/utils/errors";

export class WordLookupService {
  constructor(
    private readonly dictionaryService: JapaneseDictionaryService,
    private readonly aiExplanationService: AIExplanationService
  ) {}

  async explainWord(rawWord: string): Promise<WordLookupResponse> {
    const word = rawWord.trim();
    if (!word) {
      throw new ValidationError("word is required");
    }

    const entry = await this.dictionaryService.findEntry(word);
    if (!entry) {
      throw new NotFoundError(`word not found: ${word}`);
    }

    const explanation = await this.aiExplanationService.explain(entry);
    return { entry, explanation };
  }
}
