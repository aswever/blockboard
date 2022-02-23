import { useCallback, useEffect, useState } from "react";
import { useSignedToken } from "../store";
import { ClientAccount } from "../accounts/clientAccount";
import { toMicroAmount, amountToCoin } from "../util/coins";
import { config } from "../util/config";
import { coin } from "@cosmjs/launchpad";
import { queryContract } from "../util/queryContract";

export const useAccount = (signedTokenInit?: string) => {
  const [signedToken, setSignedToken] = useSignedToken(signedTokenInit);
  const [balance, setBalance] = useState(coin(0, config("coinDenom")));
  const [account, setAccount] = useState<ClientAccount>();

  const getAccount = useCallback(async (): Promise<ClientAccount> => {
    if (account) return account;
    const clientAccount = await ClientAccount.create();
    setAccount(clientAccount);
    return clientAccount;
  }, [account]);

  const login = useCallback(
    async (username: string) => {
      const account = await getAccount();
      const signedToken = await account.signAuthToken({ username });
      setSignedToken(signedToken);
    },
    [getAccount, setSignedToken]
  );

  const getBalance = useCallback(async () => {
    if (!signedToken) return setBalance(amountToCoin(0));
    const { balance } = await queryContract({
      get_balance: { addr: signedToken.address },
    });
    setBalance(amountToCoin(balance));
  }, [signedToken]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const addFunds = useCallback(
    async (funds: string) => {
      const amount = toMicroAmount(funds);
      const account = await getAccount();
      await account.execute(
        { deposit_funds: { amount } },
        { cost: [amountToCoin(amount)] }
      );
      await getBalance();
    },
    [getAccount, getBalance]
  );

  return {
    getAccount,
    balance,
    login,
    addFunds,
    queryContract,
    authToken: signedToken?.token,
  };
};
