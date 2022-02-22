import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useMemo, useState } from "react";
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useAccount } from '../hooks/useAccount';
import { config } from '../util/config';
import { queryContract } from "../util/queryContract";

interface Post {
  user_addr: string;
  username: string;
  content: string;
}

const queryPosts = async (): Promise<Post[]> => (await queryContract({ latest_posts: {} })).posts;

const Home: NextPage<{ initialPosts: Post[] }> = ({ initialPosts }) => {
  const postsInit = useMemo(() => initialPosts, [initialPosts]);
  const [posts, setPosts] = useState(postsInit);

  useEffect(() => {
    const interval = setInterval(async () => {
      const posts = await queryPosts();
      setPosts(posts);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {posts.map((post, idx) => (
        <div key={idx} className={styles.post}>
          <div className={styles.poster}>{post.username} ({post.user_addr})</div>
          <div className={styles.content}>{post.content}</div>
        </div>))}
      <Link href="/post">post message</Link>
    </div> 
  )
}

export const getServerSideProps: GetServerSideProps = async(context) => {
  return { props: { initialPosts: await queryPosts() } };
}

export default Home
