import { useAtom } from "jotai";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount } from "../../hooks/useAccount";
import { messageAtom } from "../../store";
import styles from "../../styles/Account.module.css";
import { fromMicroDenom } from "../../util/coins";
import { config } from "../../util/config";
import { formAction } from "../../util/form";
import { getServerSideToken } from "../../util/getServerSideToken";

export const FundAccount: NextPage<{ initToken: string }> = ({ initToken }) => {
  const router = useRouter();
  const [, setMessage] = useAtom(messageAtom);
  const [funds, setFunds] = useState("");
  const { moveFunds } = useAccount(initToken);

  const denom = fromMicroDenom(config("coinDenom"));

  const fund = async (action: "deposit" | "withdraw") => {
    setMessage({ text: `${action}ing funds...`, timeout: 30000 });
    try {
      await moveFunds(funds, action);
      setMessage({ text: "success!" });
      setFunds("");
      router.push("/");
    } catch (e) {
      setMessage({ text: `error: ${e}`, error: true, timeout: 5000 });
    }
  };

  return (
    <form className={styles.form}>
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
