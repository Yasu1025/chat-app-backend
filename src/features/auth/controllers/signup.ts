import { authQueu } from './../../../shared/services/queues/auth.queu';
import { IUserDocument } from '@user/interfaces/user.interface';
import HTTP_STATUS from 'http-status-codes';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { signupSchema } from '@auth/schemes/signup';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { upload } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { authService } from '@service/db/auth.service';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { UserCache } from '@service/redis/user.cache';
import { config } from '@root/config';
import { omit } from 'lodash';

const userCache: UserCache = new UserCache();
export class Signup {
  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, uId, email, username, password, avatarColor } = data;
    return {
      _id,
      uId,
      email: email.toLowerCase(),
      username: Helpers.firstLetterUppercase(username),
      password,
      avatarColor,
      createdAt: new Date(),
    } as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true,
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
      },
    } as unknown as IUserDocument;
  }

  // User Create ---------------------------------------------------------------
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkUserExist) {
      throw new BadRequestError('Invalid credentials');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData: IAuthDocument = Signup.prototype.signupData({
      _id: authObjectId,
      uId,
      email,
      username,
      password,
      avatarColor,
    });

    // upload Avatar Image to Cloudinary
    const result: UploadApiResponse = (await upload(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File Upload: Error occured. Try again..');
    }

    // Add cached to redis
    const userDateCache: IUserDocument = Signup.prototype.userData(authData, userObjectId);
    userDateCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;
    await userCache.saveUserToCached(`${userObjectId}`, uId, userDateCache);

    // Add cached to DB
    omit(userDateCache, ['uid', 'username', 'email', 'avatarColor', 'password']);
    authQueu.addAuthUserJob('addAuthUserJobToDB', { value: userDateCache });

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData });
  }
}
