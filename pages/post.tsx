import type { NextPage } from 'next';
import { FormEvent, useCallback, useState } from "react";
import { useSignedToken } from "../store";
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";

const Post: NextPage = () => {
  const router = useRouter();
  const [signedToken] = useSignedToken();
  const [content, setContent] = useState("");

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/post", { method: "post", body: JSON.stringify({ signedToken, content }) });
    router.push("/");
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
