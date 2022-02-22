import {
  ExecuteResult,
} from '@cosmjs/cosmwasm-stargate';
import { Secp256k1HdWallet, serializeSignDoc } from '@cosmjs/launchpad';
import { makeADR36AminoSignDoc, verifyTokenSignature } from './auth';
import { AuthToken, ExecuteOptions, SignedToken } from './types';
import { ContractAccount } from './contractAccount';

export class ServerAccount extends ContractAccount {
  static async create(): Promise<ServerAccount> {
    const wallet = await Secp256k1HdWallet.fromMnemonic(
      process.env.WALLET_MNEMONIC!,
      { prefix: process.env.NEXT_PUBLIC_ADDR_PREFIX! },
    );
    return super.fromSigner(wallet, this);
  }

  async validateToken(signedToken: SignedToken): Promise<AuthToken> {
    const authToken: AuthToken = signedToken.token;

    const valid = await verifyTokenSignature(signedToken)
      && authToken.user === signedToken.address
      && authToken.agent === this.address;

    if (!valid) {
      throw new Error("Invalid auth token");
    }

    return authToken;
  }

  prepareAuthorization(signedToken: SignedToken) {
    const document = Buffer.from(
      serializeSignDoc(makeADR36AminoSignDoc(signedToken.address, JSON.stringify(signedToken.token))),
    ).toString('base64');

    return {
      document,
      signature: signedToken.signature,
      pubkey: signedToken.pubkey,
    };
  }

  async executeWithAuth(
    signedToken: SignedToken,
    message: { [key: string]: any },
    options: ExecuteOptions = {}
  ): Promise<ExecuteResult> {
    await this.validateToken(signedToken);
    const authorization = this.prepareAuthorization(signedToken);
    message.post.authorization = authorization;
    return this.execute(message, options);
  }
}
