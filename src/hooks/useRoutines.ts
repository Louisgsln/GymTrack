import { useQuery } from '@tanstack/react-query';
import { useServices } from '../providers/AppProvider';
export function useRoutines() {
  const { routines, routineFolders } = useServices();
  const query = useQuery({
    queryKey: ['routines'],
    queryFn: () => routineFolders.library(),
  });
  return {
    routines,
    ...query,
    data: query.data?.routines,
    folders: query.data?.folders,
  };
}
export function useRoutine(id: string) {
  const { routines } = useServices();
  return {
    routines,
    ...useQuery({
      queryKey: ['routines', id],
      queryFn: () => routines.detail(id),
    }),
  };
}
