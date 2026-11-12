import { Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark"><Orbit size={20} strokeWidth={2.5} /></span>
      <span>Learn<span>Sphere</span></span>
    </Link>
  );
}
