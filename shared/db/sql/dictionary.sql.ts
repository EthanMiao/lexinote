export const SELECT_DICTIONARY_ENTRY_SQL = `
  SELECT
    word,
    reading,
    meaning_zh,
    part_of_speech
  FROM japanese_dictionary_entries
  WHERE word = $1
  LIMIT 1
`;

