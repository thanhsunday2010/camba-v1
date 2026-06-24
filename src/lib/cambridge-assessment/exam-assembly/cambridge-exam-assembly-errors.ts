export type CambridgeAssemblyErrorCode =
  | "INSUFFICIENT_ITEMS"
  | "INVALID_ITEM"
  | "COVERAGE_FAILED"
  | "DIFFICULTY_FAILED"
  | "BLUEPRINT_MISMATCH"
  | "DUPLICATE_ITEM"
  | "MISSING_WRITING"
  | "MISSING_SPEAKING"
  | "HYDRATION_FAILED";

export class CambridgeAssemblyError extends Error {
  readonly code: CambridgeAssemblyErrorCode;
  readonly path?: string;
  readonly details?: string[];

  constructor(
    code: CambridgeAssemblyErrorCode,
    message: string,
    options?: { path?: string; details?: string[]; cause?: unknown }
  ) {
    super(message, { cause: options?.cause });
    this.name = "CambridgeAssemblyError";
    this.code = code;
    this.path = options?.path;
    this.details = options?.details;
  }
}

export function isCambridgeAssemblyError(error: unknown): error is CambridgeAssemblyError {
  return error instanceof CambridgeAssemblyError;
}
