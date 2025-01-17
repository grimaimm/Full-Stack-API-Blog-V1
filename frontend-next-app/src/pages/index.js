import LoginPage from '@/modules/AuthPage/Login/components/Login';

export async function getServerSideProps(context) {
  const token = context.req.cookies?.access_token || '';

  if (token) {
    // Jika token ditemukan, redirect ke halaman dashboard
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Home() {
  return (
    <>
      <LoginPage />
    </>
  );
}
