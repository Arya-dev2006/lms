import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (isRegister && form.password !== form.confirmPassword) return toast.error('Passwords do not match.');
    setSubmitting(true);
    try {
      const account = isRegister ? await register(form) : await login({ email: form.email, password: form.password });
      toast.success(isRegister ? 'Your learning space is ready.' : 'Welcome back.');
      const destination = location.state?.from && location.state.from !== '/login' ? location.state.from : (account.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      navigate(destination, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message
        || (!error.response ? 'The learning server is unavailable. Start the API and try again.' : 'Something went wrong. Please try again.');
      toast.error(message);
    } finally { setSubmitting(false); }
  }

  return <div className="auth-page"><div className="auth-aside"><Logo /><div className="auth-quote"><p className="kicker kicker-light">A place to begin</p><h1>Keep your curiosity <em>close.</em></h1><p>Learn at your pace, return to your ideas, and make progress you can see.</p></div><span className="aside-footer">Thoughtful learning for curious people.</span></div><main className="auth-main"><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to home</Link><div className="auth-form-wrap"><div className="auth-heading"><p className="kicker">{isRegister ? 'Create your account' : 'Welcome back'}</p><h2>{isRegister ? 'Start your next chapter.' : 'Pick up where you left off.'}</h2><p>{isRegister ? 'Your free learning space is a few details away.' : 'Sign in to continue your learning journey.'}</p></div><form className="auth-form" onSubmit={submit}>{isRegister && <label><span>Full name</span><div className="input-wrap"><UserRound size={18} /><input name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" required /></div></label>}<label><span>Email address</span><div className="input-wrap"><Mail size={18} /><input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required /></div></label><label><span>Password</span><div className="input-wrap"><LockKeyhole size={18} /><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update} placeholder="At least 8 characters" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength="8" required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{isRegister && <label><span>Confirm password</span><div className="input-wrap"><LockKeyhole size={18} /><input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={update} placeholder="Repeat your password" autoComplete="new-password" required /></div></label>}<button className="button button-primary submit-button" type="submit" disabled={submitting}>{submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'} {!submitting && <ArrowRight size={17} />}</button></form><p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to LearnSphere?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></p></div></main></div>;
}
