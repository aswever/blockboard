import { Coin } from "@cosmjs/launchpad";

export interface ExecuteOptions {
  cost?: Coin[];
  memo?: string;
}

export interface AuthMeta {
  username: string;
}

export interface AuthToken {
  user: string;
  agent: string;
  expires: number;
  meta: AuthMeta;
}

export interface SignedToken {
  token: AuthToken;
  address: string;
  signature: string;
  pubkey: string;
}

export interface Authorization {
  document: string;
  signature: string;
  pubkey: string;
}

export interface MessageWithAuthorization {
  [key: string]: {
    [key: string]: unknown;
    authorization?: Authorization;
  };
}
