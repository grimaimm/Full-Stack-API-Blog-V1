import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import Cookies from 'js-cookie';
import React from 'react';

const DrawerDropdown = ({ email }) => {
  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar
          isBordered
          showFallback
          as='button'
          className='transition-transform'
          size='sm'
          src='https://images.unsplash.com/broken'
        />
      </DropdownTrigger>
      <DropdownMenu aria-label='Profile Actions' variant='flat'>
        <DropdownItem key='profile' className='h-14 gap-2'>
          <p className='font-semibold'>Signed in as</p>
          <p className='font-semibold'>{email}</p>
        </DropdownItem>
        {/* <DropdownItem key='settings'>My Settings</DropdownItem> */}
        <DropdownItem
          key='logout'
          color='danger'
          onPress={() => {
            Cookies.remove('access_token'); // Hapus token
            // Mengarahkan pengguna ke halaman login atau halaman utama
            window.location.href = '/'; // Ganti dengan halaman yang sesuai jika perlu
          }}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DrawerDropdown;
