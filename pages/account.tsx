import type { GetServerSideProps, NextPage } from 'next';
import { FormEvent, useState } from "react";
import { useAccount } from "../hooks/useAccount";
import styles from '../styles/Home.module.css';

const Account: NextPage<{ initToken: string }> = ({ initToken }) => {
  const [funds, setFunds] = useState("");
  const [username, setUsername] = useState("");
  const { loggedIn, addFunds, login } = useAccount(initToken);

  const submit = (fn: () => void) => (e: FormEvent) => {
    e.preventDefault();
    fn();
  };

  return (
    <div className={styles.container}>
      {loggedIn ? (
        <form onSubmit={submit(() => addFunds(funds))}>
          <input name="funds" placeholder="funds to add" value={funds} onChange={(e) => setFunds(e.target.value)} />
          <button>add funds</button>
        </form>
      ) : (
	<form onSubmit={submit(() => login(username))}>
          <input name="username" placeholder="your name" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button>login</button>
        </form>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async(context) => {
  return { props: { initToken: context.req.cookies.signedToken ?? null } };
}

export default Account
