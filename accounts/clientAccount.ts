import { Keplr } from "@keplr-wallet/types";
import { StdSignature } from "@cosmjs/launchpad";
import { config } from "../util/config";
import { fromMicroDenom } from "../util/coins";
import { AuthMeta } from "./types";
import { ContractAccount } from "./contractAccount";

const CosmosCoinType = 118;
const GasPrices = {
  low: 0.01,
  average: 0.025,
  high: 0.03,
};

export class ClientAccount extends ContractAccount {
  async signAuthToken(meta: AuthMeta) {
    const token = {
      user: this.address,
      agent: config("agentAddress"),
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      meta,
    };

    const {
      signature,
      pub_key: { value: pubkey },
    } = await this.signMessage(JSON.stringify(token));

    return { token, address: this.address, signature, pubkey };
  }

  async signMessage(message: string): Promise<StdSignature> {
    return (await ClientAccount.getKeplr()).signArbitrary(
      config("chainId"),
      this.address,
      message
    );
  }

  static async create(): Promise<ClientAccount> {
    const keplr = await ClientAccount.getKeplr();
    await this.suggestChain(keplr);
    return super.fromSigner(keplr.getOfflineSigner(config("chainId")), this);
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
            document.removeEventListener(
              "readystatechange",
              documentStateChange
            );
          }
        };

        document.addEventListener("readystatechange", documentStateChange);
      });
    }

    if (!keplr) throw new Error("Keplr not found");
    if (!keplr) this.keplr = keplr;

    return keplr;
  }

  static async suggestChain(keplr: Keplr): Promise<void> {
    const prefix = config("addrPrefix");
    const coinDecimals = Number.parseInt(config("coinDecimals"));
    const coinMinimalDenom = config("coinDenom");
    const coinDenom = fromMicroDenom(coinMinimalDenom).toUpperCase();

    await keplr.experimentalSuggestChain({
      chainId: config("chainId"),
      chainName: config("chainName"),
      rpc: config("rpcEndpoint"),
      rest: config("restEndpoint"),
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: prefix,
        bech32PrefixAccPub: `${prefix}pub`,
        bech32PrefixValAddr: `${prefix}valoper`,
        bech32PrefixValPub: `${prefix}valoperpub`,
        bech32PrefixConsAddr: `${prefix}valcons`,
        bech32PrefixConsPub: `${prefix}valconspub`,
      },
      currencies: [
        {
          coinDenom,
          coinMinimalDenom,
          coinDecimals,
        },
      ],
      feeCurrencies: [
        {
          coinDenom,
          coinMinimalDenom,
          coinDecimals,
        },
      ],
      stakeCurrency: {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
      },
      coinType: CosmosCoinType,
      gasPriceStep: GasPrices,
    });
  }
}
