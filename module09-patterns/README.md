# Module 9: Design Patterns

## 📋 Overview
Master essential design patterns commonly used in Java and Spring Framework development.

## 🎯 Learning Objectives
- Understand and apply creational patterns
- Master structural patterns for better code organization
- Apply behavioral patterns for flexible object interaction
- Recognize pattern usage in Spring Framework

## 🏗️ Creational Patterns

### Singleton Pattern
```java
// Thread-safe singleton
public class ConfigurationManager {
    private static volatile ConfigurationManager instance;
    private final Properties properties;
    
    private ConfigurationManager() {
        properties = new Properties();
        loadConfiguration();
    }
    
    public static ConfigurationManager getInstance() {
        if (instance == null) {
            synchronized (ConfigurationManager.class) {
                if (instance == null) {
                    instance = new ConfigurationManager();
                }
            }
        }
        return instance;
    }
    
    // Enum singleton (preferred approach)
    public enum DatabaseConnection {
        INSTANCE;
        
        public void connect() {
            // Connection logic
        }
    }
    
    private void loadConfiguration() {
        // Load configuration
    }
}
```

### Factory Pattern
```java
// Abstract Factory
public interface PaymentProcessorFactory {
    PaymentProcessor createProcessor();
    PaymentValidator createValidator();
}

public class CreditCardFactory implements PaymentProcessorFactory {
    @Override
    public PaymentProcessor createProcessor() {
        return new CreditCardProcessor();
    }
    
    @Override
    public PaymentValidator createValidator() {
        return new CreditCardValidator();
    }
}

// Factory Method in Spring
@Component
public class NotificationFactory {
    
    public NotificationSender createSender(NotificationType type) {
        switch (type) {
            case EMAIL:
                return new EmailSender();
            case SMS:
                return new SmsSender();
            case PUSH:
                return new PushNotificationSender();
            default:
                throw new IllegalArgumentException("Unknown notification type: " + type);
        }
    }
}
```

### Builder Pattern
```java
public class User {
    private final String username;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final boolean active;
    private final List<String> roles;
    
    private User(Builder builder) {
        this.username = builder.username;
        this.email = builder.email;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.active = builder.active;
        this.roles = Collections.unmodifiableList(builder.roles);
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private boolean active = true;
        private List<String> roles = new ArrayList<>();
        
        public Builder username(String username) {
            this.username = username;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public Builder active(boolean active) {
            this.active = active;
            return this;
        }
        
        public Builder addRole(String role) {
            this.roles.add(role);
            return this;
        }
        
        public User build() {
            if (username == null || email == null) {
                throw new IllegalStateException("Username and email are required");
            }
            return new User(this);
        }
    }
}

// Usage
User user = User.builder()
    .username("john_doe")
    .email("john@example.com")
    .firstName("John")
    .lastName("Doe")
    .addRole("USER")
    .addRole("ADMIN")
    .build();
```

## 🏗️ Structural Patterns

### Adapter Pattern
```java
// Legacy system interface
public class LegacyUserService {
    public LegacyUser getUserById(int id) {
        return new LegacyUser();
    }
}

// New system interface
public interface UserService {
    User findById(Long id);
}

// Adapter
@Service
public class LegacyUserServiceAdapter implements UserService {
    private final LegacyUserService legacyService;
    
    public LegacyUserServiceAdapter(LegacyUserService legacyService) {
        this.legacyService = legacyService;
    }
    
    @Override
    public User findById(Long id) {
        LegacyUser legacyUser = legacyService.getUserById(id.intValue());
        return convertToNewUser(legacyUser);
    }
    
    private User convertToNewUser(LegacyUser legacyUser) {
        return User.builder()
            .username(legacyUser.getName())
            .email(legacyUser.getEmailAddress())
            .build();
    }
}
```

### Decorator Pattern
```java
// Base interface
public interface NotificationSender {
    void send(String message, String recipient);
}

// Basic implementation
public class BasicNotificationSender implements NotificationSender {
    @Override
    public void send(String message, String recipient) {
        System.out.println("Sending: " + message + " to " + recipient);
    }
}

// Decorators
public class EncryptedNotificationSender implements NotificationSender {
    private final NotificationSender wrapped;
    
    public EncryptedNotificationSender(NotificationSender wrapped) {
        this.wrapped = wrapped;
    }
    
    @Override
    public void send(String message, String recipient) {
        String encryptedMessage = encrypt(message);
        wrapped.send(encryptedMessage, recipient);
    }
    
    private String encrypt(String message) {
        return "ENCRYPTED(" + message + ")";
    }
}

public class LoggingNotificationSender implements NotificationSender {
    private final NotificationSender wrapped;
    
    public LoggingNotificationSender(NotificationSender wrapped) {
        this.wrapped = wrapped;
    }
    
    @Override
    public void send(String message, String recipient) {
        System.out.println("LOG: Sending notification to " + recipient);
        wrapped.send(message, recipient);
        System.out.println("LOG: Notification sent successfully");
    }
}

// Usage
NotificationSender sender = new LoggingNotificationSender(
    new EncryptedNotificationSender(
        new BasicNotificationSender()
    )
);
```

## 🎭 Behavioral Patterns

### Observer Pattern
```java
// Event system
public interface EventListener<T> {
    void handle(T event);
}

@Component
public class EventPublisher {
    private final Map<Class<?>, List<EventListener<?>>> listeners = new ConcurrentHashMap<>();
    
    @SuppressWarnings("unchecked")
    public <T> void subscribe(Class<T> eventType, EventListener<T> listener) {
        listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
    }
    
    @SuppressWarnings("unchecked")
    public <T> void publish(T event) {
        List<EventListener<?>> eventListeners = listeners.get(event.getClass());
        if (eventListeners != null) {
            for (EventListener<?> listener : eventListeners) {
                ((EventListener<T>) listener).handle(event);
            }
        }
    }
}

// Usage
@Component
public class UserEventHandler implements EventListener<UserCreatedEvent> {
    @Override
    public void handle(UserCreatedEvent event) {
        // Handle user creation
    }
}
```

### Strategy Pattern
```java
// Strategy interface
public interface PricingStrategy {
    BigDecimal calculatePrice(Order order);
}

// Concrete strategies
@Component
public class RegularPricingStrategy implements PricingStrategy {
    @Override
    public BigDecimal calculatePrice(Order order) {
        return order.getBasePrice();
    }
}

@Component
public class PremiumPricingStrategy implements PricingStrategy {
    @Override
    public BigDecimal calculatePrice(Order order) {
        return order.getBasePrice().multiply(BigDecimal.valueOf(0.9)); // 10% discount
    }
}

// Context
@Service
public class OrderService {
    private final Map<CustomerType, PricingStrategy> strategies;
    
    public OrderService(List<PricingStrategy> pricingStrategies) {
        this.strategies = Map.of(
            CustomerType.REGULAR, findStrategy(pricingStrategies, RegularPricingStrategy.class),
            CustomerType.PREMIUM, findStrategy(pricingStrategies, PremiumPricingStrategy.class)
        );
    }
    
    public BigDecimal calculateOrderPrice(Order order, CustomerType customerType) {
        PricingStrategy strategy = strategies.get(customerType);
        return strategy.calculatePrice(order);
    }
    
    private PricingStrategy findStrategy(List<PricingStrategy> strategies, Class<?> type) {
        return strategies.stream()
            .filter(type::isInstance)
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("Strategy not found: " + type));
    }
}
```

### Command Pattern
```java
// Command interface
public interface Command {
    void execute();
    void undo();
}

// Concrete commands
public class CreateUserCommand implements Command {
    private final UserService userService;
    private final CreateUserRequest request;
    private User createdUser;
    
    public CreateUserCommand(UserService userService, CreateUserRequest request) {
        this.userService = userService;
        this.request = request;
    }
    
    @Override
    public void execute() {
        createdUser = userService.createUser(request);
    }
    
    @Override
    public void undo() {
        if (createdUser != null) {
            userService.deleteUser(createdUser.getId());
        }
    }
}

// Command processor
@Service
public class CommandProcessor {
    private final Stack<Command> history = new Stack<>();
    
    public void execute(Command command) {
        command.execute();
        history.push(command);
    }
    
    public void undo() {
        if (!history.isEmpty()) {
            Command command = history.pop();
            command.undo();
        }
    }
}
```

## 🌸 Spring Framework Patterns

### Template Method (Spring Template Classes)
```java
// Spring's JdbcTemplate uses Template Method pattern
@Repository
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;
    
    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public List<User> findAll() {
        return jdbcTemplate.query(
            "SELECT * FROM users",
            (rs, rowNum) -> new User(
                rs.getString("username"),
                rs.getString("email")
            )
        );
    }
}

// Custom template example
public abstract class ProcessingTemplate<T> {
    
    public final T process(T input) {
        T validated = validate(input);
        T transformed = transform(validated);
        T enriched = enrich(transformed);
        return finalize(enriched);
    }
    
    protected abstract T validate(T input);
    protected abstract T transform(T input);
    
    protected T enrich(T input) {
        return input; // Default implementation
    }
    
    protected T finalize(T input) {
        return input; // Default implementation
    }
}
```

### Dependency Injection (IoC Pattern)
```java
// Spring's IoC container manages object creation and dependencies
@Service
public class OrderService {
    private final UserService userService;
    private final PaymentService paymentService;
    private final InventoryService inventoryService;
    
    // Constructor injection
    public OrderService(UserService userService, 
                       PaymentService paymentService,
                       InventoryService inventoryService) {
        this.userService = userService;
        this.paymentService = paymentService;
        this.inventoryService = inventoryService;
    }
    
    public Order createOrder(CreateOrderRequest request) {
        User user = userService.findById(request.getUserId());
        // Order creation logic
        return new Order();
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Implement a plugin system using Factory and Strategy patterns
2. Create a caching decorator for service methods
3. Build a workflow engine using Command and Observer patterns
4. Design a configuration system using Builder and Singleton patterns

---
**Next Module**: [JVM & Memory Management](../module10-jvm/README.md)
