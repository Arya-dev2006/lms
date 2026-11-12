import { Award, LockKeyhole } from 'lucide-react';
import StudentLayout from '../components/StudentLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const possible = [
  ['first-enrollment', 'First enrollment', 'Enroll in your first course.'],
  ['first-lesson', 'First lesson', 'Complete your first lesson.'],
  ['course-completed', 'Course completed', 'Complete every lesson in a course.'],
  ['learning-enthusiast', 'Learning enthusiast', 'Complete three courses.'],
];

export default function Achievements() {
  const [earned, setEarned] = useState([]);
  useEffect(() => { api.get('/achievements/my-achievements').then(({ data }) => setEarned(data.achievements)).catch(() => toast.error('Could not load achievements.')); }, []);
  const earnedTypes = new Set(earned.map((item) => item.type));
  return <StudentLayout><div className="student-topbar"><div><p className="kicker">Milestones</p><h1>Achievements.</h1><p className="student-muted">Small moments that show how far you have come.</p></div></div><div className="achievement-grid">{possible.map(([type, title, description]) => { const item = earned.find((achievement) => achievement.type === type); return <article className={item ? 'achievement-card earned' : 'achievement-card'} key={type}>{item ? <Award size={28} /> : <LockKeyhole size={25} />}<h2>{title}</h2><p>{description}</p>{item ? <small>Earned {new Date(item.earnedAt).toLocaleDateString()}</small> : <small>Keep learning to unlock</small>}</article>; })}</div><p className="achievement-count">{earnedTypes.size} of {possible.length} achievements unlocked</p></StudentLayout>;
}
