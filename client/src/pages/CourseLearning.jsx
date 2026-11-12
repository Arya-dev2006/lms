import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, Lock, PlayCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CourseLearning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [resources, setResources] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([api.get(`/enrollments/course/${courseId}/learning`), api.get(`/resources/course/${courseId}`)]).then(([learning, resourceResponse]) => { setData(learning.data); setResources(resourceResponse.data.resources); setActive(learning.data.progress?.lastAccessedLesson || learning.data.lessons[0]); }).catch((error) => { toast.error(error.response?.data?.message || 'Enroll in this course to start learning.'); navigate(`/courses/${courseId}`); }).finally(() => setLoading(false)); }, [courseId, navigate]);
  const completed = useMemo(() => new Set(data?.progress?.completedLessons?.map((lesson) => lesson.toString()) || []), [data]);
  async function selectLesson(lesson) { setActive(lesson); try { await api.put(`/progress/${courseId}/last-accessed/${lesson._id}`); } catch { toast.error('Could not save your place.'); } }
  async function complete() { try { const { data: response } = await api.post(`/progress/${courseId}/complete-lesson/${active._id}`); setData({ ...data, progress: response.progress }); toast.success('Lesson marked complete.'); } catch (error) { toast.error(error.response?.data?.message || 'Could not update progress.'); } }
  if (loading) return <div className="page-loading">Loading your course...</div>;
  if (!data || !active) return <div className="page-loading">This course has no lessons yet.</div>;
  const isComplete = completed.has(active._id);
  return <StudentLayout><div className="learning-header"><Link className="back-link" to="/dashboard"><ArrowLeft size={15} /> My learning</Link><p>{data.course.category}</p><h1>{data.course.title}</h1></div><div className="learning-layout"><main className="lesson-main"><div className="video-frame">{active.videoUrl ? <video controls src={active.videoUrl} /> : <div><PlayCircle size={47} /><span>Video lesson</span><small>Your instructor has not added a video yet.</small></div>}</div><div className="lesson-heading"><div><p className="kicker">Lesson {active.order}</p><h2>{active.title}</h2></div><button className={isComplete ? 'complete-button is-complete' : 'complete-button'} type="button" onClick={complete}>{isComplete ? <Check size={17} /> : null}{isComplete ? 'Completed' : 'Mark complete'}</button></div><p className="lesson-description">{active.description || 'Work through this lesson at your own pace.'}</p>{resources.length > 0 && <div className="resources-box"><p className="kicker">Course resources</p>{resources.map((resource) => <a href={resource.fileUrl} target="_blank" rel="noreferrer" key={resource._id}><FileText size={17} /><span><b>{resource.title}</b><small>{resource.description || 'Download resource'}</small></span><ArrowRight size={15} /></a>)}</div>}</main><aside className="curriculum-panel"><div className="curriculum-head"><div><p className="kicker">Course curriculum</p><h2>{data.lessons.length} lessons</h2></div><span>{data.progress?.completionPercentage || 0}%</span></div><div className="student-progress large"><span style={{ width: `${data.progress?.completionPercentage || 0}%` }} /></div><div className="lesson-list">{data.lessons.map((lesson) => <button className={active._id === lesson._id ? 'lesson-item active' : 'lesson-item'} type="button" onClick={() => selectLesson(lesson)} key={lesson._id}><span className="lesson-icon">{completed.has(lesson._id) ? <Check size={14} /> : lesson.isPreview ? <PlayCircle size={14} /> : <Lock size={13} />}</span><span><b>{lesson.order}. {lesson.title}</b><small>{lesson.duration ? `${lesson.duration} min` : 'Lesson'}</small></span><ChevronDown size={14} /></button>)}</div></aside></div></StudentLayout>;
}
