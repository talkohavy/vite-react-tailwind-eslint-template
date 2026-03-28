import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { BASE_URL } from './common/constants';
import Layout from './components/Layout';
import PageNotFound from './pages/PageNotFound';
import RedirectToHome from './pages/RedirectToHome';
import { routes } from './routes';
import type { Route as RouteType } from './common/types';

function renderRoute(route: RouteType, index: number) {
  const { to: path, index: isIndex, Component, children } = route;

  if (children && children.length > 0) {
    return (
      <Route key={index} path={path} element={<Component />}>
        {children.map((childRoute, childIndex) => renderRoute(childRoute, childIndex))}
      </Route>
    );
  }

  // Simple route without children
  return <Route key={index} index={isIndex} path={path} element={<Component />} />;
}

export default function App() {
  return (
    <Layout>
      <Suspense>
        <Routes>
          <Route path={BASE_URL.substring(1)}>{routes.map((route, index) => renderRoute(route, index))}</Route>

          <Route path={'/'}>
            <Route index element={<RedirectToHome />} />
          </Route>

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
