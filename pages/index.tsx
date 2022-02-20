import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { SignedToken } from "../util/auth";
import styles from '../styles/Home.module.css';
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Home: NextPage = () => {
  const [signedToken, setSignedToken] = useState<SignedToken>();
  const { data, error } = useSWR("/api/posts", fetcher);

  const { connect } = useWallet();

  const signToken = useCallback(async () => {
    const wallet = await connect();
    const signedToken = await wallet.signAuthToken({ cost_limit: "100000" })
    setSignedToken(signedToken);
  }, [connect, signedToken]);

  if (!data) return null;
  const { posts } = data;

  return (
    <div>
      <div className={styles.header}>
        {signedToken ? <div>logged in</div> : <button onClick={() => signToken()}>login</button>}
      </div>
      <div className={styles.container}>
        {posts.map((post, idx) => (
          <div key={idx} className={styles.post}>
            <div className={styles.poster}>{post.poster}</div>
            <div className={styles.content}>{post.content}</div>
          </div>))}
      </div>
    </div>
  )
}

export default Home
