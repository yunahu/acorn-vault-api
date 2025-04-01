export interface User {
  uid: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
