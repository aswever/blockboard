import { atom, useAtom, WritableAtom } from "jotai";
import { SignedToken } from "./accounts/types";
import Cookies from "js-cookie";

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
      Cookies.set(key, JSON.stringify(nextValue));
    }
  );
};

let signedTokenAtom: WritableAtom<SignedToken | null, unknown, void>;

export const useSignedToken = (init?: string) => {
  if (!signedTokenAtom)
    signedTokenAtom = atomFromCookie<SignedToken | null>("signedToken", init);
  return useAtom(signedTokenAtom);
};
