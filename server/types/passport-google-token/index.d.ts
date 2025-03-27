declare module "passport-google-token" {
  import { Strategy as PassportStrategy } from "passport";
  import { Request } from "express";

  interface VerifyCallback {
    (error: any, user?: any, info?: any): void;
  }

  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL?: string;
    passReqToCallback?: false;
  }

  interface StrategyOptionsWithRequest {
    clientID: string;
    clientSecret: string;
    callbackURL?: string;
    passReqToCallback: true;
  }

  class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => void
    );
    constructor(
      options: StrategyOptionsWithRequest,
      verify: (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
      ) => void
    );
  }

  export default Strategy; // ✅ C’est ça qui manquait !
}
