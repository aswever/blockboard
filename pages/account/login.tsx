import type { NextPage } from "next";
import { useState } from "react";
import { formAction } from "../../util/form";
import { useAccount } from "../../hooks/useAccount";
import styles from "../../styles/Account.module.css";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { messageAtom } from "../../store";

const Login: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [, setMessage] = useAtom(messageAtom);
  const { login } = useAccount();

  const submitLogin = async () => {
    if (username.length > 20)
      return setMessage({ text: "name too long", error: true });
    setMessage({ text: "logging in...", timeout: 10000 });
    try {
      await login(username.trim());
      setUsername("");
      setMessage({ text: "login success!" });
      router.push("/");
    } catch (e) {
      setMessage({ text: `login error: ${e}`, error: true, timeout: 5000 });
    }
  };

  return (
    <form onSubmit={formAction(() => submitLogin())} className={styles.form}>
      <input
        maxLength={20}
        name="username"
        placeholder="your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button>login</button>
    </form>
  );
};

export default Login;
