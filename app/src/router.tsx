import { createBrowserRouter } from 'react-router-dom';
import Home from './modules/Home';
import Basic from './modules/Basic';

const router = createBrowserRouter([
  {
    path: '/basic',
    element: <Basic />,
  },
  {
    path: '/',
    element: <Home />,
    errorElement: <div>Not Found 404</div>,
  },
]);

export default router;
