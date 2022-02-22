import { FC } from "react";
import Account from "./Account";
import styles from "../styles/Header.module.css";
import ClientOnly from "./ClientOnly";
import Link from "next/link";

const Header: FC = () => {
  return (
    <div className={styles.header}>
      <Link href="/">home</Link>
      <ClientOnly>
	<Account />
      </ClientOnly>
    </div>
  );
}

export default Header;
