import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routes from './routes/routes';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getProfileThunk } from './redux/userSlice';

function renderRoutes(routeList) {
  return routeList.map(({ path, element, children, index }) => (
    <Route key={path || 'index'} path={path} element={element} index={index}>
      {children && renderRoutes(children)}
    </Route>
  ));
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getProfileThunk());
    }
  }, [dispatch]);
  return (  
    <BrowserRouter>
      <ToastContainer />
      <Routes>{renderRoutes(routes)}</Routes>
    </BrowserRouter>
  );
}

export default App;
