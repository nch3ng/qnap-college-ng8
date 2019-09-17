import { User } from './../auth/_models/user.model';

export interface AuthResponseError {
  message: string;
  success: boolean;
}
export class AuthResponse implements AuthResponseError {
  message: string;
  success: boolean;
  token?: string;
  payload?: any;
}

export class GeneralResponse {
  success: boolean;
  message: string;
  code: number;
  payload: any;

  constructor(success: boolean, message: string, code: number, payload?: any) {
    this.success = success;
    this.message = message;
    this.code = code;
    if (payload) {
      this.payload = payload;
    }
  }
}
