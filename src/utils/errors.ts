import { APP_NAME } from '../constants/brand';
export class DomainError extends Error {
  constructor(
    public readonly code:
      | 'NOT_FOUND'
      | 'WORKOUT_CLOSED'
      | 'INVALID_SET'
      | 'CONFIG_REQUIRED'
      | 'CONFLICT',
  ) {
    super(code);
    this.name = 'DomainError';
  }
}

/** Log only categorical information. Payloads, food names, notes and tokens never enter logs. */
export function reportError(scope: string, error: unknown): void {
  console.warn(
    `[${APP_NAME}]`,
    scope,
    error instanceof DomainError ? error.code : 'OPERATION_FAILED',
  );
}
