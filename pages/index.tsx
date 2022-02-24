import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useAccount } from "../hooks/useAccount";
import { Post, queryPosts } from "../util/posts";
import { config } from "../util/config";

interface HomeProps {
  initialPosts: Post[];
  initToken?: string;
}

const Home: NextPage<HomeProps> = ({ initialPosts, initToken }) => {
  const { authToken, balance } = useAccount(initToken);
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    const interval = setInterval(async () => {
      const posts = await queryPosts();
      setPosts(posts);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className={styles.postAction}>
        {!authToken ? (
          <Link href="/account/login" passHref={true}>
            <button>login to post</button>
          </Link>
        ) : Number(balance.amount) < Number(config("postFee")) ? (
          <Link href="/account/fund" passHref={true}>
            <button>add funds to post</button>
          </Link>
        ) : (
          <Link href="/post" passHref={true}>
            <button>add post</button>
          </Link>
        )}
      </div>
      {posts.map((post, idx) => (
        <div key={idx} className={styles.post}>
          <div className={styles.poster}>
            <div className={styles.username}>{post.username}</div>{" "}
            <div className={styles.userAddr}>{post.user_addr}</div>
          </div>
          <div className={styles.content}>{post.content}</div>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: HomeProps = { initialPosts: await queryPosts() };
  const initToken = context.req.cookies.signedToken;
  if (initToken) props.initToken = initToken;
  return { props };
};

export default Home;
