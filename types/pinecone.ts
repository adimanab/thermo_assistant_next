export interface QuestionMetadata extends Record<string, unknown> {
  text: string;      // This matches the "text" key in your Python/JSON object
  source: string;
  type: string;
}
