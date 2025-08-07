# Module 06: Reflection & Annotations - Answers

## MCQ Quiz Answers

### 1. What is reflection in Java?
**Answer: b) The ability to inspect and modify code at runtime**  
*Explanation: Reflection allows programs to examine and modify their own structure and behavior at runtime.*

### 2. Which class is the entry point for reflection operations?
**Answer: b) Class**  
*Explanation: The Class class is the main entry point for reflection, representing classes and interfaces.*

### 3. How do you get the Class object for a specific class?
**Answer: a) Class.forName("ClassName")**  
*Explanation: Class.forName() loads and returns the Class object for the specified class name.*

### 4. What is the purpose of annotations in Java?
**Answer: b) To provide metadata about code elements**  
*Explanation: Annotations provide metadata that can be processed at compile time or runtime.*

### 5. Which annotation indicates that a method overrides a parent method?
**Answer: b) @Override**  
*Explanation: @Override annotation indicates that a method overrides a method from a superclass.*

### 6. What does the @Retention annotation specify?
**Answer: a) How long an annotation should be retained**  
*Explanation: @Retention specifies the retention policy - SOURCE, CLASS, or RUNTIME.*

### 7. Which retention policy keeps annotations available at runtime?
**Answer: c) RUNTIME**  
*Explanation: RetentionPolicy.RUNTIME makes annotations available through reflection at runtime.*

### 8. What is a marker annotation?
**Answer: b) An annotation with no parameters**  
*Explanation: Marker annotations like @Override have no parameters and just mark code elements.*

### 9. How can you access private fields using reflection?
**Answer: b) field.setAccessible(true) then field.get()**  
*Explanation: setAccessible(true) bypasses access control, allowing access to private members.*

### 10. What is the main performance consideration with reflection?
**Answer: b) It's slower than direct method calls**  
*Explanation: Reflection operations are slower due to runtime type checking and security validations.*

---

## Simple Framework Task Solution

```java
import java.lang.annotation.*;
import java.lang.reflect.*;
import java.util.*;
import java.util.stream.Collectors;

// Custom annotations
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Configurable {
    String value() default "";
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface AutoInject {
    String value() default "";
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface PostConstruct {
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Required {
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface DefaultValue {
    String value();
}

// Sample classes using annotations
@Configurable("userService")
public class UserService {
    
    @AutoInject
    private DatabaseConnection database;
    
    @AutoInject("emailService")
    private EmailService emailService;
    
    @Required
    @DefaultValue("default-user")
    private String defaultUsername;
    
    private boolean initialized = false;
    
    @PostConstruct
    public void initialize() {
        initialized = true;
        System.out.println("UserService initialized with database: " + 
                          (database != null ? "connected" : "null"));
    }
    
    public void createUser(String username) {
        if (!initialized) {
            throw new IllegalStateException("Service not initialized");
        }
        System.out.println("Creating user: " + username);
        if (emailService != null) {
            emailService.sendEmail(username + "@example.com", "Welcome " + username + "!");
        }
    }
    
    // Getters
    public DatabaseConnection getDatabase() { return database; }
    public EmailService getEmailService() { return emailService; }
    public String getDefaultUsername() { return defaultUsername; }
    public boolean isInitialized() { return initialized; }
}

@Configurable
public class DatabaseConnection {
    @DefaultValue("localhost")
    private String host;
    
    @DefaultValue("5432")
    private String port;
    
    @PostConstruct
    public void connect() {
        System.out.println("Connected to database at " + host + ":" + port);
    }
    
    public void executeQuery(String query) {
        System.out.println("Executing query: " + query);
    }
    
    // Getters and setters
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    public String getPort() { return port; }
    public void setPort(String port) { this.port = port; }
}

@Configurable
public class EmailService {
    @Required
    private String smtpServer;
    
    @DefaultValue("587")
    private String port;
    
    private boolean configured = false;
    
    @PostConstruct
    public void configure() {
        if (smtpServer != null) {
            configured = true;
            System.out.println("Email service configured with SMTP: " + smtpServer + ":" + port);
        }
    }
    
    public void sendEmail(String to, String message) {
        if (!configured) {
            System.out.println("Email service not properly configured");
            return;
        }
        System.out.println("Sending email to " + to + ": " + message);
    }
    
    // Getters and setters
    public String getSmtpServer() { return smtpServer; }
    public void setSmtpServer(String smtpServer) { this.smtpServer = smtpServer; }
    public String getPort() { return port; }
    public void setPort(String port) { this.port = port; }
    public boolean isConfigured() { return configured; }
}

// Configuration framework using reflection
public class SimpleFramework {
    private Map<String, Object> instances = new HashMap<>();
    private Map<Class<?>, Object> typeInstances = new HashMap<>();
    
    // Register an instance with the framework
    public void register(String name, Object instance) {
        instances.put(name, instance);
        typeInstances.put(instance.getClass(), instance);
        System.out.println("Registered: " + name + " -> " + instance.getClass().getSimpleName());
    }
    
    // Create and configure an object
    public <T> T createAndConfigure(Class<T> clazz) throws Exception {
        // Check if class is configurable
        if (!clazz.isAnnotationPresent(Configurable.class)) {
            throw new IllegalArgumentException("Class is not @Configurable: " + clazz.getName());
        }
        
        // Create instance
        T instance = clazz.getDeclaredConstructor().newInstance();
        
        // Configure the instance
        configure(instance);
        
        // Register the instance
        Configurable config = clazz.getAnnotation(Configurable.class);
        String name = config.value().isEmpty() ? clazz.getSimpleName() : config.value();
        register(name, instance);
        
        return instance;
    }
    
    // Configure an existing object
    public void configure(Object object) throws Exception {
        Class<?> clazz = object.getClass();
        
        // Process fields
        processFields(object, clazz);
        
        // Call @PostConstruct methods
        callPostConstructMethods(object, clazz);
    }
    
    private void processFields(Object object, Class<?> clazz) throws Exception {
        Field[] fields = clazz.getDeclaredFields();
        
        for (Field field : fields) {
            field.setAccessible(true);
            
            // Handle @DefaultValue first
            if (field.isAnnotationPresent(DefaultValue.class)) {
                DefaultValue defaultValue = field.getAnnotation(DefaultValue.class);
                if (field.get(object) == null) { // Only set if field is null
                    setFieldValue(field, object, defaultValue.value());
                }
            }
            
            // Handle @AutoInject
            if (field.isAnnotationPresent(AutoInject.class)) {
                AutoInject autoInject = field.getAnnotation(AutoInject.class);
                Object dependency = findDependency(field, autoInject.value());
                if (dependency != null) {
                    field.set(object, dependency);
                }
            }
            
            // Validate @Required fields after all injections
            if (field.isAnnotationPresent(Required.class)) {
                Object value = field.get(object);
                if (value == null || (value instanceof String && ((String) value).isEmpty())) {
                    System.out.println("Warning: Required field '" + field.getName() + 
                                     "' in " + clazz.getSimpleName() + " is null or empty");
                }
            }
        }
    }
    
    private void setFieldValue(Field field, Object object, String value) throws Exception {
        Class<?> fieldType = field.getType();
        
        if (fieldType == String.class) {
            field.set(object, value);
        } else if (fieldType == int.class || fieldType == Integer.class) {
            field.set(object, Integer.parseInt(value));
        } else if (fieldType == double.class || fieldType == Double.class) {
            field.set(object, Double.parseDouble(value));
        } else if (fieldType == boolean.class || fieldType == Boolean.class) {
            field.set(object, Boolean.parseBoolean(value));
        } else if (fieldType == long.class || fieldType == Long.class) {
            field.set(object, Long.parseLong(value));
        } else {
            System.out.println("Unsupported field type for default value: " + fieldType);
        }
    }
    
    private Object findDependency(Field field, String name) throws Exception {
        // First try to find by name
        if (!name.isEmpty() && instances.containsKey(name)) {
            return instances.get(name);
        }
        
        // Then try to find by type
        Class<?> fieldType = field.getType();
        if (typeInstances.containsKey(fieldType)) {
            return typeInstances.get(fieldType);
        }
        
        // Try to create the dependency if it's configurable
        if (fieldType.isAnnotationPresent(Configurable.class)) {
            System.out.println("Auto-creating dependency: " + fieldType.getSimpleName());
            return createAndConfigure(fieldType);
        }
        
        System.out.println("Could not find dependency for field: " + field.getName() + 
                          " of type: " + fieldType.getSimpleName());
        return null;
    }
    
    private void callPostConstructMethods(Object object, Class<?> clazz) throws Exception {
        Method[] methods = clazz.getDeclaredMethods();
        
        for (Method method : methods) {
            if (method.isAnnotationPresent(PostConstruct.class)) {
                method.setAccessible(true);
                System.out.println("Calling @PostConstruct method: " + method.getName() + 
                                 " on " + clazz.getSimpleName());
                method.invoke(object);
            }
        }
    }
    
    // Get instance by name
    public Object getInstance(String name) {
        return instances.get(name);
    }
    
    // Get instance by type
    @SuppressWarnings("unchecked")
    public <T> T getInstance(Class<T> type) {
        return (T) typeInstances.get(type);
    }
    
    // List all registered instances
    public void listInstances() {
        System.out.println("=== Registered instances ===");
        instances.forEach((name, instance) -> 
            System.out.println("  " + name + " -> " + instance.getClass().getSimpleName()));
    }
    
    // Get all instances of a specific annotation
    public List<Object> getInstancesWithAnnotation(Class<? extends Annotation> annotationType) {
        return typeInstances.values().stream()
                           .filter(instance -> instance.getClass().isAnnotationPresent(annotationType))
                           .collect(Collectors.toList());
    }
}

// Reflection utility class
public class ReflectionUtils {
    
    // Get all fields including inherited ones
    public static List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        while (clazz != null && clazz != Object.class) {
            fields.addAll(Arrays.asList(clazz.getDeclaredFields()));
            clazz = clazz.getSuperclass();
        }
        return fields;
    }
    
    // Get all methods with specific annotation
    public static List<Method> getMethodsWithAnnotation(Class<?> clazz, 
                                                       Class<? extends Annotation> annotation) {
        return Arrays.stream(clazz.getDeclaredMethods())
                    .filter(method -> method.isAnnotationPresent(annotation))
                    .collect(Collectors.toList());
    }
    
    // Get field value safely
    public static Object getFieldValue(Object object, String fieldName) throws Exception {
        Class<?> clazz = object.getClass();
        Field field = findField(clazz, fieldName);
        if (field != null) {
            field.setAccessible(true);
            return field.get(object);
        }
        throw new NoSuchFieldException("Field not found: " + fieldName);
    }
    
    // Set field value safely
    public static void setFieldValue(Object object, String fieldName, Object value) throws Exception {
        Class<?> clazz = object.getClass();
        Field field = findField(clazz, fieldName);
        if (field != null) {
            field.setAccessible(true);
            field.set(object, value);
        } else {
            throw new NoSuchFieldException("Field not found: " + fieldName);
        }
    }
    
    // Find field in class hierarchy
    private static Field findField(Class<?> clazz, String fieldName) {
        while (clazz != null && clazz != Object.class) {
            try {
                return clazz.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        return null;
    }
    
    // Check if class has specific annotation
    public static boolean hasAnnotation(Class<?> clazz, Class<? extends Annotation> annotation) {
        return clazz.isAnnotationPresent(annotation);
    }
    
    // Get annotation value
    public static <T extends Annotation> T getAnnotation(Class<?> clazz, Class<T> annotationType) {
        return clazz.getAnnotation(annotationType);
    }
    
    // Get all fields with specific annotation
    public static List<Field> getFieldsWithAnnotation(Class<?> clazz, 
                                                     Class<? extends Annotation> annotation) {
        return getAllFields(clazz).stream()
                                 .filter(field -> field.isAnnotationPresent(annotation))
                                 .collect(Collectors.toList());
    }
    
    // Invoke method by name
    public static Object invokeMethod(Object object, String methodName, Object... args) throws Exception {
        Class<?> clazz = object.getClass();
        Class<?>[] paramTypes = Arrays.stream(args)
                                     .map(Object::getClass)
                                     .toArray(Class<?>[]::new);
        
        Method method = clazz.getDeclaredMethod(methodName, paramTypes);
        method.setAccessible(true);
        return method.invoke(object, args);
    }
    
    // Get class information summary
    public static String getClassInfo(Class<?> clazz) {
        StringBuilder info = new StringBuilder();
        info.append("Class: ").append(clazz.getSimpleName()).append("\n");
        info.append("Package: ").append(clazz.getPackage().getName()).append("\n");
        info.append("Superclass: ").append(clazz.getSuperclass().getSimpleName()).append("\n");
        info.append("Interfaces: ").append(Arrays.toString(clazz.getInterfaces())).append("\n");
        info.append("Annotations: ").append(Arrays.toString(clazz.getAnnotations())).append("\n");
        return info.toString();
    }
}

// Test the framework
public class FrameworkTest {
    public static void main(String[] args) {
        try {
            SimpleFramework framework = new SimpleFramework();
            
            System.out.println("=== Creating and configuring services ===");
            
            // Create EmailService first and set required field
            EmailService emailService = framework.createAndConfigure(EmailService.class);
            ReflectionUtils.setFieldValue(emailService, "smtpServer", "smtp.gmail.com");
            framework.configure(emailService); // Reconfigure after setting required field
            
            // Create DatabaseConnection
            DatabaseConnection database = framework.createAndConfigure(DatabaseConnection.class);
            
            // Create UserService (will auto-inject dependencies)
            UserService userService = framework.createAndConfigure(UserService.class);
            
            System.out.println("\n=== Testing services ===");
            userService.createUser("john_doe");
            database.executeQuery("SELECT * FROM users");
            
            System.out.println("\n=== Framework instances ===");
            framework.listInstances();
            
            System.out.println("\n=== Testing reflection utilities ===");
            System.out.println("UserService initialized: " + 
                ReflectionUtils.getFieldValue(userService, "initialized"));
            
            System.out.println("EmailService configured: " + 
                ReflectionUtils.getFieldValue(emailService, "configured"));
            
            // Test annotation inspection
            Class<?> userServiceClass = UserService.class;
            if (ReflectionUtils.hasAnnotation(userServiceClass, Configurable.class)) {
                Configurable config = ReflectionUtils.getAnnotation(userServiceClass, Configurable.class);
                System.out.println("UserService config name: " + config.value());
            }
            
            // List all fields with annotations
            System.out.println("\n=== Fields with @AutoInject ===");
            List<Field> autoInjectFields = ReflectionUtils.getFieldsWithAnnotation(userServiceClass, AutoInject.class);
            for (Field field : autoInjectFields) {
                AutoInject autoInject = field.getAnnotation(AutoInject.class);
                System.out.println(field.getName() + " -> '" + autoInject.value() + "'");
            }
            
            System.out.println("\n=== Fields with @DefaultValue ===");
            List<Field> defaultValueFields = ReflectionUtils.getFieldsWithAnnotation(DatabaseConnection.class, DefaultValue.class);
            for (Field field : defaultValueFields) {
                DefaultValue defaultValue = field.getAnnotation(DefaultValue.class);
                System.out.println(field.getName() + " = '" + defaultValue.value() + "'");
            }
            
            // Test method invocation through reflection
            System.out.println("\n=== Reflection method invocation ===");
            ReflectionUtils.invokeMethod(database, "executeQuery", "SELECT COUNT(*) FROM users");
            
            // Print class information
            System.out.println("\n=== Class Information ===");
            System.out.println(ReflectionUtils.getClassInfo(UserService.class));
            
            // Test finding all @PostConstruct methods
            System.out.println("=== @PostConstruct Methods ===");
            List<Method> postConstructMethods = ReflectionUtils.getMethodsWithAnnotation(
                UserService.class, PostConstruct.class);
            postConstructMethods.forEach(method -> 
                System.out.println("PostConstruct method: " + method.getName()));
            
            // Test getting instances with specific annotation
            System.out.println("\n=== All @Configurable instances ===");
            List<Object> configurableInstances = framework.getInstancesWithAnnotation(Configurable.class);
            configurableInstances.forEach(instance -> 
                System.out.println("Instance: " + instance.getClass().getSimpleName()));
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## Advanced Features (Bonus Examples)

```java
// Configuration from properties
public class PropertyConfiguration {
    public static void configureFromProperties(Object object, Properties properties) throws Exception {
        Class<?> clazz = object.getClass();
        String prefix = clazz.getSimpleName().toLowerCase() + ".";
        
        for (Field field : ReflectionUtils.getAllFields(clazz)) {
            field.setAccessible(true);
            String propertyName = prefix + field.getName();
            String value = properties.getProperty(propertyName);
            
            if (value != null) {
                setFieldFromString(field, object, value);
            }
        }
    }
    
    private static void setFieldFromString(Field field, Object object, String value) throws Exception {
        Class<?> type = field.getType();
        if (type == String.class) {
            field.set(object, value);
        } else if (type == int.class || type == Integer.class) {
            field.set(object, Integer.parseInt(value));
        } else if (type == boolean.class || type == Boolean.class) {
            field.set(object, Boolean.parseBoolean(value));
        }
        // Add more type conversions as needed
    }
}

// Validation annotation example
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface MinValue {
    int value();
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface MaxLength {
    int value();
}

// Validation processor
public class ValidationProcessor {
    public static void validate(Object object) throws Exception {
        for (Field field : ReflectionUtils.getAllFields(object.getClass())) {
            field.setAccessible(true);
            Object value = field.get(object);
            
            if (field.isAnnotationPresent(MinValue.class)) {
                MinValue minValue = field.getAnnotation(MinValue.class);
                if (value instanceof Number && ((Number) value).intValue() < minValue.value()) {
                    throw new IllegalArgumentException(
                        "Field " + field.getName() + " must be >= " + minValue.value());
                }
            }
            
            if (field.isAnnotationPresent(MaxLength.class)) {
                MaxLength maxLength = field.getAnnotation(MaxLength.class);
                if (value instanceof String && ((String) value).length() > maxLength.value()) {
                    throw new IllegalArgumentException(
                        "Field " + field.getName() + " exceeds max length " + maxLength.value());
                }
            }
        }
    }
}
```

## Key Reflection & Annotation Concepts Demonstrated:

1. **Custom Annotations**: Creating domain-specific annotations with retention policies
2. **Reflection API**: Using Class, Field, Method objects to inspect and modify code
3. **Annotation Processing**: Reading annotation values and acting on them
4. **Access Control**: Using setAccessible() to bypass private access
5. **Dynamic Object Creation**: Creating instances using reflection
6. **Field Injection**: Setting field values dynamically
7. **Method Invocation**: Calling methods through reflection
8. **Framework Design**: Building extensible systems using annotations
9. **Metadata Programming**: Using annotations to drive behavior
10. **Runtime Configuration**: Modifying object behavior at runtime

This solution demonstrates how reflection and annotations enable powerful framework capabilities like dependency injection, configuration management, and aspect-oriented programming - fundamental concepts in Spring Framework.
