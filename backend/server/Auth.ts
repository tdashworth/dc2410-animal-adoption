import {
  IAuthToken,
  IUser,
  UserType,
} from 'dc2410-coursework-common';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { decode, sign, verify } from 'jsonwebtoken';
import Users from './users/users.model';

class Auth {
  public static generateToken(user: IUser) {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 30);

    const token = sign(
      {
        exp: Math.round(expiry.getTime() / 1000),
        id: user.id,
        username: user.username,
      } as IAuthToken,
      process.env.AUTH_SHARED_SECRET!,
    );

    return { token, expiry };
  }

  public static decodeToken(jwt: string): IAuthToken {
    return decode(jwt) as IAuthToken;
  }

  public static verifyToken(type?: UserType): RequestHandler {
    return async (
      request: Request,
      response: Response,
      next: NextFunction,
    ): Promise<any> => {
      try {
        const authorization = request.headers.authorization;
        if (!authorization) {
          throw new Error("No 'authorization' header provided.");
        }

        if (
          !verify(authorization.substring(7), process.env.AUTH_SHARED_SECRET!)
        ) {
          throw new Error('Token not signed by this server.');
        }

        const token = Auth.decodeToken(authorization.substring(7));
        if (!token) throw new Error('Token not parsable.');
        if (new Date(token.exp) > new Date()) {
          throw new Error('Token has expired');
        }

        const user = await Users.get(token.id);
        if (!user) throw new Error('User does not exist.');
        if (type && user.type !== type) {
          throw new Error('User is of wrong type.');
        }

        request.params.user = user;
        next();
      } catch (e) {
        return response.sendStatus(403);
      }
    };
  }
}

export default Auth;
