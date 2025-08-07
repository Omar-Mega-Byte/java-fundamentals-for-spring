# Module 3: Exception Handling

## 📋 Overview
Master Java exception handling for robust Spring applications that gracefully handle errors.

## 🎯 Learning Objectives
- Understand exception hierarchy and types
- Implement proper exception handling strategies
- Create custom exceptions for business logic
- Apply exception handling in Spring applications
- Use try-with-resources for resource management

## 📚 Exception Hierarchy

```
Throwable
├── Error (JVM errors - usually not recoverable)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── VirtualMachineError
└── Exception
    ├── RuntimeException (Unchecked)
    │   ├── NullPointerException
    │   ├── IllegalArgumentException
    │   ├── IndexOutOfBoundsException
    │   └── ConcurrentModificationException
    └── Checked Exceptions
        ├── IOException
        ├── SQLException
        ├── ClassNotFoundException
        └── InterruptedException
```

## 🔍 Exception Types

### Checked Exceptions
Must be handled or declared in method signature.

```java
public class FileService {
    
    // Method declares checked exception
    public String readFile(String filename) throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(filename))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
        // IOException is automatically propagated due to throws declaration
    }
    
    // Method handles checked exception
    public String readFileWithDefault(String filename) {
        try {
            return readFile(filename);
        } catch (IOException e) {
            logger.warn("Failed to read file: " + filename, e);
            return "Default content";
        }
    }
}
```

### Unchecked Exceptions (RuntimeException)
Can be handled but not required to be declared.

```java
public class ValidationService {
    
    public void validateUser(User user) {
        // RuntimeExceptions don't need to be declared
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (!isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
    
    private boolean isValidEmail(String email) {
        return email.contains("@") && email.contains(".");
    }
}
```

## 🛠️ Exception Handling Mechanisms

### Try-Catch-Finally
```java
public class DatabaseService {
    
    public void processUserData(List<User> users) {
        Connection connection = null;
        try {
            connection = getConnection();
            connection.setAutoCommit(false);
            
            for (User user : users) {
                insertUser(connection, user);
            }
            
            connection.commit();
            logger.info("Successfully processed {} users", users.size());
            
        } catch (SQLException e) {
            // Handle specific exception
            try {
                if (connection != null) {
                    connection.rollback();
                }
            } catch (SQLException rollbackEx) {
                logger.error("Failed to rollback transaction", rollbackEx);
            }
            throw new DataProcessingException("Failed to process users", e);
            
        } catch (Exception e) {
            // Handle any other exception
            logger.error("Unexpected error during user processing", e);
            throw new RuntimeException("Unexpected error", e);
            
        } finally {
            // Always executed
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    logger.error("Failed to close connection", e);
                }
            }
        }
    }
}
```

### Try-with-Resources (Java 7+)
Automatically closes resources that implement AutoCloseable.

```java
public class ResourceManagementService {
    
    // Single resource
    public String readFile(String filename) throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(filename))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
        // BufferedReader is automatically closed
    }
    
    // Multiple resources
    public void copyFile(String source, String destination) throws IOException {
        try (InputStream in = Files.newInputStream(Paths.get(source));
             OutputStream out = Files.newOutputStream(Paths.get(destination))) {
            
            in.transferTo(out);
        }
        // Both streams are automatically closed in reverse order
    }
    
    // Custom resource
    public void processWithCustomResource() {
        try (DatabaseConnection dbConn = new DatabaseConnection();
             CacheConnection cacheConn = new CacheConnection()) {
            
            // Use resources
            dbConn.executeQuery("SELECT * FROM users");
            cacheConn.put("key", "value");
            
        } // Both connections automatically closed
    }
}

// Custom resource class
public class DatabaseConnection implements AutoCloseable {
    private boolean connected = false;
    
    public DatabaseConnection() {
        this.connected = true;
        logger.info("Database connection opened");
    }
    
    public void executeQuery(String sql) {
        if (!connected) {
            throw new IllegalStateException("Connection is closed");
        }
        // Execute query logic
    }
    
    @Override
    public void close() {
        if (connected) {
            connected = false;
            logger.info("Database connection closed");
        }
    }
}
```

## 🎯 Custom Exceptions

### Business Exception Hierarchy
```java
// Base exception for all business logic errors
public abstract class BusinessException extends RuntimeException {
    private final String errorCode;
    private final Map<String, Object> context;
    
    protected BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.context = new HashMap<>();
    }
    
    protected BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.context = new HashMap<>();
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public Map<String, Object> getContext() {
        return Collections.unmodifiableMap(context);
    }
    
    public BusinessException addContext(String key, Object value) {
        this.context.put(key, value);
        return this;
    }
}

// Specific business exceptions
public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(Long userId) {
        super("USER_NOT_FOUND", "User not found with id: " + userId);
        addContext("userId", userId);
    }
}

public class InsufficientFundsException extends BusinessException {
    public InsufficientFundsException(BigDecimal requested, BigDecimal available) {
        super("INSUFFICIENT_FUNDS", 
              String.format("Insufficient funds. Requested: %s, Available: %s", 
                          requested, available));
        addContext("requestedAmount", requested);
        addContext("availableAmount", available);
    }
}

public class ValidationException extends BusinessException {
    private final List<ValidationError> errors;
    
    public ValidationException(List<ValidationError> errors) {
        super("VALIDATION_FAILED", "Validation failed");
        this.errors = new ArrayList<>(errors);
    }
    
    public List<ValidationError> getErrors() {
        return Collections.unmodifiableList(errors);
    }
}

public class ValidationError {
    private final String field;
    private final String message;
    private final Object rejectedValue;
    
    public ValidationError(String field, String message, Object rejectedValue) {
        this.field = field;
        this.message = message;
        this.rejectedValue = rejectedValue;
    }
    
    // Getters...
}
```

### Exception Factory Pattern
```java
@Component
public class ExceptionFactory {
    
    public UserNotFoundException userNotFound(Long userId) {
        return new UserNotFoundException(userId);
    }
    
    public ValidationException validationFailed(String field, String message, Object value) {
        List<ValidationError> errors = List.of(
            new ValidationError(field, message, value)
        );
        return new ValidationException(errors);
    }
    
    public InsufficientFundsException insufficientFunds(BigDecimal requested, BigDecimal available) {
        return new InsufficientFundsException(requested, available);
    }
}
```

## 🏗️ Exception Handling Patterns

### 1. Fail-Fast Pattern
```java
@Service
public class UserService {
    
    public User createUser(CreateUserRequest request) {
        // Validate inputs immediately
        validateCreateUserRequest(request);
        
        // Continue with business logic
        User user = new User(request.getUsername(), request.getEmail());
        return userRepository.save(user);
    }
    
    private void validateCreateUserRequest(CreateUserRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new ValidationException("Username is required");
        }
        
        if (request.getEmail() == null || !isValidEmail(request.getEmail())) {
            throw new ValidationException("Valid email is required");
        }
    }
}
```

### 2. Exception Translation Pattern
```java
@Repository
public class UserRepositoryImpl implements UserRepository {
    
    @Override
    public User findById(Long id) {
        try {
            String sql = "SELECT * FROM users WHERE id = ?";
            return jdbcTemplate.queryForObject(sql, new UserRowMapper(), id);
            
        } catch (EmptyResultDataAccessException e) {
            // Translate Spring exception to business exception
            throw new UserNotFoundException(id);
            
        } catch (DataAccessException e) {
            // Translate to more general exception
            throw new DataRetrievalException("Failed to retrieve user", e)
                    .addContext("userId", id);
        }
    }
}
```

### 3. Circuit Breaker Pattern (for external services)
```java
@Component
public class ExternalApiService {
    private static final int FAILURE_THRESHOLD = 5;
    private static final long TIMEOUT_DURATION = 60000; // 1 minute
    
    private int failureCount = 0;
    private long lastFailureTime = 0;
    private boolean circuitOpen = false;
    
    public ApiResponse callExternalApi(String request) {
        if (isCircuitOpen()) {
            throw new ServiceUnavailableException("Circuit breaker is open");
        }
        
        try {
            ApiResponse response = performApiCall(request);
            reset(); // Success - reset circuit breaker
            return response;
            
        } catch (Exception e) {
            recordFailure();
            throw new ExternalServiceException("External API call failed", e);
        }
    }
    
    private boolean isCircuitOpen() {
        if (circuitOpen && (System.currentTimeMillis() - lastFailureTime) > TIMEOUT_DURATION) {
            circuitOpen = false; // Try again after timeout
            failureCount = 0;
        }
        return circuitOpen;
    }
    
    private void recordFailure() {
        failureCount++;
        lastFailureTime = System.currentTimeMillis();
        
        if (failureCount >= FAILURE_THRESHOLD) {
            circuitOpen = true;
        }
    }
    
    private void reset() {
        failureCount = 0;
        circuitOpen = false;
    }
}
```

## 🌸 Spring Framework Exception Handling

### 1. Global Exception Handler
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUserNotFound(UserNotFoundException ex) {
        logger.warn("User not found: {}", ex.getMessage());
        
        return ErrorResponse.builder()
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .timestamp(Instant.now())
                .context(ex.getContext())
                .build();
    }
    
    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(ValidationException ex) {
        logger.warn("Validation failed: {}", ex.getMessage());
        
        return ErrorResponse.builder()
                .errorCode(ex.getErrorCode())
                .message("Validation failed")
                .errors(ex.getErrors())
                .timestamp(Instant.now())
                .build();
    }
    
    @ExceptionHandler(DataAccessException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleDataAccess(DataAccessException ex) {
        logger.error("Database error occurred", ex);
        
        return ErrorResponse.builder()
                .errorCode("DATABASE_ERROR")
                .message("A database error occurred")
                .timestamp(Instant.now())
                .build();
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneral(Exception ex) {
        logger.error("Unexpected error occurred", ex);
        
        return ErrorResponse.builder()
                .errorCode("INTERNAL_ERROR")
                .message("An unexpected error occurred")
                .timestamp(Instant.now())
                .build();
    }
}

@Data
@Builder
public class ErrorResponse {
    private String errorCode;
    private String message;
    private Instant timestamp;
    private Map<String, Object> context;
    private List<ValidationError> errors;
}
```

### 2. Method-Level Exception Handling
```java
@RestController
public class UserController {
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        try {
            User user = userService.findById(id);
            return ResponseEntity.ok(user);
            
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User user = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
            
        } catch (ValidationException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Validation failed", "details", e.getErrors()));
        }
    }
}
```

### 3. Transactional Exception Handling
```java
@Service
@Transactional
public class OrderService {
    
    public Order processOrder(CreateOrderRequest request) {
        try {
            // Validate order
            validateOrder(request);
            
            // Create order
            Order order = new Order(request);
            order = orderRepository.save(order);
            
            // Process payment
            paymentService.processPayment(order.getTotal(), request.getPaymentInfo());
            
            // Update inventory
            inventoryService.reserveItems(order.getItems());
            
            // Send confirmation
            notificationService.sendOrderConfirmation(order);
            
            return order;
            
        } catch (PaymentException e) {
            // Transaction will be rolled back automatically
            logger.error("Payment failed for order", e);
            throw new OrderProcessingException("Payment failed", e);
            
        } catch (InventoryException e) {
            // Transaction will be rolled back automatically
            logger.error("Inventory reservation failed", e);
            throw new OrderProcessingException("Insufficient inventory", e);
        }
    }
    
    // This method will not rollback transaction for business exceptions
    @Transactional(noRollbackFor = {NotificationException.class})
    public void processOrderWithNotificationTolerance(CreateOrderRequest request) {
        // ... order processing logic
        
        try {
            notificationService.sendOrderConfirmation(order);
        } catch (NotificationException e) {
            // Log but don't fail the entire transaction
            logger.warn("Failed to send notification, but order was processed", e);
        }
    }
}
```

## 🔧 Exception Handling Best Practices

### 1. Logging Guidelines
```java
@Service
public class AuditService {
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    
    public void auditUserAction(Long userId, String action) {
        try {
            AuditLog auditLog = new AuditLog(userId, action, Instant.now());
            auditRepository.save(auditLog);
            
        } catch (DataAccessException e) {
            // Log error with context but don't propagate
            logger.error("Failed to audit user action. UserId: {}, Action: {}", 
                        userId, action, e);
            
            // Optionally, add to a retry queue or alternative storage
            retryQueue.add(new RetryableAuditLog(userId, action));
        }
    }
}
```

### 2. Exception Enrichment
```java
public class EnhancedExceptionHandler {
    
    public void processUserRequest(UserRequest request) {
        try {
            validateRequest(request);
            User user = userService.findById(request.getUserId());
            processUser(user);
            
        } catch (Exception e) {
            // Enrich exception with context
            throw enrichException(e, request);
        }
    }
    
    private RuntimeException enrichException(Exception original, UserRequest request) {
        Map<String, Object> context = new HashMap<>();
        context.put("requestId", request.getRequestId());
        context.put("userId", request.getUserId());
        context.put("timestamp", Instant.now());
        context.put("userAgent", getCurrentUserAgent());
        context.put("ipAddress", getCurrentIpAddress());
        
        if (original instanceof BusinessException) {
            BusinessException businessEx = (BusinessException) original;
            context.forEach(businessEx::addContext);
            return businessEx;
        }
        
        return new SystemException("Request processing failed", original)
                .addContext(context);
    }
}
```

### 3. Graceful Degradation
```java
@Service
public class RecommendationService {
    
    public List<Product> getRecommendations(Long userId) {
        try {
            // Try primary recommendation engine
            return primaryRecommendationEngine.getRecommendations(userId);
            
        } catch (Exception e) {
            logger.warn("Primary recommendation engine failed, falling back", e);
            
            try {
                // Fallback to secondary engine
                return secondaryRecommendationEngine.getRecommendations(userId);
                
            } catch (Exception fallbackEx) {
                logger.warn("Secondary recommendation engine failed, using default", fallbackEx);
                
                // Return default recommendations
                return getDefaultRecommendations();
            }
        }
    }
    
    private List<Product> getDefaultRecommendations() {
        // Return popular products or cached recommendations
        return productService.getPopularProducts(10);
    }
}
```

## ⚠️ Common Anti-Patterns

### 1. Swallowing Exceptions
```java
// BAD - Don't do this
public void badExceptionHandling() {
    try {
        riskyOperation();
    } catch (Exception e) {
        // Silently ignoring exception
    }
}

// GOOD - At minimum, log the exception
public void goodExceptionHandling() {
    try {
        riskyOperation();
    } catch (Exception e) {
        logger.error("Failed to perform risky operation", e);
        // Decide: rethrow, return default, or handle gracefully
    }
}
```

### 2. Generic Exception Catching
```java
// BAD - Too generic
public void processData() throws Exception {
    try {
        // Multiple operations that can fail differently
        validateData();
        transformData();
        saveData();
    } catch (Exception e) {
        throw e; // Not helpful
    }
}

// GOOD - Specific exception handling
public void processData() {
    try {
        validateData();
        transformData();
        saveData();
    } catch (ValidationException e) {
        throw new DataProcessingException("Validation failed", e);
    } catch (TransformationException e) {
        throw new DataProcessingException("Transformation failed", e);
    } catch (PersistenceException e) {
        throw new DataProcessingException("Save operation failed", e);
    }
}
```

### 3. Exception Flow Control
```java
// BAD - Using exceptions for flow control
public boolean isUserAdmin(Long userId) {
    try {
        User user = userService.findById(userId);
        return user.hasRole("ADMIN");
    } catch (UserNotFoundException e) {
        return false; // Using exception for control flow
    }
}

// GOOD - Proper flow control
public boolean isUserAdmin(Long userId) {
    Optional<User> userOpt = userService.findUserById(userId);
    return userOpt.map(user -> user.hasRole("ADMIN")).orElse(false);
}
```

## 🏃‍♂️ Practice Exercises

1. Create a custom exception hierarchy for an e-commerce system
2. Implement a retry mechanism with exponential backoff
3. Build a comprehensive error handling system for a REST API
4. Create a fault-tolerant service that gracefully handles multiple failure scenarios

## 📊 Exception Handling Decision Tree

```
Exception Occurred
├── Is it recoverable?
│   ├── Yes → Handle gracefully, log, continue
│   └── No → Log error, fail fast
├── Is it a business rule violation?
│   ├── Yes → Throw business exception
│   └── No → Is it a system error?
│       ├── Yes → Wrap in system exception
│       └── No → Validate assumptions
├── Should transaction be rolled back?
│   ├── Yes → Let exception propagate
│   └── No → Handle locally
└── Is user action required?
    ├── Yes → Return meaningful error message
    └── No → Log and handle automatically
```

---
**Next Module**: [Generics & Type Safety](../module4-generics/README.md)
