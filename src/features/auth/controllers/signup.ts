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

  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkUserExist) {
      throw new BadRequestError('Invalid credencials');
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

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData });
  }
}