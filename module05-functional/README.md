# Module 5: Functional Programming

## 📋 Overview
Master functional programming concepts in Java, including lambda expressions, streams, and functional interfaces essential for modern Spring development.

## 🎯 Learning Objectives
- Understand functional programming principles
- Master lambda expressions and method references
- Effectively use Stream API for data processing
- Apply functional interfaces in Spring applications
- Write functional-style code for better maintainability

## 📚 Functional Programming Fundamentals

### Core Principles
```java
// Immutability - objects don't change after creation
public final class ImmutableUser {
    private final String username;
    private final String email;
    private final List<String> roles;
    
    public ImmutableUser(String username, String email, List<String> roles) {
        this.username = username;
        this.email = email;
        this.roles = Collections.unmodifiableList(new ArrayList<>(roles));
    }
    
    // Only getters, no setters
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public List<String> getRoles() { return roles; }
    
    // Methods return new instances
    public ImmutableUser withEmail(String newEmail) {
        return new ImmutableUser(username, newEmail, roles);
    }
    
    public ImmutableUser addRole(String role) {
        List<String> newRoles = new ArrayList<>(roles);
        newRoles.add(role);
        return new ImmutableUser(username, email, newRoles);
    }
}

// Pure functions - no side effects, same input always produces same output
public class PureFunctions {
    
    // Pure function - no side effects
    public static int add(int a, int b) {
        return a + b;
    }
    
    // Pure function - doesn't modify input
    public static List<String> toUpperCase(List<String> strings) {
        return strings.stream()
                     .map(String::toUpperCase)
                     .collect(Collectors.toList());
    }
    
    // Impure function - has side effects
    private static int counter = 0;
    public static int impureIncrement() {
        return ++counter; // Modifies external state
    }
    
    // Pure alternative
    public static int increment(int value) {
        return value + 1;
    }
}
```

## 🎭 Lambda Expressions

### Basic Lambda Syntax
```java
public class LambdaBasics {
    
    public void demonstrateLambdaSyntax() {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");
        
        // Traditional anonymous class
        names.sort(new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return a.length() - b.length();
            }
        });
        
        // Lambda expression - shortest form
        names.sort((a, b) -> a.length() - b.length());
        
        // Lambda with explicit types
        names.sort((String a, String b) -> a.length() - b.length());
        
        // Lambda with block body
        names.sort((a, b) -> {
            int lengthDiff = a.length() - b.length();
            if (lengthDiff != 0) {
                return lengthDiff;
            }
            return a.compareTo(b); // Secondary sort by alphabetical order
        });
        
        // Lambda with no parameters
        Runnable task = () -> System.out.println("Hello from lambda!");
        
        // Lambda with single parameter (parentheses optional)
        Consumer<String> printer = name -> System.out.println("Hello, " + name);
        Consumer<String> printerWithParens = (name) -> System.out.println("Hello, " + name);
    }
}
```

### Lambda with Different Functional Interfaces
```java
public class LambdaWithFunctionalInterfaces {
    
    public void demonstrateFunctionalInterfaces() {
        // Predicate<T> - takes T, returns boolean
        Predicate<String> isLongName = name -> name.length() > 5;
        Predicate<Integer> isEven = num -> num % 2 == 0;
        
        // Function<T, R> - takes T, returns R
        Function<String, Integer> stringLength = String::length;
        Function<User, String> userToName = User::getUsername;
        
        // Consumer<T> - takes T, returns void
        Consumer<String> print = System.out::println;
        Consumer<User> activateUser = user -> user.setActive(true);
        
        // Supplier<T> - takes nothing, returns T
        Supplier<String> randomId = () -> UUID.randomUUID().toString();
        Supplier<User> defaultUser = () -> new User("guest", "guest@example.com");
        
        // BinaryOperator<T> - takes two T, returns T
        BinaryOperator<Integer> add = (a, b) -> a + b;
        BinaryOperator<String> concat = (a, b) -> a + " " + b;
        
        // UnaryOperator<T> - takes T, returns T
        UnaryOperator<String> toUpperCase = String::toUpperCase;
        UnaryOperator<Integer> square = x -> x * x;
        
        // BiFunction<T, U, R> - takes T and U, returns R
        BiFunction<String, String, User> createUser = (username, email) -> 
            new User(username, email);
        
        // BiPredicate<T, U> - takes T and U, returns boolean
        BiPredicate<String, String> sameLength = (a, b) -> a.length() == b.length();
    }
    
    // Custom functional interface
    @FunctionalInterface
    public interface Calculator<T> {
        T calculate(T a, T b);
        
        // Default method allowed
        default T multiply(T a, T b) {
            // Implementation would depend on type T
            throw new UnsupportedOperationException("Multiply not implemented");
        }
    }
    
    public void useCustomFunctionalInterface() {
        Calculator<Integer> adder = (a, b) -> a + b;
        Calculator<String> concatenator = (a, b) -> a + b;
        
        Integer sum = adder.calculate(5, 3);        // 8
        String combined = concatenator.calculate("Hello", " World"); // "Hello World"
    }
}
```

## 🔗 Method References

### Types of Method References
```java
public class MethodReferenceExamples {
    
    public void demonstrateMethodReferences() {
        List<String> names = Arrays.asList("alice", "bob", "charlie");
        List<User> users = Arrays.asList(
            new User("john", "john@example.com"),
            new User("jane", "jane@example.com")
        );
        
        // 1. Static method reference
        List<Integer> numbers = Arrays.asList(1, -2, 3, -4, 5);
        numbers.stream()
               .map(Math::abs)  // Static method reference
               .forEach(System.out::println);
        
        // 2. Instance method reference on particular object
        PrintStream out = System.out;
        names.stream()
             .map(String::toUpperCase)
             .forEach(out::println);  // Instance method on particular object
        
        // 3. Instance method reference on arbitrary object
        names.stream()
             .map(String::toUpperCase)  // Instance method on arbitrary object
             .sorted(String::compareToIgnoreCase)
             .forEach(System.out::println);
        
        // 4. Constructor reference
        Supplier<User> userSupplier = User::new;        // Default constructor
        Function<String, User> userCreator = User::new; // Constructor with parameter
        BiFunction<String, String, User> userFactory = User::new; // Constructor with two parameters
        
        // Convert list using constructor reference
        List<UserDto> userDtos = users.stream()
                                     .map(UserDto::new)  // Constructor reference
                                     .collect(Collectors.toList());
    }
    
    // Custom method for method reference
    public static String processName(String name) {
        return name.trim().toLowerCase();
    }
    
    public String instanceProcessName(String name) {
        return name.trim().toUpperCase();
    }
    
    public void useCustomMethodReferences() {
        List<String> names = Arrays.asList(" Alice ", " Bob ", " Charlie ");
        
        // Static method reference
        List<String> processed = names.stream()
                                     .map(MethodReferenceExamples::processName)
                                     .collect(Collectors.toList());
        
        // Instance method reference
        MethodReferenceExamples instance = new MethodReferenceExamples();
        List<String> processedInstance = names.stream()
                                             .map(instance::instanceProcessName)
                                             .collect(Collectors.toList());
    }
}
```

## 🌊 Stream API Deep Dive

### Basic Stream Operations
```java
public class StreamBasics {
    private List<User> users = Arrays.asList(
        new User("john", "john@example.com", 25, "IT"),
        new User("jane", "jane@example.com", 30, "HR"),
        new User("bob", "bob@example.com", 35, "IT"),
        new User("alice", "alice@example.com", 28, "Finance")
    );
    
    public void demonstrateBasicOperations() {
        // Filter - intermediate operation
        List<User> itUsers = users.stream()
                                 .filter(user -> "IT".equals(user.getDepartment()))
                                 .collect(Collectors.toList());
        
        // Map - transform elements
        List<String> usernames = users.stream()
                                     .map(User::getUsername)
                                     .collect(Collectors.toList());
        
        // Sorted - sort elements
        List<User> sortedByAge = users.stream()
                                     .sorted(Comparator.comparing(User::getAge))
                                     .collect(Collectors.toList());
        
        // Distinct - remove duplicates
        List<String> departments = users.stream()
                                       .map(User::getDepartment)
                                       .distinct()
                                       .collect(Collectors.toList());
        
        // Limit and Skip - pagination
        List<User> firstTwoUsers = users.stream()
                                       .limit(2)
                                       .collect(Collectors.toList());
        
        List<User> skipFirstTwo = users.stream()
                                      .skip(2)
                                      .collect(Collectors.toList());
    }
    
    public void demonstrateTerminalOperations() {
        // forEach - side effect operation
        users.stream()
             .filter(user -> user.getAge() > 30)
             .forEach(user -> System.out.println(user.getUsername()));
        
        // collect - accumulate to collection
        Map<String, List<User>> usersByDept = users.stream()
                                                  .collect(Collectors.groupingBy(User::getDepartment));
        
        // reduce - combine elements
        Optional<User> oldestUser = users.stream()
                                        .reduce((u1, u2) -> u1.getAge() > u2.getAge() ? u1 : u2);
        
        // count - count elements
        long itUsersCount = users.stream()
                                .filter(user -> "IT".equals(user.getDepartment()))
                                .count();
        
        // anyMatch, allMatch, noneMatch
        boolean hasITUser = users.stream()
                                .anyMatch(user -> "IT".equals(user.getDepartment()));
        
        boolean allAdults = users.stream()
                                .allMatch(user -> user.getAge() >= 18);
        
        boolean noMinors = users.stream()
                               .noneMatch(user -> user.getAge() < 18);
        
        // findFirst, findAny
        Optional<User> firstITUser = users.stream()
                                         .filter(user -> "IT".equals(user.getDepartment()))
                                         .findFirst();
        
        Optional<User> anyHRUser = users.stream()
                                       .filter(user -> "HR".equals(user.getDepartment()))
                                       .findAny();
    }
}
```

### Advanced Stream Operations
```java
public class AdvancedStreamOperations {
    
    public void demonstrateFlatMap() {
        List<Department> departments = Arrays.asList(
            new Department("IT", Arrays.asList("Java", "Python", "JavaScript")),
            new Department("Marketing", Arrays.asList("SEO", "Content", "Analytics")),
            new Department("Finance", Arrays.asList("Accounting", "Budgeting"))
        );
        
        // FlatMap - flatten nested structures
        List<String> allSkills = departments.stream()
                                           .flatMap(dept -> dept.getSkills().stream())
                                           .distinct()
                                           .collect(Collectors.toList());
        
        // FlatMap with transformation
        List<String> skillsWithDepartment = departments.stream()
                                                      .flatMap(dept -> 
                                                          dept.getSkills().stream()
                                                              .map(skill -> dept.getName() + ": " + skill)
                                                      )
                                                      .collect(Collectors.toList());
    }
    
    public void demonstrateAdvancedCollectors() {
        List<User> users = getUsers();
        
        // Grouping
        Map<String, List<User>> usersByDepartment = users.stream()
                                                        .collect(Collectors.groupingBy(User::getDepartment));
        
        // Grouping with downstream collector
        Map<String, Long> userCountByDepartment = users.stream()
                                                      .collect(Collectors.groupingBy(
                                                          User::getDepartment,
                                                          Collectors.counting()
                                                      ));
        
        // Grouping with multiple levels
        Map<String, Map<Boolean, List<User>>> usersByDeptAndSenior = users.stream()
                                                                          .collect(Collectors.groupingBy(
                                                                              User::getDepartment,
                                                                              Collectors.groupingBy(user -> user.getAge() > 30)
                                                                          ));
        
        // Partitioning (special case of grouping)
        Map<Boolean, List<User>> seniorAndJuniorUsers = users.stream()
                                                            .collect(Collectors.partitioningBy(user -> user.getAge() > 30));
        
        // Custom collectors
        String userSummary = users.stream()
                                 .map(User::getUsername)
                                 .collect(Collectors.joining(", ", "Users: [", "]"));
        
        // Statistics
        IntSummaryStatistics ageStats = users.stream()
                                            .mapToInt(User::getAge)
                                            .summaryStatistics();
        
        System.out.println("Average age: " + ageStats.getAverage());
        System.out.println("Max age: " + ageStats.getMax());
        System.out.println("Min age: " + ageStats.getMin());
    }
    
    public void demonstrateParallelStreams() {
        List<Integer> largeList = IntStream.range(1, 1_000_000)
                                          .boxed()
                                          .collect(Collectors.toList());
        
        // Sequential processing
        long sequentialSum = largeList.stream()
                                     .mapToInt(Integer::intValue)
                                     .sum();
        
        // Parallel processing
        long parallelSum = largeList.parallelStream()
                                   .mapToInt(Integer::intValue)
                                   .sum();
        
        // Custom parallel processing
        long customParallelSum = largeList.stream()
                                         .parallel()  // Convert to parallel
                                         .mapToInt(Integer::intValue)
                                         .sum();
        
        // Be careful with parallel streams and stateful operations
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");
        
        // This might not maintain order in parallel
        List<String> processedNames = names.parallelStream()
                                          .map(String::toLowerCase)
                                          .collect(Collectors.toList());
        
        // To maintain order, use forEachOrdered
        names.parallelStream()
             .map(String::toUpperCase)
             .forEachOrdered(System.out::println);
    }
    
    private List<User> getUsers() {
        return Arrays.asList(
            new User("john", "john@example.com", 25, "IT"),
            new User("jane", "jane@example.com", 35, "HR"),
            new User("bob", "bob@example.com", 32, "IT"),
            new User("alice", "alice@example.com", 28, "Finance")
        );
    }
}
```

### Custom Stream Operations
```java
public class CustomStreamOperations {
    
    // Custom collector example
    public static <T> Collector<T, ?, Optional<T>> toOptional() {
        return Collector.of(
            () -> new ArrayList<T>(),
            List::add,
            (list1, list2) -> { list1.addAll(list2); return list1; },
            list -> list.isEmpty() ? Optional.empty() : Optional.of(list.get(0))
        );
    }
    
    // Custom collector for immutable list
    public static <T> Collector<T, ?, List<T>> toImmutableList() {
        return Collector.of(
            ArrayList::new,
            List::add,
            (list1, list2) -> { list1.addAll(list2); return list1; },
            Collections::unmodifiableList
        );
    }
    
    // Stream utility methods
    public static <T> Stream<T> takeWhile(Stream<T> stream, Predicate<T> predicate) {
        return StreamSupport.stream(
            new Spliterators.AbstractSpliterator<T>(Long.MAX_VALUE, Spliterator.ORDERED) {
                boolean stillGoing = true;
                final Iterator<T> iterator = stream.iterator();
                
                @Override
                public boolean tryAdvance(Consumer<? super T> action) {
                    if (stillGoing && iterator.hasNext()) {
                        T next = iterator.next();
                        if (predicate.test(next)) {
                            action.accept(next);
                            return true;
                        } else {
                            stillGoing = false;
                        }
                    }
                    return false;
                }
            }, false);
    }
    
    public void demonstrateCustomOperations() {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        
        // Using custom collector
        Optional<String> firstNameOpt = names.stream()
                                            .collect(toOptional());
        
        List<String> immutableNames = names.stream()
                                          .map(String::toUpperCase)
                                          .collect(toImmutableList());
        
        // Custom stream operations
        List<Integer> numbers = Arrays.asList(1, 2, 3, 5, 4, 6, 7);
        
        List<Integer> increasing = takeWhile(
            numbers.stream(),
            new Predicate<Integer>() {
                private Integer previous = null;
                
                @Override
                public boolean test(Integer current) {
                    if (previous == null || current > previous) {
                        previous = current;
                        return true;
                    }
                    return false;
                }
            }
        ).collect(Collectors.toList()); // [1, 2, 3, 5]
    }
}
```

## 🌸 Functional Programming in Spring

### Functional Configuration
```java
// Functional style Spring configuration
@Configuration
public class FunctionalConfig {
    
    // Using lambda for bean definition
    @Bean
    public UserValidator userValidator() {
        return user -> {
            List<String> errors = new ArrayList<>();
            
            Optional.ofNullable(user.getUsername())
                   .filter(username -> !username.trim().isEmpty())
                   .orElseGet(() -> {
                       errors.add("Username is required");
                       return null;
                   });
            
            Optional.ofNullable(user.getEmail())
                   .filter(email -> email.contains("@"))
                   .orElseGet(() -> {
                       errors.add("Valid email is required");
                       return null;
                   });
            
            return errors;
        };
    }
    
    // Functional interface for validation
    @FunctionalInterface
    public interface UserValidator {
        List<String> validate(User user);
    }
    
    // Bean with functional processing
    @Bean
    public UserProcessor userProcessor() {
        return users -> users.stream()
                            .filter(User::isActive)
                            .map(this::enrichUser)
                            .collect(Collectors.toList());
    }
    
    @FunctionalInterface
    public interface UserProcessor {
        List<User> process(List<User> users);
    }
    
    private User enrichUser(User user) {
        // Enrichment logic
        return user;
    }
}
```

### Functional Service Layer
```java
@Service
public class FunctionalUserService {
    private final UserRepository userRepository;
    private final EventPublisher eventPublisher;
    
    public FunctionalUserService(UserRepository userRepository, EventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }
    
    // Functional approach to user creation
    public CompletableFuture<User> createUser(CreateUserRequest request) {
        return CompletableFuture
            .supplyAsync(() -> validateRequest(request))
            .thenApply(this::createUserFromRequest)
            .thenCompose(userRepository::saveAsync)
            .thenApply(this::publishUserCreatedEvent)
            .thenApply(this::enrichUserData);
    }
    
    // Functional validation
    private CreateUserRequest validateRequest(CreateUserRequest request) {
        return Optional.ofNullable(request)
                      .filter(req -> req.getUsername() != null && !req.getUsername().trim().isEmpty())
                      .filter(req -> req.getEmail() != null && req.getEmail().contains("@"))
                      .orElseThrow(() -> new ValidationException("Invalid user request"));
    }
    
    private User createUserFromRequest(CreateUserRequest request) {
        return User.builder()
                  .username(request.getUsername())
                  .email(request.getEmail())
                  .createdAt(Instant.now())
                  .active(true)
                  .build();
    }
    
    private User publishUserCreatedEvent(User user) {
        eventPublisher.publishEvent(new UserCreatedEvent(user));
        return user;
    }
    
    private User enrichUserData(User user) {
        // Add default roles, preferences, etc.
        return user.withRoles(List.of("USER"));
    }
    
    // Functional data processing
    public Map<String, Long> getUserStatsByDepartment() {
        return userRepository.findAll()
                           .stream()
                           .filter(User::isActive)
                           .collect(Collectors.groupingBy(
                               User::getDepartment,
                               Collectors.counting()
                           ));
    }
    
    // Functional search with Optional
    public Optional<User> findUserByEmail(String email) {
        return Optional.ofNullable(email)
                      .filter(e -> !e.trim().isEmpty())
                      .flatMap(userRepository::findByEmail);
    }
    
    // Functional bulk operations
    public List<User> activateUsers(List<Long> userIds) {
        return userIds.stream()
                     .map(userRepository::findById)
                     .filter(Optional::isPresent)
                     .map(Optional::get)
                     .map(user -> user.withActive(true))
                     .map(userRepository::save)
                     .collect(Collectors.toList());
    }
}
```

### Functional REST Controller
```java
@RestController
@RequestMapping("/api/users")
public class FunctionalUserController {
    private final FunctionalUserService userService;
    
    public FunctionalUserController(FunctionalUserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "") String department,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        
        List<UserDto> users = userService.findAll()
                                        .stream()
                                        .filter(user -> department.isEmpty() || 
                                               department.equals(user.getDepartment()))
                                        .filter(user -> !activeOnly || user.isActive())
                                        .map(this::toUserDto)
                                        .sorted(Comparator.comparing(UserDto::getUsername))
                                        .collect(Collectors.toList());
        
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userService.findById(id)
                         .map(this::toUserDto)
                         .map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/batch")
    public ResponseEntity<List<UserDto>> createUsers(@RequestBody List<CreateUserRequest> requests) {
        List<UserDto> createdUsers = requests.stream()
                                           .map(userService::createUser)
                                           .map(CompletableFuture::join)
                                           .map(this::toUserDto)
                                           .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUsers);
    }
    
    @PutMapping("/activate")
    public ResponseEntity<Map<String, Object>> activateUsers(@RequestBody List<Long> userIds) {
        List<User> activatedUsers = userService.activateUsers(userIds);
        
        Map<String, Object> response = Map.of(
            "activated", activatedUsers.size(),
            "users", activatedUsers.stream()
                                  .map(this::toUserDto)
                                  .collect(Collectors.toList())
        );
        
        return ResponseEntity.ok(response);
    }
    
    private UserDto toUserDto(User user) {
        return UserDto.builder()
                     .id(user.getId())
                     .username(user.getUsername())
                     .email(user.getEmail())
                     .department(user.getDepartment())
                     .active(user.isActive())
                     .build();
    }
}
```

### Functional Event Handling
```java
@Component
public class FunctionalEventHandler {
    private final NotificationService notificationService;
    private final AuditService auditService;
    
    public FunctionalEventHandler(NotificationService notificationService, 
                                 AuditService auditService) {
        this.notificationService = notificationService;
        this.auditService = auditService;
    }
    
    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        User user = event.getUser();
        
        // Functional event processing pipeline
        CompletableFuture.runAsync(() -> sendWelcomeEmail(user))
                        .thenRun(() -> createUserProfile(user))
                        .thenRun(() -> auditUserCreation(user))
                        .exceptionally(throwable -> {
                            handleEventProcessingError(user, throwable);
                            return null;
                        });
    }
    
    @EventListener
    public void handleBulkUserUpdate(BulkUserUpdateEvent event) {
        List<User> users = event.getUsers();
        
        // Process users in parallel with functional style
        List<CompletableFuture<Void>> futures = users.stream()
                                                    .map(this::processUserUpdate)
                                                    .collect(Collectors.toList());
        
        // Wait for all to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                        .thenRun(() -> auditBulkUpdate(users))
                        .join();
    }
    
    private CompletableFuture<Void> processUserUpdate(User user) {
        return CompletableFuture
            .supplyAsync(() -> enrichUserData(user))
            .thenCompose(this::updateUserProfile)
            .thenAccept(this::notifyUserUpdate);
    }
    
    private User enrichUserData(User user) {
        // Enrichment logic
        return user;
    }
    
    private CompletableFuture<User> updateUserProfile(User user) {
        // Async update logic
        return CompletableFuture.completedFuture(user);
    }
    
    private void notifyUserUpdate(User user) {
        // Notification logic
    }
    
    private void sendWelcomeEmail(User user) {
        notificationService.sendEmail(
            user.getEmail(),
            "Welcome!",
            "Welcome to our platform, " + user.getUsername()
        );
    }
    
    private void createUserProfile(User user) {
        // Profile creation logic
    }
    
    private void auditUserCreation(User user) {
        auditService.logEvent("USER_CREATED", user.getId());
    }
    
    private void auditBulkUpdate(List<User> users) {
        auditService.logEvent("BULK_USER_UPDATE", 
                             users.stream()
                                  .map(User::getId)
                                  .collect(Collectors.toList()));
    }
    
    private void handleEventProcessingError(User user, Throwable throwable) {
        // Error handling logic
    }
}
```

## ⚠️ Functional Programming Best Practices

### When to Use Functional Style
```java
public class FunctionalBestPractices {
    
    // GOOD: Simple transformations
    public List<String> getUsernames(List<User> users) {
        return users.stream()
                   .map(User::getUsername)
                   .collect(Collectors.toList());
    }
    
    // GOOD: Filtering and processing
    public List<User> getActiveAdultUsers(List<User> users) {
        return users.stream()
                   .filter(User::isActive)
                   .filter(user -> user.getAge() >= 18)
                   .collect(Collectors.toList());
    }
    
    // AVOID: Complex business logic in streams
    public List<User> processUsersBAD(List<User> users) {
        return users.stream()
                   .map(user -> {
                       // Complex logic should be extracted
                       if (user.getAge() > 30) {
                           user.setCategory("SENIOR");
                           if (user.getDepartment().equals("IT")) {
                               user.setSalaryGrade(calculateSeniorITGrade(user));
                               updateUserBenefits(user);
                               logSeniorITUpdate(user);
                           }
                       }
                       return user;
                   })
                   .collect(Collectors.toList());
    }
    
    // BETTER: Extract complex logic
    public List<User> processUsersGOOD(List<User> users) {
        return users.stream()
                   .map(this::categorizeUser)
                   .map(this::updateUserDetails)
                   .collect(Collectors.toList());
    }
    
    private User categorizeUser(User user) {
        if (user.getAge() > 30) {
            user.setCategory("SENIOR");
        }
        return user;
    }
    
    private User updateUserDetails(User user) {
        if ("SENIOR".equals(user.getCategory()) && "IT".equals(user.getDepartment())) {
            user.setSalaryGrade(calculateSeniorITGrade(user));
            updateUserBenefits(user);
            logSeniorITUpdate(user);
        }
        return user;
    }
    
    // Helper methods
    private String calculateSeniorITGrade(User user) { return "A"; }
    private void updateUserBenefits(User user) { }
    private void logSeniorITUpdate(User user) { }
}
```

### Performance Considerations
```java
public class FunctionalPerformance {
    
    // Be careful with parallel streams
    public void parallelStreamConsiderations() {
        List<Integer> smallList = Arrays.asList(1, 2, 3, 4, 5);
        List<Integer> largeList = IntStream.range(1, 1_000_000).boxed().collect(Collectors.toList());
        
        // Don't use parallel for small collections - overhead not worth it
        int smallSum = smallList.stream()  // Sequential is better
                               .mapToInt(Integer::intValue)
                               .sum();
        
        // Use parallel for large collections with CPU-intensive operations
        int largeSum = largeList.parallelStream()  // Parallel is beneficial
                               .mapToInt(i -> expensiveCalculation(i))
                               .sum();
    }
    
    // Avoid creating unnecessary objects in streams
    public void avoidUnnecessaryObjects() {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        
        // BAD: Creates unnecessary String objects
        String resultBAD = names.stream()
                               .map(name -> new String(name.toUpperCase())) // Unnecessary object creation
                               .collect(Collectors.joining(", "));
        
        // GOOD: Reuse existing objects
        String resultGOOD = names.stream()
                                .map(String::toUpperCase)
                                .collect(Collectors.joining(", "));
    }
    
    // Use appropriate collection types
    public void useAppropriateCollections() {
        List<User> users = getUsers();
        
        // If you need a Set, collect to Set directly
        Set<String> departments = users.stream()
                                      .map(User::getDepartment)
                                      .collect(Collectors.toSet()); // Direct to Set
        
        // Don't collect to List then convert to Set
        Set<String> departmentsBAD = users.stream()
                                         .map(User::getDepartment)
                                         .collect(Collectors.toList())
                                         .stream()  // Unnecessary intermediate stream
                                         .collect(Collectors.toSet());
    }
    
    private int expensiveCalculation(int i) {
        // Simulate expensive operation
        return i * i;
    }
    
    private List<User> getUsers() {
        return Arrays.asList(new User("john", "john@example.com", 25, "IT"));
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Create a functional pipeline for processing CSV data
2. Implement a functional validation framework using predicates
3. Build a functional event sourcing system
4. Design a functional caching mechanism using suppliers and functions

## 📊 Functional Interface Reference

| Interface | Method | Parameters | Return | Use Case |
|-----------|--------|------------|--------|----------|
| `Predicate<T>` | `test(T)` | T | boolean | Filtering, validation |
| `Function<T,R>` | `apply(T)` | T | R | Transformation |
| `Consumer<T>` | `accept(T)` | T | void | Side effects |
| `Supplier<T>` | `get()` | none | T | Lazy evaluation |
| `BinaryOperator<T>` | `apply(T,T)` | T, T | T | Reduction |
| `UnaryOperator<T>` | `apply(T)` | T | T | Transformation |

### Stream Operation Categories

**Intermediate Operations** (lazy, return Stream):
- `filter()`, `map()`, `flatMap()`, `distinct()`, `sorted()`, `limit()`, `skip()`

**Terminal Operations** (eager, return result):
- `collect()`, `forEach()`, `reduce()`, `count()`, `anyMatch()`, `allMatch()`, `noneMatch()`, `findFirst()`, `findAny()`

---
**Next Module**: [Reflection & Annotations](../module6-reflection/README.md)
