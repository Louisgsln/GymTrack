import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { reportError } from '../utils/errors';
/** Await durable writes before refreshing. Failures remain visible and never report success. */
export function useAction() {
  const client = useQueryClient();
  const [pending, setPending] = useState(0);
  const [error, setError] = useState(false);
  const last = useRef(0);
  const failed = useRef(new Map<string, () => Promise<unknown>>());
  const run = useCallback(
    async (action: () => Promise<unknown>, key?: string): Promise<boolean> => {
      const operationKey = key ?? `action-${++last.current}`;
      setPending((n) => n + 1);
      try {
        await action();
        await client.invalidateQueries();
        failed.current.delete(operationKey);
        setError(failed.current.size > 0);
        return true;
      } catch (cause) {
        reportError('mutation', cause);
        failed.current.set(operationKey, action);
        setError(true);
        return false;
      } finally {
        setPending((n) => n - 1);
      }
    },
    [client],
  );
  const retry = useCallback(async () => {
    for (const [key, action] of [...failed.current]) await run(action, key);
  }, [run]);
  return { run, retry, pending: pending > 0, error };
}
