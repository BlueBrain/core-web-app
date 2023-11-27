/* eslint-disable class-methods-use-this */

import { Session } from 'next-auth';
import {
  ComputeTime,
  NewMember,
  VirtualLab,
  VirtualLabMember,
  assertVirtualLabArray,
} from './types';
import { logError } from '@/util/logger';
import { Plan } from '@/components/VirtualLab/VirtualLabSettingsComponent/PlanPanel';

export default class VirtualLabService {
  static LOCAL_STORAGE_ID = 'USERS_VIRTUAL_LABS';

  async get(user: Session['user'], labId: string): Promise<VirtualLab> {
    const lab = await this.#getLabFromLocalStorage(labId, user);
    return lab;
  }

  async listAll(user: Session['user']): Promise<VirtualLab[]> {
    return this.#loadVirtualLabs(user);
  }

  async create(user: Session['user'], lab: Omit<VirtualLab, 'id'>): Promise<VirtualLab> {
    const createdLab = {
      ...lab,
      id: makeNewFakeId(),
    };
    await this.#saveLabToLocalStorage(user, createdLab);
    return createdLab;
  }

  async edit(
    user: Session['user'],
    labId: string,
    update: Omit<Partial<VirtualLab>, 'id'>
  ): Promise<VirtualLab> {
    if (!user) {
      throw Error('Unauthorized');
    }

    const currentLab = await this.#getLabFromLocalStorage(labId, user);
    const updatedLab = { ...currentLab, ...update };
    await this.#saveLabToLocalStorage(user, updatedLab);
    return this.#getLabFromLocalStorage(labId, user);
  }

  async changePlan(
    currentUser: Session['user'],
    labId: string,
    newPlan: Plan,
    billing: VirtualLab['billing']
  ): Promise<VirtualLab> {
    const currentLab = await this.#getLabFromLocalStorage(labId, currentUser);
    const userIsAdmin =
      currentLab.members.find((member) => member.email === currentUser.email)?.role === 'admin';
    if (!userIsAdmin) {
      throw new Error('Unauthorized');
    }
    const updatedLab: VirtualLab = { ...currentLab, plan: newPlan, billing };
    await this.#saveLabToLocalStorage(currentUser, updatedLab);
    return this.#getLabFromLocalStorage(labId, currentUser);
  }

  getComputeTime(labId: string): Promise<ComputeTime> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = Math.floor(Math.random() * 100);
        const used = Math.floor(Math.random() * total);
        resolve({ labId, totalTimeInHours: total, usedTimeInHours: used });
      }, 0);
    });
  }

  async inviteNewMember(
    newMember: NewMember,
    labId: string,
    currentUser: Session['user']
  ): Promise<void> {
    const currentLab = await this.#getLabFromLocalStorage(labId, currentUser);
    const userIsAdmin =
      currentLab.members.find((member) => member.email === currentUser.email)?.role === 'admin';
    if (!currentUser || !userIsAdmin) {
      throw new Error('Unauthorized');
    }

    const userAlreadyExisits = currentLab.members.find(
      (member) => member.email === newMember.email
    );
    if (userAlreadyExisits) {
      return;
    }

    const updatedLab: VirtualLab = {
      ...currentLab,
      members: [
        ...currentLab.members,
        {
          name: newMember.email.split('@')[0],
          email: newMember.email,
          role: newMember.role,
          lastActive: Date.now(),
        },
      ],
    };
    await this.#saveLabToLocalStorage(currentUser, updatedLab);
  }

  async changeRole(
    memberToChange: VirtualLabMember,
    newRole: VirtualLabMember['role'],
    labId: string,
    userMakingChanges: Session['user']
  ): Promise<VirtualLabMember> {
    const currentLab = await this.#getLabFromLocalStorage(labId, userMakingChanges);
    const userIsAdmin =
      currentLab.members.find((m) => m.email === userMakingChanges.email)?.role === 'admin';
    if (!userIsAdmin) {
      throw new Error('Unauthorized');
    }
    const updatedLab: VirtualLab = {
      ...currentLab,
      members: currentLab.members.map((m) =>
        m.email === memberToChange.email ? { ...m, role: newRole } : { ...m }
      ),
    };
    await this.#saveLabToLocalStorage(userMakingChanges, updatedLab);
    return { ...memberToChange, role: newRole };
  }

  async removeMember(
    memberToRemove: VirtualLabMember,
    labId: string,
    userMakingChanges: Session['user']
  ): Promise<void> {
    const currentLab = await this.#getLabFromLocalStorage(labId, userMakingChanges);
    const userIsAdmin =
      currentLab.members.find((m) => m.email === userMakingChanges.email)?.role === 'admin';
    const authorized = userIsAdmin || memberToRemove.email === userMakingChanges.email;
    if (!authorized) {
      throw new Error('Unauthorized');
    }
    const updatedLab: VirtualLab = {
      ...currentLab,
      members: currentLab.members.filter((m) => m.email !== memberToRemove.email),
    };
    await this.#saveLabToLocalStorage(userMakingChanges, updatedLab);
  }

  async deleteVirtualLab(userMakingChanges: Session['user'], labId: string) {
    const currentLab = await this.#getLabFromLocalStorage(labId, userMakingChanges);
    const userIsAdmin =
      currentLab.members.find((m) => m.email === userMakingChanges.email)?.role === 'admin';

    if (!userIsAdmin) {
      throw new Error('Unauthorized');
    }

    await this.#deleteVirtualLabFromStorage(userMakingChanges, labId);
  }

  async #getLabFromLocalStorage(labId: string, user: Session['user']) {
    const allLabs = await this.#loadVirtualLabs(user);
    const lab = allLabs.find((l) => l.id === labId);
    if (!lab) {
      throw new Error(`No lab with id ${labId} found for user ${user.username}`);
    }

    return lab;
  }

  async #deleteVirtualLabFromStorage(user: Session['user'], labId: string): Promise<void> {
    const allLabs = await this.#loadVirtualLabs(user);
    return this.#saveVirtualLabs(
      user,
      allLabs.filter((lab) => lab.id !== labId)
    );
  }

  async #saveLabToLocalStorage(user: Session['user'], lab: VirtualLab) {
    const otherLabs = (await this.#loadVirtualLabs(user)).filter((l) => l.id !== lab.id);
    return this.#saveVirtualLabs(user, [...otherLabs, lab]);
  }

  async #saveVirtualLabs(user: Session['user'], labs: VirtualLab[]): Promise<void> {
    await pauseToSimulateNetworkAccess();
    const key = `${VirtualLabService.LOCAL_STORAGE_ID}/${user.username}`;
    window.localStorage.setItem(key, JSON.stringify(labs));
  }

  async #loadVirtualLabs(user: Session['user']): Promise<VirtualLab[]> {
    try {
      await pauseToSimulateNetworkAccess();
      const key = `${VirtualLabService.LOCAL_STORAGE_ID}/${user.username}`;
      const localStorage = JSON.parse(window.localStorage.getItem(key) ?? '');
      assertVirtualLabArray(localStorage);
      return localStorage;
    } catch (err) {
      logError(err);
      return [];
    }
  }
}

/**
 * For now the service is fake and stores everything in the LocalStorage.
 * But we want to simulate the delay of the network, as if it was a real service.
 */
function pauseToSimulateNetworkAccess() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 250);
  });
}

function makeNewFakeId() {
  return `${Math.random()}`.substring(2);
}
