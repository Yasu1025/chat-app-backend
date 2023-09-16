import { authWorker } from '../../workers/auth.worker';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from './base.queue';

export class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addAuthUserJobToDB', 5, authWorker.addAuthUserToDB);
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
