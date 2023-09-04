import config from '../../../config';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  if (!userData.password) {
    userData.password = config.default_user_pass;
  }
  if (userData.role === 'seller') {
    userData.income = 0;
    userData.budget = 0;
  } else {
    userData.income = 0;
  }
  const result = await User.create(userData);
  return result;
};

export const AuthService = {
  createUser,
};
