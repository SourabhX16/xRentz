import { useApp } from '../context/AppContext';
import './Toast.css';

export default function Toast() {
  const { toasts } = useApp();

  return (
    <div className="toast-container" role="status" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast--${toast.type} animate-fade-in`}>
          <span className="toast__icon">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <p className="toast__message">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
