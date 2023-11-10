type TLiteratureHTTPServerError = {
  code: number;
  details: string;
};

class LiteratureHTTPServerError extends Error {
  detail: TLiteratureHTTPServerError;

  constructor(error: TLiteratureHTTPServerError) {
    super(error.details, { cause: error });
    this.name = 'LiteratureHTTPValidationError';
    this.detail = error;
  }
}

export default LiteratureHTTPServerError;
