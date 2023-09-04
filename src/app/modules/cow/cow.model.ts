import { Schema, model } from 'mongoose';
import { CowModel, ICow } from './cow.interface';
import { CowConstant } from './cow.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const cowSchema = new Schema<ICow, CowModel>(
  {
    name: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true, enum: CowConstant.location },
    breed: { type: String, required: true, enum: CowConstant.breed },
    weight: { type: Number, required: true },
    label: { type: String, required: true, enum: CowConstant.label },
    category: { type: String, required: true, enum: CowConstant.category },
    seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

//Handle Duplicate Entries (Cow)
cowSchema.pre('save', async function (next) {
  const isExist = await Cow.findOne({
    name: this.name,
    age: this.age,
    price: this.price,
    weight: this.weight,
    category: this.category,
    seller: this.seller,
  });

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Cow Already Exist!');
  } else {
    next();
  }
});

export const Cow = model<ICow, CowModel>('Cow', cowSchema);
