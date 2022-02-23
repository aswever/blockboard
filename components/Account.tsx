import { FC } from "react";
import Link from "next/link";
import { useAccount } from "../hooks/useAccount";
import { coinToString } from "../util/coins";
import { TiUser } from "react-icons/ti";
import { RiCoinsFill } from "react-icons/ri";
import styles from "../styles/Header.module.css";

const Account: FC = () => {
  const { balance, authToken } = useAccount();

  return (
    <div>
      <Link href="/account">
        {authToken ? (
          <div className={styles.userInfo}>
            <div className={styles.user}>
              <a>
                <TiUser size="1.2em" className={styles.userIcon} />{" "}
                {authToken.meta.username}
              </a>
            </div>
            <div className={styles.balance}>
              <RiCoinsFill className={styles.userIcon} size="1.2em" />
              {coinToString(balance)}
            </div>
          </div>
        ) : (
          "login"
        )}
      </Link>
    </div>
  );
};

export default Account;
