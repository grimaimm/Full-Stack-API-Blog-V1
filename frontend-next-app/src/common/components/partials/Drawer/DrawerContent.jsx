import React from 'react';

const DrawerContent = ({ children }) => {
  return (
    <div className='p-4 sm:ml-80'>
      <div className='p-4 border-2 max-w-7xl mx-auto border-gray-200 border-dashed rounded-lg dark:border-gray-700'>
        {children}
      </div>
    </div>
  );
};

export default DrawerContent;
