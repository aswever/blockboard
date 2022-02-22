import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useMemo, useState } from "react";
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useAccount } from '../hooks/useAccount';

interface Post {
  user_addr: string;
  username: string;
  content: string;
}  

const Home: NextPage<{ initialPosts: Post[] }> = ({ initialPosts }) => {
  const postsInit = useMemo(() => initialPosts, [initialPosts]);
  const [posts, setPosts] = useState(postsInit);
  const { getClient } = useAccount();

  useEffect(() => {
    const interval = setInterval(async () => {
      const client = await getClient();
      const { posts }: { posts: Post[] } = await client.queryContractSmart(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, { latest_posts: {} });
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
  const client = await CosmWasmClient.connect(process.env.NEXT_PUBLIC_RPC_ENDPOINT!);
  const { posts }: { posts: Post[] } = await client.queryContractSmart(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, { latest_posts: {} });
  return { props: { initialPosts: posts } };
}

export default Home
