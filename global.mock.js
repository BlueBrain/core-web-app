global.structuredClone = (v) => JSON.parse(JSON.stringify(v));

// The following module uses server-actions which causes tests to fail atm. Therefore, it can be mocked temporarily to resolve the issue.
// Github issue on next - https://github.com/vercel/next.js/issues/53065
jest.mock('@/components/explore-section/Literature/actions.ts', () => ({
  __esModule: true,
  getGenerativeQAAction: jest.fn(),
}));
