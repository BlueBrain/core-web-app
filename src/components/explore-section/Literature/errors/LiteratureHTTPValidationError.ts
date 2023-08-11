class LiteratureHTTPValidationError extends Error {
  detail: {
    loc: string[];
    msg: string;
    type: string;
  };

  constructor(detail: { loc: string[]; msg: string; type: string }) {
    super(detail.msg, { cause: detail });
    this.name = 'LiteratureHTTPValidationError';
    this.detail = detail;
  }
}

export default LiteratureHTTPValidationError;
