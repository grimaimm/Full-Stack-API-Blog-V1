import React, { useEffect, useState } from 'react';
import DrawerNav from './DrawerNav';
import { DrawerSideDesktop, DrawerSideMobile } from './DrawerSide';
import { useDisclosure } from '@heroui/react';
import { MENU_ITEMS } from '@/common/constant/Menu';
import { useRouter } from 'next/router';
import { useSession } from '@/common/context/SessionContext';

export default function AppDrawer() {
  const { user } = useSession();
  // const [user, setUser] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [backdrop, setBackdrop] = useState('transparent');
  const [placement, setPlacement] = useState('left');
  const [size, setSize] = React.useState('xs');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const menuItems = MENU_ITEMS();
  const filteredMenu = menuItems?.filter((item) => item?.isShow);
  const [isSmallScreenLg, setIsSmallScreenLg] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreenLg(window.innerWidth < 1024); // Tailwind's 'lg' breakpoint is 1024px
    };

    // Initialize on mount
    handleResize();

    // Add event listener on resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cek ukuran layar
  const checkScreenSize = () => {
    const isSmall = window.innerWidth < 1024; // Menentukan ukuran layar
    setIsSmallScreen(isSmall);

    // Update backdrop dan tutup drawer jika < sm
    if (isSmall) {
      setBackdrop('blur');
    } else {
      setBackdrop('transparent');
      onOpenChange(false);
    }
  };

  // Menambahkan event listener untuk resize
  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (!user) {
    return; // Show loading if user is not yet fetched
  }

  return (
    <>
      <DrawerNav onClick={onOpen} isOpen={isOpen} email={user?.email} />
      {!isSmallScreenLg && (
        <DrawerSideDesktop
          list={filteredMenu}
          fullname={user?.fullname || ''}
          level_name={user?.level_name || ''}
        />
      )}
      {isSmallScreenLg && (
        <DrawerSideMobile
          size={size}
          backdrop={backdrop}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement={placement}
          list={filteredMenu}
          fullname={user?.fullname}
          level_name={user?.level_name}
        />
      )}
    </>
  );
}
