import { ArrowLeft, ArrowUpRight, BookOpen, Plus, Search, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  async function load() { try { const { data } = await api.get('/admin/courses', { params: search ? { search } : {} }); setCourses(data.courses); } catch (error) { toast.error(error.response?.data?.message || 'Could not load courses.'); } }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  async function remove(id) { if (!window.confirm('Delete this course and its lessons?')) return; try { await api.delete(`/courses/${id}`); toast.success('Course deleted.'); load(); } catch (error) { toast.error(error.response?.data?.message || 'Could not delete course.'); } }
  return <AdminLayout><div className="admin-topbar"><div><Link className="back-link" to="/admin/dashboard"><ArrowLeft size={15} /> Overview</Link><h1>Course library</h1><p className="admin-muted">Create, edit, and publish your learning catalogue.</p></div><Link className="button button-primary" to="/admin/courses/new"><Plus size={17} /> New course</Link></div><div className="admin-toolbar"><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} placeholder="Search courses" /></div><span>{courses.length} course{courses.length === 1 ? '' : 's'}</span></div><section className="admin-panel course-list-panel">{courses.length === 0 ? <div className="admin-empty"><BookOpen size={30} /><h3>No courses found.</h3><p>Try another search or create your first course.</p></div> : courses.map((course) => <div className="course-row" key={course._id}><div className="course-thumb">{course.title.slice(0, 1)}</div><div className="course-row-title"><b>{course.title}</b><small>{course.category} · {course.instructor}</small></div><span className={course.isPublished ? 'status-pill published' : 'status-pill'}>{course.isPublished ? 'Published' : 'Draft'}</span><Link to={`/admin/courses/${course._id}/edit`} className="row-action" aria-label={`Edit ${course.title}`}><ArrowUpRight size={16} /></Link><button className="row-delete" type="button" onClick={() => remove(course._id)} aria-label={`Delete ${course.title}`}><Trash2 size={16} /></button></div>)}</section></AdminLayout>;
}
