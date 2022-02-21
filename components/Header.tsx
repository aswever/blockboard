import { FC } from "react";
import Account from "./Account";
import styles from "../styles/Header.module.css";

const Header: FC = () => {
  return (
    <div className={styles.header}>
      <Account />
    </div>
  );
}

export default Header;
