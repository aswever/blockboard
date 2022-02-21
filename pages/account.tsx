import type { NextPage } from 'next';
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import styles from '../styles/Home.module.css';
import { toMicroAmount } from "../util/coins";
import { coins } from '@cosmjs/launchpad';

const Account: NextPage = () => {
  const [funds, setFunds] = useState("");

  const { connect } = useWallet();

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
	  const amount = toMicroAmount(funds, process.env.NEXT_PUBLIC_COIN_DECIMALS!);
	  const wallet = await connect();
    const result = await wallet.execute({ deposit_funds: { amount } }, { cost: coins(amount, process.env.NEXT_PUBLIC_COIN_NAME!) });
    console.log(result);
  }, [funds]);

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit}>
      <input name="funds" placeholder="Funds to add" value={funds} onChange={(e) => setFunds(e.target.value)} />
      <button>Add funds</button>
      </form>
    </div>
  )
}

export default Account
