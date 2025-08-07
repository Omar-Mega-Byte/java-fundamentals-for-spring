# Module 4: Generics & Type Safety

## 📋 Overview
Master Java Generics for type-safe code and understand how Spring leverages generics for dependency injection and data binding.

## 🎯 Learning Objectives
- Understand generic types, methods, and wildcards
- Write type-safe collections and methods
- Apply bounded type parameters effectively
- Recognize generics usage in Spring Framework
- Avoid common generics pitfalls

## 📚 Generic Fundamentals

### Basic Generic Classes
```java
// Generic class with type parameter
public class Container<T> {
    private T content;
    
    public Container(T content) {
        this.content = content;
    }
    
    public T getContent() {
        return content;
    }
    
    public void setContent(T content) {
        this.content = content;
    }
    
    // Generic method within generic class
    public <U> Container<U> transform(Function<T, U> transformer) {
        U transformed = transformer.apply(content);
        return new Container<>(transformed);
    }
}

// Usage examples
public class GenericUsageExample {
    public void demonstrateBasicGenerics() {
        // Type-safe containers
        Container<String> stringContainer = new Container<>("Hello");
        Container<Integer> intContainer = new Container<>(42);
        Container<User> userContainer = new Container<>(new User("John"));
        
        // Type safety at compile time
        String str = stringContainer.getContent(); // No casting needed
        Integer num = intContainer.getContent();   // No casting needed
        
        // Transform container type
        Container<Integer> lengthContainer = stringContainer.transform(String::length);
    }
}
```

### Generic Interfaces
```java
// Generic interface
public interface Repository<T, ID> {
    Optional<T> findById(ID id);
    List<T> findAll();
    T save(T entity);
    void deleteById(ID id);
    boolean existsById(ID id);
}

// Generic interface with multiple type parameters
public interface Converter<S, T> {
    T convert(S source);
    
    // Default method with generics
    default List<T> convertAll(List<S> sources) {
        return sources.stream()
                     .map(this::convert)
                     .collect(Collectors.toList());
    }
}

// Implementation examples
public class UserRepository implements Repository<User, Long> {
    private final Map<Long, User> users = new HashMap<>();
    
    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(users.get(id));
    }
    
    @Override
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }
    
    @Override
    public User save(User user) {
        users.put(user.getId(), user);
        return user;
    }
    
    @Override
    public void deleteById(Long id) {
        users.remove(id);
    }
    
    @Override
    public boolean existsById(Long id) {
        return users.containsKey(id);
    }
}

public class UserToUserDtoConverter implements Converter<User, UserDto> {
    @Override
    public UserDto convert(User user) {
        return UserDto.builder()
                     .id(user.getId())
                     .username(user.getUsername())
                     .email(user.getEmail())
                     .build();
    }
}
```

## 🔧 Generic Methods

### Standalone Generic Methods
```java
public class GenericMethodExamples {
    
    // Generic method with type parameter
    public static <T> void swap(T[] array, int i, int j) {
        T temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    // Generic method with return type
    public static <T> Optional<T> findFirst(List<T> list, Predicate<T> predicate) {
        return list.stream()
                  .filter(predicate)
                  .findFirst();
    }
    
    // Generic method with multiple type parameters
    public static <K, V> Map<K, V> createMap(K[] keys, V[] values) {
        if (keys.length != values.length) {
            throw new IllegalArgumentException("Arrays must have same length");
        }
        
        Map<K, V> map = new HashMap<>();
        for (int i = 0; i < keys.length; i++) {
            map.put(keys[i], values[i]);
        }
        return map;
    }
    
    // Generic factory method
    public static <T> Builder<T> builder(Class<T> type) {
        return new Builder<>(type);
    }
}

// Usage
public class GenericMethodUsage {
    public void demonstrateGenericMethods() {
        // Type inference
        String[] names = {"Alice", "Bob", "Charlie"};
        GenericMethodExamples.swap(names, 0, 2); // T inferred as String
        
        // Explicit type parameter
        List<User> users = Arrays.asList(
            new User("john", "john@example.com"),
            new User("jane", "jane@example.com")
        );
        
        Optional<User> johnUser = GenericMethodExamples.<User>findFirst(
            users, 
            user -> "john".equals(user.getUsername())
        );
    }
}
```

## 🎯 Bounded Type Parameters

### Upper Bounds (extends)
```java
// Upper bounded type parameter
public class NumberContainer<T extends Number> {
    private T value;
    
    public NumberContainer(T value) {
        this.value = value;
    }
    
    // Can call Number methods on T
    public double getDoubleValue() {
        return value.doubleValue();
    }
    
    public int compareTo(NumberContainer<T> other) {
        return Double.compare(this.getDoubleValue(), other.getDoubleValue());
    }
}

// Multiple bounds
public interface Drawable {
    void draw();
}

public interface Movable {
    void move(int x, int y);
}

public class GraphicsContainer<T extends Drawable & Movable> {
    private List<T> items = new ArrayList<>();
    
    public void addItem(T item) {
        items.add(item);
    }
    
    public void drawAll() {
        items.forEach(Drawable::draw); // Can call draw() because T extends Drawable
    }
    
    public void moveAll(int deltaX, int deltaY) {
        items.forEach(item -> item.move(deltaX, deltaY)); // Can call move() because T extends Movable
    }
}

// Bounded generic methods
public class MathUtils {
    
    // Works with any Number subtype
    public static <T extends Number> double sum(List<T> numbers) {
        return numbers.stream()
                     .mapToDouble(Number::doubleValue)
                     .sum();
    }
    
    // Works with Comparable types
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) > 0 ? a : b;
    }
    
    // Multiple bounds
    public static <T extends Number & Comparable<T>> T clamp(T value, T min, T max) {
        if (value.compareTo(min) < 0) return min;
        if (value.compareTo(max) > 0) return max;
        return value;
    }
}
```

### Lower Bounds (super) - Used with Wildcards
```java
public class BoundedWildcardExamples {
    
    // Producer extends, Consumer super (PECS principle)
    
    // Upper bounded wildcard (? extends T) - Producer
    public static double calculateTotal(List<? extends Number> numbers) {
        double total = 0;
        for (Number number : numbers) {
            total += number.doubleValue(); // Can read as Number
        }
        return total;
        // Cannot add to the list (except null)
    }
    
    // Lower bounded wildcard (? super T) - Consumer
    public static void addNumbers(List<? super Integer> numbers) {
        numbers.add(42);        // Can add Integer
        numbers.add(100);       // Can add Integer
        // numbers.add(3.14);   // Cannot add Double
        
        // Can only read as Object
        for (Object obj : numbers) {
            System.out.println(obj);
        }
    }
    
    // Practical example combining both
    public static <T> void copy(List<? extends T> source, List<? super T> destination) {
        for (T item : source) {
            destination.add(item);
        }
    }
}

// Usage examples
public class BoundedWildcardUsage {
    public void demonstrateBounds() {
        // Upper bounds - can pass List of Number subtypes
        List<Integer> integers = Arrays.asList(1, 2, 3);
        List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
        
        double intTotal = BoundedWildcardExamples.calculateTotal(integers);
        double doubleTotal = BoundedWildcardExamples.calculateTotal(doubles);
        
        // Lower bounds - can pass List that can hold Integer or its supertypes
        List<Number> numbers = new ArrayList<>();
        List<Object> objects = new ArrayList<>();
        
        BoundedWildcardExamples.addNumbers(numbers);  // OK - Number is super of Integer
        BoundedWildcardExamples.addNumbers(objects);  // OK - Object is super of Integer
        
        // Copy example
        List<String> sourceStrings = Arrays.asList("a", "b", "c");
        List<Object> destinationObjects = new ArrayList<>();
        BoundedWildcardExamples.copy(sourceStrings, destinationObjects);
    }
}
```

## 🌟 Advanced Generic Patterns

### Generic Builder Pattern
```java
public class GenericBuilder<T> {
    private final Class<T> type;
    private final Map<String, Object> properties = new HashMap<>();
    
    private GenericBuilder(Class<T> type) {
        this.type = type;
    }
    
    public static <T> GenericBuilder<T> of(Class<T> type) {
        return new GenericBuilder<>(type);
    }
    
    public GenericBuilder<T> set(String property, Object value) {
        properties.put(property, value);
        return this;
    }
    
    public T build() {
        try {
            T instance = type.getDeclaredConstructor().newInstance();
            
            for (Map.Entry<String, Object> entry : properties.entrySet()) {
                setProperty(instance, entry.getKey(), entry.getValue());
            }
            
            return instance;
        } catch (Exception e) {
            throw new RuntimeException("Failed to build instance", e);
        }
    }
    
    private void setProperty(T instance, String propertyName, Object value) {
        // Use reflection to set property
        try {
            Field field = type.getDeclaredField(propertyName);
            field.setAccessible(true);
            field.set(instance, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set property: " + propertyName, e);
        }
    }
}

// Usage
User user = GenericBuilder.of(User.class)
                         .set("username", "john_doe")
                         .set("email", "john@example.com")
                         .set("age", 30)
                         .build();
```

### Generic Factory Pattern
```java
public interface EntityFactory<T> {
    T create();
    T create(Map<String, Object> properties);
}

public class UserFactory implements EntityFactory<User> {
    @Override
    public User create() {
        return new User();
    }
    
    @Override
    public User create(Map<String, Object> properties) {
        User user = new User();
        user.setUsername((String) properties.get("username"));
        user.setEmail((String) properties.get("email"));
        user.setAge((Integer) properties.get("age"));
        return user;
    }
}

// Generic factory registry
@Component
public class EntityFactoryRegistry {
    private final Map<Class<?>, EntityFactory<?>> factories = new HashMap<>();
    
    public <T> void registerFactory(Class<T> type, EntityFactory<T> factory) {
        factories.put(type, factory);
    }
    
    @SuppressWarnings("unchecked")
    public <T> EntityFactory<T> getFactory(Class<T> type) {
        EntityFactory<?> factory = factories.get(type);
        if (factory == null) {
            throw new IllegalArgumentException("No factory registered for type: " + type);
        }
        return (EntityFactory<T>) factory;
    }
    
    public <T> T create(Class<T> type) {
        return getFactory(type).create();
    }
    
    public <T> T create(Class<T> type, Map<String, Object> properties) {
        return getFactory(type).create(properties);
    }
}
```

### Generic Event System
```java
// Generic event class
public abstract class Event<T> {
    private final T source;
    private final Instant timestamp;
    
    protected Event(T source) {
        this.source = source;
        this.timestamp = Instant.now();
    }
    
    public T getSource() {
        return source;
    }
    
    public Instant getTimestamp() {
        return timestamp;
    }
}

// Specific event types
public class UserCreatedEvent extends Event<User> {
    public UserCreatedEvent(User user) {
        super(user);
    }
}

public class OrderPlacedEvent extends Event<Order> {
    private final BigDecimal total;
    
    public OrderPlacedEvent(Order order, BigDecimal total) {
        super(order);
        this.total = total;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
}

// Generic event listener
public interface EventListener<T extends Event<?>> {
    void handle(T event);
    Class<T> getEventType();
}

// Event publisher
@Component
public class EventPublisher {
    private final Map<Class<?>, List<EventListener<?>>> listeners = new HashMap<>();
    
    @SuppressWarnings("unchecked")
    public <T extends Event<?>> void registerListener(EventListener<T> listener) {
        Class<T> eventType = listener.getEventType();
        listeners.computeIfAbsent(eventType, k -> new ArrayList<>())
                 .add(listener);
    }
    
    @SuppressWarnings("unchecked")
    public <T extends Event<?>> void publish(T event) {
        List<EventListener<?>> eventListeners = listeners.get(event.getClass());
        if (eventListeners != null) {
            for (EventListener<?> listener : eventListeners) {
                ((EventListener<T>) listener).handle(event);
            }
        }
    }
}
```

## 🌸 Spring Framework and Generics

### Spring Data Repositories
```java
// Spring Data leverages generics heavily
public interface UserRepository extends JpaRepository<User, Long> {
    // Inherits generic CRUD methods:
    // Optional<User> findById(Long id)
    // List<User> findAll()
    // User save(User entity)
    // void deleteById(Long id)
    
    List<User> findByUsernameContaining(String username);
    Optional<User> findByEmail(String email);
}

// Custom repository with generics
public interface CustomRepository<T, ID> {
    List<T> findByExample(T example);
    Page<T> findByExampleWithPaging(T example, Pageable pageable);
}

@Repository
public class CustomUserRepository implements CustomRepository<User, Long> {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<User> findByExample(User example) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> root = query.from(User.class);
        
        List<Predicate> predicates = new ArrayList<>();
        
        if (example.getUsername() != null) {
            predicates.add(cb.like(root.get("username"), "%" + example.getUsername() + "%"));
        }
        
        if (example.getEmail() != null) {
            predicates.add(cb.equal(root.get("email"), example.getEmail()));
        }
        
        query.where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(query).getResultList();
    }
    
    @Override
    public Page<T> findByExampleWithPaging(T example, Pageable pageable) {
        // Implementation using generics
        return null; // Simplified for brevity
    }
}
```

### Generic Service Layer
```java
// Generic service interface
public interface CrudService<T, ID> {
    Optional<T> findById(ID id);
    List<T> findAll();
    T save(T entity);
    void deleteById(ID id);
    boolean existsById(ID id);
}

// Abstract generic service implementation
public abstract class AbstractCrudService<T, ID> implements CrudService<T, ID> {
    
    protected abstract Repository<T, ID> getRepository();
    
    @Override
    public Optional<T> findById(ID id) {
        return getRepository().findById(id);
    }
    
    @Override
    public List<T> findAll() {
        return getRepository().findAll();
    }
    
    @Override
    public T save(T entity) {
        return getRepository().save(entity);
    }
    
    @Override
    public void deleteById(ID id) {
        getRepository().deleteById(id);
    }
    
    @Override
    public boolean existsById(ID id) {
        return getRepository().existsById(id);
    }
}

// Concrete service implementation
@Service
@Transactional
public class UserService extends AbstractCrudService<User, Long> {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    protected Repository<User, Long> getRepository() {
        return userRepository;
    }
    
    // Additional business methods
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> searchUsers(String username) {
        return userRepository.findByUsernameContaining(username);
    }
}
```

### Generic REST Controllers
```java
// Generic REST controller
public abstract class AbstractCrudController<T, ID> {
    
    protected abstract CrudService<T, ID> getService();
    
    @GetMapping("/{id}")
    public ResponseEntity<T> findById(@PathVariable ID id) {
        return getService().findById(id)
                          .map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public List<T> findAll() {
        return getService().findAll();
    }
    
    @PostMapping
    public ResponseEntity<T> create(@Valid @RequestBody T entity) {
        T saved = getService().save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable ID id, @Valid @RequestBody T entity) {
        if (!getService().existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        T updated = getService().save(entity);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        if (!getService().existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        getService().deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// Concrete controller
@RestController
@RequestMapping("/api/users")
public class UserController extends AbstractCrudController<User, Long> {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @Override
    protected CrudService<User, Long> getService() {
        return userService;
    }
    
    // Additional endpoints
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String username) {
        return userService.searchUsers(username);
    }
    
    @GetMapping("/by-email")
    public ResponseEntity<User> findByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                         .map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
}
```

### Generic Configuration
```java
// Generic configuration property
@ConfigurationProperties
public class GenericServiceConfig<T> {
    private Class<T> entityType;
    private int batchSize = 100;
    private Duration timeout = Duration.ofSeconds(30);
    private Map<String, Object> properties = new HashMap<>();
    
    // Getters and setters
}

// Generic converter
@Component
public class GenericEntityConverter<S, T> implements Converter<S, T> {
    private final ObjectMapper objectMapper;
    private final Class<T> targetType;
    
    public GenericEntityConverter(ObjectMapper objectMapper, Class<T> targetType) {
        this.objectMapper = objectMapper;
        this.targetType = targetType;
    }
    
    @Override
    public T convert(S source) {
        try {
            String json = objectMapper.writeValueAsString(source);
            return objectMapper.readValue(json, targetType);
        } catch (Exception e) {
            throw new ConversionFailedException(
                TypeDescriptor.valueOf(source.getClass()),
                TypeDescriptor.valueOf(targetType),
                source,
                e
            );
        }
    }
}
```

## ⚠️ Common Pitfalls and Best Practices

### Type Erasure Understanding
```java
public class TypeErasureExamples {
    
    // This won't work due to type erasure
    public void demonstrateTypeErasure() {
        List<String> stringList = new ArrayList<>();
        List<Integer> intList = new ArrayList<>();
        
        // Both have same runtime type
        System.out.println(stringList.getClass() == intList.getClass()); // true
        
        // Cannot check generic type at runtime
        // if (stringList instanceof List<String>) {} // Compilation error
        
        // Can only check raw type
        if (stringList instanceof List) {
            System.out.println("It's a List");
        }
    }
    
    // Solutions for type checking
    public class TypeSafeContainer<T> {
        private final T value;
        private final Class<T> type;
        
        public TypeSafeContainer(T value, Class<T> type) {
            this.value = value;
            this.type = type;
        }
        
        public boolean isOfType(Class<?> otherType) {
            return type.equals(otherType);
        }
        
        public Class<T> getType() {
            return type;
        }
    }
}
```

### Raw Types (Avoid)
```java
public class RawTypeProblems {
    
    // BAD - Raw type usage
    @SuppressWarnings("rawtypes")
    public void badRawTypeUsage() {
        List list = new ArrayList(); // Raw type
        list.add("String");
        list.add(42);               // Can add anything
        
        for (Object obj : list) {
            String str = (String) obj; // ClassCastException at runtime!
        }
    }
    
    // GOOD - Proper generic usage
    public void goodGenericUsage() {
        List<String> stringList = new ArrayList<>();
        stringList.add("String");
        // stringList.add(42); // Compilation error - type safety
        
        for (String str : stringList) {
            // No casting needed, type safe
            System.out.println(str.toUpperCase());
        }
    }
}
```

### Wildcard Guidelines (PECS)
```java
public class WildcardGuidelines {
    
    // Producer Extends - use ? extends T when reading from collection
    public static double sumNumbers(List<? extends Number> numbers) {
        double sum = 0;
        for (Number num : numbers) { // Reading - use extends
            sum += num.doubleValue();
        }
        return sum;
    }
    
    // Consumer Super - use ? super T when writing to collection
    public static void addIntegers(List<? super Integer> numbers) {
        numbers.add(42);    // Writing - use super
        numbers.add(100);
    }
    
    // Combination example
    public static <T> void transferElements(
            List<? extends T> source,     // Producer - reading from source
            List<? super T> destination   // Consumer - writing to destination
    ) {
        for (T element : source) {
            destination.add(element);
        }
    }
}
```

## 🔍 Generic Type Inference

### Diamond Operator (Java 7+)
```java
public class TypeInferenceExamples {
    
    public void demonstrateDiamondOperator() {
        // Before Java 7
        Map<String, List<User>> userGroups = new HashMap<String, List<User>>();
        
        // Java 7+ Diamond operator
        Map<String, List<User>> betterUserGroups = new HashMap<>();
        
        // Method type inference
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        
        // Target type inference (Java 8+)
        Map<String, Integer> nameLengths = names.stream()
                                               .collect(Collectors.toMap(
                                                   Function.identity(),  // Inferred
                                                   String::length        // Inferred
                                               ));
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Create a generic caching system with TTL support
2. Implement a type-safe event bus using generics
3. Build a generic validation framework
4. Design a generic repository pattern with query builders

## 📊 Generics Cheat Sheet

| Pattern | Usage | Example |
|---------|-------|---------|
| `<T>` | Generic type parameter | `List<T>` |
| `<T extends U>` | Upper bounded type | `<T extends Number>` |
| `<? extends T>` | Upper bounded wildcard | `List<? extends Number>` |
| `<? super T>` | Lower bounded wildcard | `List<? super Integer>` |
| `<?>` | Unbounded wildcard | `List<?>` |
| `<T, U>` | Multiple type parameters | `Map<T, U>` |

### When to Use Each

- **Upper bounds (`extends`)**: When you need to read from a collection
- **Lower bounds (`super`)**: When you need to write to a collection  
- **Unbounded (`?`)**: When you don't care about the type
- **Exact type (`T`)**: When you need both read and write operations

---
**Next Module**: [Functional Programming](../module5-functional/README.md)
