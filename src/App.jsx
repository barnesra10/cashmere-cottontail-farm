import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import BreedPageWrapper from './pages/BreedPageWrapper';
import AvailablePageWrapper from './pages/AvailablePageWrapper';
import ProducePage from './pages/Produce';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import QuickPost from './pages/QuickPost';
import SocialPreview from './pages/SocialPreview';
import SocialPost from './pages/SocialPost';
import BillOfSale from './pages/BillOfSale';
import BuyerBillOfSale from './pages/BuyerBillOfSale';
import Records from './pages/Records';
import PublicAnimalRecord from './pages/PublicAnimalRecord';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="grain">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="produce" element={<ProducePage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          <Route path="post" element={<QuickPost />} />
          <Route path="social" element={<SocialPreview />} />
          <Route path="social-post" element={<SocialPost />} />
          <Route path="bill-of-sale" element={<BillOfSale />} />
          <Route path="records" element={<Records />} />
          <Route path="animal-record/:token" element={<PublicAnimalRecord />} />
          <Route path="buyer/:token" element={<BuyerBillOfSale />} />
          <Route path=":breedSlug" element={<BreedPageWrapper />} />
          <Route path=":breedSlug/available" element={<AvailablePageWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
