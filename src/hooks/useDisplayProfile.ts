import { useEffect, useState } from 'react';

const read = () => ({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    quality: (window.innerWidth <= 700 ? 'mobile' : window.innerWidth <= 1050 ? 'tablet' : 'desktop') as 'mobile' | 'tablet' | 'desktop',
});

export function useDisplayProfile() {
  const [profile, setProfile] = useState(read);
  useEffect(() => {
    const queries = [window.matchMedia('(prefers-reduced-motion: reduce)'), window.matchMedia('(max-width: 700px)'), window.matchMedia('(max-width: 1050px)')];
    const update = () => setProfile(read());
    queries.forEach(query => { query.addEventListener('change', update); });
    return () => { queries.forEach(query => { query.removeEventListener('change', update); }); };
  }, []);
  return profile;
}
