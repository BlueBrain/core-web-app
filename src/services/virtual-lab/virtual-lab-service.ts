/* eslint-disable class-methods-use-this */

import { Session } from 'next-auth';
import { ComputeTime, VirtualLab, assertVirtualLabArray } from './types';
import { logError } from '@/util/logger';

export default class VirtualLabService {
  static LOCAL_STORAGE_ID = 'USERS_VIRTUAL_LABS';

  get(user: Session['user'], labId: string): Promise<VirtualLab> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(this.#getLabFromLocalStorage(labId, user));
        } catch (e) {
          reject(e);
        }
      }, 150);
    });
  }

  listAll(user: Session['user']): Promise<VirtualLab[]> {
    return new Promise((resolve, reject) => {
      if (user) {
        resolve([]);
      } else {
        reject();
      }
    });
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

  getComputeTime(labId: string): Promise<ComputeTime> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = Math.floor(Math.random() * 100);
        const used = Math.floor(Math.random() * total);
        resolve({ labId, totalTimeInHours: total, usedTimeInHours: used });
      }, 0);
    });
  }

  async #loadVirtualLabs(user: Session['user']): Promise<VirtualLab[]> {
    try {
      await pauseToSimulateNetworkAccess();
      const key = `${VirtualLabService.LOCAL_STORAGE_ID}/${user.username}`;
      const localStorage = window.localStorage.getItem(key);
      assertVirtualLabArray(localStorage);
      return localStorage;
    } catch (err) {
      logError(err);
      return [];
    }
  }

  async #saveVirtualLabs(user: Session['user'], labs: VirtualLab[]): Promise<void> {
    await pauseToSimulateNetworkAccess();
    const key = `${VirtualLabService.LOCAL_STORAGE_ID}/${user.username}`;
    window.localStorage.setItem(key, JSON.stringify(labs));
  }

  async #getLabFromLocalStorage(labId: string, user: Session['user']) {
    const allLabs = await this.#loadVirtualLabs(user);
    const lab = allLabs.find((l) => l.id === labId);
    if (!lab) {
      throw new Error(`No lab with id ${labId} found for user ${user.username}`);
    }

    return lab;
  }

  async #saveLabToLocalStorage(user: Session['user'], lab: VirtualLab) {
    const otherLabs = (await this.#loadVirtualLabs(user)).filter((l) => l.id !== lab.id);
    return this.#saveVirtualLabs(user, [...otherLabs, lab]);
  }
}

/**
 * For now the service is fake and stores everything in the LocalStorage.
 * But we want to simulate the delay of the network, as if it was a real service.
 */
function pauseToSimulateNetworkAccess() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 250 + 1750 * Math.random());
  });
}

function makeNewFakeId() {
  return `${Math.random()}`.substring(2);
}
