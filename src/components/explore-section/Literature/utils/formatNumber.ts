function formatNumber(total: number): string {
  return new Intl.NumberFormat('en-US', {}).format(total);
}

export default formatNumber;