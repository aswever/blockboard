import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { SignedToken } from "../util/auth";
import styles from '../styles/Home.module.css';
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Home: NextPage = () => {
  const { data, error } = useSWR("/api/posts", fetcher);
  if (!data) return null;
  const { posts } = data;

  return (
    <div className={styles.container}>
      {posts.map((post, idx) => (
        <div key={idx} className={styles.post}>
          <div className={styles.poster}>{post.poster}</div>
          <div className={styles.content}>{post.content}</div>
        </div>))}
    </div>
  )
}

export default Home
