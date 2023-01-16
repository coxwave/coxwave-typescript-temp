/**
 * Ingestion metadata
 */
export interface IngestionMetadata {
  /** The source name of ingestion metadata e.g. "cox" */
  sourceName?: string;
  /** The source version of ingestion metadata e.g. "2.0.0" */
  sourceVersion?: string;
}

/**
 * Ingestion metadata event property, snake-case
 */
export interface IngestionMetadataEventProperty {
  /** The source name of ingestion metadata e.g. "cox" */
  source_name?: string;
  /** The source version of ingestion metadata e.g. "2.0.0" */
  source_version?: string;
}
