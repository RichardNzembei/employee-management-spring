package com.employeemanagement.service;

import com.employeemanagement.dto.EmployeeDto;
import com.employeemanagement.entity.Employee;
import com.employeemanagement.exception.*;
import com.employeemanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor @Slf4j
public class EmployeeService {

    private final EmployeeRepository repo;

    @Transactional
    public EmployeeDto.Response saveEmployee(EmployeeDto.CreateRequest r) {
        if (repo.existsByEmail(r.getEmail()))
            throw new DuplicateEmployeeException("Email already exists: " + r.getEmail());
        if (repo.existsByEmploymentNumber(r.getEmploymentNumber()))
            throw new DuplicateEmployeeException("Employment number already exists: " + r.getEmploymentNumber());
        return EmployeeDto.Response.fromEntity(repo.save(Employee.builder()
            .firstName(r.getFirstName()).lastName(r.getLastName())
            .email(r.getEmail()).employmentNumber(r.getEmploymentNumber())
            .salary(r.getSalary()).position(r.getPosition())
            .employmentDate(r.getEmploymentDate()).build()));
    }

    @Transactional(readOnly = true)
    public EmployeeDto.Response getEmployeeByEmail(String email) {
        return EmployeeDto.Response.fromEntity(
            repo.findByEmail(email).orElseThrow(
                () -> new EmployeeNotFoundException("Employee not found: " + email)));
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto.Response> getAllEmployees() {
        return repo.findAll().stream().map(EmployeeDto.Response::fromEntity).toList();
    }

    @Transactional
    public EmployeeDto.Response updateEmployeeName(String email, EmployeeDto.UpdateNameRequest r) {
        Employee e = repo.findByEmail(email).orElseThrow(
            () -> new EmployeeNotFoundException("Employee not found: " + email));
        e.setFirstName(r.getFirstName());
        e.setLastName(r.getLastName());
        return EmployeeDto.Response.fromEntity(repo.save(e));
    }

    @Transactional
    public void deleteEmployee(String email) {
        Employee e = repo.findByEmail(email).orElseThrow(
            () -> new EmployeeNotFoundException("Employee not found: " + email));
        repo.delete(e);
    }
}
