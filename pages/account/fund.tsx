import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount } from "../../hooks/useAccount";
import styles from "../../styles/Account.module.css";
import { fromMicroDenom } from "../../util/coins";
import { config } from "../../util/config";
import { formAction } from "../../util/form";
import { getServerSideToken } from "../../util/getServerSideToken";

export const FundAccount: NextPage<{ initToken: string }> = ({ initToken }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [funds, setFunds] = useState("");
  const { moveFunds } = useAccount(initToken);

  const denom = fromMicroDenom(config("coinDenom"));

  const fund = async (action: "deposit" | "withdraw") => {
    setMessage(`${action}ing funds...`);
    try {
      await moveFunds(funds, action);
      setMessage("success!");
      setFunds("");
      router.push("/");
    } catch (e) {
      setMessage(`error: ${e}`);
    }
  };

  return (
    <form className={styles.form}>
      {message && <div className={styles.message}>{message}</div>}
      <input
        name="funds"
        placeholder={denom}
        autoComplete="off"
        value={funds}
        onChange={(e) => setFunds(e.target.value)}
      />
      <div className={styles.buttons}>
        <button onClick={formAction(() => fund("deposit"))}>deposit</button>
        <button onClick={formAction(() => fund("withdraw"))}>withdraw</button>
      </div>
    </form>
  );
};

export const getServerSideProps = getServerSideToken;

export default FundAccount;
