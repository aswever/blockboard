import { FC } from "react";
import UserInfo from "./UserInfo";
import styles from "../styles/Header.module.css";
import ClientOnly from "./ClientOnly";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import Message from "./Message";

const Header: FC = () => {
  return (
    <>
      <div className={styles.header}>
        <Link href="/" passHref={true}>
          <a className={styles.home}>
            <TiHome size="1.2em" />
          </a>
        </Link>
        <ClientOnly>
          <UserInfo />
        </ClientOnly>
      </div>
      <Message />
    </>
  );
};

export default Header;
