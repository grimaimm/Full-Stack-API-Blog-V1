import React from 'react';
import Introduction from './Introduction';
import LoginForm from './LoginForm';
import { NextSeo } from 'next-seo';

export default function LoginPage() {
  return (
    <>
      <NextSeo title='Login | Aimdev Hub' />
      <section className='flex items-center min-h-dvh'>
        {/* <div className='py-8 lg:px-4 px-6 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16'> */}
        <div className='max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:px-20'>
          <Introduction data-aos='fade-right' />
          <LoginForm />
        </div>
        {/* </div> */}
      </section>
    </>
  );
}
