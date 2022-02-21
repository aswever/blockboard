import type { NextPage } from 'next';
import { FormEvent, useCallback, useState } from "react";
import { useAtom } from "jotai";
import { signedTokenAtom } from "../store";
import styles from '../styles/Home.module.css';

const Post: NextPage = () => {
  const [signedToken] = useAtom(signedTokenAtom);
  const [content, setContent] = useState("");

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/post", { method: "post", body: JSON.stringify({ signedToken, content }) });
    console.log(response.json());
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
