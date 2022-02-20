import type { NextPage } from 'next'
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Post: NextPage {
  const { data, error } = useSWR("/api/posts", fetcher);
}
