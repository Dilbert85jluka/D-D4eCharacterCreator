import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';

export function EmptyState() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="text-7xl mb-6">⚔️</div>
      <h2 className="text-2xl font-bold text-amber-900 mb-3">No Characters Yet</h2>
      <p className="text-stone-600 mb-8 max-w-sm">
        Create your first D&D 4th Edition character and begin your adventure!
      </p>
      <Button size="lg" onClick={() => navigate('wizard')}>
        Create Your First Character
      </Button>
    </div>
  );
}
