import { FC } from "react";
import Link from "next/link";
import { useAccount } from "../hooks/useAccount";

const Account: FC = () => {
  const { loggedIn, balanceString } = useAccount();

  return (
    <div>
      <Link href="/account">{loggedIn ? <div>logged in (balance: {balanceString})</div> : "login"}</Link>
    </div>
  );
}

export default Account;
