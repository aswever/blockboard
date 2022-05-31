import { useCallback, useEffect } from "react";
import { accountAtom, balanceAtom, useSignedToken } from "../store";
import { toMicroAmount, amountToCoin } from "../util/coins";
import { queryContract } from "../util/queryContract";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { UserAccount } from "cw-auth-js";
import { getKeplr, suggestChain } from "../accounts/keplr";
import { config, configObject } from "../util/config";
import { coin } from "@cosmjs/launchpad";

export const useAccount = (signedTokenInit?: string) => {
  const router = useRouter();
  const [signedToken, setSignedToken] = useSignedToken(signedTokenInit);
  const [balance, setBalance] = useAtom(balanceAtom);
  const [account, setAccount] = useAtom(accountAtom);

  const createAccount = useCallback(async (): Promise<UserAccount> => {
    const keplr = await getKeplr();
    await suggestChain(keplr);
    const userAccount = await UserAccount.create(
      keplr,
      configObject(
        "rpcEndpoint",
        "gasPrice",
        "coinDenom",
        "chainId",
        "contractAddress",
        "agentAddress"
      )
    );
    setAccount(userAccount);
    return userAccount;
  }, [setAccount]);

  const getAccount = useCallback(async (): Promise<UserAccount> => {
    if (account) return account;
    return createAccount();
  }, [account, createAccount]);

  const login = useCallback(
    async (username: string) => {
      const account = await getAccount();
      const signedToken = await account.signAuthToken({ username });
      setSignedToken(signedToken);
    },
    [getAccount, setSignedToken]
  );

  const logout = useCallback(
    async (redirect = true) => {
      setSignedToken(null);
      if (redirect) router.push("/account/login");
    },
    [setSignedToken, router]
  );

  useEffect(() => {
    if (!signedToken) return;
    if (signedToken.token.expires * 1000 < Date.now()) {
      logout(false);
    } else {
      const timeout = setTimeout(
        () => logout(false),
        signedToken.token.expires * 1000 - Date.now()
      );
      return () => clearTimeout(timeout);
    }
  }, [signedToken, logout]);

  const walletBalance = useCallback(async () => {
    if (!signedToken || !account) return coin(0, config("coinDenom"));
    return account.client.getBalance(account.address, config("coinDenom"));
  }, [signedToken, account]);

  const getBalance = useCallback(async () => {
    if (!signedToken) return setBalance(amountToCoin(0));
    const { balance } = await queryContract({
      get_balance: { addr: signedToken.address },
    });
    setBalance(amountToCoin(balance));
  }, [signedToken, setBalance]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const moveFunds = useCallback(
    async (funds: string, action: "deposit" | "withdraw") => {
      const amount = toMicroAmount(funds);
      const account = await getAccount();
      await account.execute(
        { [`${action}_funds`]: { amount } },
        { funds: action === "deposit" ? [amountToCoin(amount)] : undefined }
      );
      await getBalance();
    },
    [getAccount, getBalance]
  );

  return {
    getAccount,
    balance,
    login,
    logout,
    moveFunds,
    queryContract,
    authToken: signedToken?.token,
    walletBalance,
  };
};
