import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import NotFoundPage from '../pages/notfound/not-found-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/not-found': new NotFoundPage(),
};

export default routes;
