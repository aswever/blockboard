import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Secp256k1HdWallet, serializeSignDoc } from "@cosmjs/launchpad";
import { makeADR36AminoSignDoc, verifyTokenSignature } from "./auth";
import {
  Authorization,
  AuthToken,
  ExecuteOptions,
  MessageWithAuthorization,
  SignedToken,
} from "./types";
import { ContractAccount } from "./contractAccount";
import { config } from "../util/config";

export class ServerAccount extends ContractAccount {
  static async create(): Promise<ServerAccount> {
    const wallet = await Secp256k1HdWallet.fromMnemonic(
      config("walletMnemonic"),
      { prefix: config("addrPrefix") }
    );
    return super.fromSigner(wallet, this);
  }

  async validateToken(signedToken: SignedToken): Promise<AuthToken> {
    const authToken: AuthToken = signedToken.token;

    const valid =
      (await verifyTokenSignature(signedToken)) &&
      authToken.user === signedToken.address &&
      authToken.agent === this.address;

    if (!valid) {
      throw new Error("Invalid auth token");
    }

    return authToken;
  }

  prepareAuthorization(signedToken: SignedToken) {
    const document = Buffer.from(
      serializeSignDoc(
        makeADR36AminoSignDoc(
          signedToken.address,
          JSON.stringify(signedToken.token)
        )
      )
    ).toString("base64");

    return {
      document,
      signature: signedToken.signature,
      pubkey: signedToken.pubkey,
    };
  }

  async executeWithAuth(
    signedToken: SignedToken,
    message: MessageWithAuthorization,
    options: ExecuteOptions = {}
  ): Promise<ExecuteResult> {
    await this.validateToken(signedToken);
    const authorization = this.prepareAuthorization(signedToken);
    const [rootKey] = Object.keys(message);
    message[rootKey].authorization = authorization;
    return this.execute(message, options);
  }
}
