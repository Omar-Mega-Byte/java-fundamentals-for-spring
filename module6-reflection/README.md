# Module 6: Reflection & Annotations

## 📋 Overview
Master Java Reflection API and Annotations - the foundation technologies that power Spring Framework's dependency injection, AOP, and configuration mechanisms.

## 🎯 Learning Objectives
- Understand reflection capabilities and use cases
- Create and use custom annotations effectively
- Apply annotation processing patterns
- Recognize how Spring uses reflection and annotations
- Implement metadata-driven programming

## 📚 Reflection Fundamentals

### Class Inspection
```java
public class ReflectionBasics {
    
    public void demonstrateClassInspection() throws Exception {
        Class<User> userClass = User.class;
        
        // Getting Class objects
        Class<?> clazz1 = Class.forName("com.example.User");
        Class<?> clazz2 = new User().getClass();
        Class<?> clazz3 = User.class;
        
        // Basic class information
        System.out.println("Class name: " + userClass.getName());
        System.out.println("Simple name: " + userClass.getSimpleName());
        System.out.println("Package: " + userClass.getPackage().getName());
        System.out.println("Superclass: " + userClass.getSuperclass());
        System.out.println("Interfaces: " + Arrays.toString(userClass.getInterfaces()));
        
        // Modifiers
        int modifiers = userClass.getModifiers();
        System.out.println("Is public: " + Modifier.isPublic(modifiers));
        System.out.println("Is final: " + Modifier.isFinal(modifiers));
        System.out.println("Is abstract: " + Modifier.isAbstract(modifiers));
        
        // Annotations
        Annotation[] annotations = userClass.getAnnotations();
        for (Annotation annotation : annotations) {
            System.out.println("Annotation: " + annotation.annotationType().getSimpleName());
        }
    }
    
    public void demonstrateFieldInspection() throws Exception {
        Class<User> userClass = User.class;
        
        // Get all fields (including private)
        Field[] allFields = userClass.getDeclaredFields();
        
        // Get only public fields
        Field[] publicFields = userClass.getFields();
        
        for (Field field : allFields) {
            System.out.println("Field: " + field.getName());
            System.out.println("Type: " + field.getType());
            System.out.println("Generic type: " + field.getGenericType());
            System.out.println("Modifiers: " + Modifier.toString(field.getModifiers()));
            
            // Check annotations
            if (field.isAnnotationPresent(JsonProperty.class)) {
                JsonProperty jsonProperty = field.getAnnotation(JsonProperty.class);
                System.out.println("JSON property name: " + jsonProperty.value());
            }
        }
    }
    
    public void demonstrateMethodInspection() throws Exception {
        Class<User> userClass = User.class;
        
        // Get all methods
        Method[] allMethods = userClass.getDeclaredMethods();
        
        // Get specific method
        Method setUsernameMethod = userClass.getMethod("setUsername", String.class);
        
        for (Method method : allMethods) {
            System.out.println("Method: " + method.getName());
            System.out.println("Return type: " + method.getReturnType());
            System.out.println("Parameter types: " + Arrays.toString(method.getParameterTypes()));
            System.out.println("Exception types: " + Arrays.toString(method.getExceptionTypes()));
            
            // Check for annotations
            if (method.isAnnotationPresent(Deprecated.class)) {
                System.out.println("This method is deprecated");
            }
        }
    }
    
    public void demonstrateConstructorInspection() throws Exception {
        Class<User> userClass = User.class;
        
        Constructor<?>[] constructors = userClass.getConstructors();
        
        for (Constructor<?> constructor : constructors) {
            System.out.println("Constructor parameters: " + 
                             Arrays.toString(constructor.getParameterTypes()));
            
            // Get parameter annotations
            Annotation[][] parameterAnnotations = constructor.getParameterAnnotations();
            for (int i = 0; i < parameterAnnotations.length; i++) {
                System.out.println("Parameter " + i + " annotations: " + 
                                 Arrays.toString(parameterAnnotations[i]));
            }
        }
    }
}
```

### Dynamic Object Creation and Manipulation
```java
public class DynamicObjectManipulation {
    
    public void demonstrateObjectCreation() throws Exception {
        Class<User> userClass = User.class;
        
        // Create instance using default constructor
        User user1 = userClass.getDeclaredConstructor().newInstance();
        
        // Create instance using parameterized constructor
        Constructor<User> constructor = userClass.getConstructor(String.class, String.class);
        User user2 = constructor.newInstance("john_doe", "john@example.com");
        
        System.out.println("Created user: " + user2.getUsername());
    }
    
    public void demonstrateFieldAccess() throws Exception {
        User user = new User("john_doe", "john@example.com");
        Class<User> userClass = User.class;
        
        // Access public field
        Field publicField = userClass.getField("publicProperty");
        publicField.set(user, "public value");
        Object publicValue = publicField.get(user);
        
        // Access private field
        Field privateField = userClass.getDeclaredField("username");
        privateField.setAccessible(true); // Bypass private access
        privateField.set(user, "new_username");
        String username = (String) privateField.get(user);
        
        System.out.println("Username via reflection: " + username);
    }
    
    public void demonstrateMethodInvocation() throws Exception {
        User user = new User("john_doe", "john@example.com");
        Class<User> userClass = User.class;
        
        // Invoke public method
        Method setEmailMethod = userClass.getMethod("setEmail", String.class);
        setEmailMethod.invoke(user, "newemail@example.com");
        
        // Invoke private method
        Method privateMethod = userClass.getDeclaredMethod("validateEmail", String.class);
        privateMethod.setAccessible(true);
        boolean isValid = (boolean) privateMethod.invoke(user, "test@example.com");
        
        System.out.println("Email validation result: " + isValid);
    }
    
    // Generic method for setting field values
    public static void setFieldValue(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set field: " + fieldName, e);
        }
    }
    
    // Generic method for getting field values
    @SuppressWarnings("unchecked")
    public static <T> T getFieldValue(Object target, String fieldName, Class<T> expectedType) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            Object value = field.get(target);
            return expectedType.cast(value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get field: " + fieldName, e);
        }
    }
}
```

## 🏷️ Custom Annotations

### Creating Custom Annotations
```java
// Method-level annotation
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Cacheable {
    String value() default "";
    int expiry() default 300; // seconds
    boolean async() default false;
}

// Field-level annotation
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Inject {
    String value() default "";
    boolean required() default true;
}

// Class-level annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Entity {
    String table() default "";
    String schema() default "public";
}

// Parameter-level annotation
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface Valid {
    String message() default "Invalid parameter";
    Class<?>[] groups() default {};
}

// Multi-target annotation
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface JsonProperty {
    String value();
    boolean required() default false;
}

// Annotation with enum
public enum ValidationGroup {
    CREATE, UPDATE, DELETE
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Validate {
    ValidationGroup[] groups() default {ValidationGroup.CREATE, ValidationGroup.UPDATE};
    String pattern() default "";
    int min() default Integer.MIN_VALUE;
    int max() default Integer.MAX_VALUE;
}

// Meta-annotation (annotation of annotations)
@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Constraint {
    String message() default "Constraint violation";
    Class<?>[] groups() default {};
}

// Using meta-annotation
@Constraint(message = "Email must be valid")
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Email {
    String message() default "Invalid email format";
    boolean allowEmpty() default false;
}
```

### Annotation Processing at Runtime
```java
@Component
public class AnnotationProcessor {
    
    // Process class-level annotations
    public void processClassAnnotations(Class<?> clazz) {
        if (clazz.isAnnotationPresent(Entity.class)) {
            Entity entity = clazz.getAnnotation(Entity.class);
            
            String tableName = entity.table().isEmpty() ? 
                             clazz.getSimpleName().toLowerCase() : 
                             entity.table();
            
            System.out.println("Entity: " + clazz.getSimpleName());
            System.out.println("Table: " + entity.schema() + "." + tableName);
        }
    }
    
    // Process field annotations
    public void processFieldAnnotations(Object instance) throws Exception {
        Class<?> clazz = instance.getClass();
        
        for (Field field : clazz.getDeclaredFields()) {
            // Process @Inject annotation
            if (field.isAnnotationPresent(Inject.class)) {
                Inject inject = field.getAnnotation(Inject.class);
                String beanName = inject.value().isEmpty() ? 
                                field.getName() : 
                                inject.value();
                
                // Simulate dependency injection
                Object dependency = resolveDependency(beanName, field.getType());
                if (dependency != null || !inject.required()) {
                    field.setAccessible(true);
                    field.set(instance, dependency);
                }
            }
            
            // Process @Validate annotation
            if (field.isAnnotationPresent(Validate.class)) {
                Validate validate = field.getAnnotation(Validate.class);
                field.setAccessible(true);
                Object value = field.get(instance);
                
                validateField(field.getName(), value, validate);
            }
            
            // Process @Email annotation
            if (field.isAnnotationPresent(Email.class)) {
                Email email = field.getAnnotation(Email.class);
                field.setAccessible(true);
                String emailValue = (String) field.get(instance);
                
                validateEmail(emailValue, email);
            }
        }
    }
    
    // Process method annotations
    public void processMethodAnnotations(Class<?> clazz) {
        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(Cacheable.class)) {
                Cacheable cacheable = method.getAnnotation(Cacheable.class);
                
                String cacheKey = cacheable.value().isEmpty() ? 
                                method.getName() : 
                                cacheable.value();
                
                System.out.println("Cacheable method: " + method.getName());
                System.out.println("Cache key: " + cacheKey);
                System.out.println("Expiry: " + cacheable.expiry() + " seconds");
                System.out.println("Async: " + cacheable.async());
                
                // Here you would set up caching logic
                setupCaching(method, cacheable);
            }
        }
    }
    
    // Process parameter annotations
    public void processParameterAnnotations(Method method, Object[] args) {
        Parameter[] parameters = method.getParameters();
        Annotation[][] parameterAnnotations = method.getParameterAnnotations();
        
        for (int i = 0; i < parameters.length; i++) {
            for (Annotation annotation : parameterAnnotations[i]) {
                if (annotation instanceof Valid) {
                    Valid valid = (Valid) annotation;
                    validateParameter(parameters[i].getName(), args[i], valid);
                }
            }
        }
    }
    
    // Helper methods
    private Object resolveDependency(String name, Class<?> type) {
        // Simulate dependency resolution
        if (type == String.class) {
            return "Injected " + name;
        }
        return null;
    }
    
    private void validateField(String fieldName, Object value, Validate validate) {
        if (value instanceof String) {
            String strValue = (String) value;
            if (!validate.pattern().isEmpty() && !strValue.matches(validate.pattern())) {
                throw new ValidationException("Field " + fieldName + " doesn't match pattern");
            }
        }
        
        if (value instanceof Integer) {
            int intValue = (Integer) value;
            if (intValue < validate.min() || intValue > validate.max()) {
                throw new ValidationException("Field " + fieldName + " out of range");
            }
        }
    }
    
    private void validateEmail(String email, Email emailAnnotation) {
        if (email == null || email.trim().isEmpty()) {
            if (!emailAnnotation.allowEmpty()) {
                throw new ValidationException(emailAnnotation.message());
            }
            return;
        }
        
        if (!email.contains("@") || !email.contains(".")) {
            throw new ValidationException(emailAnnotation.message());
        }
    }
    
    private void validateParameter(String paramName, Object value, Valid valid) {
        // Parameter validation logic
        System.out.println("Validating parameter: " + paramName);
    }
    
    private void setupCaching(Method method, Cacheable cacheable) {
        // Cache setup logic
        System.out.println("Setting up cache for method: " + method.getName());
    }
}

// Custom exception for validation
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
```

### Advanced Annotation Patterns
```java
// Repeatable annotations (Java 8+)
@Repeatable(Schedules.class)
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Schedule {
    String cron();
    String zone() default "UTC";
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Schedules {
    Schedule[] value();
}

// Conditional annotations
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ConditionalOnProperty {
    String name();
    String havingValue() default "";
    boolean matchIfMissing() default false;
}

// Configuration annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Component
@ConditionalOnProperty(name = "feature.enabled", havingValue = "true")
public @interface FeatureEnabled {
    String value() default "";
}

// Usage examples
@Entity(table = "users", schema = "app")
public class User {
    
    @Inject("userValidator")
    private UserValidator validator;
    
    @Validate(groups = {ValidationGroup.CREATE}, pattern = "^[a-zA-Z0-9_]+$")
    @JsonProperty("user_name")
    private String username;
    
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @Validate(min = 18, max = 100)
    private int age;
    
    @Cacheable(value = "user-profile", expiry = 600, async = true)
    public UserProfile getProfile() {
        // Method implementation
        return new UserProfile();
    }
    
    @Schedule(cron = "0 0 * * *", zone = "America/New_York")
    @Schedule(cron = "0 12 * * *", zone = "Europe/London")
    public void sendDailyReport() {
        // Method implementation
    }
    
    public void updateUser(@Valid User user, @Valid String reason) {
        // Method implementation
    }
}
```

## 🔄 Annotation-Driven Development Patterns

### Simple Dependency Injection Framework
```java
// Simplified DI container using reflection and annotations
@Component
public class SimpleContainer {
    private final Map<String, Object> beans = new ConcurrentHashMap<>();
    private final Map<Class<?>, Object> beansByType = new ConcurrentHashMap<>();
    
    public void registerBean(String name, Object bean) {
        beans.put(name, bean);
        beansByType.put(bean.getClass(), bean);
    }
    
    public <T> T getBean(String name, Class<T> type) {
        Object bean = beans.get(name);
        return type.cast(bean);
    }
    
    @SuppressWarnings("unchecked")
    public <T> T getBean(Class<T> type) {
        return (T) beansByType.get(type);
    }
    
    public void injectDependencies(Object target) {
        Class<?> clazz = target.getClass();
        
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(Inject.class)) {
                Inject inject = field.getAnnotation(Inject.class);
                
                try {
                    field.setAccessible(true);
                    Object dependency = resolveDependency(inject, field);
                    
                    if (dependency != null) {
                        field.set(target, dependency);
                    } else if (inject.required()) {
                        throw new RuntimeException("Required dependency not found: " + field.getName());
                    }
                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Failed to inject dependency", e);
                }
            }
        }
    }
    
    private Object resolveDependency(Inject inject, Field field) {
        String beanName = inject.value();
        
        if (!beanName.isEmpty()) {
            return beans.get(beanName);
        }
        
        // Try by type
        return beansByType.get(field.getType());
    }
    
    // Scan for components and register them
    public void scanAndRegister(String packageName) throws Exception {
        // Simplified package scanning
        Set<Class<?>> classes = findClassesInPackage(packageName);
        
        for (Class<?> clazz : classes) {
            if (clazz.isAnnotationPresent(Component.class)) {
                Component component = clazz.getAnnotation(Component.class);
                String beanName = component.value().isEmpty() ? 
                                clazz.getSimpleName().toLowerCase() : 
                                component.value();
                
                Object instance = clazz.getDeclaredConstructor().newInstance();
                registerBean(beanName, instance);
                injectDependencies(instance);
            }
        }
    }
    
    private Set<Class<?>> findClassesInPackage(String packageName) {
        // Simplified - in real implementation you'd scan the classpath
        return Set.of(UserService.class, UserRepository.class);
    }
}
```

### Validation Framework
```java
// Annotation-based validation framework
public class ValidationFramework {
    
    public <T> ValidationResult validate(T object) {
        ValidationResult result = new ValidationResult();
        Class<?> clazz = object.getClass();
        
        for (Field field : clazz.getDeclaredFields()) {
            try {
                field.setAccessible(true);
                Object value = field.get(object);
                
                validateField(field, value, result);
            } catch (IllegalAccessException e) {
                result.addError(field.getName(), "Cannot access field for validation");
            }
        }
        
        return result;
    }
    
    private void validateField(Field field, Object value, ValidationResult result) {
        String fieldName = field.getName();
        
        // Check @NotNull
        if (field.isAnnotationPresent(NotNull.class) && value == null) {
            NotNull notNull = field.getAnnotation(NotNull.class);
            result.addError(fieldName, notNull.message());
            return; // Skip other validations if null
        }
        
        // Check @Size
        if (field.isAnnotationPresent(Size.class) && value instanceof String) {
            Size size = field.getAnnotation(Size.class);
            String strValue = (String) value;
            
            if (strValue.length() < size.min() || strValue.length() > size.max()) {
                result.addError(fieldName, size.message());
            }
        }
        
        // Check @Min/@Max
        if (field.isAnnotationPresent(Min.class) && value instanceof Number) {
            Min min = field.getAnnotation(Min.class);
            if (((Number) value).longValue() < min.value()) {
                result.addError(fieldName, min.message());
            }
        }
        
        if (field.isAnnotationPresent(Max.class) && value instanceof Number) {
            Max max = field.getAnnotation(Max.class);
            if (((Number) value).longValue() > max.value()) {
                result.addError(fieldName, max.message());
            }
        }
        
        // Check @Pattern
        if (field.isAnnotationPresent(Pattern.class) && value instanceof String) {
            Pattern pattern = field.getAnnotation(Pattern.class);
            if (!((String) value).matches(pattern.regexp())) {
                result.addError(fieldName, pattern.message());
            }
        }
    }
}

// Validation annotations
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NotNull {
    String message() default "Field cannot be null";
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Size {
    int min() default 0;
    int max() default Integer.MAX_VALUE;
    String message() default "Size must be between {min} and {max}";
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Min {
    long value();
    String message() default "Value must be at least {value}";
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Max {
    long value();
    String message() default "Value must be at most {value}";
}

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Pattern {
    String regexp();
    String message() default "Value must match pattern {regexp}";
}

// Validation result
public class ValidationResult {
    private final Map<String, List<String>> errors = new HashMap<>();
    
    public void addError(String field, String message) {
        errors.computeIfAbsent(field, k -> new ArrayList<>()).add(message);
    }
    
    public boolean hasErrors() {
        return !errors.isEmpty();
    }
    
    public Map<String, List<String>> getErrors() {
        return Collections.unmodifiableMap(errors);
    }
    
    public List<String> getFieldErrors(String field) {
        return errors.getOrDefault(field, Collections.emptyList());
    }
}
```

## 🌸 Spring Framework and Reflection/Annotations

### How Spring Uses Reflection and Annotations
```java
// Spring's annotation-driven configuration
@Configuration
@ComponentScan(basePackages = "com.example")
@EnableTransactionManagement
@EnableJpaRepositories
public class AppConfig {
    
    @Bean
    @Primary
    @Conditional(DatabaseCondition.class)
    public DataSource dataSource() {
        return new HikariDataSource();
    }
}

// Spring component with annotations
@Service
@Transactional
@Validated
public class UserService {
    
    @Autowired
    @Qualifier("userRepository")
    private UserRepository userRepository;
    
    @Value("${app.default-page-size:10}")
    private int defaultPageSize;
    
    @PostConstruct
    public void init() {
        // Initialization logic
    }
    
    @PreDestroy
    public void cleanup() {
        // Cleanup logic
    }
    
    @Cacheable(value = "users", key = "#id")
    @Retryable(value = {DataAccessException.class}, maxAttempts = 3)
    public User findById(@NotNull Long id) {
        return userRepository.findById(id)
                           .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    @Transactional(rollbackFor = Exception.class)
    @Async
    public CompletableFuture<User> createUserAsync(@Valid CreateUserRequest request) {
        User user = new User(request.getUsername(), request.getEmail());
        User savedUser = userRepository.save(user);
        return CompletableFuture.completedFuture(savedUser);
    }
    
    @EventListener
    @Async
    public void handleUserCreated(UserCreatedEvent event) {
        // Handle event
    }
    
    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredSessions() {
        // Cleanup logic
    }
}

// Spring Data repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLogin = :loginTime WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("loginTime") Instant loginTime);
    
    @Query(value = "SELECT * FROM users WHERE department = ?1", nativeQuery = true)
    List<User> findByDepartmentNative(String department);
}

// Spring MVC controller
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<User> getUser(@PathVariable @Min(1) Long id) {
        return userService.findById(id)
                         .map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUserNotFound(UserNotFoundException ex) {
        return new ErrorResponse("USER_NOT_FOUND", ex.getMessage());
    }
}
```

### Understanding Spring's Annotation Processing
```java
// How Spring processes annotations (simplified explanation)
public class SpringAnnotationProcessingExample {
    
    // 1. Component scanning finds classes with @Component and related annotations
    public void componentScanning() {
        // Spring scans classpath for @Component, @Service, @Repository, @Controller
        // Creates BeanDefinition objects
        // Registers them in ApplicationContext
    }
    
    // 2. Dependency injection using @Autowired
    public void dependencyInjection() {
        // Spring uses reflection to find @Autowired annotations
        // Resolves dependencies from ApplicationContext
        // Injects using field access or setter methods
    }
    
    // 3. Transaction management with @Transactional
    public void transactionManagement() {
        // Spring creates proxy objects for @Transactional methods
        // Uses AOP (Aspect-Oriented Programming)
        // Interceptor handles transaction begin/commit/rollback
    }
    
    // 4. Validation with @Valid and JSR-303 annotations
    public void validation() {
        // Spring integrates with Bean Validation API
        // Processes @NotNull, @Size, @Pattern, etc.
        // Validates before method execution
    }
    
    // 5. Configuration processing with @Value
    public void configurationInjection() {
        // Spring resolves property placeholders
        // Converts string values to target types
        // Injects using reflection
    }
}
```

## 🔧 Practical Reflection Utilities

### Generic Utility Classes
```java
// Reflection utilities for common tasks
public class ReflectionUtils {
    
    // Copy properties between objects
    public static void copyProperties(Object source, Object target) {
        copyProperties(source, target, (String[]) null);
    }
    
    public static void copyProperties(Object source, Object target, String... ignoreProperties) {
        Set<String> ignoreSet = ignoreProperties != null ? 
                               Set.of(ignoreProperties) : 
                               Collections.emptySet();
        
        Class<?> sourceClass = source.getClass();
        Class<?> targetClass = target.getClass();
        
        for (Field sourceField : sourceClass.getDeclaredFields()) {
            if (ignoreSet.contains(sourceField.getName())) {
                continue;
            }
            
            try {
                Field targetField = targetClass.getDeclaredField(sourceField.getName());
                
                if (targetField.getType().isAssignableFrom(sourceField.getType())) {
                    sourceField.setAccessible(true);
                    targetField.setAccessible(true);
                    
                    Object value = sourceField.get(source);
                    targetField.set(target, value);
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                // Field doesn't exist in target or access denied - skip
            }
        }
    }
    
    // Create instance with property map
    public static <T> T createInstance(Class<T> clazz, Map<String, Object> properties) {
        try {
            T instance = clazz.getDeclaredConstructor().newInstance();
            
            for (Map.Entry<String, Object> entry : properties.entrySet()) {
                setProperty(instance, entry.getKey(), entry.getValue());
            }
            
            return instance;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create instance", e);
        }
    }
    
    // Generic property setter
    public static void setProperty(Object target, String propertyName, Object value) {
        try {
            Field field = findField(target.getClass(), propertyName);
            if (field != null) {
                field.setAccessible(true);
                field.set(target, convertValue(value, field.getType()));
            } else {
                // Try setter method
                String setterName = "set" + Character.toUpperCase(propertyName.charAt(0)) + 
                                  propertyName.substring(1);
                Method setter = findMethod(target.getClass(), setterName, value.getClass());
                if (setter != null) {
                    setter.invoke(target, convertValue(value, setter.getParameterTypes()[0]));
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to set property: " + propertyName, e);
        }
    }
    
    // Generic property getter
    @SuppressWarnings("unchecked")
    public static <T> T getProperty(Object target, String propertyName, Class<T> expectedType) {
        try {
            Field field = findField(target.getClass(), propertyName);
            if (field != null) {
                field.setAccessible(true);
                return (T) field.get(target);
            } else {
                // Try getter method
                String getterName = "get" + Character.toUpperCase(propertyName.charAt(0)) + 
                                  propertyName.substring(1);
                Method getter = findMethod(target.getClass(), getterName);
                if (getter != null) {
                    return (T) getter.invoke(target);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get property: " + propertyName, e);
        }
        return null;
    }
    
    // Find field in class hierarchy
    public static Field findField(Class<?> clazz, String fieldName) {
        Class<?> currentClass = clazz;
        while (currentClass != null) {
            try {
                return currentClass.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                currentClass = currentClass.getSuperclass();
            }
        }
        return null;
    }
    
    // Find method in class hierarchy
    public static Method findMethod(Class<?> clazz, String methodName, Class<?>... paramTypes) {
        Class<?> currentClass = clazz;
        while (currentClass != null) {
            try {
                return currentClass.getDeclaredMethod(methodName, paramTypes);
            } catch (NoSuchMethodException e) {
                currentClass = currentClass.getSuperclass();
            }
        }
        return null;
    }
    
    // Simple type conversion
    private static Object convertValue(Object value, Class<?> targetType) {
        if (value == null || targetType.isAssignableFrom(value.getClass())) {
            return value;
        }
        
        if (targetType == String.class) {
            return value.toString();
        }
        
        if (targetType == Integer.class || targetType == int.class) {
            return Integer.valueOf(value.toString());
        }
        
        if (targetType == Long.class || targetType == long.class) {
            return Long.valueOf(value.toString());
        }
        
        if (targetType == Boolean.class || targetType == boolean.class) {
            return Boolean.valueOf(value.toString());
        }
        
        // Add more conversions as needed
        return value;
    }
    
    // Get all fields including inherited ones
    public static List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        Class<?> currentClass = clazz;
        
        while (currentClass != null) {
            fields.addAll(Arrays.asList(currentClass.getDeclaredFields()));
            currentClass = currentClass.getSuperclass();
        }
        
        return fields;
    }
    
    // Get all methods including inherited ones
    public static List<Method> getAllMethods(Class<?> clazz) {
        List<Method> methods = new ArrayList<>();
        Class<?> currentClass = clazz;
        
        while (currentClass != null) {
            methods.addAll(Arrays.asList(currentClass.getDeclaredMethods()));
            currentClass = currentClass.getSuperclass();
        }
        
        return methods;
    }
}
```

## ⚠️ Reflection Best Practices and Pitfalls

### Performance Considerations
```java
public class ReflectionPerformance {
    
    // Cache reflection objects for better performance
    private static final Map<String, Field> FIELD_CACHE = new ConcurrentHashMap<>();
    private static final Map<String, Method> METHOD_CACHE = new ConcurrentHashMap<>();
    
    public static Field getCachedField(Class<?> clazz, String fieldName) {
        String key = clazz.getName() + "#" + fieldName;
        return FIELD_CACHE.computeIfAbsent(key, k -> {
            try {
                Field field = clazz.getDeclaredField(fieldName);
                field.setAccessible(true);
                return field;
            } catch (NoSuchFieldException e) {
                throw new RuntimeException("Field not found: " + fieldName, e);
            }
        });
    }
    
    public static Method getCachedMethod(Class<?> clazz, String methodName, Class<?>... paramTypes) {
        String key = clazz.getName() + "#" + methodName + "#" + Arrays.toString(paramTypes);
        return METHOD_CACHE.computeIfAbsent(key, k -> {
            try {
                Method method = clazz.getDeclaredMethod(methodName, paramTypes);
                method.setAccessible(true);
                return method;
            } catch (NoSuchMethodException e) {
                throw new RuntimeException("Method not found: " + methodName, e);
            }
        });
    }
    
    // Performance comparison
    public void performanceComparison() {
        User user = new User("john", "john@example.com");
        
        // Direct access (fastest)
        long start = System.nanoTime();
        for (int i = 0; i < 1000000; i++) {
            String username = user.getUsername();
        }
        long directTime = System.nanoTime() - start;
        
        // Cached reflection (medium)
        Field usernameField = getCachedField(User.class, "username");
        start = System.nanoTime();
        for (int i = 0; i < 1000000; i++) {
            try {
                String username = (String) usernameField.get(user);
            } catch (IllegalAccessException e) {
                // Handle exception
            }
        }
        long cachedReflectionTime = System.nanoTime() - start;
        
        // Uncached reflection (slowest)
        start = System.nanoTime();
        for (int i = 0; i < 1000000; i++) {
            try {
                Field field = User.class.getDeclaredField("username");
                field.setAccessible(true);
                String username = (String) field.get(user);
            } catch (Exception e) {
                // Handle exception
            }
        }
        long uncachedReflectionTime = System.nanoTime() - start;
        
        System.out.println("Direct access: " + directTime + " ns");
        System.out.println("Cached reflection: " + cachedReflectionTime + " ns");
        System.out.println("Uncached reflection: " + uncachedReflectionTime + " ns");
    }
}
```

### Security Considerations
```java
public class ReflectionSecurity {
    
    // Always check security manager
    public static void secureReflectionAccess(Class<?> clazz, String memberName) {
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            sm.checkPermission(new ReflectPermission("suppressAccessChecks"));
        }
    }
    
    // Validate class before reflection
    public static boolean isSafeClass(Class<?> clazz) {
        String className = clazz.getName();
        
        // Avoid system classes
        if (className.startsWith("java.") || 
            className.startsWith("javax.") || 
            className.startsWith("sun.") ||
            className.startsWith("com.sun.")) {
            return false;
        }
        
        // Check for dangerous interfaces
        if (ProcessBuilder.class.isAssignableFrom(clazz) ||
            Runtime.class.isAssignableFrom(clazz)) {
            return false;
        }
        
        return true;
    }
    
    // Safe reflection wrapper
    public static <T> T safeGetFieldValue(Object target, String fieldName, Class<T> expectedType) {
        if (!isSafeClass(target.getClass())) {
            throw new SecurityException("Unsafe class for reflection: " + target.getClass());
        }
        
        secureReflectionAccess(target.getClass(), fieldName);
        
        return ReflectionUtils.getProperty(target, fieldName, expectedType);
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Create a simple ORM framework using reflection and annotations
2. Build a configuration framework that maps properties to objects
3. Implement a serialization framework using annotations
4. Design a plugin system using reflection for dynamic loading

## 📊 Annotation Retention Policies

| Retention | Description | Use Case |
|-----------|-------------|----------|
| `SOURCE` | Discarded by compiler | Code generation, IDE hints |
| `CLASS` | Stored in .class file, not available at runtime | Bytecode processing |
| `RUNTIME` | Available at runtime via reflection | Framework processing, validation |

## 🔍 Common Spring Annotations by Category

### Component Stereotypes
- `@Component` - Generic component
- `@Service` - Business logic layer
- `@Repository` - Data access layer  
- `@Controller` - Web layer
- `@RestController` - REST web services

### Dependency Injection
- `@Autowired` - Automatic dependency injection
- `@Qualifier` - Specify which bean to inject
- `@Value` - Inject property values
- `@Inject` - JSR-330 standard injection

### Configuration
- `@Configuration` - Java-based configuration
- `@Bean` - Bean definition method
- `@ComponentScan` - Component scanning
- `@PropertySource` - External property files

---
**Next Module**: [Concurrency & Threading](../module7-concurrency/README.md)
