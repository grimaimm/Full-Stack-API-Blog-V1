import React from 'react';

const MainContainer = ({ children }) => {
  return (
    <div className='px-6 py-4 lg:ml-80 z-50'>
      <div className='max-w-7xl mx-auto z-50'>{children}</div>
    </div>
  );
};

export default MainContainer;
