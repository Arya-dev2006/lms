import { LockKeyhole, Save, UserRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import StudentLayout from '../components/StudentLayout';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profile, setProfile] = useState({ name: user.name, email: user.email });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    try { await updateProfile(profile); toast.success('Profile updated.'); } catch (error) { toast.error(error.response?.data?.message || 'Could not update profile.'); } finally { setSaving(false); }
  }
  async function savePassword(event) {
    event.preventDefault();
    setSaving(true);
    try { await changePassword(password); setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' }); toast.success('Password updated.'); } catch (error) { toast.error(error.response?.data?.message || 'Could not update password.'); } finally { setSaving(false); }
  }
  return <StudentLayout><div className="student-topbar"><div><p className="kicker">Account</p><h1>My profile.</h1><p className="student-muted">Keep your account details and security up to date.</p></div></div><div className="profile-grid"><section className="form-card"><div className="profile-heading"><span className="profile-avatar">{user.name.slice(0, 1).toUpperCase()}</span><div><h2>{user.name}</h2><p>{user.role === 'admin' ? 'Administrator' : 'Learner'}</p></div></div><form className="settings-form" onSubmit={saveProfile}><p className="kicker">Profile details</p><label>Name<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required minLength="2" /></label><label>Email<input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></label><button className="button button-primary" disabled={saving}><Save size={16} /> Save profile</button></form></section><section className="form-card"><p className="kicker">Security</p><form className="settings-form" onSubmit={savePassword}><label>Current password<input type="password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} required /></label><label>New password<input type="password" minLength="8" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} required /></label><label>Confirm new password<input type="password" minLength="8" value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} required /></label><button className="button button-dark" disabled={saving}><LockKeyhole size={16} /> Change password</button></form></section></div></StudentLayout>;
}
