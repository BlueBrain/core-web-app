type TCostumError = {
  loc: string[];
  msg: string;
  type: string;
};

class LiteratureValidationError extends Error {
  detail: TCostumError;

  constructor(detail: TCostumError) {
    super(detail.msg, { cause: detail });
    this.name = 'LiteratureValidationError';
    this.detail = detail;
  }
}

export default LiteratureValidationError;
