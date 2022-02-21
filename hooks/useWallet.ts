import { Keplr } from "@keplr-wallet/types";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useCallback, useState } from "react";
import { StdSignature } from "@cosmjs/launchpad";

const CosmosCoinType = 118;
const GasPrices = {
  low: 0.01,
  average: 0.025,
  high: 0.03,
};

export interface AuthMeta {
}

export interface AuthToken {
  user: string,
  agent: string;
  expires: number;
  meta: AuthMeta;
}

export interface SignedToken {
  token: AuthToken,
  address: string,
  signature: string,
  pubkey: string
}

export class KeplrWallet {
  constructor(private keplr: Keplr, public client: SigningCosmWasmClient, private address: string) { }

  async signAuthToken(meta: AuthMeta) {
    const token = {
      user: this.address,
      agent: process.env.NEXT_PUBLIC_AGENT_ADDRESS!,
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      meta,
    };

    const {
      signature,
      pub_key: { value: pubkey },
    } = await this.signMessage(JSON.stringify(token));

    return { token, address: this.address, signature, pubkey };
  }

  static async create(): Promise<KeplrWallet> {
    const keplr = await this.getKeplr();
    await this.suggestChain(keplr);
    const { client, address } = await this.getClient(keplr);
    return new KeplrWallet(keplr, client, address);
  }

  async signMessage(message: string): Promise<StdSignature> {
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID!;
    return this.keplr.signArbitrary(chainId, this.address, message);
  }

  static keplr: Keplr | undefined;

  static async getKeplr(): Promise<Keplr> {
    let keplr: Keplr | undefined;

    if (this.keplr) {
      keplr = this.keplr;
    } else if (window.keplr) {
      keplr = window.keplr;
    } else if (document.readyState === "complete") {
      keplr = window.keplr;
    } else {
      keplr = await new Promise((resolve) => {
        const documentStateChange = (event: Event) => {
          if (
            event.target &&
            (event.target as Document).readyState === "complete"
          ) {
            resolve(window.keplr);
            document.removeEventListener("readystatechange", documentStateChange);
          }
        };

        document.addEventListener("readystatechange", documentStateChange);
      });
    }

    if (!keplr) throw new Error("Keplr not found");
    if (!keplr) this.keplr = keplr;

    return keplr;
  }

  static async getClient(keplr: Keplr): Promise<{ client: SigningCosmWasmClient, address: string }> {
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID!;
    const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT!;

    await keplr.enable(chainId);

    const signer = keplr.getOfflineSigner(chainId);

    const [{ address }] = await signer.getAccounts();

    const client = await SigningCosmWasmClient.connectWithSigner(
      rpcEndpoint,
      signer
    );

    return { client, address };
  }

  static async suggestChain(keplr: Keplr): Promise<void> {
    const prefix = process.env.NEXT_PUBLIC_ADDR_PREFIX!;
    const coin = process.env.NEXT_PUBLIC_COIN_NAME!;
    const coinDecimals = Number.parseInt(
      process.env.NEXT_PUBLIC_COIN_DECIMALS!
    );
    const coinGeckoId = process.env.NEXT_PUBLIC_COIN_GECKO_ID!;
    const coinDenom = coin.toUpperCase();
    const coinMinimalDenom = `u${coin}`;

    await keplr.experimentalSuggestChain({
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID!,
      chainName: process.env.NEXT_PUBLIC_CHAIN_NAME!,
      rpc: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT!,
      rest: process.env.NEXT_PUBLIC_CHAIN_REST_ENDPOINT!,
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: prefix,
        bech32PrefixAccPub: `${coin}pub`,
        bech32PrefixValAddr: `${coin}valoper`,
        bech32PrefixValPub: `${coin}valoperpub`,
        bech32PrefixConsAddr: `${coin}valcons`,
        bech32PrefixConsPub: `${coin}valconspub`,
      },
      currencies: [
        {
          coinDenom,
          coinMinimalDenom,
          coinDecimals,
          coinGeckoId,
        },
      ],
      feeCurrencies: [
        {
          coinDenom,
          coinMinimalDenom,
          coinDecimals,
          coinGeckoId,
        },
      ],
      stakeCurrency: {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
        coinGeckoId,
      },
      coinType: CosmosCoinType,
      gasPriceStep: GasPrices,
    });
  }

}
let keplr: Keplr;


export function useWallet(): { wallet: KeplrWallet | undefined, connect: () => Promise<KeplrWallet> } {
  const [wallet, setWallet] = useState<KeplrWallet>();

  const connect = useCallback(async (): Promise<KeplrWallet> => {
    if (wallet) return wallet;

    const keplrWallet = await KeplrWallet.create();
    setWallet(keplrWallet);

    return keplrWallet;
  }, [wallet]);

  return { wallet, connect };
}
