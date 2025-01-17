import React from 'react';
import DrawerDropdown from './DrawerDropdown';
import { ButtonOpenSidebar } from './DrawerButton';
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/navbar';
import AcmeLogo from './AcmeLogo';

const DrawerNav = ({ onClick, isOpen, email }) => {
  return (
    <Navbar isBordered className='flex gap-2 lg:hidden'>
      <NavbarContent className='lg:hidden' justify='start'>
        <ButtonOpenSidebar onClick={onClick} isOpen={isOpen} />
      </NavbarContent>

      <NavbarContent className='lg:hidden pr-3' justify='center'>
        <NavbarBrand>
          <AcmeLogo />
          <p className='font-bold text-inherit'>Aimblog Dash</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as='div' className='items-center' justify='end'>
        <DrawerDropdown email={email} />
      </NavbarContent>
    </Navbar>
  );
};

export default DrawerNav;
