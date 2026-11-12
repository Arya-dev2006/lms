import { Award, BookOpen, Compass, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  async function signOut() {
    try { await logout(); navigate('/login'); } catch { toast.error('Could not log out.'); }
  }
  return <div className="student-shell"><aside className="student-sidebar"><Logo /><div className="student-profile"><span>{user.name.slice(0, 1).toUpperCase()}</span><div><b>{user.name}</b><small>Learner</small></div></div><nav className="student-nav"><NavLink to="/dashboard"><LayoutDashboard size={17} /> Overview</NavLink><NavLink to="/courses"><Compass size={17} /> Explore courses</NavLink><NavLink to="/dashboard#learning"><BookOpen size={17} /> My learning</NavLink><NavLink to="/achievements"><Award size={17} /> Achievements</NavLink><a href="#profile"><UserRound size={17} /> My profile <small>soon</small></a></nav><button className="student-logout" type="button" onClick={signOut}><LogOut size={17} /> Log out</button></aside><main className="student-content">{children}</main></div>;
}
