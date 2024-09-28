import { captureException, captureMessage } from '@sentry/nextjs';

type RetryParams = {
  readonly retries?: number;
  readonly delaySecs?: number;
  readonly shouldRetryOnException?: (e: any) => boolean;
  readonly shouldRetryOnError?: (requestInit: RequestInit, res: Response) => boolean;
};

const RETRY_DEFAULT = 4;
const DELAY_SECS_DEFAULT = 0.5;
const DEFAULT_SHOULD_RETRY_ON_ERROR = () => false; // By default don't retry on errors
const DEFAULT_SHOULD_RETRY_ON_EXCEPTION = (e: any) => !(e instanceof DOMException); // By default don't retry on DOMException (inc AbortError)

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

  return function decorator(fn: Fn) {
    // @ts-expect-error This is needed because Typescript can't infer that the return type of Fn must be assignable to Promise<Response>
    return async function wrapper(...args: Parameters<Fn>): ReturnType<Fn> {
      let tryCount = 0;

      let res: Response | undefined;

      while (tryCount < tries) {
        try {
          res = await fn(...args);

          if (res.ok || !shouldRetryOnError(args[1] ?? {}, res) || tryCount === tries - 1) {
            return res as ReturnType<Fn>;
          }
        } catch (error) {
          if (tryCount === tries - 1 || !shouldRetryOnException(error)) {
            throw error; // Throw on last retry if an error occurs
          } else {
            captureException(error);
          }
        }

        const delay = Math.random() * delaySecs * 2 ** tryCount * 1000; // Exponential backoff with full-jitter

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
          setTimeout(resolve, delay);
        });

        tryCount++;
      }

      // This line is never reached, just for typescript to never expect undefined as return type
      throw new Error('Maximum retries exceeded');
    };
  };
}
