export type EmployeePosition = 'JUNIOR_DEVELOPER' | 'SENIOR_DEVELOPER';

export const POSITION_LABELS: Record<EmployeePosition, string> = {
  JUNIOR_DEVELOPER: 'Junior Developer',
  SENIOR_DEVELOPER: 'Senior Developer',
};

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  employmentNumber: string;
  salary: number;
  position: EmployeePosition;
  employmentDate: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  employmentNumber: string;
  salary: number;
  position: EmployeePosition;
  employmentDate: string;
}

export interface UpdateNameRequest {
  firstName: string;
  lastName: string;
}
