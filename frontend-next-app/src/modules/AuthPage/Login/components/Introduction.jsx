import React from 'react';

const Introduction = ({ ...props }) => {
  return (
    <div className='flex flex-col justify-center' {...props}>
      <h1 className='mb-6 font-extrabold tracking-tight leading-tight'>
        <div className='text-3xl italic'>Welcome to</div>
        <div className='text-6xl text-nowrap'>Aimdev <span className='bg-secondary px-4 text-default-50 rounded-xl'>Hub</span></div>
        {/* Welcome to  */}
      </h1>
      <p className='text-lg font-normal text-default-400'>
        Aimdev Hub adalah sebuah REST API yang dirancang untuk mengelola platform blog, memungkinkan pengguna untuk membuat, membaca, mengedit, dan menghapus artikel.
      </p>
    </div>
  );
};

export default Introduction;
