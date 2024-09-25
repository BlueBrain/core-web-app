import { captureException, captureMessage } from '@sentry/nextjs';

type RetryParams = {
  readonly retries?: number;
  readonly delaySecs?: number;
  readonly shouldRetryOnException?: boolean;
  readonly shouldRetryOnError?: (status: number) => boolean;
};

const RETRY_DEFAULT = 3;
const DELAY_SECS_DEFAULT = 1;
const DEFAULT_SHOULD_RETRY_ON_ERROR = () => false; // By default don't retry on errors
const DEFAULT_SHOULD_RETRY_ON_EXCEPTION = true; // By default retry on exceptions

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

          if (res.ok || !shouldRetryOnError(res.status) || tryCount === tries - 1) {
            return res as ReturnType<Fn>;
          }
        } catch (error) {
          if (tryCount === tries - 1 || !shouldRetryOnException) {
            throw error; // Throw on last retry if an error occurs
          } else {
            captureException(error);
          }
        }

        const delay = delaySecs * 2 ** tryCount * 1000; // Exponential backoff

        captureMessage(`Request failed, retrying`, {
          extra: {
            url: args[0],
            status: res?.status,
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
