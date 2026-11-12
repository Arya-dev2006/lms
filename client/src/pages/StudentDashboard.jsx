import { ArrowRight, BookOpen, CheckCircle2, Compass, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/enrollments/my-courses').then(({ data }) => setCourses(data.courses)).catch((error) => toast.error(error.response?.data?.message || 'Could not load your learning.')).finally(() => setLoading(false)); }, []);
  const completed = courses.filter((course) => course.progress?.completionPercentage === 100).length;
  const lessons = courses.reduce((total, course) => total + (course.progress?.completedLessons?.length || 0), 0);
  return <StudentLayout><div className="student-topbar"><div><p className="kicker">Your learning space</p><h1>Good morning, {user.name.split(' ')[0]}.</h1><p className="student-muted">A little progress today adds up to something meaningful.</p></div><Link className="button button-primary" to="/courses"><Compass size={17} /> Explore courses</Link></div><div className="student-stats"><Stat icon={BookOpen} label="Enrolled courses" value={courses.length} /><Stat icon={CheckCircle2} label="Completed courses" value={completed} /><Stat icon={Play} label="Lessons completed" value={lessons} /><Stat icon={Compass} label="Overall progress" value={courses.length ? `${Math.round(courses.reduce((sum, course) => sum + (course.progress?.completionPercentage || 0), 0) / courses.length)}%` : '0%'} /></div><section className="student-panel" id="learning"><div className="panel-heading"><div><p className="kicker">Keep going</p><h2>My learning</h2></div><Link className="text-link" to="/courses">Find more <ArrowRight size={15} /></Link></div>{loading ? <div className="student-empty">Loading your courses...</div> : courses.length === 0 ? <div className="student-empty"><BookOpen size={30} /><h3>Your learning space is waiting.</h3><p>Explore the catalogue and enroll in a free course to begin.</p><Link className="button button-dark" to="/courses">Explore courses <ArrowRight size={15} /></Link></div> : <div className="student-course-list">{courses.map((course) => <CourseCard course={course} key={course._id} />)}</div>}</section></StudentLayout>;
}

function Stat({ icon: Icon, label, value }) { return <div className="student-stat"><span><Icon size={18} /></span><small>{label}</small><b>{value}</b></div>; }
function CourseCard({ course }) {
  const percentage = course.progress?.completionPercentage || 0;
  return <article className="student-course-card"><div className="student-course-art">{course.thumbnail ? <img src={course.thumbnail} alt="" /> : <span>{course.title.slice(0, 1)}</span>}<small>{course.category}</small></div><div className="student-course-info"><div><p>{course.instructor}</p><h3>{course.title}</h3></div><span className="course-percent">{percentage}%</span><div className="student-progress"><span style={{ width: `${percentage}%` }} /></div><div className="student-course-footer"><small>{course.progress?.completedLessons?.length || 0} lessons complete</small><Link className="text-link" to={`/courses/${course._id}/learn`}>{percentage ? 'Continue' : 'Start course'} <ArrowRight size={15} /></Link></div></div></article>;
}
