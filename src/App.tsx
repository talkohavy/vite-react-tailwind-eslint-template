import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import { BASE_URL } from './common/constants';
import Layout from './components/Layout';
import PageNotFound from './pages/PageNotFound';
import { routes } from './routes';

// Import Home page and its tabs
const HomePage = lazy(() => import('./pages/Home'));
const Overview = lazy(() => import('./pages/Home/tabs/Overview'));
const Analytics = lazy(() => import('./pages/Home/tabs/Analytics'));
const Settings = lazy(() => import('./pages/Home/tabs/Settings'));

export default function App() {
  return (
    <Layout>
      <Suspense>
        <Routes>
          {/* Home route with nested routes */}
          <Route path={`${BASE_URL}/*`} element={<HomePage />}>
            <Route path='' element={<Overview />} />
            <Route path='analytics' element={<Analytics />} />
            <Route path='settings' element={<Settings />} />
          </Route>

          {/* Other routes (excluding Home) */}
          {routes
            .filter((route) => !route.to.includes('/*'))
            .map(({ to: path, Component }, index) => (
              <Route key={index} path={path} element={<Component />} />
            ))}

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
