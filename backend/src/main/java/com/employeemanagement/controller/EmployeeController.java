package com.employeemanagement.controller;

import com.employeemanagement.dto.EmployeeDto;
import com.employeemanagement.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final EmployeeService service;

    @PostMapping
    public ResponseEntity<EmployeeDto.Response> save(@Valid @RequestBody EmployeeDto.CreateRequest r) {
        log.info("POST /api/employees - create {} {} <{}>", r.getFirstName(), r.getLastName(), r.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.saveEmployee(r));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDto.Response>> getAll() {
        log.debug("GET /api/employees");
        return ResponseEntity.ok(service.getAllEmployees());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<EmployeeDto.Response> getByEmail(@PathVariable String email) {
        log.debug("GET /api/employees/email/{}", email);
        return ResponseEntity.ok(service.getEmployeeByEmail(email));
    }

    @PatchMapping("/email/{email}/name")
    public ResponseEntity<EmployeeDto.Response> updateName(@PathVariable String email,
            @Valid @RequestBody EmployeeDto.UpdateNameRequest r) {
        log.info("PATCH /api/employees/email/{}/name - {} {}", email, r.getFirstName(), r.getLastName());
        return ResponseEntity.ok(service.updateEmployeeName(email, r));
    }

    @DeleteMapping("/email/{email}")
    public ResponseEntity<Void> delete(@PathVariable String email) {
        log.warn("DELETE /api/employees/email/{}", email);
        service.deleteEmployee(email);
        return ResponseEntity.noContent().build();
    }
}
