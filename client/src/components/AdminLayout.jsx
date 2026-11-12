import { BarChart3, BookOpen, LogOut, Plus, Settings, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  async function signOut() {
    try { await logout(); navigate('/login'); } catch { toast.error('Could not log out.'); }
  }
  return <div className="admin-shell"><aside className="admin-sidebar"><Logo /><div className="admin-profile"><span>{user.name.slice(0, 1).toUpperCase()}</span><div><b>{user.name}</b><small>Administrator</small></div></div><nav className="admin-nav"><p>Workspace</p><NavLink to="/admin/dashboard"><BarChart3 size={17} /> Overview</NavLink><NavLink to="/admin/courses"><BookOpen size={17} /> Courses</NavLink><NavLink to="/admin/courses/new"><Plus size={17} /> Create course</NavLink><p>Manage</p><NavLink to="/admin/users"><Users size={17} /> Users</NavLink><a href="#settings"><Settings size={17} /> Settings <small>soon</small></a></nav><button className="admin-logout" type="button" onClick={signOut}><LogOut size={17} /> Log out</button></aside><main className="admin-content">{children}</main></div>;
}
