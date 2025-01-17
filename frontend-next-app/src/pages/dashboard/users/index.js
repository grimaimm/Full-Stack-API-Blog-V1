import ListUsers from '@/modules/DashboardPage/Users/components/ListUsers';
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';
import { NextSeo } from 'next-seo';

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

export default function Users() {
  return (
    <>
      <NextSeo title="Users | Aimdev Hub" />
      <Breadcrumbs color="foreground" classNames={{ base: 'my-2' }}>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Users</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-3xl font-bold mb-4 mt-3">List Users</h1>
      <ListUsers />
    </>
  );
}
