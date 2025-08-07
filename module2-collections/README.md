# Module 2: Collections Framework

## 📋 Overview
Master Java Collections Framework for efficient data handling in Spring applications.

## 🎯 Learning Objectives
- Understand collection hierarchies and interfaces
- Choose appropriate collection types for different scenarios
- Master iteration patterns and stream operations
- Apply collections effectively in Spring development

## 📚 Core Collection Interfaces

### Collection Hierarchy
```
Collection
├── List (ordered, allows duplicates)
│   ├── ArrayList
│   ├── LinkedList
│   └── Vector
├── Set (no duplicates)
│   ├── HashSet
│   ├── LinkedHashSet
│   └── TreeSet
└── Queue (FIFO processing)
    ├── LinkedList
    ├── PriorityQueue
    └── ArrayDeque

Map (key-value pairs)
├── HashMap
├── LinkedHashMap
├── TreeMap
└── ConcurrentHashMap
```

## 🗂️ List Interface

### ArrayList vs LinkedList
```java
import java.util.*;

public class ListComparison {
    public void demonstrateArrayList() {
        List<String> arrayList = new ArrayList<>();
        
        // Fast random access O(1)
        arrayList.add("Spring");
        arrayList.add("Boot");
        arrayList.add("Framework");
        
        // Efficient for bulk operations
        String element = arrayList.get(1); // O(1) access
        
        // Good for read-heavy operations
        for (String item : arrayList) {
            System.out.println(item);
        }
    }
    
    public void demonstrateLinkedList() {
        List<String> linkedList = new LinkedList<>();
        
        // Efficient insertion/deletion at any position
        linkedList.add("First");
        linkedList.addFirst("New First"); // O(1)
        linkedList.addLast("Last"); // O(1)
        
        // Implements Deque interface
        ((LinkedList<String>) linkedList).push("Stack Element");
        String popped = ((LinkedList<String>) linkedList).pop();
    }
}
```

### List Best Practices
```java
@Service
public class UserService {
    
    // Use interface type for flexibility
    private List<User> users = new ArrayList<>();
    
    // Immutable list for read-only data
    public List<User> getActiveUsers() {
        return users.stream()
                   .filter(User::isActive)
                   .collect(Collectors.toUnmodifiableList());
    }
    
    // Defensive copying
    public List<User> getAllUsers() {
        return new ArrayList<>(users);
    }
}
```

**Spring Relevance**: Spring MVC automatically binds request parameters to List properties in form backing objects.

## 🔗 Set Interface

### HashSet vs LinkedHashSet vs TreeSet
```java
public class SetComparison {
    
    public void demonstrateHashSet() {
        Set<String> hashSet = new HashSet<>();
        
        // Fast add/remove/contains O(1) average
        hashSet.add("Spring");
        hashSet.add("Boot");
        hashSet.add("Spring"); // Duplicate ignored
        
        // No guaranteed order
        System.out.println(hashSet); // Order may vary
    }
    
    public void demonstrateLinkedHashSet() {
        Set<String> linkedHashSet = new LinkedHashSet<>();
        
        // Maintains insertion order
        linkedHashSet.add("First");
        linkedHashSet.add("Second");
        linkedHashSet.add("Third");
        
        // Predictable iteration order
        linkedHashSet.forEach(System.out::println);
    }
    
    public void demonstrateTreeSet() {
        Set<String> treeSet = new TreeSet<>();
        
        // Sorted order (natural or custom)
        treeSet.add("Charlie");
        treeSet.add("Alpha");
        treeSet.add("Beta");
        
        // Always sorted
        System.out.println(treeSet); // [Alpha, Beta, Charlie]
    }
}
```

### Custom Objects in Sets
```java
public class User {
    private Long id;
    private String username;
    private String email;
    
    // Constructor
    public User(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
    
    // Essential for HashSet/LinkedHashSet
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return Objects.equals(id, user.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    // For TreeSet (or implement Comparator)
    public static class UsernameComparator implements Comparator<User> {
        @Override
        public int compare(User u1, User u2) {
            return u1.username.compareTo(u2.username);
        }
    }
}

// Usage
Set<User> userSet = new TreeSet<>(new User.UsernameComparator());
```

**Spring Relevance**: Spring Security often uses Sets to store user authorities and roles.

## 🗺️ Map Interface

### HashMap vs LinkedHashMap vs TreeMap
```java
public class MapComparison {
    
    public void demonstrateHashMap() {
        Map<String, User> userMap = new HashMap<>();
        
        // Fast key-based access O(1) average
        userMap.put("john_doe", new User(1L, "john_doe", "john@example.com"));
        userMap.put("jane_smith", new User(2L, "jane_smith", "jane@example.com"));
        
        // No guaranteed order
        User user = userMap.get("john_doe");
    }
    
    public void demonstrateLinkedHashMap() {
        // Maintains insertion order
        Map<String, String> configMap = new LinkedHashMap<>();
        configMap.put("database.url", "jdbc:mysql://localhost/db");
        configMap.put("database.username", "admin");
        configMap.put("database.password", "secret");
        
        // Predictable iteration order
        configMap.forEach((key, value) -> 
            System.out.println(key + "=" + value));
    }
    
    public void demonstrateTreeMap() {
        // Sorted by keys
        Map<String, Integer> scoreMap = new TreeMap<>();
        scoreMap.put("Charlie", 85);
        scoreMap.put("Alice", 95);
        scoreMap.put("Bob", 90);
        
        // Always sorted by key
        scoreMap.forEach((name, score) -> 
            System.out.println(name + ": " + score));
        // Output: Alice: 95, Bob: 90, Charlie: 85
    }
}
```

### Advanced Map Operations
```java
@Service
public class CacheService {
    private final Map<String, Object> cache = new ConcurrentHashMap<>();
    
    // Atomic operations
    public Object getOrCompute(String key, Supplier<Object> supplier) {
        return cache.computeIfAbsent(key, k -> supplier.get());
    }
    
    // Merge operations
    public void incrementCounter(String key) {
        cache.merge(key, 1, (oldValue, newValue) -> 
            (Integer) oldValue + (Integer) newValue);
    }
    
    // Replace operations
    public boolean updateIfPresent(String key, Object newValue) {
        return cache.replace(key, newValue) != null;
    }
}
```

**Spring Relevance**: Spring's ApplicationContext is essentially a Map of bean names to bean instances.

## 📊 Queue and Deque

### Queue Implementations
```java
public class QueueExamples {
    
    public void demonstrateFIFO() {
        Queue<String> taskQueue = new LinkedList<>();
        
        // Add to tail
        taskQueue.offer("Task 1");
        taskQueue.offer("Task 2");
        taskQueue.offer("Task 3");
        
        // Remove from head (FIFO)
        while (!taskQueue.isEmpty()) {
            String task = taskQueue.poll();
            System.out.println("Processing: " + task);
        }
    }
    
    public void demonstratePriorityQueue() {
        Queue<Task> priorityQueue = new PriorityQueue<>(
            Comparator.comparing(Task::getPriority).reversed()
        );
        
        priorityQueue.offer(new Task("Low Priority", 1));
        priorityQueue.offer(new Task("High Priority", 10));
        priorityQueue.offer(new Task("Medium Priority", 5));
        
        // Always processes highest priority first
        while (!priorityQueue.isEmpty()) {
            Task task = priorityQueue.poll();
            System.out.println("Processing: " + task.getName());
        }
    }
    
    public void demonstrateDeque() {
        Deque<String> deque = new ArrayDeque<>();
        
        // Can add/remove from both ends
        deque.addFirst("First");
        deque.addLast("Last");
        deque.addFirst("New First");
        
        // Stack operations (LIFO)
        deque.push("Stack Item");
        String item = deque.pop();
        
        // Queue operations (FIFO)
        deque.offer("Queue Item");
        String queueItem = deque.poll();
    }
}
```

**Spring Relevance**: Spring's async processing and message queues often use Queue implementations.

## 🌊 Stream API and Collections

### Basic Stream Operations
```java
@Service
public class DataProcessingService {
    
    public List<String> processUsernames(List<User> users) {
        return users.stream()
                   .filter(user -> user.isActive())
                   .map(User::getUsername)
                   .filter(username -> username.length() > 3)
                   .sorted()
                   .collect(Collectors.toList());
    }
    
    public Map<String, List<User>> groupByDepartment(List<User> users) {
        return users.stream()
                   .collect(Collectors.groupingBy(User::getDepartment));
    }
    
    public Optional<User> findUserByEmail(List<User> users, String email) {
        return users.stream()
                   .filter(user -> user.getEmail().equals(email))
                   .findFirst();
    }
    
    public double calculateAverageAge(List<User> users) {
        return users.stream()
                   .mapToInt(User::getAge)
                   .average()
                   .orElse(0.0);
    }
}
```

### Advanced Stream Patterns
```java
public class AdvancedStreamOperations {
    
    // Parallel processing for large datasets
    public List<ProcessedData> processLargeDataset(List<RawData> data) {
        return data.parallelStream()
                  .filter(this::isValid)
                  .map(this::transform)
                  .collect(Collectors.toList());
    }
    
    // Custom collectors
    public String generateReport(List<Transaction> transactions) {
        return transactions.stream()
                          .collect(Collector.of(
                              StringBuilder::new,
                              (sb, transaction) -> sb.append(transaction.toString()).append("\n"),
                              StringBuilder::append,
                              StringBuilder::toString
                          ));
    }
    
    // FlatMap for nested collections
    public List<String> getAllTags(List<Article> articles) {
        return articles.stream()
                      .flatMap(article -> article.getTags().stream())
                      .distinct()
                      .sorted()
                      .collect(Collectors.toList());
    }
}
```

## 🔄 Iteration Patterns

### Traditional vs Modern Iteration
```java
public class IterationPatterns {
    
    public void traditionalForLoop(List<String> items) {
        // Traditional for loop - when you need index
        for (int i = 0; i < items.size(); i++) {
            String item = items.get(i);
            System.out.println("Index " + i + ": " + item);
        }
    }
    
    public void enhancedForLoop(List<String> items) {
        // Enhanced for loop - cleaner syntax
        for (String item : items) {
            System.out.println(item);
        }
    }
    
    public void iteratorPattern(List<String> items) {
        // Iterator - safe removal during iteration
        Iterator<String> iterator = items.iterator();
        while (iterator.hasNext()) {
            String item = iterator.next();
            if (shouldRemove(item)) {
                iterator.remove(); // Safe removal
            }
        }
    }
    
    public void streamIteration(List<String> items) {
        // Stream API - functional approach
        items.stream()
             .filter(this::isValid)
             .forEach(System.out::println);
    }
    
    private boolean shouldRemove(String item) { return item.isEmpty(); }
    private boolean isValid(String item) { return item != null && !item.trim().isEmpty(); }
}
```

## 🏗️ Collection Utilities

### Collections Class
```java
public class CollectionUtilities {
    
    public void demonstrateCollectionsClass() {
        List<Integer> numbers = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5, 9));
        
        // Sorting
        Collections.sort(numbers);
        Collections.reverse(numbers);
        
        // Searching
        int index = Collections.binarySearch(numbers, 5);
        
        // Min/Max
        Integer min = Collections.min(numbers);
        Integer max = Collections.max(numbers);
        
        // Shuffling
        Collections.shuffle(numbers);
        
        // Immutable views
        List<Integer> unmodifiableList = Collections.unmodifiableList(numbers);
        
        // Synchronized wrappers
        List<Integer> synchronizedList = Collections.synchronizedList(new ArrayList<>());
        
        // Empty collections
        List<String> emptyList = Collections.emptyList();
        Set<String> emptySet = Collections.emptySet();
        Map<String, String> emptyMap = Collections.emptyMap();
    }
}
```

### Google Guava Collections (Optional but useful)
```java
// If using Guava library
public class GuavaExamples {
    
    public void demonstrateGuavaCollections() {
        // Immutable collections
        ImmutableList<String> immutableList = ImmutableList.of("a", "b", "c");
        ImmutableSet<String> immutableSet = ImmutableSet.of("x", "y", "z");
        ImmutableMap<String, Integer> immutableMap = ImmutableMap.of(
            "one", 1, "two", 2, "three", 3
        );
        
        // Multimap - one key, multiple values
        Multimap<String, String> multimap = ArrayListMultimap.create();
        multimap.put("colors", "red");
        multimap.put("colors", "blue");
        multimap.put("colors", "green");
        
        // BiMap - bidirectional map
        BiMap<String, Integer> biMap = HashBiMap.create();
        biMap.put("one", 1);
        biMap.put("two", 2);
        BiMap<Integer, String> inverse = biMap.inverse();
    }
}
```

## 🎯 Spring Framework Connections

### 1. Configuration Properties
```java
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    private List<String> allowedOrigins = new ArrayList<>();
    private Map<String, String> database = new HashMap<>();
    private Set<String> enabledFeatures = new HashSet<>();
    
    // Getters and setters
}
```

### 2. Bean Collections
```java
@Service
public class NotificationService {
    
    // Spring injects all beans of type NotificationSender
    private final List<NotificationSender> notificationSenders;
    
    public NotificationService(List<NotificationSender> senders) {
        this.notificationSenders = senders;
    }
    
    public void sendToAll(String message) {
        notificationSenders.forEach(sender -> sender.send(message));
    }
}
```

### 3. Request Mapping with Collections
```java
@RestController
public class UserController {
    
    @PostMapping("/users/batch")
    public ResponseEntity<List<User>> createUsers(@RequestBody List<User> users) {
        List<User> savedUsers = userService.saveAll(users);
        return ResponseEntity.ok(savedUsers);
    }
    
    @GetMapping("/users")
    public Map<String, Object> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<User> userPage = userService.findAll(PageRequest.of(page, size));
        
        Map<String, Object> response = new HashMap<>();
        response.put("users", userPage.getContent());
        response.put("totalPages", userPage.getTotalPages());
        response.put("totalElements", userPage.getTotalElements());
        
        return response;
    }
}
```

## ⚠️ Common Pitfalls

1. **ConcurrentModificationException**: Don't modify collection while iterating
```java
// BAD
for (String item : list) {
    if (shouldRemove(item)) {
        list.remove(item); // Throws ConcurrentModificationException
    }
}

// GOOD
list.removeIf(this::shouldRemove);
```

2. **Null Values in Collections**:
```java
// Always check for null
Optional.ofNullable(map.get(key))
        .ifPresent(this::process);
```

3. **Memory Leaks with Large Collections**:
```java
// Clear collections when done
cache.clear();

// Use weak references for caches
Map<String, Object> cache = new WeakHashMap<>();
```

## 🏃‍♂️ Practice Exercises

1. Implement a LRU cache using LinkedHashMap
2. Create a thread-safe counter using ConcurrentHashMap
3. Build a simple in-memory database with Collections
4. Implement a priority-based task scheduler using PriorityQueue

## 📊 Performance Comparison

| Operation | ArrayList | LinkedList | HashSet | TreeSet |
|-----------|-----------|------------|---------|---------|
| Add | O(1) | O(1) | O(1) | O(log n) |
| Remove | O(n) | O(1)* | O(1) | O(log n) |
| Search | O(n) | O(n) | O(1) | O(log n) |
| Access | O(1) | O(n) | N/A | N/A |

*O(1) only if you have reference to the node

---
**Next Module**: [Exception Handling](../module3-exceptions/README.md)
