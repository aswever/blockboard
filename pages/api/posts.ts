// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import type { NextApiRequest, NextApiResponse } from 'next'
import { SignedToken } from "../../util/auth";
import { Wallet } from "../../util/wallet";

interface Post {
  poster: string;
  content: string;
}

interface ResponseBody {
  posts: Post[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  const client = await CosmWasmClient.connect(process.env.NEXT_PUBLIC_RPC_ENDPOINT!);
  const { posts }: { posts: Post[] } = await client.queryContractSmart(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, { latest_posts: {} });
  res.status(200).json({ posts })
}
