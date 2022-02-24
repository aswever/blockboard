import { FC } from "react";
import Link from "next/link";
import { useAccount } from "../hooks/useAccount";
import { coinToString } from "../util/coins";
import { TiUser } from "react-icons/ti";
import { RiCoinsFill } from "react-icons/ri";
import styles from "../styles/Header.module.css";

const UserInfo: FC = () => {
  const { balance, authToken } = useAccount();

  return (
    <div>
      {authToken ? (
        <div className={styles.userInfo}>
          <div className={styles.user}>
            <Link href="/account/logout" passHref={true}>
              <a>
                <TiUser size="1.2em" className={styles.userIcon} />{" "}
                {authToken.meta.username}
              </a>
            </Link>
          </div>
          <div className={styles.balance}>
            <Link href="/account/fund" passHref={true}>
              <a>
                <RiCoinsFill className={styles.userIcon} size="1.2em" />
                {coinToString(balance)}
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <Link href="/account/login" passHref={true}>
          <a>login</a>
        </Link>
      )}
    </div>
  );
};

export default UserInfo;
