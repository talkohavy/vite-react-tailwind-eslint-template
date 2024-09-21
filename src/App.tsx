import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/index';
import PageNotFound from './pages/PageNotFound';
import { routes } from './routes';

function App() {
  return (
    <Layout>
      <Suspense>
        <Routes>
          {routes.map(({ to: path, Component }, index) => (
            <Route key={index} path={path} element={<Component />} />
          ))}

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
