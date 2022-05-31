// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { AgentAccount, SignedToken } from "cw-auth-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { config, configObject } from "../../util/config";

type RequestBody = {
  signedToken: SignedToken;
  content: string;
};

type ResponseBody = {
  response?: ExecuteResult;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  try {
    const { signedToken, content } = JSON.parse(req.body) as RequestBody;
    const account = await AgentAccount.create(
      config("walletMnemonic"),
      configObject(
        "rpcEndpoint",
        "gasPrice",
        "coinDenom",
        "contractAddress",
        "addrPrefix"
      )
    );
    const response = await account.executeWithAuth(signedToken, {
      post: { message: { content } },
    });
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
}
