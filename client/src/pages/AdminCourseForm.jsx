import { ArrowLeft, Check, Plus, Save, Trash2, Video } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const initial = { title: '', description: '', category: '', difficulty: 'beginner', instructor: '', thumbnail: '', objectivesText: '', isPublished: false };
const emptySegment = () => ({ title: '', description: '', videoUrl: '', duration: '', module: 'General', isPreview: false, id: null, uploading: false });

export default function AdminCourseForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [segments, setSegments] = useState([emptySegment()]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.get(`/courses/${id}`).then(({ data }) => {
      const course = data.course;
      setForm({ ...course, objectivesText: course.objectives.join('\n') });
      setSegments(data.lessons.length ? data.lessons.map((lesson) => ({
        title: lesson.title, description: lesson.description, videoUrl: lesson.videoUrl,
        duration: lesson.duration || '', module: lesson.module, isPreview: lesson.isPreview, id: lesson._id, uploading: false,
      })) : [emptySegment()]);
    }).catch(() => toast.error('Could not load course.'));
  }, [editing, id]);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function updateSegment(index, changes) {
    setSegments((current) => current.map((segment, segmentIndex) => segmentIndex === index ? { ...segment, ...changes } : segment));
  }

  async function uploadFile(file, onUploaded, setBusy) {
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    setBusy(true);
    try {
      const { data } = await api.post('/uploads', body);
      onUploaded(data.asset.url);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not upload file.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function uploadThumbnail(event) {
    const file = event.target.files?.[0];
    const uploaded = await uploadFile(file, (url) => setForm((current) => ({ ...current, thumbnail: url })), setUploading);
    if (uploaded) toast.success('Thumbnail uploaded.');
  }

  async function uploadSegmentVideo(index, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    updateSegment(index, { uploading: true });
    await uploadFile(file, (url) => updateSegment(index, { videoUrl: url }), (busy) => updateSegment(index, { uploading: busy }));
  }

  async function submit(event) {
    event.preventDefault();
    const requiredFields = [['title', 'course title'], ['description', 'description'], ['category', 'category'], ['instructor', 'instructor']];
    const missingField = requiredFields.find(([field]) => !String(form[field] || '').trim());
    if (missingField) {
      toast.error(`Please enter a ${missingField[1]}.`);
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      instructor: form.instructor.trim(),
      objectives: form.objectivesText.split('\n').map((item) => item.trim()).filter(Boolean),
    };
    delete payload.objectivesText;
    const lessonSegments = segments.filter((segment) => segment.title.trim());
    try {
      const originalLessons = editing ? (await api.get(`/courses/${id}`)).data.lessons : [];
      const response = editing ? await api.put(`/courses/${id}`, payload) : await api.post('/courses', payload);
      const courseId = editing ? id : response.data.course._id;
      if (editing) {
        const retainedIds = new Set(lessonSegments.map((segment) => segment.id).filter(Boolean));
        await Promise.all(originalLessons.filter((lesson) => !retainedIds.has(lesson._id)).map((lesson) => api.delete(`/lessons/${lesson._id}`)));
      }
      await Promise.all(lessonSegments.map((segment, index) => {
        const lesson = {
          course: courseId, title: segment.title, description: segment.description, videoUrl: segment.videoUrl,
          duration: Number(segment.duration) || 0, order: index + 1, module: segment.module, isPreview: segment.isPreview,
        };
        return segment.id ? api.put(`/lessons/${segment.id}`, lesson) : api.post('/lessons', lesson);
      }));
      toast.success(editing ? 'Course updated.' : 'Course created.');
      navigate('/admin/courses');
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const details = validationErrors ? Object.values(validationErrors).map((item) => item.message).filter(Boolean).join(' ') : '';
      toast.error(details || error.response?.data?.message || 'Could not save course and video segments.');
    } finally {
      setSaving(false);
    }
  }

  return <AdminLayout>
    <div className="admin-topbar">
      <div><Link className="back-link" to="/admin/courses"><ArrowLeft size={15} /> Course library</Link><h1>{editing ? 'Edit course' : 'Create a course'}</h1><p className="admin-muted">Shape a clear, useful learning experience.</p></div>
    </div>
    <form className="course-form" onSubmit={submit}>
      <div className="form-card">
        <p className="kicker">Course details</p>
        <label>Course title<input name="title" value={form.title} onChange={update} placeholder="e.g. Foundations of product design" required /></label>
        <label>Description<textarea name="description" value={form.description} onChange={update} placeholder="What will learners take away?" rows="5" required /></label>
        <div className="form-two"><label>Category<input name="category" value={form.category} onChange={update} placeholder="Design" required /></label><label>Difficulty<select name="difficulty" value={form.difficulty} onChange={update}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label></div>
        <label>Instructor<input name="instructor" value={form.instructor} onChange={update} placeholder="Instructor name" required /></label>
        <label>Thumbnail URL <small>Paste a Cloudinary image URL or upload a file.</small><input name="thumbnail" value={form.thumbnail} onChange={update} placeholder="https://res.cloudinary.com/..." /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadThumbnail} disabled={uploading} /></label>
        {form.thumbnail && <img className="thumbnail-preview" src={form.thumbnail} alt="Course thumbnail preview" onError={(event) => { event.currentTarget.hidden = true; }} />}
      </div>
      <div className="form-card">
        <p className="kicker">Video segments</p>
        <p className="admin-muted">Paste a Cloudinary video URL or upload a video for each lesson.</p>
        {segments.map((segment, index) => <div className="segment-card" key={segment.id || index}>
          <div className="segment-header"><b>Segment {index + 1}</b><button className="row-delete" type="button" onClick={() => segments.length > 1 && setSegments((current) => current.filter((_item, itemIndex) => itemIndex !== index))} disabled={segments.length === 1} aria-label={`Remove segment ${index + 1}`}><Trash2 size={16} /></button></div>
          <label>Segment title<input value={segment.title} onChange={(event) => updateSegment(index, { title: event.target.value })} placeholder="e.g. Introduction" /></label>
          <div className="form-two"><label>Module<input value={segment.module} onChange={(event) => updateSegment(index, { module: event.target.value })} /></label><label>Duration (minutes)<input type="number" min="0" value={segment.duration} onChange={(event) => updateSegment(index, { duration: event.target.value })} /></label></div>
          <label>Description<textarea value={segment.description} onChange={(event) => updateSegment(index, { description: event.target.value })} rows="2" placeholder="What is covered in this segment?" /></label>
          <label>Video URL <small>Use the direct Cloudinary video URL ending in .mp4, or choose a file.</small><input value={segment.videoUrl} onChange={(event) => updateSegment(index, { videoUrl: event.target.value })} placeholder="https://res.cloudinary.com/.../video/upload/...mp4" /><input type="file" accept="video/mp4,video/webm" onChange={(event) => uploadSegmentVideo(index, event)} disabled={segment.uploading} /><span className="upload-status">{segment.uploading ? 'Uploading video...' : segment.videoUrl ? <><Video size={14} /> Video ready</> : 'No video added yet'}</span></label>
          {segment.videoUrl && <video className="segment-preview" controls src={segment.videoUrl} />}
          <label className="checkbox-label"><input type="checkbox" checked={segment.isPreview} onChange={(event) => updateSegment(index, { isPreview: event.target.checked })} /><span><b>Free preview</b><small>Allow learners to watch this segment before enrolling.</small></span><Check size={16} /></label>
        </div>)}
        <button className="button button-small" type="button" onClick={() => setSegments((current) => [...current, emptySegment()])}><Plus size={16} /> Add another segment</button>
        <label className="checkbox-label"><input type="checkbox" name="isPublished" checked={form.isPublished} onChange={update} /><span><b>Publish this course</b><small>Published courses are visible to learners.</small></span><Check size={16} /></label>
        <button className="button button-primary" type="submit" disabled={saving || uploading || segments.some((segment) => segment.uploading)}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create course'} <Save size={16} /></button>
      </div>
    </form>
  </AdminLayout>;
}
