export type RagChunk = {
  id: string;
  text: string;
  /** Present when `npm run rag:build` ran with HF credentials. */
  embedding?: number[] | null;
};

export type RagIndexFile = {
  embeddingModel: string;
  generatedAt: string;
  /** When true, retrieval uses lexical overlap only. */
  lexicalOnly?: boolean;
  chunks: RagChunk[];
};
