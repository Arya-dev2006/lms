import { Search, Users } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  async function load(page = 1) { try { const { data } = await api.get('/admin/users', { params: { search, page, limit: 10 } }); setUsers(data.users); setPagination(data.pagination); } catch (error) { toast.error(error.response?.data?.message || 'Could not load users.'); } }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <AdminLayout><div className="admin-topbar"><div><p className="kicker">People</p><h1>Learners.</h1><p className="admin-muted">See who is building momentum on LearnSphere.</p></div></div><div className="admin-toolbar"><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} placeholder="Search name or email" /></div><span>{pagination.total || 0} learners</span></div><section className="admin-panel">{users.length === 0 ? <div className="admin-empty"><Users size={30} /><h3>No learners found.</h3></div> : users.map((user) => <div className="user-row" key={user._id}><div className="user-avatar">{user.name.slice(0, 1)}</div><div className="course-row-title"><b>{user.name}</b><small>{user.email}</small></div><span>{user.enrolledCourses} courses</span><span>{user.completed} completed</span><span>{Math.round(user.average || 0)}% avg.</span></div>)}{pagination.pages > 1 && <div className="pagination"><button type="button" disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)}>Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button type="button" disabled={pagination.page >= pagination.pages} onClick={() => load(pagination.page + 1)}>Next</button></div>}</section></AdminLayout>;
}
