import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../lib/api';
import { Employee } from '@/types/employee';

export function useEmployees() {
  return useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: () => employeeApi.getAll(),
  });
}

export function useEmployee(email: string | undefined) {
  return useQuery<Employee, Error>({
    queryKey: ['employee', email],
    queryFn: () => employeeApi.getByEmail(email || ''),
    enabled: !!email,
  });
}
