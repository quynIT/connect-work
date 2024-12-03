import { Schema, Document } from 'mongoose';

const UserSchema = new Schema(
  {
    name: String,
    username: String,
    phone: String,
    salary: String,
    gender: String,
    bithdate: String,
    stk: String,
    address: String,
    position: String,
    email: String,
    password: String,
    avt: String,
    refreshToken: String,
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export { UserSchema };

export interface User extends Document {
  name: string;
  username: string;
  phone: string;
  salary: string;
  gender: string;
  bithdate: string;
  stk: string;
  address: string;
  position: string;
  email: string;
  password: string;
  avt: string;
  refreshToken: string;
}
