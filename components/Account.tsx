import { FC } from "react";
import Link from "next/link";
import { useAccount } from "../hooks/useAccount";
import { coinToString } from "../util/coins";

const Account: FC = () => {
  const { loggedIn, balance } = useAccount();

  return (
    <div>
      <Link href="/account">
        {loggedIn ? (
          <div>logged in (balance: {coinToString(balance)})</div>
        ) : (
          "login"
        )}
      </Link>
    </div>
  );
};

export default Account;
