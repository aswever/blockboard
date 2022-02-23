import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { config } from "./config";

let client: CosmWasmClient;

const getClient = async () => {
  if (!client) client = await CosmWasmClient.connect(config("rpcEndpoint"));
  return client;
};

export const queryContract = async <T>(
  query: Record<string, unknown>
): Promise<T> => {
  const client = await getClient();
  return client.queryContractSmart(config("contractAddress"), query);
};
