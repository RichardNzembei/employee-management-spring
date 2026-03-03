package com.employeemanagement.dto;

import com.employeemanagement.entity.Employee;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotBlank private String firstName;
        @NotBlank private String lastName;
        @NotBlank @Email private String email;
        @NotBlank private String employmentNumber;
        @NotNull @DecimalMin("0.0") private BigDecimal salary;
        @NotNull private Employee.EmployeePosition position;
        @NotNull private LocalDate employmentDate;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateNameRequest {
        @NotBlank private String firstName;
        @NotBlank private String lastName;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String firstName, lastName, email, employmentNumber;
        private BigDecimal salary;
        private Employee.EmployeePosition position;
        private LocalDate employmentDate;

        public static Response fromEntity(Employee e) {
            return Response.builder()
                .id(e.getId()).firstName(e.getFirstName()).lastName(e.getLastName())
                .email(e.getEmail()).employmentNumber(e.getEmploymentNumber())
                .salary(e.getSalary()).position(e.getPosition())
                .employmentDate(e.getEmploymentDate()).build();
        }
    }
}
