import { BarChart3, BookOpen, LogOut, Plus, Settings, Users } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from './Logo';
import LogoutConfirmation from './LogoutConfirmation';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  async function signOut() {
    setIsLoggingOut(true);
    try { await logout(); navigate('/login'); } catch { toast.error('Could not log out.'); }
    finally { setIsLoggingOut(false); setShowLogoutConfirmation(false); }
  }
  return <div className="admin-shell"><aside className="admin-sidebar"><Logo /><div className="admin-profile"><span>{user.name.slice(0, 1).toUpperCase()}</span><div><b>{user.name}</b><small>Administrator</small></div></div><nav className="admin-nav"><p>Workspace</p><NavLink end to="/admin/dashboard"><BarChart3 size={17} /> Overview</NavLink><NavLink end to="/admin/courses"><BookOpen size={17} /> Courses</NavLink><NavLink end to="/admin/courses/new"><Plus size={17} /> Create course</NavLink><p>Manage</p><NavLink end to="/admin/users"><Users size={17} /> Users</NavLink><NavLink end to="/admin/settings"><Settings size={17} /> Settings</NavLink></nav><button className="admin-logout" type="button" onClick={() => setShowLogoutConfirmation(true)}><LogOut size={17} /> Log out</button></aside><main className="admin-content">{children}</main><LogoutConfirmation open={showLogoutConfirmation} onCancel={() => setShowLogoutConfirmation(false)} onConfirm={signOut} isLoggingOut={isLoggingOut} /></div>;
}
