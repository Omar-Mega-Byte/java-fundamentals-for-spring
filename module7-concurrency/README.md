# Module 7: Concurrency & Threading

## 📋 Overview
Master Java concurrency and threading concepts essential for building scalable Spring applications.

## 🎯 Learning Objectives
- Understand threading fundamentals and lifecycle
- Master synchronization mechanisms
- Apply concurrent collections and atomic operations
- Use ExecutorService and thread pools effectively
- Handle asynchronous programming in Spring

## 📚 Threading Fundamentals

### Thread Creation and Management
```java
public class ThreadBasics {
    
    // Method 1: Extending Thread class
    static class MyThread extends Thread {
        @Override
        public void run() {
            System.out.println("Thread: " + Thread.currentThread().getName());
        }
    }
    
    // Method 2: Implementing Runnable (preferred)
    static class MyTask implements Runnable {
        @Override
        public void run() {
            System.out.println("Task executed by: " + Thread.currentThread().getName());
        }
    }
    
    // Method 3: Lambda expression
    public void demonstrateThreadCreation() {
        // Extending Thread
        MyThread thread1 = new MyThread();
        thread1.start();
        
        // Implementing Runnable
        Thread thread2 = new Thread(new MyTask());
        thread2.start();
        
        // Lambda expression
        Thread thread3 = new Thread(() -> {
            System.out.println("Lambda task: " + Thread.currentThread().getName());
        });
        thread3.start();
        
        // Anonymous class
        Thread thread4 = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous task: " + Thread.currentThread().getName());
            }
        });
        thread4.start();
    }
}
```

### Thread Synchronization
```java
public class SynchronizationExamples {
    private int counter = 0;
    private final Object lock = new Object();
    
    // Synchronized method
    public synchronized void incrementSynchronized() {
        counter++;
    }
    
    // Synchronized block
    public void incrementWithBlock() {
        synchronized (lock) {
            counter++;
        }
    }
    
    // Thread-safe counter using volatile
    private volatile int volatileCounter = 0;
    
    public void incrementVolatile() {
        volatileCounter++; // Still not thread-safe for increment!
    }
    
    // Producer-Consumer pattern
    static class ProducerConsumer {
        private final Queue<Integer> queue = new LinkedList<>();
        private final int capacity = 5;
        
        public void produce(int item) throws InterruptedException {
            synchronized (queue) {
                while (queue.size() == capacity) {
                    queue.wait(); // Wait for consumer
                }
                queue.offer(item);
                System.out.println("Produced: " + item);
                queue.notifyAll(); // Notify consumers
            }
        }
        
        public int consume() throws InterruptedException {
            synchronized (queue) {
                while (queue.isEmpty()) {
                    queue.wait(); // Wait for producer
                }
                int item = queue.poll();
                System.out.println("Consumed: " + item);
                queue.notifyAll(); // Notify producers
                return item;
            }
        }
    }
}
```

### Concurrent Collections
```java
@Service
public class ConcurrentCollectionsService {
    
    // Thread-safe collections
    private final Map<String, User> userCache = new ConcurrentHashMap<>();
    private final Queue<Task> taskQueue = new ConcurrentLinkedQueue<>();
    private final List<String> logEntries = new CopyOnWriteArrayList<>();
    
    // Atomic operations
    private final AtomicInteger requestCounter = new AtomicInteger(0);
    private final AtomicLong totalProcessingTime = new AtomicLong(0);
    private final AtomicReference<String> status = new AtomicReference<>("IDLE");
    
    public void addUser(String id, User user) {
        userCache.put(id, user);
        requestCounter.incrementAndGet();
    }
    
    public User getUser(String id) {
        return userCache.get(id);
    }
    
    public void addTask(Task task) {
        taskQueue.offer(task);
    }
    
    public Task getNextTask() {
        return taskQueue.poll();
    }
    
    public void addLogEntry(String message) {
        logEntries.add(Instant.now() + ": " + message);
    }
    
    public void updateProcessingTime(long time) {
        totalProcessingTime.addAndGet(time);
    }
    
    public boolean updateStatus(String expected, String newStatus) {
        return status.compareAndSet(expected, newStatus);
    }
}
```

## 🎯 ExecutorService and Thread Pools

### Thread Pool Management
```java
@Service
public class ThreadPoolService {
    
    // Different types of thread pools
    private final ExecutorService fixedThreadPool = Executors.newFixedThreadPool(4);
    private final ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
    private final ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(2);
    
    // Custom thread pool
    private final ThreadPoolExecutor customPool = new ThreadPoolExecutor(
        2,                     // core pool size
        4,                     // maximum pool size
        60L,                   // keep alive time
        TimeUnit.SECONDS,      // time unit
        new LinkedBlockingQueue<>(100), // work queue
        new ThreadPoolExecutor.CallerRunsPolicy() // rejection policy
    );
    
    public CompletableFuture<String> processDataAsync(String data) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulate processing
            try {
                Thread.sleep(1000);
                return "Processed: " + data;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return "Interrupted";
            }
        }, fixedThreadPool);
    }
    
    public void schedulePeriodicTask() {
        scheduledPool.scheduleAtFixedRate(() -> {
            System.out.println("Periodic task executed at: " + Instant.now());
        }, 0, 30, TimeUnit.SECONDS);
    }
    
    public Future<Integer> submitTask(Callable<Integer> task) {
        return customPool.submit(task);
    }
    
    @PreDestroy
    public void shutdown() {
        shutdownExecutor(fixedThreadPool);
        shutdownExecutor(cachedThreadPool);
        shutdownExecutor(scheduledPool);
        shutdownExecutor(customPool);
    }
    
    private void shutdownExecutor(ExecutorService executor) {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
```

### CompletableFuture Patterns
```java
@Service
public class AsyncProcessingService {
    
    public CompletableFuture<UserProfile> getUserProfile(Long userId) {
        // Combine multiple async operations
        CompletableFuture<User> userFuture = getUserAsync(userId);
        CompletableFuture<List<Order>> ordersFuture = getUserOrdersAsync(userId);
        CompletableFuture<UserPreferences> prefsFuture = getUserPreferencesAsync(userId);
        
        return userFuture.thenCombine(ordersFuture, (user, orders) -> {
                    return new UserProfile(user, orders);
                })
                .thenCombine(prefsFuture, (profile, prefs) -> {
                    profile.setPreferences(prefs);
                    return profile;
                })
                .exceptionally(throwable -> {
                    log.error("Error creating user profile", throwable);
                    return new UserProfile(); // Default profile
                });
    }
    
    public CompletableFuture<List<String>> processInParallel(List<String> items) {
        List<CompletableFuture<String>> futures = items.stream()
            .map(item -> CompletableFuture.supplyAsync(() -> processItem(item)))
            .collect(Collectors.toList());
        
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenApply(v -> futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList()));
    }
    
    private CompletableFuture<User> getUserAsync(Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulate database call
            return new User();
        });
    }
    
    private CompletableFuture<List<Order>> getUserOrdersAsync(Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulate database call
            return new ArrayList<>();
        });
    }
    
    private CompletableFuture<UserPreferences> getUserPreferencesAsync(Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulate database call
            return new UserPreferences();
        });
    }
    
    private String processItem(String item) {
        // Simulate processing
        return "Processed: " + item;
    }
}
```

## 🌸 Spring Async and Concurrency

### Spring Async Configuration
```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    
    @Override
    @Bean(name = "taskExecutor")
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("Async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
    
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new SimpleAsyncUncaughtExceptionHandler();
    }
    
    @Bean(name = "scheduledExecutor")
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5);
        scheduler.setThreadNamePrefix("Scheduled-");
        scheduler.initialize();
        return scheduler;
    }
}

@Service
public class AsyncUserService {
    
    @Async
    public CompletableFuture<User> createUserAsync(CreateUserRequest request) {
        User user = new User(request.getUsername(), request.getEmail());
        // Simulate long-running operation
        return CompletableFuture.completedFuture(user);
    }
    
    @Async("taskExecutor")
    public void sendNotificationAsync(String email, String message) {
        // Send notification in background
        System.out.println("Sending notification to: " + email);
    }
    
    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredSessions() {
        // Cleanup logic
    }
    
    @Scheduled(cron = "0 0 2 * * ?")
    public void generateDailyReport() {
        // Generate report at 2 AM daily
    }
}
```

## ⚠️ Common Concurrency Pitfalls

### Thread Safety Issues
```java
public class ConcurrencyPitfalls {
    
    // WRONG: Race condition
    private int unsafeCounter = 0;
    
    public void incrementUnsafe() {
        unsafeCounter++; // Not atomic!
    }
    
    // CORRECT: Using AtomicInteger
    private final AtomicInteger safeCounter = new AtomicInteger(0);
    
    public void incrementSafe() {
        safeCounter.incrementAndGet();
    }
    
    // WRONG: Double-checked locking (before Java 5)
    private volatile ExpensiveObject instance;
    
    public ExpensiveObject getInstanceWrong() {
        if (instance == null) {
            synchronized (this) {
                if (instance == null) {
                    instance = new ExpensiveObject(); // Can be problematic
                }
            }
        }
        return instance;
    }
    
    // CORRECT: Initialization-on-demand holder pattern
    private static class Holder {
        static final ExpensiveObject INSTANCE = new ExpensiveObject();
    }
    
    public static ExpensiveObject getInstance() {
        return Holder.INSTANCE;
    }
    
    // WRONG: Deadlock potential
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized (lock1) {
            synchronized (lock2) {
                // Work
            }
        }
    }
    
    public void method2() {
        synchronized (lock2) { // Different order - deadlock risk!
            synchronized (lock1) {
                // Work
            }
        }
    }
    
    // CORRECT: Consistent lock ordering
    public void safeMethod1() {
        synchronized (lock1) {
            synchronized (lock2) {
                // Work
            }
        }
    }
    
    public void safeMethod2() {
        synchronized (lock1) { // Same order
            synchronized (lock2) {
                // Work
            }
        }
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Implement a thread-safe cache with expiration
2. Create a producer-consumer system using BlockingQueue
3. Build a parallel file processor using CompletableFuture
4. Design a rate-limiting service using concurrency primitives

## 📊 Thread Pool Guidelines

| Pool Type | Use Case | Configuration |
|-----------|----------|---------------|
| `FixedThreadPool` | Known workload | Set size = CPU cores |
| `CachedThreadPool` | Variable workload | Unbounded, reuses threads |
| `ScheduledThreadPool` | Periodic tasks | Small fixed size |
| `ForkJoinPool` | CPU-intensive, divide-and-conquer | Size = CPU cores |

---
**Next Module**: [I/O & Serialization](../module8-io/README.md)
