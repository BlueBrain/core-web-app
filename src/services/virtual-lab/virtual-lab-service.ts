/* eslint-disable class-methods-use-this */

// TODO: Remove the above disable line once this class has more logic.

import { Session } from 'next-auth';
import { VirtualLab } from './types';

export class VirtualLabService {
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
}
