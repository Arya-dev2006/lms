import { ArrowUpRight, BookOpen, CheckCircle2, Clock3, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => { Promise.all([api.get('/admin/courses'), api.get('/admin/analytics')]).then(([courseResponse, analyticsResponse]) => { setCourses(courseResponse.data.courses); setAnalytics(analyticsResponse.data); }).catch((error) => toast.error(error.response?.data?.message || 'Could not load analytics.')); }, []);
  const stats = analytics?.stats;
  return <AdminLayout><div className="admin-topbar"><div><p className="kicker">Overview</p><h1>Good morning, {courses.length ? 'admin' : 'there'}.</h1><p className="admin-muted">A clear view of your learning platform.</p></div><Link className="button button-primary" to="/admin/courses/new"><Plus size={17} /> New course</Link></div><div className="admin-stats"><Stat icon={BookOpen} label="Total courses" value={stats?.courses ?? courses.length} /><Stat icon={CheckCircle2} label="Published" value={stats?.published ?? '—'} /><Stat icon={Users} label="Registered learners" value={stats?.users ?? '—'} /><Stat icon={Clock3} label="Enrollments" value={stats?.enrollments ?? '—'} /></div><section className="admin-panel"><div className="panel-heading"><div><p className="kicker">Course library</p><h2>Recent courses</h2></div><Link className="text-link" to="/admin/courses">View all <ArrowUpRight size={15} /></Link></div>{courses.length === 0 ? <div className="admin-empty"><BookOpen size={30} /><h3>Your library is ready for its first course.</h3><p>Create a course to start building your learning space.</p><Link className="button button-dark" to="/admin/courses/new">Create a course <Plus size={15} /></Link></div> : <div className="course-table">{courses.slice(0, 6).map((course) => <div className="course-row" key={course._id}><div className="course-thumb">{course.title.slice(0, 1)}</div><div className="course-row-title"><b>{course.title}</b><small>{course.category} · {course.difficulty}</small></div><span className={course.isPublished ? 'status-pill published' : 'status-pill'}>{course.isPublished ? 'Published' : 'Draft'}</span><Link to={`/admin/courses/${course._id}/edit`} className="row-action"><ArrowUpRight size={16} /></Link></div>)}</div>}</section></AdminLayout>;
}

function Stat({ icon: Icon, label, value }) {
  return <div className="admin-stat"><span><Icon size={18} /></span><small>{label}</small><b>{value}</b></div>;
}
