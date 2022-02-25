import { useAtom } from "jotai";
import { FC, useEffect } from "react";
import { messageAtom } from "../store";
import styles from "../styles/Header.module.css";

const Message: FC = () => {
  const [message, setMessage] = useAtom(messageAtom);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, message.timeout ?? 1000);
      return () => clearTimeout(timeout);
    }
  }, [message, setMessage]);

  if (!message) return null;

  const classes = [styles.message];
  if (message.error) classes.push(styles.error);

  return <div className={classes.join(" ")}>{message.text}</div>;
};

export default Message;
