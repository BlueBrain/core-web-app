type CostumError = {
  loc: string[];
  msg: string;
  type: string;
};

class LiteratureValidationError extends Error {
  detail: CostumError;

  constructor(detail: CostumError) {
    super(detail.msg, { cause: detail });
    this.name = 'LiteratureValidationError';
    this.detail = detail;
  }
}

export default LiteratureValidationError;
