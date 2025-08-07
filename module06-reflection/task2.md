# Module 06: Reflection & Annotations - Simple Framework Task

## Task: Create a Basic Annotation-Based Configuration Framework

Build a simple framework that uses annotations and reflection to configure objects automatically.

### Requirements:

### 1. Create custom annotations:
```java
import java.lang.annotation.*;

// Annotation to mark a class as configurable
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Configurable {
    String value() default "";
}

// Annotation to mark fields for auto-injection
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface AutoInject {
    String value() default "";
}

// Annotation to mark methods that should run after configuration
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface PostConstruct {
}

// Annotation for validation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Required {
}

// Annotation for default values
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface DefaultValue {
    String value();
}
```

### 2. Create sample classes using annotations:
```java
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
        System.out.println("UserService initialized");
    }
    
    public void createUser(String username) {
        if (!initialized) {
            throw new IllegalStateException("Service not initialized");
        }
        System.out.println("Creating user: " + username);
        // Use database and emailService
    }
    
    // Getters and setters
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
    
    @PostConstruct
    public void configure() {
        System.out.println("Email service configured with SMTP: " + smtpServer);
    }
    
    public void sendEmail(String to, String message) {
        System.out.println("Sending email to " + to + ": " + message);
    }
    
    // Getters and setters
    public String getSmtpServer() { return smtpServer; }
    public void setSmtpServer(String smtpServer) { this.smtpServer = smtpServer; }
    public String getPort() { return port; }
    public void setPort(String port) { this.port = port; }
}
```

### 3. Create a configuration framework using reflection:
```java
import java.lang.reflect.*;
import java.util.*;

public class SimpleFramework {
    private Map<String, Object> instances = new HashMap<>();
    private Map<Class<?>, Object> typeInstances = new HashMap<>();
    
    // Register an instance with the framework
    public void register(String name, Object instance) {
        instances.put(name, instance);
        typeInstances.put(instance.getClass(), instance);
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
            
            // Handle @DefaultValue
            if (field.isAnnotationPresent(DefaultValue.class)) {
                DefaultValue defaultValue = field.getAnnotation(DefaultValue.class);
                setFieldValue(field, object, defaultValue.value());
            }
            
            // Handle @AutoInject
            if (field.isAnnotationPresent(AutoInject.class)) {
                AutoInject autoInject = field.getAnnotation(AutoInject.class);
                Object dependency = findDependency(field, autoInject.value());
                if (dependency != null) {
                    field.set(object, dependency);
                }
            }
            
            // Validate @Required fields
            if (field.isAnnotationPresent(Required.class)) {
                Object value = field.get(object);
                if (value == null) {
                    throw new IllegalStateException("Required field is null: " + field.getName());
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
        }
        // Add more type conversions as needed
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
            return createAndConfigure(fieldType);
        }
        
        return null;
    }
    
    private void callPostConstructMethods(Object object, Class<?> clazz) throws Exception {
        Method[] methods = clazz.getDeclaredMethods();
        
        for (Method method : methods) {
            if (method.isAnnotationPresent(PostConstruct.class)) {
                method.setAccessible(true);
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
        System.out.println("Registered instances:");
        instances.forEach((name, instance) -> 
            System.out.println("  " + name + " -> " + instance.getClass().getSimpleName()));
    }
}
```

### 4. Create a reflection utility class:
```java
public class ReflectionUtils {
    
    // Get all fields including inherited ones
    public static List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        while (clazz != null) {
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
        Field field = object.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(object);
    }
    
    // Set field value safely
    public static void setFieldValue(Object object, String fieldName, Object value) throws Exception {
        Field field = object.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(object, value);
    }
    
    // Check if class has specific annotation
    public static boolean hasAnnotation(Class<?> clazz, Class<? extends Annotation> annotation) {
        return clazz.isAnnotationPresent(annotation);
    }
    
    // Get annotation value
    public static <T extends Annotation> T getAnnotation(Class<?> clazz, Class<T> annotationType) {
        return clazz.getAnnotation(annotationType);
    }
}
```

### 5. Test the framework:
```java
public class FrameworkTest {
    public static void main(String[] args) {
        try {
            SimpleFramework framework = new SimpleFramework();
            
            System.out.println("=== Creating and configuring services ===");
            
            // Create EmailService and set required field
            EmailService emailService = framework.createAndConfigure(EmailService.class);
            ReflectionUtils.setFieldValue(emailService, "smtpServer", "smtp.gmail.com");
            framework.configure(emailService); // Reconfigure after setting required field
            
            // Create DatabaseConnection
            DatabaseConnection database = framework.createAndConfigure(DatabaseConnection.class);
            
            // Create UserService (will auto-inject dependencies)
            UserService userService = framework.createAndConfigure(UserService.class);
            
            System.out.println("\n=== Testing services ===");
            userService.createUser("john_doe");
            emailService.sendEmail("john@example.com", "Welcome!");
            
            System.out.println("\n=== Framework instances ===");
            framework.listInstances();
            
            System.out.println("\n=== Testing reflection utilities ===");
            System.out.println("UserService initialized: " + 
                ReflectionUtils.getFieldValue(userService, "initialized"));
            
            // Test annotation inspection
            Class<?> userServiceClass = UserService.class;
            if (ReflectionUtils.hasAnnotation(userServiceClass, Configurable.class)) {
                Configurable config = ReflectionUtils.getAnnotation(userServiceClass, Configurable.class);
                System.out.println("UserService config name: " + config.value());
            }
            
            // List all fields with annotations
            System.out.println("\n=== Fields with @AutoInject ===");
            for (Field field : userServiceClass.getDeclaredFields()) {
                if (field.isAnnotationPresent(AutoInject.class)) {
                    AutoInject autoInject = field.getAnnotation(AutoInject.class);
                    System.out.println(field.getName() + " -> " + autoInject.value());
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Bonus (Optional):
- Add configuration from properties files
- Implement circular dependency detection
- Add support for method injection
- Create annotation for bean scopes (singleton, prototype)
- Add validation annotations with custom validators
