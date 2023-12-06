type TValidationCostumError = {
  loc: string[];
  msg: string;
  type: string;
}[];

class ValidationError extends Error {
  detail: TValidationCostumError;

  constructor(detail: TValidationCostumError) {
    super(
      `It seems there is an error.Try adjusting your request.If the issue persists, it's likely a glitch on our end. Please submit your question using the “feedback” button.`,
      { cause: detail }
    );
    this.name = 'LiteratureValidationError';
    this.detail = detail;
  }
}

export default ValidationError;
