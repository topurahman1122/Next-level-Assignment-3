import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { UserConstant } from './user.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const userSchema = new Schema<IUser, UserModel>(
  {
    password: { type: String, required: true },
    role: { type: String, required: true, enum: UserConstant.role },
    name: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
      required: true,
    },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

//Handle Duplicate Entry (User)
userSchema.pre('save', async function (next) {
  const isExist = await User.findOne({
    $or: [
      { phoneNumber: this.phoneNumber },
      {
        'name.firstName': this.name.firstName,
        'name.lastName': this.name.lastName,
      },
    ],
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'User With Same Name Or Phone Number Already Exist!',
    );
  } else {
    next();
  }
});

export const User = model<IUser, UserModel>('User', userSchema);
