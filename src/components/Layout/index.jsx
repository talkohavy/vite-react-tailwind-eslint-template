import Header from './Header/index';
import Main from './Main/index';
import Sidebar from './Sidebar/index';

export default function Layout({ children }) {
  return (
    <div className='h-full'>
      <Header />

      <div className='flex h-full items-center justify-center'>
        <Sidebar />

        <Main>{children}</Main>
      </div>
    </div>
  );
}
