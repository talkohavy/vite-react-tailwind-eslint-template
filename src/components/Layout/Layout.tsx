import type { PropsWithChildren } from 'react';
import { MemoryMonitor } from '../MemoryMonitor';
import { Position } from '../MemoryMonitor/logic/constants';
import Header from './Header';
import Main from './Main';
import Sidebar from './Sidebar';

type LayoutProps = PropsWithChildren;

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <div className='flex h-full flex-col items-start justify-start'>
      <Header />

      <div className='flex size-full items-center justify-start overflow-auto'>
        <Sidebar />

        <Main>{children}</Main>

        <MemoryMonitor position={Position.BottomRight} startMinimized />
      </div>
    </div>
  );
}
