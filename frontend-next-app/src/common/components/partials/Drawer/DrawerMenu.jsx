import React from 'react';
import MenuItem from './MenuItem';
import { Button } from '@heroui/button';
import Cookies from 'js-cookie';
import { FiLogOut as LogoutIcon } from 'react-icons/fi';

const DrawerMenu = ({ list }) => {
  return (
    <ul className='space-y-2 font-medium'>
      {list?.map((item, index) => (
        <li key={index}>
          <MenuItem key={index} {...item} />
        </li>
      ))}
      <li>
        <Button
          color='danger'
          className='w-full text-base rounded-lg'
          variant='flat'
          onPress={() => {
            Cookies.remove('access_token');
            window.location.href = '/';
          }}
        >
          <LogoutIcon size={20} /> Logout
        </Button>
      </li>
    </ul>
  );
};

export default DrawerMenu;
