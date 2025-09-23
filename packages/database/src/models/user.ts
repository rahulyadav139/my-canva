import { Schema, model } from 'mongoose';
import { User as UserSchema } from '@repo/shared/schema';

const userSchema = new Schema<UserSchema>({
  name: String,
  email: String,
  password: String,
});

export const UserModel = model<UserSchema>('User', userSchema);