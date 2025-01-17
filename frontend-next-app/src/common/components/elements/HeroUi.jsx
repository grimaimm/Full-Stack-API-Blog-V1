import React from 'react';

const HeroUi = () => {
  return (
    <>
      <div
        aria-hidden='true'
        // className='fixed hidden dark:md:block dark:opacity-70 -bottom-[40%] -left-[20%] -z-10'
        className='fixed dark:opacity-70 -bottom-[40%] -left-[20%] -z-10'
      >
        <img
          src='https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/docs-left.png'
          className='relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large'
          alt='docs left background'
          data-loaded='true'
        />
      </div>
      <div
        aria-hidden='true'
        className='fixed hidden dark:md:block dark:opacity-70 -top-[80%] -right-[60%] 2xl:-top-[60%] 2xl:-right-[45%] -z-10 rotate-12'
      >
        <img
          src='https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/docs-right.png'
          className='relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large'
          alt='docs right background'
          data-loaded='true'
        />
      </div>
    </>
  );
};

export default HeroUi;
