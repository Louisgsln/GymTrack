import { useQuery } from '@tanstack/react-query';
import { useServices } from '../providers/AppProvider';
export function useTraining() {
  const { training } = useServices();
  return {
    training,
    ...useQuery({ queryKey: ['training'], queryFn: () => training.state() }),
  };
}
