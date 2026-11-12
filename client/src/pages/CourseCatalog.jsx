import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  useEffect(() => {
    api.get('/courses', { params: { search, category, difficulty, page, limit: 9 } })
      .then(({ data }) => { setCourses(data.courses); setPagination(data.pagination); })
      .catch(() => toast.error('Could not load courses.'));
  }, [search, category, difficulty, page]);
  function filter(setter) { return (event) => { setter(event.target.value); setPage(1); }; }
  return <div className="catalog-page"><PublicNav /><main className="section-wrap catalog-main"><p className="kicker">The course catalogue</p><h1>Find something worth <em>learning.</em></h1><p className="catalog-lead">Free, focused courses to help you grow at your own pace.</p><div className="catalog-filters"><div className="catalog-search"><Search size={18} /><input value={search} onChange={filter(setSearch)} placeholder="Search by topic or course name" /></div><select value={category} onChange={filter(setCategory)}><option value="">All categories</option><option value="Design">Design</option><option value="Development">Development</option><option value="Business">Business</option></select><select value={difficulty} onChange={filter(setDifficulty)}><option value="">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>{courses.length === 0 ? <div className="catalog-empty">No published courses match your filters.</div> : <><div className="catalog-grid">{courses.map((course) => <article className="catalog-card" key={course._id}><div className="catalog-art">{course.thumbnail ? <img src={course.thumbnail} alt="" /> : <span>{course.title.slice(0, 1)}</span>}<b>FREE</b></div><div className="catalog-card-body"><p>{course.category} · {course.difficulty}</p><h2>{course.title}</h2><span>{course.instructor}</span><Link className="text-link" to={`/courses/${course._id}`}>View course <ArrowRight size={15} /></Link></div></article>)}</div>{pagination.pages > 1 && <div className="pagination catalog-pagination"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {pagination.pages}</span><button type="button" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</button></div>}</>}</main></div>;
}
