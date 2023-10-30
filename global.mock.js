global.structuredClone = (v) => JSON.parse(JSON.stringify(v));

// The following module uses server-actions which causes tests to fail atm. Therefore, it can be mocked temporarily to resolve the issue.
// Github issue on next - https://github.com/vercel/next.js/issues/53065
jest.mock('@/components/explore-section/Literature/actions.ts', () => ({
  __esModule: true,
  getGenerativeQAAction: jest.fn(),
}));

// Mocks for function from deepdash-es. The dependency is not resolved with jest, therefore the functions need to be mocked. (see - https://github.com/YuriGor/deepdash/issues/133)
export const findDeep = (flatTree, findFn) => flatTree.find(findFn);
export const reduceDeep = (someValue) => [someValue];
