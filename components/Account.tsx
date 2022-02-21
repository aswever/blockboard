import { FC, useCallback } from "react";
import { useAtom } from "jotai";
import { signedTokenAtom } from "../store";
import { useWallet } from "../hooks/useWallet";
import ClientOnly from "./ClientOnly";

const Account: FC = () => {
  const [signedToken, setSignedToken] = useAtom(signedTokenAtom);
  const { connect } = useWallet();

  const signToken = useCallback(async () => {
    const wallet = await connect();
    const signedToken = await wallet.signAuthToken({})
    setSignedToken(signedToken);
  }, [connect, signedToken]);

  return (
    <ClientOnly>
      <div>
        {signedToken ? <div>logged in</div> : <button onClick={() => signToken()}>login</button>}
      </div>
    </ClientOnly>
  );
}

export default Account;
