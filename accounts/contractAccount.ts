import {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice, OfflineSigner } from "@cosmjs/launchpad";
import { ExecuteOptions } from "./types";
import { config } from "../util/config";

export class ContractAccount {
  constructor(
    protected client: SigningCosmWasmClient,
    protected address: string
  ) {}

  static async fromSigner<T extends ContractAccount>(
    signer: OfflineSigner,
    constructor: new (client: SigningCosmWasmClient, address: string) => T
  ): Promise<T> {
    const client = await SigningCosmWasmClient.connectWithSigner(
      config("rpcEndpoint"),
      signer,
      {
        gasPrice: GasPrice.fromString(
          `${config("gasPrice")}${config("coinDenom")}`
        ),
      }
    );

    const [{ address }] = await signer.getAccounts();

    return new constructor(client, address);
  }

  async execute(
    message: Record<string, unknown>,
    { cost, memo }: ExecuteOptions = {}
  ): Promise<ExecuteResult> {
    return this.client.execute(
      this.address,
      config("contractAddress"),
      message,
      "auto",
      memo,
      cost
    );
  }
}
