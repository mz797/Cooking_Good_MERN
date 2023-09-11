import { RecipeType } from "./recipe-types";
import { TUser } from "./user/TUser";

export interface IReport {
	id: string;
	recipe: RecipeType;
	comment: any;
	reportCreator: TUser;
}
