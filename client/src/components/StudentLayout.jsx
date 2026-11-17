import { Award, BookOpen, Compass, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from './Logo';
import LogoutConfirmation from './LogoutConfirmation';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  async function signOut() {
    setIsLoggingOut(true);
    try { await logout(); navigate('/login'); } catch { toast.error('Could not log out.'); }
    finally { setIsLoggingOut(false); setShowLogoutConfirmation(false); }
  }
  return <div className="student-shell"><aside className="student-sidebar"><Logo /><div className="student-profile"><span>{user.name.slice(0, 1).toUpperCase()}</span><div><b>{user.name}</b><small>Learner</small></div></div><nav className="student-nav"><NavLink end to="/dashboard"><LayoutDashboard size={17} /> Overview</NavLink><NavLink to="/courses"><Compass size={17} /> Explore courses</NavLink><a href="/dashboard#learning"><BookOpen size={17} /> My learning</a><NavLink end to="/achievements"><Award size={17} /> Achievements</NavLink><NavLink end to="/profile"><UserRound size={17} /> My profile</NavLink></nav><button className="student-logout" type="button" onClick={() => setShowLogoutConfirmation(true)}><LogOut size={17} /> Log out</button></aside><main className="student-content">{children}</main><LogoutConfirmation open={showLogoutConfirmation} onCancel={() => setShowLogoutConfirmation(false)} onConfirm={signOut} isLoggingOut={isLoggingOut} /></div>;
}
