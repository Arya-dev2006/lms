import { ArrowLeft, Check, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const initial = { title: '', description: '', category: '', difficulty: 'beginner', instructor: '', thumbnail: '', objectivesText: '', isPublished: false };

export default function AdminCourseForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { if (editing) api.get(`/courses/${id}`).then(({ data }) => { const course = data.course; setForm({ ...course, objectivesText: course.objectives.join('\n') }); }).catch(() => toast.error('Could not load course.')); }, [editing, id]);
  function update(event) { const { name, value, type, checked } = event.target; setForm({ ...form, [name]: type === 'checkbox' ? checked : value }); }
  async function uploadThumbnail(event) {
    const file = event.target.files?.[0]; if (!file) return;
    const body = new FormData(); body.append('file', file); setUploading(true);
    try { const { data } = await api.post('/uploads', body, { headers: { 'Content-Type': 'multipart/form-data' } }); setForm({ ...form, thumbnail: data.asset.url }); toast.success('Thumbnail uploaded.'); }
    catch (error) { toast.error(error.response?.data?.message || 'Could not upload thumbnail.'); } finally { setUploading(false); }
  }
  async function submit(event) {
    event.preventDefault(); setSaving(true);
    const payload = { ...form, objectives: form.objectivesText.split('\n').map((item) => item.trim()).filter(Boolean) }; delete payload.objectivesText;
    try { if (editing) await api.put(`/courses/${id}`, payload); else await api.post('/courses', payload); toast.success(editing ? 'Course updated.' : 'Course created.'); navigate('/admin/courses'); } catch (error) { toast.error(error.response?.data?.message || 'Could not save course.'); } finally { setSaving(false); }
  }
  return <AdminLayout><div className="admin-topbar"><div><Link className="back-link" to="/admin/courses"><ArrowLeft size={15} /> Course library</Link><h1>{editing ? 'Edit course' : 'Create a course'}</h1><p className="admin-muted">Shape a clear, useful learning experience.</p></div></div><form className="course-form" onSubmit={submit}><div className="form-card"><p className="kicker">Course details</p><label>Course title<input name="title" value={form.title} onChange={update} placeholder="e.g. Foundations of product design" required /></label><label>Description<textarea name="description" value={form.description} onChange={update} placeholder="What will learners take away?" rows="5" required /></label><div className="form-two"><label>Category<input name="category" value={form.category} onChange={update} placeholder="Design" required /></label><label>Difficulty<select name="difficulty" value={form.difficulty} onChange={update}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label></div><label>Instructor<input name="instructor" value={form.instructor} onChange={update} placeholder="Instructor name" required /></label><label>Thumbnail URL <small>Use a URL or upload to Cloudinary</small><input name="thumbnail" value={form.thumbnail} onChange={update} placeholder="https://..." /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadThumbnail} disabled={uploading} /></label></div><div className="form-card"><p className="kicker">Learning outcomes</p><label>Objectives <small>One objective per line</small><textarea name="objectivesText" value={form.objectivesText} onChange={update} placeholder="Understand the fundamentals&#10;Build a practical workflow" rows="5" /></label><label className="checkbox-label"><input type="checkbox" name="isPublished" checked={form.isPublished} onChange={update} /><span><b>Publish this course</b><small>Published courses are visible to learners.</small></span><Check size={16} /></label><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create course'} <Save size={16} /></button></div></form></AdminLayout>;
}
