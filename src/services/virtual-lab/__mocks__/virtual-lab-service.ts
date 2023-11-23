import { VirtualLab, VirtualLabMember } from '../types';
import { createMockVirtualLab } from '__tests__/__utils__/VirtualLab';

export const getVirtualLabMock = jest.fn();
export const getComputeTimeMock = jest.fn();
export const editVirtualLabMock = jest.fn();
export const inviteNewMemberMock = jest.fn();
export const changeRole = jest.fn();

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
        }, 0);
      });
    }),
    edit: editVirtualLabMock.mockImplementation(
      (user: any, labId: string, update: Omit<Partial<VirtualLab>, 'id'>) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ ...createMockVirtualLab(labId), ...update });
          }, 0);
        });
      }
    ),
    inviteNewMember: inviteNewMemberMock.mockImplementation((): Promise<void> => {
      return new Promise((resolve) => {
        resolve();
      });
    }),
    changeRole: changeRole.mockImplementation(
      (
        memberToChange: VirtualLabMember,
        newRole: VirtualLabMember['role']
      ): Promise<VirtualLabMember> => {
        return new Promise((resolve) => {
          resolve({ ...memberToChange, role: newRole });
        });
      }
    ),
  };
});

export default mockService;
