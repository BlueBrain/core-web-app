type TTokenThresholdReachedCustomError = {
  loc: string[];
  msg: string;
  type: string;
};

class LiteratureTokenThresholdReachedError extends Error {
  detail: TTokenThresholdReachedCustomError;

  constructor(detail: TTokenThresholdReachedCustomError) {
    super(detail.msg, { cause: detail });
    this.name = 'LiteratureTokenThresholdReachedError';
    this.detail = detail;
  }
}

export default LiteratureTokenThresholdReachedError;
