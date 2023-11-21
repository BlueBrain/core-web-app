/* eslint-disable class-methods-use-this */

import { Session } from 'next-auth';
import { ComputeTime, VirtualLab, assertVirtualLabArray } from './types';

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

  create(user: Session['user'], lab: Omit<VirtualLab, 'id'>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (user && lab) {
        resolve();
      } else {
        reject();
      }
    });
  }

  edit(
    user: Session['user'],
    labId: string,
    update: Omit<Partial<VirtualLab>, 'id'>
  ): Promise<VirtualLab> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error('Unauthorized'));
        }

        try {
          const currentLab = this.#getLabFromLocalStorage(labId, user);
          const updatedLab = { ...currentLab, ...update };
          this.#saveLabToLocalStorage(updatedLab);
          resolve(this.#getLabFromLocalStorage(labId, user));
        } catch (e) {
          reject(e);
        }
      }, 150);
    });
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

  #getLabFromLocalStorage(labId: string, user: Session['user']) {
    const localStorage = window.localStorage.getItem(VirtualLabService.LOCAL_STORAGE_ID);
    if (!localStorage) {
      throw new Error(`No lab with id ${labId} found for user ${user.username}`);
    }
    const allLabs = JSON.parse(localStorage) as VirtualLab[];
    assertVirtualLabArray(allLabs);

    const lab = allLabs.find((l) => l.id === labId);

    if (!lab) {
      throw new Error(`No lab with id ${labId} found for user ${user.username}`);
    }

    return lab;
  }

  #saveLabToLocalStorage(lab: VirtualLab) {
    const localStorage = window.localStorage.getItem(VirtualLabService.LOCAL_STORAGE_ID);

    const otherLabs = localStorage
      ? (JSON.parse(localStorage) as VirtualLab[]).filter((l) => l.id !== lab.id)
      : [];

    assertVirtualLabArray(otherLabs);

    window.localStorage.setItem(
      VirtualLabService.LOCAL_STORAGE_ID,
      JSON.stringify([...otherLabs, lab] as VirtualLab[])
    );
  }
}
