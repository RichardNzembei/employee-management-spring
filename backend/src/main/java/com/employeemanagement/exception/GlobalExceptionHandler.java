package com.employeemanagement.exception;

import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleNotFound(EmployeeNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DuplicateEmployeeException.class)
    public ResponseEntity<Map<String,Object>> handleDuplicate(DuplicateEmployeeException ex) {
        return buildError(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,String> errs = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(e ->
            errs.put(((FieldError)e).getField(), e.getDefaultMessage()));
        Map<String,Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("error", "Validation Failed");
        body.put("validationErrors", errs);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Map<String,Object>> buildError(HttpStatus s, String msg) {
        Map<String,Object> b = new HashMap<>();
        b.put("timestamp", LocalDateTime.now().toString());
        b.put("status", s.value());
        b.put("error", s.getReasonPhrase());
        b.put("message", msg);
        return new ResponseEntity<>(b, s);
    }
}
