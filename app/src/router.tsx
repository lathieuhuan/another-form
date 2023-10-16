import { createBrowserRouter } from 'react-router-dom';
import Home from './modules/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <div>Not Found 404</div>,
  },
]);

export default router;
