import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SignedToken } from "./util/auth";

export const signedTokenAtom = atomWithStorage<SignedToken | null>("signedToken", null);
export const authTokenAtom = atom((get) => get(signedTokenAtom)?.token ?? null);
