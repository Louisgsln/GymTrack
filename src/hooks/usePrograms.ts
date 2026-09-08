import { useQuery } from '@tanstack/react-query';
import { useServices } from '../providers/AppProvider';
export function usePrograms() {
  const { programs } = useServices();
  return {
    programs,
    ...useQuery({ queryKey: ['programs'], queryFn: () => programs.list() }),
  };
}
export function useProgram(id: string) {
  const { programs } = useServices();
  return {
    programs,
    ...useQuery({
      queryKey: ['programs', id],
      queryFn: () => programs.detail(id),
    }),
  };
}
