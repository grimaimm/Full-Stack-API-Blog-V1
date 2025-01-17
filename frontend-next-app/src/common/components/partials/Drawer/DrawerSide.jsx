import React from 'react';
import BrandName from './BrandName';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/react';
import { Divider, Link } from '@heroui/react';
import ProfileUser from './ProfileUser';
import { ButtonCloseSidebar } from './DrawerButton';
import DrawerMenu from './DrawerMenu';

export const DrawerSideMobile = ({
  size,
  backdrop,
  isOpen,
  onOpenChange,
  placement,
  list,
  fullname,
  level_name,
}) => {
  return (
    <Drawer
      size={size}
      backdrop={backdrop}
      // isOpen={isSmallScreen ? isOpen : true}
      // onOpenChange={(state) => onOpenChange(state)}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement={placement}
      classNames={{
        wrapper: 'lg:w-80 w-screen lg:z-0 z-50',
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className='absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-3.5 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg'>
              <BrandName />
              <ButtonCloseSidebar onClose={onClose} />
            </DrawerHeader>
            <DrawerBody className='pt-20'>
              <ProfileUser fullname={fullname} level_name={level_name} />
              <Divider className='mt-4' />
              <DrawerMenu list={list} />
            </DrawerBody>
            <DrawerFooter className='flex items-center justify-center'>
              <Link
                isBlock
                isExternal
                showAnchorIcon
                color='foreground'
                href='https://aimdev.xyz'
                size='sm'
              >
                AimDev.xyz
              </Link>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export const DrawerSideDesktop = ({ list, fullname, level_name }) => {
  return (
    <aside
      id='logo-sidebar'
      className='fixed top-0 left-0 z-40 lg:block hidden lg:w-80 h-screen transition-transform -translate-x-full sm:translate-x-0 rounded-r-xl'
      aria-label='Sidebar'
    >
      <div className='h-full px-6 pb-4 overflow-y-auto bg-zinc-900 rounded-xl'>
        <div className='absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-3.5 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg rounded-tr-xl'>
          <BrandName />
        </div>
        <div className='pt-20'>
          <ProfileUser fullname={fullname} level_name={level_name} />
          <Divider className='mt-6 mb-3' />
          <DrawerMenu list={list} />
        </div>
        <div className='flex justify-center items-center absolute bottom-0 inset-x-0 z-50 px-2 py-4'>
          <Link
            isBlock
            isExternal
            showAnchorIcon
            color='foreground'
            href='https://aimdev.xyz'
            size='sm'
          >
            AimDev.xyz
          </Link>
        </div>
      </div>
    </aside>
  );
};
