// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { coins } from '@cosmjs/launchpad';
import type { NextApiRequest, NextApiResponse } from 'next'
import { SignedToken } from "../../util/auth";
import { Wallet } from "../../util/wallet";

type RequestBody = {
  signedToken: SignedToken;
  content: string;
}

type ResponseBody = {
  response: ExecuteResult
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  const { signedToken, content } = JSON.parse(req.body) as RequestBody;
  const wallet = await Wallet.create();
  const response = await wallet.executeWithAuth(signedToken, { post: { message: { content } } }, { cost: coins("10000", process.env.NEXT_PUBLIC_COIN_NAME!) });
  res.status(200).json({ response })
}
