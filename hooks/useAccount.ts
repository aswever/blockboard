import { useCallback, useEffect } from "react";
import { accountAtom, balanceAtom, useSignedToken } from "../store";
import { ClientAccount } from "../accounts/clientAccount";
import { toMicroAmount, amountToCoin } from "../util/coins";
import { queryContract } from "../util/queryContract";
import { useAtom } from "jotai";
import { useRouter } from "next/router";

export const useAccount = (signedTokenInit?: string) => {
  const router = useRouter();
  const [signedToken, setSignedToken] = useSignedToken(signedTokenInit);
  const [balance, setBalance] = useAtom(balanceAtom);
  const [account, setAccount] = useAtom(accountAtom);

  const getAccount = useCallback(async (): Promise<ClientAccount> => {
    if (account) return account;
    const clientAccount = await ClientAccount.create();
    setAccount(clientAccount);
    return clientAccount;
  }, [account, setAccount]);

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
    const timeout = setTimeout(
      () => logout(false),
      signedToken.token.expires - Date.now()
    );
    return () => clearTimeout(timeout);
  }, [signedToken, logout]);

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
        { cost: action === "deposit" ? [amountToCoin(amount)] : undefined }
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
  };
};
