package com.employeemanagement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = "spring.flyway.enabled=false")
class EmployeeManagementApplicationTests {

	@Autowired
	private com.employeemanagement.repository.EmployeeRepository repo;

	@org.junit.jupiter.api.BeforeEach
	void clean() {
		repo.deleteAll();
	}

	@Test
	void contextLoads() {
	}

	@Test
	void repositorySaveAndFind() {
		String email = "test" + System.currentTimeMillis() + "@example.com";
		com.employeemanagement.entity.Employee e = com.employeemanagement.entity.Employee.builder()
			.firstName("Test").lastName("User").email(email)
			.employmentNumber("EMP-TEST").salary(new java.math.BigDecimal("1000"))
			.position(com.employeemanagement.entity.Employee.EmployeePosition.JUNIOR_DEVELOPER)
			.employmentDate(java.time.LocalDate.now()).build();
		repo.save(e);
		java.util.Optional<com.employeemanagement.entity.Employee> found = repo.findByEmail(email);
		assertTrue(found.isPresent());
		assertEquals("Test", found.get().getFirstName());
	}

}
