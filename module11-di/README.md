# Module 11: Dependency Injection Concepts

## 📋 Overview
Master dependency injection principles and IoC patterns that form the foundation of Spring Framework.

## 🎯 Learning Objectives
- Understand IoC and DI principles
- Master different injection types and patterns
- Apply dependency injection best practices
- Prepare for Spring Framework mastery

## 📚 IoC and DI Fundamentals

### Without Dependency Injection (Tight Coupling)
```java
// BAD: Tight coupling, hard to test and maintain
public class OrderService {
    private UserRepository userRepository;
    private PaymentService paymentService;
    private EmailService emailService;
    
    public OrderService() {
        // Hard-coded dependencies
        this.userRepository = new DatabaseUserRepository();
        this.paymentService = new CreditCardPaymentService();
        this.emailService = new SmtpEmailService();
    }
    
    public Order createOrder(CreateOrderRequest request) {
        User user = userRepository.findById(request.getUserId());
        boolean paymentSuccessful = paymentService.processPayment(request.getPayment());
        
        if (paymentSuccessful) {
            Order order = new Order(user, request.getItems());
            emailService.sendOrderConfirmation(user.getEmail(), order);
            return order;
        }
        
        throw new PaymentFailedException("Payment processing failed");
    }
}
```

### With Dependency Injection (Loose Coupling)
```java
// GOOD: Loose coupling, testable, maintainable
public class OrderService {
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final EmailService emailService;
    
    // Constructor injection
    public OrderService(UserRepository userRepository,
                       PaymentService paymentService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.paymentService = paymentService;
        this.emailService = emailService;
    }
    
    public Order createOrder(CreateOrderRequest request) {
        User user = userRepository.findById(request.getUserId());
        boolean paymentSuccessful = paymentService.processPayment(request.getPayment());
        
        if (paymentSuccessful) {
            Order order = new Order(user, request.getItems());
            emailService.sendOrderConfirmation(user.getEmail(), order);
            return order;
        }
        
        throw new PaymentFailedException("Payment processing failed");
    }
}
```

## 🔧 Injection Types

### Constructor Injection (Recommended)
```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final UserValidator userValidator;
    
    // All dependencies are required and immutable
    public UserService(UserRepository userRepository,
                      EmailService emailService,
                      UserValidator userValidator) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.userValidator = userValidator;
    }
    
    public User createUser(CreateUserRequest request) {
        userValidator.validate(request);
        
        User user = new User(request.getUsername(), request.getEmail());
        User savedUser = userRepository.save(user);
        
        emailService.sendWelcomeEmail(savedUser.getEmail());
        return savedUser;
    }
}
```

### Setter Injection (Optional Dependencies)
```java
@Service
public class NotificationService {
    private EmailService emailService;
    private SmsService smsService;
    private PushNotificationService pushService;
    
    // Optional dependencies with defaults
    @Autowired(required = false)
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @Autowired(required = false)
    public void setSmsService(SmsService smsService) {
        this.smsService = smsService;
    }
    
    @Autowired(required = false)
    public void setPushService(PushNotificationService pushService) {
        this.pushService = pushService;
    }
    
    public void sendNotification(String message, String recipient, NotificationType type) {
        switch (type) {
            case EMAIL:
                if (emailService != null) {
                    emailService.send(recipient, message);
                }
                break;
            case SMS:
                if (smsService != null) {
                    smsService.send(recipient, message);
                }
                break;
            case PUSH:
                if (pushService != null) {
                    pushService.send(recipient, message);
                }
                break;
        }
    }
}
```

### Field Injection (Not Recommended for Production)
```java
@Service
public class ExampleService {
    @Autowired
    private UserRepository userRepository; // Hard to test
    
    @Autowired
    private EmailService emailService; // Dependencies not explicit
    
    // Prefer constructor injection instead
}
```

## 🏭 IoC Container Implementation

### Simple DI Container
```java
public class SimpleDIContainer {
    private final Map<Class<?>, Object> services = new HashMap<>();
    private final Map<Class<?>, Class<?>> serviceTypes = new HashMap<>();
    
    // Register service implementation
    public <T> void register(Class<T> serviceInterface, Class<? extends T> implementation) {
        serviceTypes.put(serviceInterface, implementation);
    }
    
    // Register singleton instance
    public <T> void registerInstance(Class<T> serviceInterface, T instance) {
        services.put(serviceInterface, instance);
    }
    
    // Resolve service with dependency injection
    @SuppressWarnings("unchecked")
    public <T> T resolve(Class<T> serviceInterface) {
        // Return existing instance if available
        T instance = (T) services.get(serviceInterface);
        if (instance != null) {
            return instance;
        }
        
        // Get implementation class
        Class<?> implementationClass = serviceTypes.get(serviceInterface);
        if (implementationClass == null) {
            throw new IllegalArgumentException("Service not registered: " + serviceInterface);
        }
        
        // Create instance with dependency injection
        instance = (T) createInstance(implementationClass);
        services.put(serviceInterface, instance);
        
        return instance;
    }
    
    private Object createInstance(Class<?> implementationClass) {
        try {
            Constructor<?>[] constructors = implementationClass.getConstructors();
            Constructor<?> constructor = constructors[0]; // Use first constructor
            
            Class<?>[] parameterTypes = constructor.getParameterTypes();
            Object[] parameters = new Object[parameterTypes.length];
            
            // Resolve constructor dependencies
            for (int i = 0; i < parameterTypes.length; i++) {
                parameters[i] = resolve(parameterTypes[i]);
            }
            
            return constructor.newInstance(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create instance of " + implementationClass, e);
        }
    }
}

// Usage example
public class DIContainerExample {
    public void demonstrateContainer() {
        SimpleDIContainer container = new SimpleDIContainer();
        
        // Register services
        container.register(UserRepository.class, DatabaseUserRepository.class);
        container.register(EmailService.class, SmtpEmailService.class);
        container.register(UserService.class, UserServiceImpl.class);
        
        // Resolve service - dependencies are automatically injected
        UserService userService = container.resolve(UserService.class);
        
        // Use the service
        CreateUserRequest request = new CreateUserRequest("john", "john@example.com");
        User user = userService.createUser(request);
    }
}
```

### Bean Lifecycle Management
```java
public interface BeanLifecycle {
    void init();
    void destroy();
}

public class LifecycleAwareDIContainer extends SimpleDIContainer {
    private final List<Object> managedBeans = new ArrayList<>();
    
    @Override
    protected Object createInstance(Class<?> implementationClass) {
        Object instance = super.createInstance(implementationClass);
        
        // Initialize bean if it implements lifecycle interface
        if (instance instanceof BeanLifecycle) {
            ((BeanLifecycle) instance).init();
        }
        
        managedBeans.add(instance);
        return instance;
    }
    
    public void shutdown() {
        // Destroy beans in reverse order
        for (int i = managedBeans.size() - 1; i >= 0; i--) {
            Object bean = managedBeans.get(i);
            if (bean instanceof BeanLifecycle) {
                ((BeanLifecycle) bean).destroy();
            }
        }
        managedBeans.clear();
    }
}
```

## 🎯 DI Patterns and Best Practices

### Service Locator Pattern (Anti-pattern)
```java
// AVOID: Service Locator - creates hidden dependencies
public class ServiceLocator {
    private static final Map<Class<?>, Object> services = new HashMap<>();
    
    @SuppressWarnings("unchecked")
    public static <T> T getService(Class<T> serviceClass) {
        return (T) services.get(serviceClass);
    }
    
    public static void registerService(Class<?> serviceClass, Object service) {
        services.put(serviceClass, service);
    }
}

// BAD: Hidden dependency on ServiceLocator
public class OrderServiceBad {
    public Order createOrder(CreateOrderRequest request) {
        // Hidden dependencies - hard to test
        UserRepository userRepo = ServiceLocator.getService(UserRepository.class);
        PaymentService paymentService = ServiceLocator.getService(PaymentService.class);
        
        // Business logic...
        return new Order();
    }
}
```

### Factory Pattern with DI
```java
// Factory that uses DI container
@Component
public class PaymentProcessorFactory {
    private final Map<PaymentType, PaymentProcessor> processors;
    
    // Constructor injection of all PaymentProcessor implementations
    public PaymentProcessorFactory(List<PaymentProcessor> processors) {
        this.processors = processors.stream()
            .collect(Collectors.toMap(
                PaymentProcessor::getSupportedType,
                Function.identity()
            ));
    }
    
    public PaymentProcessor getProcessor(PaymentType type) {
        PaymentProcessor processor = processors.get(type);
        if (processor == null) {
            throw new UnsupportedPaymentTypeException("No processor for type: " + type);
        }
        return processor;
    }
}

// Different payment processor implementations
@Component
public class CreditCardProcessor implements PaymentProcessor {
    private final BankService bankService;
    
    public CreditCardProcessor(BankService bankService) {
        this.bankService = bankService;
    }
    
    @Override
    public PaymentType getSupportedType() {
        return PaymentType.CREDIT_CARD;
    }
    
    @Override
    public boolean processPayment(PaymentRequest request) {
        return bankService.chargeCreditCard(request);
    }
}

@Component
public class PayPalProcessor implements PaymentProcessor {
    private final PayPalApiClient payPalClient;
    
    public PayPalProcessor(PayPalApiClient payPalClient) {
        this.payPalClient = payPalClient;
    }
    
    @Override
    public PaymentType getSupportedType() {
        return PaymentType.PAYPAL;
    }
    
    @Override
    public boolean processPayment(PaymentRequest request) {
        return payPalClient.processPayment(request);
    }
}
```

### Configuration and Environment-based Injection
```java
// Configuration-driven service selection
@Configuration
public class PaymentConfiguration {
    
    @Bean
    @ConditionalOnProperty(name = "payment.provider", havingValue = "stripe")
    public PaymentGateway stripePaymentGateway() {
        return new StripePaymentGateway();
    }
    
    @Bean
    @ConditionalOnProperty(name = "payment.provider", havingValue = "paypal")
    public PaymentGateway paypalPaymentGateway() {
        return new PayPalPaymentGateway();
    }
    
    @Bean
    @ConditionalOnMissingBean(PaymentGateway.class)
    public PaymentGateway defaultPaymentGateway() {
        return new MockPaymentGateway();
    }
}

// Environment-specific configurations
@Configuration
@Profile("development")
public class DevelopmentConfig {
    
    @Bean
    public EmailService emailService() {
        return new MockEmailService(); // Don't send real emails in dev
    }
}

@Configuration
@Profile("production")
public class ProductionConfig {
    
    @Bean
    public EmailService emailService() {
        return new SmtpEmailService(); // Real email service in production
    }
}
```

## 🧪 Testing with DI

### Unit Testing with Mocks
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PaymentService paymentService;
    
    @Mock
    private EmailService emailService;
    
    @InjectMocks
    private OrderService orderService;
    
    @Test
    void shouldCreateOrderSuccessfully() {
        // Given
        Long userId = 1L;
        User user = new User("john", "john@example.com");
        CreateOrderRequest request = new CreateOrderRequest(userId, List.of("item1"));
        
        when(userRepository.findById(userId)).thenReturn(user);
        when(paymentService.processPayment(any())).thenReturn(true);
        
        // When
        Order order = orderService.createOrder(request);
        
        // Then
        assertThat(order).isNotNull();
        assertThat(order.getUser()).isEqualTo(user);
        
        verify(emailService).sendOrderConfirmation(user.getEmail(), order);
    }
    
    @Test
    void shouldThrowExceptionWhenPaymentFails() {
        // Given
        Long userId = 1L;
        User user = new User("john", "john@example.com");
        CreateOrderRequest request = new CreateOrderRequest(userId, List.of("item1"));
        
        when(userRepository.findById(userId)).thenReturn(user);
        when(paymentService.processPayment(any())).thenReturn(false);
        
        // When & Then
        assertThatThrownBy(() -> orderService.createOrder(request))
            .isInstanceOf(PaymentFailedException.class);
        
        verify(emailService, never()).sendOrderConfirmation(anyString(), any());
    }
}
```

### Integration Testing
```java
@SpringBootTest
@TestPropertySource(properties = {
    "payment.provider=mock",
    "email.provider=mock"
})
class OrderServiceIntegrationTest {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    @Transactional
    @Rollback
    void shouldCreateOrderEndToEnd() {
        // Given
        User user = new User("john", "john@example.com");
        User savedUser = userRepository.save(user);
        
        CreateOrderRequest request = new CreateOrderRequest(
            savedUser.getId(), 
            List.of("item1", "item2")
        );
        
        // When
        Order order = orderService.createOrder(request);
        
        // Then
        assertThat(order).isNotNull();
        assertThat(order.getUser()).isEqualTo(savedUser);
        assertThat(order.getItems()).hasSize(2);
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Build a simple IoC container with annotation support
2. Create a plugin system using dependency injection
3. Implement different injection strategies (constructor, setter, field)
4. Design a configuration system with environment-specific beans

## 📊 DI vs Service Locator Comparison

| Aspect | Dependency Injection | Service Locator |
|--------|---------------------|-----------------|
| **Dependencies** | Explicit and visible | Hidden |
| **Testing** | Easy to mock | Harder to test |
| **Coupling** | Loose | Tight to locator |
| **Configuration** | External | Internal |
| **Inversion of Control** | True IoC | Not true IoC |

## 🎯 Benefits of Dependency Injection

### ✅ Advantages
- **Testability**: Easy to mock dependencies
- **Flexibility**: Easy to swap implementations
- **Maintainability**: Loose coupling between components
- **Reusability**: Components are more reusable
- **Separation of Concerns**: Clear separation of object creation and business logic

### ⚠️ Considerations
- **Complexity**: Can make simple applications more complex
- **Runtime Errors**: Dependency resolution errors at runtime
- **Performance**: Slight overhead from container management
- **Learning Curve**: Requires understanding of IoC principles

---
**Next Module**: [Testing Fundamentals](../module12-testing/README.md)
