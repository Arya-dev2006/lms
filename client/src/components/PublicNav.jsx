import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Logo from './Logo';

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const links = [
    { href: '#courses', label: 'Explore courses' },
    { href: '#method', label: 'Our method' },
    { href: '#features', label: 'Why LearnSphere' },
  ];

  function closeMenu() { setOpen(false); }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo />
        <button className="icon-button mobile-menu" type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={open ? 'main-nav is-open' : 'main-nav'}>
          {links.map((link) => <a href={link.href} key={link.href} onClick={closeMenu}>{link.label}</a>)}
          <span className="nav-divider" />
          <Link className="nav-login" to="/login" state={{ from: location.pathname }} onClick={closeMenu}>Log in</Link>
          <Link className="button button-dark button-small" to="/register" onClick={closeMenu}>
            Start learning <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
