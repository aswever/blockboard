// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import type { NextApiRequest, NextApiResponse } from 'next'
import { SignedToken } from "../../accounts/types";
import { ServerAccount } from "../../accounts/serverAccount";
import { amountToCoin } from '../../util/coins';

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
  const account = await ServerAccount.create();
  const response = await account.executeWithAuth(signedToken, { post: { message: { content } } }, { cost: [amountToCoin(10000)] });
  res.status(200).json({ response })
}
