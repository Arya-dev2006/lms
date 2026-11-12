import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, PlayCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CourseDetails() {
  const { id } = useParams(); const { user } = useAuth(); const navigate = useNavigate();
  const [course, setCourse] = useState(null); const [enrolled, setEnrolled] = useState(false); const [busy, setBusy] = useState(false);
  useEffect(() => { api.get(`/courses/${id}`).then(({ data }) => setCourse(data)).catch(() => toast.error('Could not load course.')); if (user) api.get(`/enrollments/course/${id}`).then(({ data }) => setEnrolled(data.enrolled)).catch(() => {}); }, [id, user]);
  async function join() { if (!user) return navigate('/login', { state: { from: `/courses/${id}` } }); setBusy(true); try { await api.post('/enrollments', { course: id }); setEnrolled(true); toast.success('You are enrolled.'); navigate(`/courses/${id}/learn`); } catch (error) { toast.error(error.response?.data?.message || 'Could not enroll.'); } finally { setBusy(false); } }
  if (!course) return <div className="page-loading">Loading course...</div>;
  return <div className="course-detail-page"><PublicNav /><main className="section-wrap detail-main"><Link className="back-link" to="/courses"><ArrowLeft size={15} /> All courses</Link><div className="detail-hero"><div><p className="kicker">{course.course.category} · {course.course.difficulty}</p><h1>{course.course.title}</h1><p className="detail-lead">{course.course.description}</p><span className="detail-instructor">Led by {course.course.instructor}</span><div className="detail-actions">{enrolled ? <Link className="button button-primary" to={`/courses/${id}/learn`}>Continue learning <ArrowRight size={17} /></Link> : <button className="button button-primary" type="button" onClick={join} disabled={busy}>{busy ? 'Enrolling...' : 'Enroll for free'} <ArrowRight size={17} /></button>}</div></div><div className="detail-art">{course.course.thumbnail ? <img src={course.course.thumbnail} alt="" /> : <span>{course.course.title.slice(0, 1)}</span>}<b>FREE COURSE</b></div></div><div className="detail-columns"><section><p className="kicker">What you will learn</p><h2>Build a stronger foundation.</h2><div className="objective-list">{course.course.objectives.map((objective) => <p key={objective}><CheckCircle2 size={17} /> {objective}</p>)}</div></section><aside className="detail-curriculum"><p className="kicker">Inside the course</p><h3>{course.lessons.length} lessons</h3>{course.lessons.map((lesson) => <div key={lesson._id}><PlayCircle size={16} /><span>{lesson.title}</span><small><Clock3 size={12} /> {lesson.duration || '—'} min</small></div>)}</aside></div></main></div>;
}
