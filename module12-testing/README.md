# Module 12: Testing Fundamentals

## 📋 Overview
Master testing principles and frameworks essential for robust Spring application development.

## 🎯 Learning Objectives
- Understand testing pyramid and strategies
- Master JUnit 5 and testing frameworks
- Apply mocking and stubbing techniques
- Write effective unit, integration, and end-to-end tests

## 📚 Testing Fundamentals

### Testing Pyramid
```java
/**
 * Testing Pyramid (Bottom to Top):
 * 
 * 1. Unit Tests (70%)
 *    - Fast, isolated, focused
 *    - Test individual methods/classes
 *    - Mock external dependencies
 * 
 * 2. Integration Tests (20%)
 *    - Test component interactions
 *    - Use real implementations
 *    - Test data persistence, external APIs
 * 
 * 3. End-to-End Tests (10%)
 *    - Test complete user workflows
 *    - Use real environment
 *    - Slowest but most comprehensive
 */
```

### JUnit 5 Fundamentals
```java
@DisplayName("User Service Tests")
class UserServiceTest {
    
    private UserService userService;
    private UserRepository userRepository;
    private EmailService emailService;
    
    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        emailService = mock(EmailService.class);
        userService = new UserService(userRepository, emailService);
    }
    
    @Test
    @DisplayName("Should create user with valid data")
    void shouldCreateUserWithValidData() {
        // Given
        CreateUserRequest request = new CreateUserRequest("john_doe", "john@example.com");
        User expectedUser = new User("john_doe", "john@example.com");
        
        when(userRepository.save(any(User.class))).thenReturn(expectedUser);
        
        // When
        User actualUser = userService.createUser(request);
        
        // Then
        assertThat(actualUser.getUsername()).isEqualTo("john_doe");
        assertThat(actualUser.getEmail()).isEqualTo("john@example.com");
        
        verify(userRepository).save(any(User.class));
        verify(emailService).sendWelcomeEmail("john@example.com");
    }
    
    @Test
    @DisplayName("Should throw exception for duplicate username")
    void shouldThrowExceptionForDuplicateUsername() {
        // Given
        CreateUserRequest request = new CreateUserRequest("existing_user", "new@example.com");
        
        when(userRepository.existsByUsername("existing_user")).thenReturn(true);
        
        // When & Then
        assertThatThrownBy(() -> userService.createUser(request))
            .isInstanceOf(UserAlreadyExistsException.class)
            .hasMessageContaining("existing_user");
        
        verify(userRepository, never()).save(any());
        verify(emailService, never()).sendWelcomeEmail(anyString());
    }
    
    @ParameterizedTest
    @ValueSource(strings = {"", " ", "a", "verylongusernamethatexceedslimit"})
    @DisplayName("Should reject invalid usernames")
    void shouldRejectInvalidUsernames(String invalidUsername) {
        // Given
        CreateUserRequest request = new CreateUserRequest(invalidUsername, "test@example.com");
        
        // When & Then
        assertThatThrownBy(() -> userService.createUser(request))
            .isInstanceOf(ValidationException.class);
    }
    
    @ParameterizedTest
    @CsvSource({
        "john, john@example.com, true",
        "jane, jane@test.org, true",
        "invalid, notanemail, false",
        "user, user@, false"
    })
    @DisplayName("Should validate email formats")
    void shouldValidateEmailFormats(String username, String email, boolean shouldSucceed) {
        // Given
        CreateUserRequest request = new CreateUserRequest(username, email);
        
        if (shouldSucceed) {
            when(userRepository.save(any(User.class))).thenReturn(new User(username, email));
        }
        
        // When & Then
        if (shouldSucceed) {
            assertThatNoException().isThrownBy(() -> userService.createUser(request));
        } else {
            assertThatThrownBy(() -> userService.createUser(request))
                .isInstanceOf(ValidationException.class);
        }
    }
    
    @Test
    @Timeout(value = 5, unit = TimeUnit.SECONDS)
    @DisplayName("Should complete user creation within timeout")
    void shouldCompleteUserCreationWithinTimeout() {
        // Test for performance requirements
        CreateUserRequest request = new CreateUserRequest("john", "john@example.com");
        when(userRepository.save(any(User.class))).thenReturn(new User("john", "john@example.com"));
        
        assertThatNoException().isThrownBy(() -> userService.createUser(request));
    }
    
    @Nested
    @DisplayName("User search operations")
    class UserSearchTests {
        
        @Test
        @DisplayName("Should find user by email")
        void shouldFindUserByEmail() {
            // Given
            String email = "john@example.com";
            User expectedUser = new User("john", email);
            
            when(userRepository.findByEmail(email)).thenReturn(Optional.of(expectedUser));
            
            // When
            Optional<User> actualUser = userService.findByEmail(email);
            
            // Then
            assertThat(actualUser).isPresent();
            assertThat(actualUser.get().getEmail()).isEqualTo(email);
        }
        
        @Test
        @DisplayName("Should return empty for non-existent email")
        void shouldReturnEmptyForNonExistentEmail() {
            // Given
            String email = "nonexistent@example.com";
            
            when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
            
            // When
            Optional<User> actualUser = userService.findByEmail(email);
            
            // Then
            assertThat(actualUser).isEmpty();
        }
    }
}
```

## 🧪 Mocking and Stubbing

### Advanced Mockito Usage
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PaymentService paymentService;
    
    @Mock
    private EmailService emailService;
    
    @Spy
    private OrderValidator orderValidator = new OrderValidator();
    
    @InjectMocks
    private OrderService orderService;
    
    @Captor
    private ArgumentCaptor<Order> orderCaptor;
    
    @Test
    void shouldProcessOrderWithCorrectFlow() {
        // Given
        Long userId = 1L;
        User user = new User("john", "john@example.com");
        CreateOrderRequest request = new CreateOrderRequest(userId, 
            List.of(new OrderItem("item1", 2), new OrderItem("item2", 1)));
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(paymentService.processPayment(any(PaymentRequest.class)))
            .thenReturn(PaymentResult.success("txn-123"));
        
        // When
        Order result = orderService.createOrder(request);
        
        // Then
        verify(userRepository).findById(userId);
        verify(paymentService).processPayment(argThat(payment -> 
            payment.getAmount().compareTo(BigDecimal.valueOf(30.0)) == 0));
        
        verify(emailService).sendOrderConfirmation(eq(user.getEmail()), orderCaptor.capture());
        
        Order capturedOrder = orderCaptor.getValue();
        assertThat(capturedOrder.getItems()).hasSize(2);
        assertThat(capturedOrder.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }
    
    @Test
    void shouldRetryPaymentOnTransientFailure() {
        // Given
        User user = new User("john", "john@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Mock transient failure then success
        when(paymentService.processPayment(any()))
            .thenThrow(new TransientPaymentException("Network error"))
            .thenReturn(PaymentResult.success("txn-456"));
        
        CreateOrderRequest request = new CreateOrderRequest(1L, 
            List.of(new OrderItem("item1", 1)));
        
        // When
        Order result = orderService.createOrder(request);
        
        // Then
        verify(paymentService, times(2)).processPayment(any());
        assertThat(result.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }
    
    @Test
    void shouldCallRealMethodOnSpy() {
        // Given
        CreateOrderRequest request = new CreateOrderRequest(1L, List.of());
        
        // When calling real method on spy
        doCallRealMethod().when(orderValidator).validate(request);
        
        // Then real validation logic is executed
        assertThatThrownBy(() -> orderValidator.validate(request))
            .isInstanceOf(ValidationException.class)
            .hasMessageContaining("Order items cannot be empty");
    }
}
```

### Custom Argument Matchers
```java
public class CustomMatchers {
    
    public static User userWithEmail(String email) {
        return argThat(user -> user != null && email.equals(user.getEmail()));
    }
    
    public static PaymentRequest paymentGreaterThan(BigDecimal amount) {
        return argThat(payment -> payment.getAmount().compareTo(amount) > 0);
    }
    
    public static <T> Collection<T> collectionOfSize(int expectedSize) {
        return argThat(collection -> collection != null && collection.size() == expectedSize);
    }
}

// Usage in tests
@Test
void shouldUseCustomMatchers() {
    // Given
    CreateUserRequest request = new CreateUserRequest("john", "john@example.com");
    
    when(userRepository.save(userWithEmail("john@example.com")))
        .thenReturn(new User("john", "john@example.com"));
    
    // When
    userService.createUser(request);
    
    // Then
    verify(userRepository).save(userWithEmail("john@example.com"));
}
```

## 🌸 Spring Testing

### Spring Boot Test Slices
```java
// Test only web layer
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void shouldCreateUserSuccessfully() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest("john", "john@example.com");
        User createdUser = new User("john", "john@example.com");
        
        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(createdUser);
        
        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "john",
                        "email": "john@example.com"
                    }
                    """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("john"))
                .andExpect(jsonPath("$.email").value("john@example.com"));
        
        verify(userService).createUser(any(CreateUserRequest.class));
    }
    
    @Test
    void shouldReturnValidationErrorForInvalidInput() throws Exception {
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "username": "",
                        "email": "invalid-email"
                    }
                    """))
                .andExpect(status().isBadRequest())
                .andExpected(jsonPath("$.errors").isArray())
                .andExpected(jsonPath("$.errors", hasSize(2)));
    }
}

// Test only data layer
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldFindUserByEmail() {
        // Given
        User user = new User("john", "john@example.com");
        entityManager.persistAndFlush(user);
        
        // When
        Optional<User> found = userRepository.findByEmail("john@example.com");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("john");
    }
    
    @Test
    void shouldReturnEmptyForNonExistentEmail() {
        // When
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        
        // Then
        assertThat(found).isEmpty();
    }
}
```

### Integration Tests
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class UserServiceIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Test
    @Transactional
    @Rollback
    void shouldCreateUserEndToEnd() {
        // Given
        CreateUserRequest request = new CreateUserRequest("john", "john@example.com");
        
        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users", 
            request, 
            User.class
        );
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getUsername()).isEqualTo("john");
        
        // Verify persistence
        Optional<User> savedUser = userRepository.findByEmail("john@example.com");
        assertThat(savedUser).isPresent();
    }
    
    @Test
    void shouldRejectDuplicateUsers() {
        // Given
        User existingUser = new User("existing", "existing@example.com");
        userRepository.save(existingUser);
        
        CreateUserRequest request = new CreateUserRequest("existing", "new@example.com");
        
        // When
        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
            "/api/users", 
            request, 
            ErrorResponse.class
        );
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody().getErrorCode()).isEqualTo("USER_ALREADY_EXISTS");
    }
}
```

## 🧪 Test Data Management

### Test Data Builders
```java
public class UserTestDataBuilder {
    private String username = "defaultuser";
    private String email = "default@example.com";
    private boolean active = true;
    private List<String> roles = new ArrayList<>();
    
    public static UserTestDataBuilder aUser() {
        return new UserTestDataBuilder();
    }
    
    public UserTestDataBuilder withUsername(String username) {
        this.username = username;
        return this;
    }
    
    public UserTestDataBuilder withEmail(String email) {
        this.email = email;
        return this;
    }
    
    public UserTestDataBuilder inactive() {
        this.active = false;
        return this;
    }
    
    public UserTestDataBuilder withRole(String role) {
        this.roles.add(role);
        return this;
    }
    
    public User build() {
        return User.builder()
            .username(username)
            .email(email)
            .active(active)
            .roles(roles)
            .build();
    }
    
    public CreateUserRequest buildRequest() {
        return new CreateUserRequest(username, email);
    }
}

// Usage in tests
@Test
void shouldProcessActiveUser() {
    // Given
    User user = aUser()
        .withUsername("john")
        .withEmail("john@example.com")
        .withRole("USER")
        .build();
    
    // Test logic...
}

@Test
void shouldRejectInactiveUser() {
    // Given
    User user = aUser()
        .withUsername("inactive")
        .inactive()
        .build();
    
    // Test logic...
}
```

### Test Fixtures and Data
```java
@Component
@TestComponent
public class TestDataFixtures {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    public User createTestUser(String username, String email) {
        User user = new User(username, email);
        return userRepository.save(user);
    }
    
    public Order createTestOrder(User user, String... items) {
        List<OrderItem> orderItems = Arrays.stream(items)
            .map(item -> new OrderItem(item, 1))
            .collect(Collectors.toList());
        
        Order order = new Order(user, orderItems);
        return orderRepository.save(order);
    }
    
    public void cleanupTestData() {
        orderRepository.deleteAll();
        userRepository.deleteAll();
    }
}

// Usage in integration tests
@SpringBootTest
class OrderIntegrationTest {
    
    @Autowired
    private TestDataFixtures fixtures;
    
    @Autowired
    private OrderService orderService;
    
    @AfterEach
    void cleanup() {
        fixtures.cleanupTestData();
    }
    
    @Test
    void shouldProcessExistingUserOrder() {
        // Given
        User user = fixtures.createTestUser("john", "john@example.com");
        
        // When
        Order order = orderService.createOrder(new CreateOrderRequest(
            user.getId(), 
            List.of(new OrderItem("item1", 2))
        ));
        
        // Then
        assertThat(order.getUser()).isEqualTo(user);
    }
}
```

## 🏃‍♂️ Testing Best Practices

### Test Organization
```java
// Good test structure: AAA Pattern
@Test
@DisplayName("Should calculate total price with discount")
void shouldCalculateTotalPriceWithDiscount() {
    // Arrange (Given)
    Order order = new Order();
    order.addItem(new OrderItem("item1", 2, BigDecimal.valueOf(10.00)));
    order.addItem(new OrderItem("item2", 1, BigDecimal.valueOf(15.00)));
    
    DiscountService discountService = new DiscountService();
    PriceCalculator calculator = new PriceCalculator(discountService);
    
    // Act (When)
    BigDecimal totalPrice = calculator.calculateTotal(order, BigDecimal.valueOf(0.10));
    
    // Assert (Then)
    assertThat(totalPrice).isEqualByComparingTo(BigDecimal.valueOf(31.50)); // 35 - 10% = 31.50
}

// Test naming conventions
@Test
void should_ThrowException_When_UserNotFound() { /* ... */ }

@Test 
void givenInvalidEmail_whenCreatingUser_thenThrowsValidationException() { /* ... */ }

@Test
@DisplayName("Given invalid email when creating user then throws validation exception")
void testUserCreationWithInvalidEmail() { /* ... */ }
```

### Common Testing Pitfalls
```java
public class TestingAntiPatterns {
    
    // AVOID: Testing implementation details
    @Test
    void badTest_TestsImplementationDetails() {
        UserService service = new UserService(userRepository, emailService);
        
        service.createUser(request);
        
        // Bad: Testing internal method calls
        verify(service, times(1)).validateUser(any());
        verify(service, times(1)).hashPassword(any());
    }
    
    // GOOD: Test behavior, not implementation
    @Test
    void goodTest_TestsBehavior() {
        UserService service = new UserService(userRepository, emailService);
        
        User result = service.createUser(request);
        
        // Good: Testing observable behavior
        assertThat(result.getUsername()).isEqualTo(request.getUsername());
        verify(emailService).sendWelcomeEmail(request.getEmail());
    }
    
    // AVOID: Overly complex tests
    @Test
    void badTest_TooComplex() {
        // Tests multiple scenarios in one test
        // Hard to understand what's being tested
        // Difficult to debug when it fails
    }
    
    // GOOD: Simple, focused tests
    @Test
    void goodTest_Simple() {
        // Tests one specific scenario
        // Clear what's being tested
        // Easy to debug
    }
}
```

## 📊 Testing Metrics and Coverage

```java
// Example test configuration for coverage
// build.gradle
plugins {
    id 'jacoco'
}

jacoco {
    toolVersion = "0.8.7"
}

jacocoTestReport {
    reports {
        xml.enabled false
        csv.enabled false
        html.destination file("${buildDir}/jacocoHtml")
    }
}

test {
    useJUnitPlatform()
    finalizedBy jacocoTestReport
}

jacocoTestCoverageVerification {
    violationRules {
        rule {
            limit {
                minimum = 0.80 // 80% coverage minimum
            }
        }
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Write comprehensive tests for a service class using all JUnit 5 features
2. Create integration tests using Testcontainers
3. Implement custom assertion methods for domain objects
4. Build a test data factory for complex object graphs

## 📊 Testing Strategy Summary

| Test Type | Scope | Speed | Cost | Confidence |
|-----------|-------|-------|------|------------|
| **Unit** | Single class/method | Fast | Low | Medium |
| **Integration** | Multiple components | Medium | Medium | High |
| **End-to-End** | Complete workflow | Slow | High | Very High |

### Test Characteristics
- **Fast**: Tests should run quickly
- **Independent**: Tests shouldn't depend on each other
- **Repeatable**: Same result every time
- **Self-validating**: Clear pass/fail result
- **Timely**: Written close to production code

---

## 🎉 Congratulations!

You've completed all 12 modules of the Java Core Principles guide! You now have a solid foundation to master Spring Framework development. 

### Next Steps:
1. Practice the exercises in each module
2. Build a complete project using these concepts
3. Explore Spring Framework documentation
4. Start with Spring Boot and gradually move to advanced Spring features

Remember: **Mastery comes through practice and application of these principles in real-world projects.**
