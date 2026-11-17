import { ArrowUpRight, BarChart3, BookOpen, CheckCircle2, Clock3, Plus, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    Promise.all([api.get('/admin/courses'), api.get('/admin/analytics')])
      .then(([courseResponse, analyticsResponse]) => { setCourses(courseResponse.data.courses); setAnalytics(analyticsResponse.data); })
      .catch((error) => toast.error(error.response?.data?.message || 'Could not load analytics.'));
  }, []);
  const stats = analytics?.stats;
  const chartData = analytics?.enrollmentsByCourse || [];
  const publishedRatio = stats?.courses ? Math.round((stats.published / stats.courses) * 100) : 0;
  const averageEnrollments = stats?.courses ? Math.round((stats.enrollments || 0) / stats.courses) : 0;
  return <AdminLayout>
    <div className="admin-topbar"><div><p className="kicker">Overview</p><h1>Hi, {user.name}.</h1><p className="admin-muted">A clear view of your learning platform.</p></div><Link className="button button-primary" to="/admin/courses/new"><Plus size={17} /> New course</Link></div>
    <div className="admin-stats"><Stat icon={BookOpen} label="Total courses" value={stats?.courses ?? courses.length} /><Stat icon={CheckCircle2} label="Published" value={stats?.published ?? '—'} /><Stat icon={Users} label="Registered learners" value={stats?.users ?? '—'} /><Stat icon={Clock3} label="Enrollments" value={stats?.enrollments ?? '—'} /></div>
    <div className="admin-dashboard-grid"><section className="admin-panel chart-panel"><div className="panel-heading"><div><p className="kicker">Learning activity</p><h2>Course enrollments</h2></div><BarChart3 size={20} /></div>{chartData.length ? <ResponsiveContainer width="100%" height={240}><BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef4" /><XAxis dataKey="title" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: '#f7f6ff' }} /><Bar dataKey="enrollments" fill="#6258e8" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="chart-empty"><BarChart3 size={24} /><span>Enrollment activity will appear here as learners join courses.</span></div>}</section><section className="admin-panel quick-panel"><div className="panel-heading"><div><p className="kicker">Shortcuts</p><h2>Quick actions</h2></div></div><Link to="/admin/courses/new" className="quick-action"><span><Plus size={17} /></span><div><b>Create a course</b><small>Add a new learning experience</small></div><ArrowUpRight size={16} /></Link><Link to="/admin/courses" className="quick-action"><span><BookOpen size={17} /></span><div><b>Manage catalogue</b><small>Edit, publish, or organize courses</small></div><ArrowUpRight size={16} /></Link><Link to="/admin/settings" className="quick-action"><span><Settings size={17} /></span><div><b>Platform settings</b><small>Update your learning space</small></div><ArrowUpRight size={16} /></Link></section></div>
    <section className="admin-pulse-grid"><Pulse label="Published coverage" value={`${publishedRatio}%`} detail="of your catalogue is live" progress={publishedRatio} /><Pulse label="Average enrollments" value={averageEnrollments} detail="learners per course" progress={Math.min(averageEnrollments * 10, 100)} /><Pulse label="Completed learning" value={stats?.completed ?? '—'} detail="courses completed by learners" progress={stats?.enrollments ? Math.round((stats.completed / stats.enrollments) * 100) : 0} /></section>
    <section className="admin-panel"><div className="panel-heading"><div><p className="kicker">Course library</p><h2>Recent courses</h2></div><Link className="text-link" to="/admin/courses">View all <ArrowUpRight size={15} /></Link></div>{courses.length === 0 ? <div className="admin-empty"><BookOpen size={30} /><h3>Your library is ready for its first course.</h3><p>Create a course to start building your learning space.</p><Link className="button button-dark" to="/admin/courses/new">Create a course <Plus size={15} /></Link></div> : <div className="course-table">{courses.slice(0, 6).map((course) => <div className="course-row" key={course._id}><div className="course-thumb">{course.title.slice(0, 1)}</div><div className="course-row-title"><b>{course.title}</b><small>{course.category} · {course.difficulty}</small></div><span className={course.isPublished ? 'status-pill published' : 'status-pill'}>{course.isPublished ? 'Published' : 'Draft'}</span><Link to={`/admin/courses/${course._id}/edit`} className="row-action"><ArrowUpRight size={16} /></Link></div>)}</div>}</section>
  </AdminLayout>;
}

function Stat({ icon: Icon, label, value }) {
  return <div className="admin-stat"><span><Icon size={18} /></span><small>{label}</small><b>{value}</b></div>;
}

function Pulse({ label, value, detail, progress }) {
  return <article className="pulse-card"><div><p>{label}</p><b>{value}</b></div><span>{detail}</span><div className="pulse-track"><i style={{ width: `${Math.min(progress || 0, 100)}%` }} /></div></article>;
}
