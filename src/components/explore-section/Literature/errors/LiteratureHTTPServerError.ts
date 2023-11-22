type TLiteratureHTTPServerError = {
  code: number;
  details: string;
};

class LiteratureHTTPServerError extends Error {
  detail: TLiteratureHTTPServerError;

  constructor(error: TLiteratureHTTPServerError) {
    super(
      `It seems there is an error.Try adjusting your request.If the issue persists, it's likely a glitch on our end. Please submit your question using the “feedback” button.`,
      { cause: error }
    );
    this.name = 'LiteratureHTTPValidationError';
    this.detail = error;
  }
}

export default LiteratureHTTPServerError;
