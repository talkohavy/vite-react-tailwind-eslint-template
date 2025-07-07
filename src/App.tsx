import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import type { Route as RouteType } from './common/types';
import Layout from './components/Layout';
import PageNotFound from './pages/PageNotFound';
import { routes } from './routes';

function renderRoute(route: RouteType, index: number) {
  const { to: path, Component, children } = route;

  if (children && children.length > 0) {
    return (
      <Route key={index} path={path} element={<Component />}>
        {children.map((childRoute, childIndex) => renderRoute(childRoute, childIndex))}
      </Route>
    );
  }

  // Simple route without children
  return <Route key={index} path={path} element={<Component />} />;
}

export default function App() {
  return (
    <Layout>
      <Suspense>
        <Routes>
          {routes.map((route, index) => renderRoute(route, index))}
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
