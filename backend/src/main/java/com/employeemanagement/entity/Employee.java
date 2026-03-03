package com.employeemanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Employment number is required")
    @Column(name = "employment_number", nullable = false, unique = true)
    private String employmentNumber;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be positive")
    @Column(name = "salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal salary;

    @NotNull(message = "Employee position is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "position", nullable = false)
    private EmployeePosition position;

    @NotNull(message = "Employment date is required")
    @Column(name = "employment_date", nullable = false)
    private LocalDate employmentDate;

    public enum EmployeePosition {
        JUNIOR_DEVELOPER,
        SENIOR_DEVELOPER
    }
}
