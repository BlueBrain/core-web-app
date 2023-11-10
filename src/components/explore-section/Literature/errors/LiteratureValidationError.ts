type TValidationCostumError = {
  loc: string[];
  msg: string;
  type: string;
}[];

class ValidationError extends Error {
  detail: TValidationCostumError;

  constructor(detail: TValidationCostumError) {
    super(detail.map((item) => item.msg).join(' | '), { cause: detail });
    this.name = 'LiteratureValidationError';
    this.detail = detail;
  }
}

export default ValidationError;
