import React from 'react';
import AppDrawer from '../partials/Drawer/AppDrawer';
import MainContainer from './MainContainer';


export default function LayoutDashboard({ children }) {
  return (
    <>
      <AppDrawer />
      <MainContainer>{children}</MainContainer>
    </>
  );
}
