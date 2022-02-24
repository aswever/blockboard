import type { NextPage } from "next";
import { useAccount } from "../../hooks/useAccount";
import styles from "../../styles/Account.module.css";
import { formAction } from "../../util/form";
import { getServerSideToken } from "../../util/getServerSideToken";

export const Logout: NextPage<{ initToken: string }> = ({ initToken }) => {
  const { logout } = useAccount(initToken);

  return (
    <form onSubmit={formAction(() => logout())} className={styles.form}>
      <button>logout</button>
    </form>
  );
};

export const getServerSideProps = getServerSideToken;

export default Logout;
