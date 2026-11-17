import { ArrowRight, Award, BookOpen, CheckCircle2, Compass, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.get('/enrollments/my-courses'), api.get('/courses', { params: { limit: 6 } })])
      .then(([enrollmentResponse, courseResponse]) => {
        const enrolled = enrollmentResponse.data.courses;
        setCourses(enrolled);
        const enrolledIds = new Set(enrolled.map((course) => course._id));
        setRecommendations(courseResponse.data.courses.filter((course) => !enrolledIds.has(course._id)).slice(0, 3));
      })
      .catch((error) => toast.error(error.response?.data?.message || 'Could not load your learning.'))
      .finally(() => setLoading(false));
  }, []);
  const completed = courses.filter((course) => course.progress?.completionPercentage === 100).length;
  const lessons = courses.reduce((total, course) => total + (course.progress?.completedLessons?.length || 0), 0);
  const overallProgress = courses.length ? Math.round(courses.reduce((sum, course) => sum + (course.progress?.completionPercentage || 0), 0) / courses.length) : 0;
  const activeCourse = courses.find((course) => (course.progress?.completionPercentage || 0) < 100);
  return <StudentLayout><div className="student-topbar"><div><p className="kicker">Your learning space</p><h1>Hi, {user.name}.</h1><p className="student-muted">A little progress today adds up to something meaningful.</p></div><Link className="button button-primary" to="/courses"><Compass size={17} /> Explore courses</Link></div><div className="student-stats"><Stat icon={BookOpen} label="Enrolled courses" value={courses.length} /><Stat icon={CheckCircle2} label="Completed courses" value={completed} /><Stat icon={Play} label="Lessons completed" value={lessons} /><Stat icon={Compass} label="Overall progress" value={`${overallProgress}%`} /></div>{activeCourse && <section className="continue-banner"><div className="continue-icon"><Sparkles size={21} /></div><div><p className="kicker">Your next step</p><h2>Continue {activeCourse.title}</h2><p>{activeCourse.progress?.completionPercentage || 0}% complete · Keep your momentum going.</p></div><Link className="button button-dark" to={`/courses/${activeCourse._id}/learn`}>Resume learning <ArrowRight size={16} /></Link></section>}<div className="student-overview-grid"><section className="student-panel" id="learning"><div className="panel-heading"><div><p className="kicker">Keep going</p><h2>My learning</h2></div><Link className="text-link" to="/courses">Find more <ArrowRight size={15} /></Link></div>{loading ? <div className="student-empty">Loading your courses...</div> : courses.length === 0 ? <div className="student-empty"><BookOpen size={30} /><h3>Your learning space is waiting.</h3><p>Explore the catalogue and enroll in a free course to begin.</p><Link className="button button-dark" to="/courses">Explore courses <ArrowRight size={15} /></Link></div> : <div className="student-course-list">{courses.map((course) => <CourseCard course={course} key={course._id} />)}</div>}</section><aside className="student-side-panel"><div className="side-panel-icon"><Award size={20} /></div><p className="kicker">Your milestones</p><h2>Celebrate your progress.</h2><p>Every completed lesson moves you closer to a new achievement.</p><Link className="text-link" to="/achievements">View achievements <ArrowRight size={15} /></Link><div className="milestone-track"><span style={{ width: `${Math.min(overallProgress, 100)}%` }} /></div><small>{completed} course{completed === 1 ? '' : 's'} completed</small></aside></div><section className="recommendations-section"><div className="section-heading-row"><div><p className="kicker">Keep exploring</p><h2>Recommended for you.</h2></div><Link className="text-link" to="/courses">Browse catalogue <ArrowRight size={15} /></Link></div>{recommendations.length ? <div className="recommendation-grid">{recommendations.map((course) => <RecommendationCard course={course} key={course._id} />)}</div> : <div className="recommendation-empty"><Sparkles size={20} /><span>You have explored everything in the current catalogue.</span><Link className="text-link" to="/courses">Refresh catalogue <ArrowRight size={15} /></Link></div>}</section></StudentLayout>;
}

function Stat({ icon: Icon, label, value }) { return <div className="student-stat"><span><Icon size={18} /></span><small>{label}</small><b>{value}</b></div>; }
function CourseCard({ course }) {
  const percentage = course.progress?.completionPercentage || 0;
  return <article className="student-course-card"><div className="student-course-art">{course.thumbnail ? <img src={course.thumbnail} alt="" /> : <span>{course.title.slice(0, 1)}</span>}<small>{course.category}</small></div><div className="student-course-info"><div><p>{course.instructor}</p><h3>{course.title}</h3></div><span className="course-percent">{percentage}%</span><div className="student-progress"><span style={{ width: `${percentage}%` }} /></div><div className="student-course-footer"><small>{course.progress?.completedLessons?.length || 0} lessons complete</small><Link className="text-link" to={`/courses/${course._id}/learn`}>{percentage ? 'Continue' : 'Start course'} <ArrowRight size={15} /></Link></div></div></article>;
}
function RecommendationCard({ course }) {
  return <Link className="recommendation-card" to={`/courses/${course._id}`}><div className="recommendation-art">{course.thumbnail ? <img src={course.thumbnail} alt="" /> : <span>{course.title.slice(0, 1)}</span>}</div><div><small>{course.category} · {course.difficulty}</small><h3>{course.title}</h3><span>View course <ArrowRight size={14} /></span></div></Link>;
}
