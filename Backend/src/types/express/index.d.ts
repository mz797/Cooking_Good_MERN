export {};

declare global {
	namespace Express {
		export interface Request {
			userData: { userId: string };
		}
	}
}
