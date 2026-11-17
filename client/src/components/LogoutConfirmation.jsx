import { AlertTriangle, LogOut, X } from 'lucide-react';
import { useEffect } from 'react';

export default function LogoutConfirmation({ open, onCancel, onConfirm, isLoggingOut }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !isLoggingOut) onCancel();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLoggingOut, onCancel, open]);

  if (!open) return null;

  return <div className="logout-dialog-backdrop" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget && !isLoggingOut) onCancel();
  }}>
    <div className="logout-dialog" role="alertdialog" aria-modal="true" aria-labelledby="logout-dialog-title" aria-describedby="logout-dialog-description">
      <button className="logout-dialog-close" type="button" onClick={onCancel} disabled={isLoggingOut} aria-label="Close logout confirmation">
        <X size={18} />
      </button>
      <div className="logout-dialog-icon"><AlertTriangle size={22} /></div>
      <h2 id="logout-dialog-title">Log out of LearnSphere?</h2>
      <p id="logout-dialog-description">You will need to sign in again to continue your learning journey.</p>
      <div className="logout-dialog-actions">
        <button className="button button-light" type="button" onClick={onCancel} disabled={isLoggingOut}>Stay signed in</button>
        <button className="button button-danger" type="button" onClick={onConfirm} disabled={isLoggingOut}>
          <LogOut size={16} /> {isLoggingOut ? 'Logging out...' : 'Log out'}
        </button>
      </div>
    </div>
  </div>;
}
