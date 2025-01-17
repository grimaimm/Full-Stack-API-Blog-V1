import React from 'react';
import AcmeLogo from './AcmeLogo';

const BrandName = () => {
  return (
    <div className='flex flex-row items-center'>
      <AcmeLogo />
      <p className='font-bold text-inherit'>Aimblog Dash</p>
    </div>
  );
};

export default BrandName;
