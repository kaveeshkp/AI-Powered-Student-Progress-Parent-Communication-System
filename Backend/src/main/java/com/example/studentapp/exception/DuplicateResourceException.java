package com.example.studentapp.exception;

/**
 * Exception thrown when attempting to create a duplicate resource.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String resourceName, String field, String value) {
        super(String.format("%s with %s '%s' already exists", resourceName, field, value));
    }
}
