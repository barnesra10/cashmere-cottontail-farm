import { useParams } from 'react-router-dom';
import { useBreed } from '../hooks/useData';
import AvailablePage from './AvailablePage';
import NotFound from './NotFound';

export default function AvailablePageWrapper() {
  const { breedSlug } = useParams();
  const { breed, loading } = useBreed(breedSlug);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
    </div>
  );

  if (!breed) return <NotFound />;

  return <AvailablePage breed={breed} />;
}
