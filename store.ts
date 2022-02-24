import { atom, useAtom, WritableAtom } from "jotai";
import { SignedToken } from "./accounts/types";
import Cookies from "js-cookie";
import { ClientAccount } from "./accounts/clientAccount";
import { coin } from "@cosmjs/launchpad";
import { config } from "./util/config";

const atomFromCookie = <T>(
  key: string,
  initialValue?: string
): WritableAtom<T, unknown, void> => {
  const baseAtom = atom(JSON.parse(Cookies.get(key) ?? initialValue ?? "null"));
  return atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      if (nextValue !== null) {
        Cookies.set(key, JSON.stringify(nextValue));
      } else {
        Cookies.remove(key);
      }
    }
  );
};

let signedTokenAtom: WritableAtom<SignedToken | null, unknown, void>;

export const useSignedToken = (init?: string) => {
  if (!signedTokenAtom)
    signedTokenAtom = atomFromCookie<SignedToken | null>("signedToken", init);
  return useAtom(signedTokenAtom);
};

export const balanceAtom = atom(coin(0, config("coinDenom")));
export const accountAtom = atom<ClientAccount | null>(null);
