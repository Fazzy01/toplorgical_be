export interface AuthTokenResponse {
    token: string;
    success: boolean;
    user: any;
  }

export  interface CustomRequest extends Request {
    user?: any;
  }

