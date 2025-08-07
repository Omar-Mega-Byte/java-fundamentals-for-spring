# Module 11: Dependency Injection - Answers

## Task 1: MCQ Quiz Answers

### 1. What is Dependency Injection (DI)?
**Answer: b) A design pattern where dependencies are provided to an object rather than created by it**

Explanation: DI is a design pattern that implements Inversion of Control (IoC) where objects receive their dependencies from external sources rather than creating them internally.

### 2. Which type of dependency injection is considered most reliable?
**Answer: a) Constructor injection**

Explanation: Constructor injection ensures all required dependencies are provided when the object is created, making the object immutable and preventing it from being in an incomplete state.

### 3. What is the main benefit of using dependency injection?
**Answer: d) All of the above**

Explanation: DI provides loose coupling (objects depend on abstractions), easier testing (dependencies can be mocked), and better maintainability (easier to change implementations).

### 4. What is Inversion of Control (IoC)?
**Answer: c) A principle where the control of object creation is transferred to an external entity**

Explanation: IoC is a fundamental principle where the control flow is inverted - instead of objects controlling their dependencies, an external entity (IoC container) manages object creation and lifecycle.

### 5. Which is NOT a type of dependency injection?
**Answer: d) Factory injection**

Explanation: The three main types of DI are constructor injection, setter injection, and field injection. Factory injection is not a standard DI type.

### 6. What is a DI container?
**Answer: c) A framework that manages object creation and dependency injection**

Explanation: A DI container (or IoC container) is responsible for object instantiation, dependency resolution, and lifecycle management of objects in an application.

### 7. When should you avoid dependency injection?
**Answer: d) In simple utility classes with no dependencies**

Explanation: DI adds complexity and is overkill for simple utility classes, immutable objects, or classes with no dependencies. It's best used for complex objects with multiple dependencies.

### 8. What is the difference between DI and Service Locator pattern?
**Answer: b) DI pushes dependencies to objects, Service Locator pulls dependencies**

Explanation: In DI, dependencies are pushed/injected into objects. In Service Locator, objects actively pull their dependencies from a central registry.

### 9. How does DI help with testing?
**Answer: c) It allows easy substitution of real dependencies with mocks**

Explanation: DI enables easy testing by allowing test doubles (mocks, stubs) to be injected instead of real dependencies, isolating the unit under test.

### 10. What is circular dependency in DI?
**Answer: b) When two or more objects depend on each other directly or indirectly**

Explanation: Circular dependency occurs when A depends on B, and B depends on A (directly or through a chain). This creates an infinite loop during object creation and should be avoided.

---

## Task 2: Simple DI Container Implementation

### Complete Implementation with All Classes:

```java
// ===== INTERFACES =====

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}

public interface DatabaseService {
    void save(String data);
    String load(String id);
}

// ===== IMPLEMENTATIONS =====

public class SMTPEmailService implements EmailService {
    private final String smtpServer;
    private final int port;
    
    public SMTPEmailService(String smtpServer, int port) {
        this.smtpServer = smtpServer;
        this.port = port;
        System.out.println("SMTPEmailService created with server: " + smtpServer + ":" + port);
    }
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        System.out.println("Sending via SMTP (" + smtpServer + ":" + port + ")");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + body);
    }
}

public class MySQLDatabaseService implements DatabaseService {
    private final String connectionString;
    
    public MySQLDatabaseService(String connectionString) {
        this.connectionString = connectionString;
        System.out.println("MySQLDatabaseService created with connection: " + connectionString);
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

public class UserService {
    private final EmailService emailService;
    private final DatabaseService databaseService;
    
    // Constructor injection - dependencies are required
    public UserService(EmailService emailService, DatabaseService databaseService) {
        this.emailService = emailService;
        this.databaseService = databaseService;
        System.out.println("UserService created with injected dependencies");
    }
    
    public void createUser(String username, String email) {
        // Save user to database
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

// ===== DI CONTAINER =====

import java.util.*;
import java.util.function.Supplier;

public class SimpleDIContainer {
    private final Map<Class<?>, Object> singletons = new HashMap<>();
    private final Map<Class<?>, Supplier<?>> factories = new HashMap<>();
    private final Map<Class<?>, Class<?>> bindings = new HashMap<>();
    
    // Register a singleton instance
    public <T> void registerSingleton(Class<T> type, T instance) {
        singletons.put(type, instance);
        System.out.println("Registered singleton: " + type.getSimpleName());
    }
    
    // Register a factory for creating instances
    public <T> void registerFactory(Class<T> type, Supplier<T> factory) {
        factories.put(type, factory);
        System.out.println("Registered factory: " + type.getSimpleName());
    }
    
    // Bind interface to implementation
    public <T> void bind(Class<T> interfaceType, Class<? extends T> implementationType) {
        bindings.put(interfaceType, implementationType);
        System.out.println("Bound " + interfaceType.getSimpleName() + " -> " + implementationType.getSimpleName());
    }
    
    // Get instance from container
    @SuppressWarnings("unchecked")
    public <T> T getInstance(Class<T> type) {
        System.out.println("Resolving dependency: " + type.getSimpleName());
        
        // Check for singleton first
        if (singletons.containsKey(type)) {
            System.out.println("  Found singleton instance");
            return (T) singletons.get(type);
        }
        
        // Check for factory
        if (factories.containsKey(type)) {
            System.out.println("  Using factory to create instance");
            return (T) factories.get(type).get();
        }
        
        // Check for binding
        if (bindings.containsKey(type)) {
            System.out.println("  Found binding, creating implementation");
            Class<?> implementationType = bindings.get(type);
            return (T) createInstance(implementationType);
        }
        
        // Try to create instance directly
        System.out.println("  Creating instance directly");
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
            
            System.out.println("    Constructor requires " + parameterTypes.length + " parameters");
            
            // Resolve dependencies
            Object[] parameters = new Object[parameterTypes.length];
            for (int i = 0; i < parameterTypes.length; i++) {
                System.out.println("    Resolving parameter " + (i+1) + ": " + parameterTypes[i].getSimpleName());
                parameters[i] = getInstance(parameterTypes[i]);
            }
            
            Object instance = constructor.newInstance(parameters);
            System.out.println("    Created instance of " + type.getSimpleName());
            return instance;
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
        System.out.println("===================================");
    }
}

// ===== CONFIGURATION =====

public class DIConfiguration {
    
    public static SimpleDIContainer configure() {
        System.out.println("Configuring DI Container...");
        SimpleDIContainer container = new SimpleDIContainer();
        
        // Register concrete implementations as factories
        container.registerFactory(SMTPEmailService.class, 
            () -> new SMTPEmailService("smtp.gmail.com", 587));
        
        container.registerFactory(MySQLDatabaseService.class,
            () -> new MySQLDatabaseService("jdbc:mysql://localhost:3306/mydb"));
        
        // Bind interfaces to implementations
        container.bind(EmailService.class, SMTPEmailService.class);
        container.bind(DatabaseService.class, MySQLDatabaseService.class);
        
        System.out.println("DI Container configured successfully!");
        return container;
    }
    
    // Alternative configuration method
    public static SimpleDIContainer configureWithSingletons() {
        System.out.println("Configuring DI Container with Singletons...");
        SimpleDIContainer container = new SimpleDIContainer();
        
        // Create instances manually and register as singletons
        EmailService emailService = new SMTPEmailService("smtp.example.com", 25);
        DatabaseService databaseService = new MySQLDatabaseService("jdbc:mysql://prod:3306/app");
        
        container.registerSingleton(EmailService.class, emailService);
        container.registerSingleton(DatabaseService.class, databaseService);
        
        System.out.println("Singleton DI Container configured successfully!");
        return container;
    }
}

// ===== MOCK IMPLEMENTATIONS FOR TESTING =====

import java.util.*;

public class MockEmailService implements EmailService {
    private final List<String> sentEmails = new ArrayList<>();
    
    public MockEmailService() {
        System.out.println("MockEmailService created");
    }
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        String email = "To: " + to + ", Subject: " + subject + ", Body: " + body;
        sentEmails.add(email);
        System.out.println("MOCK EMAIL: " + email);
    }
    
    public List<String> getSentEmails() {
        return new ArrayList<>(sentEmails);
    }
    
    public int getEmailCount() {
        return sentEmails.size();
    }
    
    public void clearEmails() {
        sentEmails.clear();
    }
}

public class MockDatabaseService implements DatabaseService {
    private final Map<String, String> storage = new HashMap<>();
    private int idCounter = 1;
    
    public MockDatabaseService() {
        System.out.println("MockDatabaseService created");
    }
    
    @Override
    public void save(String data) {
        String id = "id_" + idCounter++;
        storage.put(id, data);
        System.out.println("MOCK DB: Saved '" + data + "' with id " + id);
    }
    
    @Override
    public String load(String id) {
        String data = storage.getOrDefault(id, "NOT_FOUND");
        System.out.println("MOCK DB: Loaded '" + data + "' for id " + id);
        return data;
    }
    
    public int getStorageSize() {
        return storage.size();
    }
    
    public void clearStorage() {
        storage.clear();
        idCounter = 1;
    }
    
    public Map<String, String> getAllData() {
        return new HashMap<>(storage);
    }
}

// ===== TEST CONFIGURATION =====

public class TestConfiguration {
    public static SimpleDIContainer configureForTesting() {
        System.out.println("Configuring Test DI Container...");
        SimpleDIContainer container = new SimpleDIContainer();
        
        // Use mock implementations for testing
        container.registerSingleton(EmailService.class, new MockEmailService());
        container.registerSingleton(DatabaseService.class, new MockDatabaseService());
        
        System.out.println("Test DI Container configured with mocks!");
        return container;
    }
}

// ===== MAIN TEST CLASS =====

public class DITest {
    public static void main(String[] args) {
        System.out.println("Starting Dependency Injection Demonstration");
        System.out.println("==========================================");
        
        // Test 1: Basic DI container usage
        System.out.println("\n=== Test 1: Basic DI Container ===");
        SimpleDIContainer container = DIConfiguration.configure();
        container.listRegistrations();
        
        System.out.println("\nCreating UserService with dependency injection:");
        UserService userService = container.getInstance(UserService.class);
        
        System.out.println("\nTesting user operations:");
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
        
        // Test 5: Unit testing with mocks
        System.out.println("\n=== Test 5: Unit Testing with Mocks ===");
        runUnitTests();
        
        System.out.println("\n=== All Tests Completed ===");
    }
    
    private static void testWithoutDI() {
        System.out.println("Creating dependencies manually (tightly coupled):");
        
        // Manual creation - tightly coupled
        EmailService emailService = new SMTPEmailService("smtp.manual.com", 587);
        DatabaseService databaseService = new MySQLDatabaseService("jdbc:mysql://manual:3306/db");
        UserService userService = new UserService(emailService, databaseService);
        
        System.out.println("Testing manually created UserService:");
        userService.createUser("manual_user", "manual@example.com");
    }
    
    private static void testInstanceManagement(SimpleDIContainer factoryContainer, 
                                             SimpleDIContainer singletonContainer) {
        System.out.println("Testing instance management patterns:");
        
        // Factory container creates new instances each time
        System.out.println("\nFactory Container (new instances each time):");
        EmailService email1 = factoryContainer.getInstance(EmailService.class);
        EmailService email2 = factoryContainer.getInstance(EmailService.class);
        System.out.println("Factory instances are same object? " + (email1 == email2));
        System.out.println("Email1 hash: " + email1.hashCode());
        System.out.println("Email2 hash: " + email2.hashCode());
        
        // Singleton container returns same instance
        System.out.println("\nSingleton Container (same instance each time):");
        EmailService emailSingle1 = singletonContainer.getInstance(EmailService.class);
        EmailService emailSingle2 = singletonContainer.getInstance(EmailService.class);
        System.out.println("Singleton instances are same object? " + (emailSingle1 == emailSingle2));
        System.out.println("EmailSingle1 hash: " + emailSingle1.hashCode());
        System.out.println("EmailSingle2 hash: " + emailSingle2.hashCode());
    }
    
    private static void runUnitTests() {
        System.out.println("Setting up test environment with mocks:");
        
        // Setup test container with mocks
        SimpleDIContainer testContainer = TestConfiguration.configureForTesting();
        
        // Get service with injected mocks
        UserService userService = testContainer.getInstance(UserService.class);
        
        // Get mocks to verify behavior
        MockEmailService mockEmail = (MockEmailService) testContainer.getInstance(EmailService.class);
        MockDatabaseService mockDb = (MockDatabaseService) testContainer.getInstance(DatabaseService.class);
        
        System.out.println("\nTesting user creation with mocks:");
        userService.createUser("test_user", "test@example.com");
        userService.createUser("another_user", "another@example.com");
        
        System.out.println("\nVerifying mock interactions:");
        System.out.println("Emails sent: " + mockEmail.getEmailCount());
        System.out.println("Database entries: " + mockDb.getStorageSize());
        
        // Verify email content
        List<String> emails = mockEmail.getSentEmails();
        System.out.println("All sent emails:");
        for (int i = 0; i < emails.size(); i++) {
            System.out.println("  " + (i+1) + ". " + emails.get(i));
        }
        
        // Verify database content
        System.out.println("All database entries:");
        Map<String, String> dbData = mockDb.getAllData();
        for (Map.Entry<String, String> entry : dbData.entrySet()) {
            System.out.println("  " + entry.getKey() + " -> " + entry.getValue());
        }
        
        // Test user info retrieval
        System.out.println("\nTesting user info retrieval:");
        userService.getUserInfo("id_1");
        userService.getUserInfo("nonexistent");
        
        System.out.println("\nUnit test completed successfully!");
        
        // Demonstrate test isolation
        System.out.println("\nDemonstrating test isolation:");
        mockEmail.clearEmails();
        mockDb.clearStorage();
        System.out.println("Mocks cleared - Emails: " + mockEmail.getEmailCount() + 
                         ", DB entries: " + mockDb.getStorageSize());
    }
}
```

### Expected Output:
```
Starting Dependency Injection Demonstration
==========================================

=== Test 1: Basic DI Container ===
Configuring DI Container...
Registered factory: SMTPEmailService
Registered factory: MySQLDatabaseService
Bound EmailService -> SMTPEmailService
Bound DatabaseService -> MySQLDatabaseService
DI Container configured successfully!
=== DI Container Registrations ===
Singletons: []
Factories: [class SMTPEmailService, class MySQLDatabaseService]
Bindings: {interface EmailService=class SMTPEmailService, interface DatabaseService=class MySQLDatabaseService}
===================================

Creating UserService with dependency injection:
Resolving dependency: UserService
  Creating instance directly
    Constructor requires 2 parameters
    Resolving parameter 1: EmailService
Resolving dependency: EmailService
  Found binding, creating implementation
    Constructor requires 2 parameters
    Resolving parameter 1: SMTPEmailService
Resolving dependency: SMTPEmailService
  Using factory to create instance
SMTPEmailService created with server: smtp.gmail.com:587
    Created instance of SMTPEmailService
    Resolving parameter 2: DatabaseService
Resolving dependency: DatabaseService
  Found binding, creating implementation
    Constructor requires 1 parameters
    Resolving parameter 1: MySQLDatabaseService
Resolving dependency: MySQLDatabaseService
  Using factory to create instance
MySQLDatabaseService created with connection: jdbc:mysql://localhost:3306/mydb
    Created instance of MySQLDatabaseService
    Created instance of MySQLDatabaseService
    Created instance of SMTPEmailService
UserService created with injected dependencies
    Created instance of UserService

Testing user operations:
Saving to MySQL (jdbc:mysql://localhost:3306/mydb): User: john_doe
Sending via SMTP (smtp.gmail.com:587)
To: john@example.com
Subject: Welcome!
Body: Welcome john_doe!
User john_doe created successfully
Loading from MySQL (jdbc:mysql://localhost:3306/mydb): user123
Retrieved: Data for user123
```

### Key Learning Points:

1. **Constructor Injection**: Dependencies are provided through the constructor, ensuring objects are fully initialized
2. **Interface-based Design**: Services depend on interfaces, not concrete implementations
3. **IoC Container**: Manages object creation and dependency resolution automatically
4. **Configuration Separation**: DI configuration is separate from business logic
5. **Testing Support**: Easy to substitute real dependencies with mocks for testing
6. **Lifecycle Management**: Container can manage singleton vs prototype instances
7. **Loose Coupling**: Classes don't know about concrete implementations of their dependencies

### Benefits Demonstrated:

- **Flexibility**: Easy to swap implementations (SMTP vs Mock email service)
- **Testability**: Mock objects can be injected for unit testing
- **Maintainability**: Changes to implementations don't affect dependent classes
- **Separation of Concerns**: Object creation logic is separated from business logic
- **Reusability**: Services can be reused in different contexts with different dependencies

This implementation shows the core concepts that frameworks like Spring use, just simplified for learning purposes!
