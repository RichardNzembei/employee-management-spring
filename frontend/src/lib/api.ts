import axios from 'axios';
import { Employee, CreateEmployeeRequest, UpdateNameRequest } from '@/types/employee';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
});

export const employeeApi = {
  create: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const res = await api.post<Employee>('/employees', data);
    return res.data;
  },
  getAll: async (): Promise<Employee[]> => {
    const res = await api.get<Employee[]>('/employees');
    return res.data;
  },
  getByEmail: async (email: string): Promise<Employee> => {
    const res = await api.get<Employee>(`/employees/email/${encodeURIComponent(email)}`);
    return res.data;
  },
  updateName: async (email: string, data: UpdateNameRequest): Promise<Employee> => {
    const res = await api.patch<Employee>(`/employees/email/${encodeURIComponent(email)}/name`, data);
    return res.data;
  },
  delete: async (email: string): Promise<void> => {
    await api.delete(`/employees/email/${encodeURIComponent(email)}`);
  },
};
