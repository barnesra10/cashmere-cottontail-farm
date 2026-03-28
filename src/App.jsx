import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import BreedPage from './pages/BreedPage';
import AvailablePage from './pages/AvailablePage';
import ProducePage from './pages/Produce';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import breeds from './data/breeds';

export default function App() {
  return (
    <div className="grain">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="produce" element={<ProducePage />} />
          <Route path="contact" element={<Contact />} />
          {breeds.map(breed => (
            <Route key={breed.slug} path={breed.slug}>
              <Route index element={<BreedPage breed={breed} />} />
              <Route path="available" element={<AvailablePage breed={breed} />} />
            </Route>
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
