import {
  ExecuteResult,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { Coin, GasPrice, Secp256k1HdWallet, serializeSignDoc } from '@cosmjs/launchpad';
import { AuthToken, makeADR36AminoSignDoc, SignedToken, verifyTokenSignature } from './auth';

interface ExecuteOptions {
  cost?: Coin[],
  memo?: string,
}

export class Wallet {
  constructor(private wallet: Secp256k1HdWallet, private client: SigningCosmWasmClient, private address: string) { }

  static async create(): Promise<Wallet> {
    const wallet = await Secp256k1HdWallet.fromMnemonic(
      process.env.WALLET_MNEMONIC!,
      { prefix: process.env.NEXT_PUBLIC_ADDR_PREFIX! },
    );

    const client = await SigningCosmWasmClient.connectWithSigner(
      process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
      wallet,
      {
        gasPrice: GasPrice.fromString(
          `${process.env.NEXT_PUBLIC_GAS_PRICE!}${process.env.NEXT_PUBLIC_COIN_NAME!}`
        ),
      }
    );

    const [{ address }] = await wallet.getAccounts();

    return new Wallet(wallet, client, address);
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
    // await this.validateToken(signedToken);
    const authorization = this.prepareAuthorization(signedToken);
    message.post.authorization = authorization;
    return this.execute(message, options);
  }

  async execute(
    message: { [key: string]: any },
    { cost, memo }: ExecuteOptions = {}
  ): Promise<ExecuteResult> {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
    console.log(message);

    return this.client.execute(
      this.address,
      contractAddress,
      message,
      "auto",
      memo,
      cost,
    );
  }
}
