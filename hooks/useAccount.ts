import { useCallback, useEffect, useMemo, useState } from "react";
import { useSignedToken } from "../store";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { KeplrWallet } from "./useWallet";
import { toMicroAmount, fromMicroCoin } from "../util/coins";
import { coins } from "@cosmjs/launchpad";

export const useAccount = (signedTokenInit?: string) => {
  const [signedToken, setSignedToken] = useSignedToken(signedTokenInit);
  const [balance, setBalance] = useState("0");
  const [client, setClient] = useState<CosmWasmClient>();
  const [wallet, setWallet] = useState<KeplrWallet>();

  const getClient = useCallback(async () => {
    if (client) return client;
    const newClient = await CosmWasmClient.connect(process.env.NEXT_PUBLIC_RPC_ENDPOINT!);
    setClient(newClient);
    return newClient;
  }, [client]);

  const getWallet = useCallback(async (): Promise<KeplrWallet> => {
    if (wallet) return wallet;

    const keplrWallet = await KeplrWallet.create();
    setWallet(keplrWallet);

    return keplrWallet;
  }, [wallet]);

  const getSigningClient = useCallback(async (): Promise<SigningCosmWasmClient> => {
    return (await getWallet()).client;
  }, [wallet]);

  const getBalance = useCallback(async () => {
    if (!signedToken) return setBalance("0");
    const client = await getClient();
    const { balance } = await client.queryContractSmart(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, { get_balance: { addr: signedToken.address } });
    setBalance(balance);
  }, [signedToken, getClient]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const login = useCallback(async (username: string) => {
    const wallet = await getWallet();
    const signedToken = await wallet.signAuthToken({ username })
    setSignedToken(signedToken);
  }, [getWallet, signedToken]);

  const addFunds = useCallback(async (funds: string) => {
    const amount = toMicroAmount(funds, process.env.NEXT_PUBLIC_COIN_DECIMALS!);
    const wallet = await getWallet();
    await wallet.execute({ deposit_funds: { amount } }, { cost: coins(amount, process.env.NEXT_PUBLIC_COIN_NAME!) });
    await getBalance();
  }, [getWallet]);

  const balanceString = useMemo(() => {
    const coin = fromMicroCoin({amount: balance, denom: process.env.NEXT_PUBLIC_COIN_NAME!}, process.env.NEXT_PUBLIC_COIN_DECIMALS!);
    return `${coin.amount}${coin.denom}`;
  }, [balance]);

  return { getClient, getSigningClient, getWallet, getBalance, balance, balanceString, login, addFunds, loggedIn: signedToken !== undefined };

}
