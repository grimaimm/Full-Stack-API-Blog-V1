import React from 'react';
import HeroUi from '../elements/HeroUi';

export default function LayoutDefault({ children }) {
  return (
    <>
      <div className='w-full'>
        <div className='w-full max-w-[1280px] mx-auto px-6 py-6 lg:py-0'>
          {children}
        </div>
      </div>
      <HeroUi />
    </>
  );
}
