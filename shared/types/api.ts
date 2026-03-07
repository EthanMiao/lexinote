export type WordLookupRequest = {
  word: string;
};

export type DictionaryEntry = {
  word: string;
  reading: string | null;
  meaningZh: string;
  partOfSpeech: string | null;
};

export type AIExplanationOutput = {
  actualUsage: string;
  commonScenarios: string;
  nuanceDifferences: string;
  commonMistakes: string;
};

export type WordLookupResponse = {
  entry: DictionaryEntry;
  explanation: AIExplanationOutput;
};
