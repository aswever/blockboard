import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useAtom } from "jotai";
import { signedTokenAtom } from "../store";
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router'

const Post: NextPage = () => {
  const [signedToken, setSignedToken] = useAtom(signedTokenAtom);
  const [content, setContent] = useState("");

  const { connect } = useWallet();

  const onSubmit = useCallback(async (e: Event) => {
    e.preventDefault();
    const wallet = await connect();
    const { response } = await fetch("/api/post", { method: "post", body: JSON.stringify({ signedToken, content }) });
    console.log(response);
  }, [content]);

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <button>post</button>
      </form>
    </div>
  )
}

export default Post
