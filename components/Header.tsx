import { FC } from "react";
import Account from "./Account";
import styles from "../styles/Header.module.css";
import ClientOnly from "./ClientOnly";
import Link from "next/link";
import { TiHome } from "react-icons/ti";

const Header: FC = () => {
  return (
    <div className={styles.header}>
      <Link href="/" passHref={true}>
        <a className={styles.home}>
          <TiHome size="1.2em" />
        </a>
      </Link>
      <ClientOnly>
        <Account />
      </ClientOnly>
    </div>
  );
};

export default Header;
