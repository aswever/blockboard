import { GetServerSideProps } from "next";

export const getServerSideToken: GetServerSideProps = async (context) => {
  const { signedToken } = context.req.cookies;

  if (!signedToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/account/login",
      },
    };
  }

  return { props: { initToken: signedToken } };
};
