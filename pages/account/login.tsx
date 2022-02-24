import type { NextPage } from "next";
import { useState } from "react";
import { formAction } from "../../util/form";
import { useAccount } from "../../hooks/useAccount";
import styles from "../../styles/Account.module.css";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const { login } = useAccount();

  const submitLogin = async () => {
    if (username.length > 20) throw new Error("Name too long");
    await login(username.trim());
    setUsername("");
    router.push("/");
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
