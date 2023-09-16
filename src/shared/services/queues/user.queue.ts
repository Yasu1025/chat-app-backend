import { BaseQueue } from './base.queue';
import { userWorker } from '@worker/user.worker';

export class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    this.processJob('addUserJobToDB', 5, userWorker.addUserToDB);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
