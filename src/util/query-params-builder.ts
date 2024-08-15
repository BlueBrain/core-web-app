interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export default function buildQueryString(params: QueryParams): string {
  const encodedParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      encodedParams.append(key, encodeURIComponent(value.toString()));
    }
  }

  return encodedParams.toString();
}
