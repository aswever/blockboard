import { queryContract } from "../util/queryContract";

export interface Post {
  user_addr: string;
  username: string;
  content: string;
}

export interface LatestPostsResponse {
  posts: Post[];
}

export const queryPosts = async (): Promise<Post[]> => {
  const { posts } = await queryContract<LatestPostsResponse>({
    latest_posts: { limit: 5 },
  });
  return posts;
};
