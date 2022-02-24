import type { NextPage } from "next";
import { FormEvent, useCallback, useState } from "react";
import { useSignedToken } from "../store";
import styles from "../styles/Post.module.css";
import { useRouter } from "next/router";
import { getServerSideToken } from "../util/getServerSideToken";

const Post: NextPage = () => {
  const router = useRouter();
  const [signedToken] = useSignedToken();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await fetch("/api/post", {
        method: "post",
        body: JSON.stringify({ signedToken, content }),
      });
      router.push("/");
      setLoading(false);
    },
    [content, router, signedToken]
  );

  if (loading) return <div className={styles.posting}>posting...</div>;

  return (
    <div>
      <form onSubmit={onSubmit} className={styles.form}>
        <button>post</button>
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
