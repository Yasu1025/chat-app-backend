import express from 'express';
import { Signup } from '@auth/controllers/signup';
import { Router } from 'express';
import { Signin } from '@auth/controllers/singin';
import { Signout } from '@auth/controllers/singout';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/signin', Signin.prototype.read);

    return this.router;
  }

  public signoutRoutes(): Router {
    this.router.get('/signout', Signout.prototype.update);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
