import { TUser } from "./user/TUser";

export interface IPost {
  id: string;
  title: string;
  image: string;
  description: string;
  creator: TUser;
  addetAt: Date;
}
