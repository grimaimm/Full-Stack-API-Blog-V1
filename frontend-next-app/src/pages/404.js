import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <>
      <Head>
        <NextSeo title='404 | Aimdev Hub' />
      </Head>
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <h1 className='text-9xl font-extrabold tracking-widest'>404</h1>
        <div className='absolute rotate-12 rounded bg-secondary px-2 text-sm text-white'>
          Page Not Found
        </div>
        <button className='mt-5'>
          <Link
            href='/'
            className='group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring active:text-secondary'
          >
            <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 bg-secondary transition-transform group-hover:translate-x-0 group-hover:translate-y-0'></span>

            <span className='relative block border border-current bg-neutral px-8 py-3'>
              Go Home
            </span>
          </Link>
        </button>
      </div>
    </>
  );
};

export default Custom404;
