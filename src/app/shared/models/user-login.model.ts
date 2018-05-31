import { UserStrimi } from './user-strimi.model';
export class UserLogin {
  constructor(public login?: string, public pass?: string) { }
}

export class LoggedData {
  constructor(public loginData: UserLogin, public user: UserStrimi) { }
}
