export function checkMatchPatterns(value: string, patterns: (string | RegExp)[]): boolean {
  return patterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return value === pattern;
    }
    return pattern.test(value);
  });
}
