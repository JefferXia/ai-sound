import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'hot videos! - TopMind for video',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className='p-6 pt-24'>{children}</div>;
};

export default Layout;
