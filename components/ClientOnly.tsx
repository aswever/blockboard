import { FC, useEffect, useState } from "react";

const ClientOnly: FC = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return <>{children}</>;
};

export default ClientOnly;
