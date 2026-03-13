/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Splash } from './pages/Splash';
import { SetupWizard } from './pages/SetupWizard';
import { Home } from './pages/Home';
import { Camera } from './pages/Camera';
import { Diary } from './pages/Diary';
import { Exercise } from './pages/Exercise';
import { Profile } from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Splash />,
  },
  {
    path: '/setup',
    element: <SetupWizard />,
  },
  {
    path: '/camera',
    element: <Camera />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/diary',
        element: <Diary />,
      },
      {
        path: '/exercise',
        element: <Exercise />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
], {
  basename: '/SnapCalorie'
});

export default function App() {
  return <RouterProvider router={router} />;
}

