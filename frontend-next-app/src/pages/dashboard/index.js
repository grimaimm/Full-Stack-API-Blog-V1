import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';

// Server-side authentication check
export async function getServerSideProps(context) {
  const accessToken = context.req.cookies?.access_token || '';

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/who-me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const data = await response.json();

  if (data.user.level_id === 3) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get('access_token');

    if (!accessToken) {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <NextSeo title="Dashboard | Aimdev Hub" />
      <Breadcrumbs color="foreground" classNames={{ base: 'my-2' }}>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-3xl font-bold mb-4 mt-3">Home</h1>
    </>
  );
}
