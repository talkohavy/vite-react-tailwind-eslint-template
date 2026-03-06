import type { ReactNode } from 'react';
import { Suspense } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import PageNotFound from './pages/PageNotFound';
import { routes } from './routes';
import type { Route as RouteType } from './common/types';

function renderRoute(route: RouteType, index: number): ReactNode {
  const { to: path, Component, children } = route;

  if (children && children.length > 0) {
    return (
      <Route
        key={index}
        path={path}
        render={({ match }: RouteComponentProps) => (
          <Component>
            <Switch>
              {children.map((child, childIndex) => {
                const childPath = child.to === '' ? match.url : `${match.url}/${child.to}`.replace(/\/+/g, '/');
                const isIndex = child.to === '';
                return <Route key={childIndex} exact={isIndex} path={childPath} component={child.Component} />;
              })}
            </Switch>
          </Component>
        )}
      />
    );
  }

  // Root redirect must be exact so path="/" doesn't match every URL (v5 matches by prefix by default)
  const isRootRedirect = path === '/';
  return <Route key={index} exact={isRootRedirect} path={path} component={Component} />;
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <Switch>
          {routes.map((route, index) => renderRoute(route, index))}
          <Route component={PageNotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}
