import express from 'express';
import { Signup } from '@auth/controllers/signup';
import { Router } from 'express';
import { Signin } from '@auth/controllers/singin';

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
}

export const authRoutes: AuthRoutes = new AuthRoutes();
