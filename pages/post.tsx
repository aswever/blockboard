import type { NextPage } from "next";
import { FormEvent, useCallback, useState } from "react";
import { messageAtom, useSignedToken } from "../store";
import styles from "../styles/Post.module.css";
import { useRouter } from "next/router";
import { getServerSideToken } from "../util/getServerSideToken";
import { useAtom } from "jotai";

const Post: NextPage = () => {
  const router = useRouter();
  const [signedToken] = useSignedToken();
  const [, setMessage] = useAtom(messageAtom);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage({ text: "posting...", timeout: 10000 });
      const { ok, statusText } = await fetch("/api/post", {
        method: "post",
        body: JSON.stringify({ signedToken, content }),
      });
      if (ok) {
        setMessage({ text: "posted!" });
        setTimeout(() => router.push("/"), 500);
      } else {
        setMessage({
          text: `error: ${statusText}`,
          error: true,
          timeout: 5000,
        });
      }
      setLoading(false);
    },
    [content, router, signedToken, setMessage]
  );

  return (
    <div>
      <form onSubmit={onSubmit} className={styles.form}>
        <button disabled={loading}>post</button>
        <textarea
          placeholder="your message"
          maxLength={140}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
    </div>
  );
};

export const getServerSideProps = getServerSideToken;

export default Post;
