CREATE TABLE employee (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    employment_number VARCHAR(255) NOT NULL UNIQUE,
    salary NUMERIC(15,2) NOT NULL,
    position VARCHAR(50) NOT NULL,
    employment_date DATE NOT NULL
);
