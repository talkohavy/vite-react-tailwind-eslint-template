import Header from './Header';
import Main from './Main';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className='flex h-full flex-col items-start justify-start'>
      <Header />

      <div className='flex w-full flex-grow items-center justify-center'>
        <Sidebar />

        <Main>{children}</Main>
      </div>
    </div>
  );
}
