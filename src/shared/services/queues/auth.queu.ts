import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from './base.queue';

export class AuthQueu extends BaseQueue {
  constructor() {
    super('auth');
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueu: AuthQueu = new AuthQueu();
