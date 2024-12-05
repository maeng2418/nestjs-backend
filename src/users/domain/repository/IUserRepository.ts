import { User } from '../user';

export interface IUserRepository {
  checkUserExists(email: string): Promise<User>;
  saveUserUsingQueryRunner(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void>;
}
