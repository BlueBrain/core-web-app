import { captureException, captureMessage } from '@sentry/nextjs';

type RetryParams = {
  readonly retries?: number;
  readonly delaySecs?: number;
  readonly shouldRetryOnError?: (status: number) => boolean;
  readonly shouldRetryOnException?: (e: any) => boolean;
};

const RETRY_DEFAULT = 3;
const DELAY_SECS_DEFAULT = 1;
const DEFAULT_SHOULD_RETRY_ON_ERROR = () => false; // By default don't retry on errors
const DEFAULT_SHOULD_RETRY_ON_EXCEPTION = (e: any) => !(e instanceof DOMException); // By default don't retry on DOMException (inc AbortError)
const DELAY_SECS_CAP = 10;

const RETRY_DEFAULTS: RetryParams = {
  retries: RETRY_DEFAULT,
  delaySecs: DELAY_SECS_DEFAULT,
  shouldRetryOnError: DEFAULT_SHOULD_RETRY_ON_ERROR,
  shouldRetryOnException: DEFAULT_SHOULD_RETRY_ON_EXCEPTION,
};

export function retry<Fn extends (...args: any[]) => Promise<Response>>({
  retries = RETRY_DEFAULT,
  delaySecs = DELAY_SECS_DEFAULT,
  shouldRetryOnError = DEFAULT_SHOULD_RETRY_ON_ERROR,
  shouldRetryOnException = DEFAULT_SHOULD_RETRY_ON_EXCEPTION,
}: RetryParams = RETRY_DEFAULTS) {
  const tries = Math.max(retries + 1, 1); // Ensure at least initial call
  const delayBase = Math.max(delaySecs, DELAY_SECS_DEFAULT); // Ensure minimum delay base

  return function decorator(fn: Fn) {
    // @ts-expect-error This is needed because Typescript can't infer that the return type of Fn must be assignable to Promise<Response>
    return async function wrapper(...args: Parameters<Fn>): ReturnType<Fn> {
      let tryCount = 0;

      let res: Response | undefined;

      while (tryCount < tries) {
        try {
          res = await fn(...args);

          if (res.ok || !shouldRetryOnError(res.status) || tryCount === tries - 1) {
            return res as ReturnType<Fn>;
          }
        } catch (error) {
          if (tryCount === tries - 1 || !shouldRetryOnException(error)) {
            throw error; // Throw on last retry if an error occurs
          } else {
            captureException(error);
          }
        }

        let delay = Math.random() * delayBase * 2 ** tryCount; // Exponential backoff with full-jitter
        delay = Math.min(delay, DELAY_SECS_CAP); // Never exceed DELAY_CAP

        captureMessage(`Request failed, retrying`, {
          tags: {
            retry: tryCount + 1,
            status: res?.status ?? null,
          },
          extra: {
            url: args[0],
            delay,
          },
        });

        // Wait before the next retry
        await new Promise((resolve) => {
          setTimeout(resolve, delay * 1000);
        });

        tryCount++;
      }

      // This line is never reached, just for typescript to never expect undefined as return type
      throw new Error('Maximum retries exceeded');
    };
  };
}
