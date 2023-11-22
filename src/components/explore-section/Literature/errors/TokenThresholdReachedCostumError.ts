type TTokenThresholdReachedCustomError = {
  loc: string[];
  msg: string;
  type: string;
};

class LiteratureTokenThresholdReachedError extends Error {
  detail: TTokenThresholdReachedCustomError;

  constructor(detail: TTokenThresholdReachedCustomError) {
    super(
      `It seems there is an error.Try adjusting your request.If the issue persists, it's likely a glitch on our end. Please submit your question using the “feedback” button.`,
      { cause: detail }
    );
    this.name = 'LiteratureTokenThresholdReachedError';
    this.detail = detail;
  }
}

export default LiteratureTokenThresholdReachedError;
