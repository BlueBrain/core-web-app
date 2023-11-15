import { createMockVirtualLab } from '__tests__/__utils__/VirtualLab';

export const getVirtualLabMock = jest.fn();
export const getComputeTimeMock = jest.fn();

const mockService = jest.fn().mockImplementation(() => {
  return {
    get: getVirtualLabMock.mockImplementation((user: any, id: string) => {
      return new Promise((resolve) => {
        resolve(createMockVirtualLab(id));
      });
    }),
    getComputeTime: getComputeTimeMock.mockImplementation((labId: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ labId, totalTimeInHours: 100, usedTimeInHours: 73 });
        }, 500);
      });
    }),
  };
});

export default mockService;
