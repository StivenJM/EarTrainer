import { Loader2 } from 'lucide-react';

const LucideLoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 size={32} color="#3498db" className="animate-spin" />
    </div>
  );
};

export default LucideLoadingSpinner;