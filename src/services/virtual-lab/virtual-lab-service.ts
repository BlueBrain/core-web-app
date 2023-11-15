/* eslint-disable class-methods-use-this */

// TODO: Remove the above disable line once this class has more logic.

import { Session } from 'next-auth';
import { ComputeTime, VirtualLab } from './types';

export default class VirtualLabService {
  static LOCAL_STORAGE_ID = 'USERS_VIRTUAL_LABS';

  get(user: Session['user'], labId: string): Promise<VirtualLab> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const localStorage = window.localStorage.getItem(VirtualLabService.LOCAL_STORAGE_ID);
          if (!localStorage) {
            throw new Error(`No lab with id ${labId} found for user ${user.username}`);
          }
          const allLabs = JSON.parse(localStorage) as VirtualLab[];

          const lab = allLabs.find((l) => l.id === labId);

          if (!lab) {
            throw new Error(`No lab with id ${labId} found for user ${user.username}`);
          }
          resolve(lab);
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
    updatedLab: Omit<VirtualLab, 'id'>
  ): Promise<VirtualLab> {
    return new Promise((resolve, reject) => {
      if (user && labId) {
        resolve({ ...updatedLab, id: labId });
      } else {
        reject();
      }
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
}
