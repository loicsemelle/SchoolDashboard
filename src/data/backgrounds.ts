import { BackgroundOption } from '../types/dashboard';

export const DEFAULT_BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'classroom-board',
    name: 'Tableau d’école',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=2560&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'nature-forest',
    name: 'Forêt apaisante',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'mountain-lake',
    name: 'Lac de montagne',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'night-sky',
    name: 'Ciel étoilé',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'library',
    name: 'Bibliothèque',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2560&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'gradient-dark',
    name: 'Sombre Épuré',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    thumbnail: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
  },
  {
    id: 'gradient-sunset',
    name: 'Aurore Boréale',
    type: 'gradient',
    value: 'linear-gradient(135deg, #09203f 0%, #537895 100%)',
    thumbnail: 'linear-gradient(135deg, #09203f, #537895)',
  },
];
