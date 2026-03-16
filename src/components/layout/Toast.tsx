import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function Toast() {
  const { activeToast, clearToast } = useAppStore();

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(clearToast, 3000);
    return () => clearTimeout(timer);
  }, [activeToast, clearToast]);

  if (!activeToast) return null;

  const colors = {
    success: 'bg-emerald-700 text-white',
    error: 'bg-red-700 text-white',
    info: 'bg-blue-700 text-white',
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg">
      <div className={`rounded-xl px-5 py-3 text-sm font-medium ${colors[activeToast.type]}`}>
        {activeToast.message}
      </div>
    </div>
  );
}
