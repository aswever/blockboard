import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { queryContract } from "../util/queryContract";

interface Post {
  user_addr: string;
  username: string;
  content: string;
}

interface LatestPostsResponse {
  posts: Post[];
}

const queryPosts = async (): Promise<Post[]> => {
  const { posts } = await queryContract<LatestPostsResponse>({
    latest_posts: {},
  });
  return posts;
};

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
      <div className={styles.postAction}>
        <Link href="/post">add post</Link>
      </div>
      {posts.map((post, idx) => (
        <div key={idx} className={styles.post}>
          <div className={styles.poster}>
            {post.username} ({post.user_addr})
          </div>
          <div className={styles.content}>{post.content}</div>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { initialPosts: await queryPosts() } };
};

export default Home;
