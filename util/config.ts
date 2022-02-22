export const configMap = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME,
  rpcEndpoint: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
  restEndpoint: process.env.NEXT_PUBLIC_REST_ENDPOINT,
  coinDenom: process.env.NEXT_PUBLIC_COIN_DENOM,
  addrPrefix: process.env.NEXT_PUBLIC_ADDR_PREFIX,
  coinDecimals: process.env.NEXT_PUBLIC_COIN_DECIMALS,
  gasPrice: process.env.NEXT_PUBLIC_GAS_PRICE,
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  agentAddress: process.env.NEXT_PUBLIC_AGENT_ADDRESS,
};

export type ConfigKey = keyof typeof configMap;

export const config = (key: ConfigKey): string => {
  const value = configMap[key];
  if (!value) throw new Error(`Missing config for ${key}`);
  return value;
}