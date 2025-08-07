# Module 11: Dependency Injection - Simple DI Container

## Task: Build a Basic Dependency Injection Container

Create a simple DI container to understand how dependency injection works.

### Requirements:

### 1. Create service interfaces and implementations:
```java
// Email service interface
public interface EmailService {
    void sendEmail(String to, String subject, String body);
}

public class SMTPEmailService implements EmailService {
    private final String smtpServer;
    private final int port;
    
    public SMTPEmailService(String smtpServer, int port) {
        this.smtpServer = smtpServer;
        this.port = port;
    }
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        System.out.println("Sending via SMTP (" + smtpServer + ":" + port + ")");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + body);
    }
}

// Database service interface
public interface DatabaseService {
    void save(String data);
    String load(String id);
}

public class MySQLDatabaseService implements DatabaseService {
    private final String connectionString;
    
    public MySQLDatabaseService(String connectionString) {
        this.connectionString = connectionString;
    }
    
    @Override
    public void save(String data) {
        System.out.println("Saving to MySQL (" + connectionString + "): " + data);
    }
    
    @Override
    public String load(String id) {
        System.out.println("Loading from MySQL (" + connectionString + "): " + id);
        return "Data for " + id;
    }
}

// User service that depends on other services
public class UserService {
    private final EmailService emailService;
    private final DatabaseService databaseService;
    
    // Constructor injection
    public UserService(EmailService emailService, DatabaseService databaseService) {
        this.emailService = emailService;
        this.databaseService = databaseService;
    }
    
    public void createUser(String username, String email) {
        // Save user
        databaseService.save("User: " + username);
        
        // Send welcome email
        emailService.sendEmail(email, "Welcome!", "Welcome " + username + "!");
        
        System.out.println("User " + username + " created successfully");
    }
    
    public void getUserInfo(String userId) {
        String userData = databaseService.load(userId);
        System.out.println("Retrieved: " + userData);
    }
}
```

### 2. Create a simple DI container:
```java
import java.util.*;
import java.util.function.Supplier;

public class SimpleDIContainer {
    private final Map<Class<?>, Object> singletons = new HashMap<>();
    private final Map<Class<?>, Supplier<?>> factories = new HashMap<>();
    private final Map<Class<?>, Class<?>> bindings = new HashMap<>();
    
    // Register a singleton instance
    public <T> void registerSingleton(Class<T> type, T instance) {
        singletons.put(type, instance);
    }
    
    // Register a factory for creating instances
    public <T> void registerFactory(Class<T> type, Supplier<T> factory) {
        factories.put(type, factory);
    }
    
    // Bind interface to implementation
    public <T> void bind(Class<T> interfaceType, Class<? extends T> implementationType) {
        bindings.put(interfaceType, implementationType);
    }
    
    // Get instance from container
    @SuppressWarnings("unchecked")
    public <T> T getInstance(Class<T> type) {
        // Check for singleton first
        if (singletons.containsKey(type)) {
            return (T) singletons.get(type);
        }
        
        // Check for factory
        if (factories.containsKey(type)) {
            return (T) factories.get(type).get();
        }
        
        // Check for binding
        if (bindings.containsKey(type)) {
            Class<?> implementationType = bindings.get(type);
            return (T) createInstance(implementationType);
        }
        
        // Try to create instance directly
        return (T) createInstance(type);
    }
    
    // Create instance using constructor injection
    private Object createInstance(Class<?> type) {
        try {
            var constructors = type.getConstructors();
            if (constructors.length == 0) {
                throw new RuntimeException("No public constructor found for " + type);
            }
            
            // Use first constructor (in real DI container, you'd be smarter about this)
            var constructor = constructors[0];
            var parameterTypes = constructor.getParameterTypes();
            
            // Resolve dependencies
            Object[] parameters = new Object[parameterTypes.length];
            for (int i = 0; i < parameterTypes.length; i++) {
                parameters[i] = getInstance(parameterTypes[i]);
            }
            
            return constructor.newInstance(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create instance of " + type, e);
        }
    }
    
    // Check if type is registered
    public boolean isRegistered(Class<?> type) {
        return singletons.containsKey(type) || 
               factories.containsKey(type) || 
               bindings.containsKey(type);
    }
    
    // List all registered types
    public void listRegistrations() {
        System.out.println("=== DI Container Registrations ===");
        System.out.println("Singletons: " + singletons.keySet());
        System.out.println("Factories: " + factories.keySet());
        System.out.println("Bindings: " + bindings);
    }
}
```

### 3. Create a configuration class:
```java
public class DIConfiguration {
    
    public static SimpleDIContainer configure() {
        SimpleDIContainer container = new SimpleDIContainer();
        
        // Register concrete implementations as factories
        container.registerFactory(SMTPEmailService.class, 
            () -> new SMTPEmailService("smtp.gmail.com", 587));
        
        container.registerFactory(MySQLDatabaseService.class,
            () -> new MySQLDatabaseService("jdbc:mysql://localhost:3306/mydb"));
        
        // Bind interfaces to implementations
        container.bind(EmailService.class, SMTPEmailService.class);
        container.bind(DatabaseService.class, MySQLDatabaseService.class);
        
        return container;
    }
    
    // Alternative configuration method
    public static SimpleDIContainer configureWithSingletons() {
        SimpleDIContainer container = new SimpleDIContainer();
        
        // Create instances manually and register as singletons
        EmailService emailService = new SMTPEmailService("smtp.example.com", 25);
        DatabaseService databaseService = new MySQLDatabaseService("jdbc:mysql://prod:3306/app");
        
        container.registerSingleton(EmailService.class, emailService);
        container.registerSingleton(DatabaseService.class, databaseService);
        
        return container;
    }
}
```

### 4. Create test scenarios:
```java
public class DITest {
    public static void main(String[] args) {
        // Test 1: Basic DI container usage
        System.out.println("=== Test 1: Basic DI Container ===");
        SimpleDIContainer container = DIConfiguration.configure();
        container.listRegistrations();
        
        // Get UserService (dependencies will be injected automatically)
        UserService userService = container.getInstance(UserService.class);
        userService.createUser("john_doe", "john@example.com");
        userService.getUserInfo("user123");
        
        // Test 2: Manual dependency creation (without DI)
        System.out.println("\n=== Test 2: Manual Dependencies (No DI) ===");
        testWithoutDI();
        
        // Test 3: DI with singletons
        System.out.println("\n=== Test 3: DI with Singletons ===");
        SimpleDIContainer singletonContainer = DIConfiguration.configureWithSingletons();
        UserService userService2 = singletonContainer.getInstance(UserService.class);
        userService2.createUser("jane_doe", "jane@example.com");
        
        // Test 4: Multiple instances vs singletons
        System.out.println("\n=== Test 4: Instance Management ===");
        testInstanceManagement(container, singletonContainer);
    }
    
    private static void testWithoutDI() {
        // Manual creation - tightly coupled
        EmailService emailService = new SMTPEmailService("smtp.manual.com", 587);
        DatabaseService databaseService = new MySQLDatabaseService("jdbc:mysql://manual:3306/db");
        UserService userService = new UserService(emailService, databaseService);
        
        userService.createUser("manual_user", "manual@example.com");
    }
    
    private static void testInstanceManagement(SimpleDIContainer factoryContainer, 
                                             SimpleDIContainer singletonContainer) {
        // Factory container creates new instances each time
        EmailService email1 = factoryContainer.getInstance(EmailService.class);
        EmailService email2 = factoryContainer.getInstance(EmailService.class);
        System.out.println("Factory instances same? " + (email1 == email2));
        
        // Singleton container returns same instance
        EmailService emailSingle1 = singletonContainer.getInstance(EmailService.class);
        EmailService emailSingle2 = singletonContainer.getInstance(EmailService.class);
        System.out.println("Singleton instances same? " + (emailSingle1 == emailSingle2));
    }
}
```

### 5. Create a testing framework using DI:
```java
// Mock implementations for testing
public class MockEmailService implements EmailService {
    private final List<String> sentEmails = new ArrayList<>();
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        String email = "To: " + to + ", Subject: " + subject + ", Body: " + body;
        sentEmails.add(email);
        System.out.println("MOCK: " + email);
    }
    
    public List<String> getSentEmails() {
        return new ArrayList<>(sentEmails);
    }
    
    public int getEmailCount() {
        return sentEmails.size();
    }
}

public class MockDatabaseService implements DatabaseService {
    private final Map<String, String> storage = new HashMap<>();
    
    @Override
    public void save(String data) {
        String id = "id_" + storage.size();
        storage.put(id, data);
        System.out.println("MOCK: Saved " + data + " with id " + id);
    }
    
    @Override
    public String load(String id) {
        String data = storage.getOrDefault(id, "NOT_FOUND");
        System.out.println("MOCK: Loaded " + data + " for id " + id);
        return data;
    }
    
    public int getStorageSize() {
        return storage.size();
    }
}

// Test configuration with mocks
public class TestConfiguration {
    public static SimpleDIContainer configureForTesting() {
        SimpleDIContainer container = new SimpleDIContainer();
        
        // Use mock implementations for testing
        container.registerSingleton(EmailService.class, new MockEmailService());
        container.registerSingleton(DatabaseService.class, new MockDatabaseService());
        
        return container;
    }
}

// Unit test example
public class UserServiceTest {
    public static void testUserService() {
        System.out.println("=== Unit Test: UserService ===");
        
        // Setup test container with mocks
        SimpleDIContainer testContainer = TestConfiguration.configureForTesting();
        
        // Get service with injected mocks
        UserService userService = testContainer.getInstance(UserService.class);
        
        // Get mocks to verify behavior
        MockEmailService mockEmail = (MockEmailService) testContainer.getInstance(EmailService.class);
        MockDatabaseService mockDb = (MockDatabaseService) testContainer.getInstance(DatabaseService.class);
        
        // Test user creation
        userService.createUser("test_user", "test@example.com");
        
        // Verify interactions
        System.out.println("Emails sent: " + mockEmail.getEmailCount());
        System.out.println("Database entries: " + mockDb.getStorageSize());
        
        // Verify email content
        List<String> emails = mockEmail.getSentEmails();
        if (emails.size() > 0) {
            System.out.println("Last email: " + emails.get(emails.size() - 1));
        }
        
        System.out.println("Test completed successfully!");
    }
    
    public static void main(String[] args) {
        testUserService();
    }
}
```

### Bonus (Optional):
- Add lifecycle management (initialization/destruction)
- Implement circular dependency detection
- Add annotation-based configuration
- Create scopes (singleton, prototype, request)
- Add AOP (Aspect-Oriented Programming) support
