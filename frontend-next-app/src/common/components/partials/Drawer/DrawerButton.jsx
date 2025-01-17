import { Button, Tooltip } from '@heroui/react';
import { IoIosClose, IoIosMenu } from 'react-icons/io';
import React from 'react';

export const ButtonCloseSidebar = ({ onClose }) => {
  return (
    <Tooltip content='Close'>
      <Button
        isIconOnly
        className='text-default-400 sm:hidden flex'
        size='sm'
        variant='light'
        onPress={onClose}
      >
        <svg
          fill='none'
          height='20'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          viewBox='0 0 24 24'
          width='20'
          xmlns='http://www.w3.org/2000/svg'
          className='rotate-180'
        >
          <path d='m13 17 5-5-5-5M6 17l5-5-5-5' />
        </svg>
      </Button>
    </Tooltip>
  );
};

export const ButtonOpenSidebar = ({ onClick, isOpen }) => {
  return (
    <button onClick={onClick} className='bg-transparent'>
      {isOpen ? <IoIosClose size={24} /> : <IoIosMenu size={24} />}
    </button>
  );
};
