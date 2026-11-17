import { ArrowRight, BookOpen, Check, ChevronRight, Compass, LineChart, Play, Sparkles, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import Logo from '../components/Logo';
import { useEffect, useState } from 'react';
import api from '../services/api';

const features = [
  { icon: Compass, title: 'Find your direction', text: 'Focused courses and clear pathways help you spend less time searching and more time learning.' },
  { icon: LineChart, title: 'See your progress', text: 'A calm, useful view of your momentum makes every completed lesson feel meaningful.' },
  { icon: BookOpen, title: 'Learn in context', text: 'Move from ideas to practical understanding with structured lessons and resources.' },
];

export default function LandingPage() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    Promise.all([api.get('/courses/stats'), api.get('/courses', { params: { limit: 3 } })])
      .then(([statsResponse, coursesResponse]) => { setStats(statsResponse.data.stats); setCourses(coursesResponse.data.courses); })
      .catch(() => {});
  }, []);
  return (
    <div className="marketing-page">
      <PublicNav />
      <main>
        <section className="hero section-wrap">
          <div className="hero-copy reveal">
            <p className="kicker"><Sparkles size={15} /> A better way to keep learning</p>
            <h1>Make room for <em>curiosity.</em></h1>
            <p className="hero-lead">LearnSphere gives you a thoughtful place to build skills, follow your interests, and make progress that lasts.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/register">Create your free account <ArrowRight size={17} /></Link>
              <a className="text-link" href="#courses"><Play size={16} fill="currentColor" /> See how it works</a>
            </div>
            <div className="hero-note"><span className="avatar-stack"><i /><i /><i /></span><span>Built for steady progress, not noisy feeds.</span></div>
          </div>
          <div className="hero-art reveal-delay" aria-label="Learning progress preview">
            <div className="art-grid" />
            <div className="course-preview">
              <div className="preview-top"><span className="mini-label">Continue learning</span><span className="preview-menu">•••</span></div>
              <div className="preview-visual"><span>Design<br /><strong>systems</strong></span><div className="visual-ring"><div /></div></div>
              <div className="preview-meta"><span>Product design</span><span>64% complete</span></div>
              <div className="progress-track"><span /></div>
              <div className="preview-footer"><span>Lesson 08 of 12</span><button type="button" aria-label="Continue lesson"><ArrowRight size={16} /></button></div>
            </div>
            <div className="floating-card floating-check"><span className="check-icon"><Check size={14} /></span><span><b>Lesson complete</b><small>Keep the momentum going</small></span></div>
            <div className="floating-card floating-stat"><small>Learning streak</small><b>07 <span>days</span></b><div className="streak-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
          </div>
        </section>

        <section className="proof-bar section-wrap">
          <span className="proof-label">A focused space for your next chapter</span>
          <div className="proof-items"><span>{stats?.courses ?? '—'} COURSES</span><span>{stats?.learners ?? '—'} LEARNERS</span><span>{stats?.lessons ?? '—'} LESSONS</span><span>ALWAYS FREE</span></div>
        </section>

        <section className="section-wrap intro-section" id="courses">
          <div className="section-heading"><p className="kicker">The LearnSphere approach</p><h2>Learning should feel like <em>forward motion.</em></h2></div>
          <p className="section-description">No busywork. No endless scrolling. Just a considered environment designed to help you start, continue, and finish the things that matter to you.</p>
        </section>

        <section className="section-wrap featured-courses">
          <div className="section-heading-row"><div><p className="kicker">Explore the library</p><h2>Start with something <em>useful.</em></h2></div><Link className="text-link" to="/courses">View all courses <ChevronRight size={16} /></Link></div>
          <div className="featured-course-grid">{courses.map((course, index) => <Link className="featured-course-card" to={`/courses/${course._id}`} key={course._id}><div className={`featured-course-art art-${index + 1}`}>{course.thumbnail ? <img src={course.thumbnail} alt="" /> : <span>{course.title.slice(0, 1)}</span>}<small>{course.category}</small></div><div className="featured-course-body"><span>{course.difficulty} · {course.instructor}</span><h3>{course.title}</h3><div><span>Explore course</span><ArrowRight size={15} /></div></div></Link>)}</div>
          {!courses.length && <div className="featured-empty"><BookOpen size={22} /><span>New courses are being prepared. Check the catalogue soon.</span></div>}
        </section>

        <section className="section-wrap feature-grid" id="features">
          {features.map(({ icon: Icon, title, text }, index) => (
            <article className="feature-card" key={title}><span className="feature-number">0{index + 1}</span><Icon size={24} strokeWidth={1.7} /><h3>{title}</h3><p>{text}</p><ArrowRight className="feature-arrow" size={18} /></article>
          ))}
        </section>

        <section className="section-wrap benefits-section">
          <div className="benefits-copy"><p className="kicker">Built around your momentum</p><h2>Everything you need to make learning <em>stick.</em></h2><p>From the first lesson to the final milestone, LearnSphere keeps your next step visible and your progress easy to celebrate.</p><Link className="button button-dark" to="/register">Build your learning rhythm <ArrowRight size={16} /></Link></div>
          <div className="benefit-list"><div><span><Target size={19} /></span><div><b>Clear milestones</b><p>Know what to learn next and see how close you are to the finish.</p></div></div><div><span><LineChart size={19} /></span><div><b>Visible progress</b><p>Turn small completed lessons into a motivating view of your momentum.</p></div></div><div><span><Users size={19} /></span><div><b>A focused community</b><p>Learn without the noise, pressure, or distraction of endless feeds.</p></div></div></div>
        </section>

        <section className="platform-highlight">
          <div className="section-wrap highlight-inner"><div><p className="kicker kicker-light">A calmer learning experience</p><h2>Make progress you can <em>feel.</em></h2><p>LearnSphere brings your courses, lessons, resources, and milestones into one focused space.</p></div><div className="highlight-cards"><div><b>{stats?.courses ?? '—'}</b><span>focused courses</span></div><div><b>{stats?.lessons ?? '—'}</b><span>lessons to explore</span></div><div><b>100%</b><span>free to begin</span></div></div></div>
        </section>

        <section className="method-section" id="method">
          <div className="section-wrap method-inner"><div><p className="kicker kicker-light">Start where you are</p><h2>A small step is still a <em>step forward.</em></h2></div><div className="method-list"><div><span>01</span><p><b>Choose a course</b><br />Follow what interests you, at your own pace.</p></div><div><span>02</span><p><b>Build a rhythm</b><br />Return to your learning space whenever you have time.</p></div><div><span>03</span><p><b>Make it yours</b><br />Track your progress and celebrate every milestone.</p></div></div></div>
        </section>

        <section className="section-wrap cta-section"><div><p className="kicker">Your next idea is waiting</p><h2>Begin with one <em>good lesson.</em></h2></div><Link className="button button-primary" to="/register">Start learning free <ArrowRight size={17} /></Link></section>
      </main>
      <footer className="site-footer section-wrap"><Logo /><span>© 2026 LearnSphere</span><a href="mailto:hello@learnsphere.example">hello@learnsphere.example</a></footer>
    </div>
  );
}
