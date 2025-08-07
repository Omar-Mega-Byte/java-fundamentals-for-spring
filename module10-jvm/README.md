# Module 10: JVM & Memory Management

## 📋 Overview
Understand JVM internals and memory management for optimizing Spring application performance.

## 🎯 Learning Objectives
- Understand JVM architecture and memory areas
- Master garbage collection concepts and tuning
- Apply memory optimization techniques
- Monitor and profile Spring applications

## 📚 JVM Architecture

### Memory Areas
```java
public class JVMMemoryExample {
    
    // Method Area (Metaspace in Java 8+)
    // - Class metadata, constant pool, static variables
    private static final String CONSTANT = "This goes to Method Area";
    private static int staticCounter = 0;
    
    // Heap Memory
    // - Object instances, instance variables
    private String instanceVariable; // Reference in stack, object in heap
    private List<String> dataList = new ArrayList<>(); // Both reference and ArrayList object in heap
    
    public void demonstrateMemoryUsage() {
        // Stack Memory
        // - Local variables, method parameters, return addresses
        int localInt = 42; // Primitive in stack
        String localString = "Local"; // Reference in stack, object in heap
        User localUser = new User(); // Reference in stack, User object in heap
        
        // Method calls create stack frames
        processData(localString);
    }
    
    private void processData(String data) {
        // New stack frame created
        char[] charArray = data.toCharArray(); // Array object in heap
        
        // When method returns, stack frame is removed
    }
    
    // PC Register and Native Method Stack are managed by JVM
}
```

### Garbage Collection
```java
@Component
public class MemoryOptimizationService {
    
    // Avoid memory leaks
    private final Map<String, WeakReference<CachedData>> cache = new ConcurrentHashMap<>();
    
    public void demonstrateGCBehavior() {
        List<String> data = new ArrayList<>();
        
        // Young Generation objects
        for (int i = 0; i < 1000; i++) {
            data.add("String " + i); // Short-lived objects
        }
        
        // Suggest GC (not guaranteed)
        System.gc();
        
        // Long-lived objects move to Old Generation
        staticCache.putAll(createLongLivedData());
    }
    
    private static final Map<String, Object> staticCache = new ConcurrentHashMap<>();
    
    // Memory-efficient caching
    public CachedData getCachedData(String key) {
        WeakReference<CachedData> ref = cache.get(key);
        if (ref != null) {
            CachedData data = ref.get();
            if (data != null) {
                return data;
            } else {
                // Object was garbage collected
                cache.remove(key);
            }
        }
        
        // Create new cached data
        CachedData newData = loadData(key);
        cache.put(key, new WeakReference<>(newData));
        return newData;
    }
    
    private Map<String, Object> createLongLivedData() {
        return Map.of("config1", "value1", "config2", "value2");
    }
    
    private CachedData loadData(String key) {
        return new CachedData(key);
    }
}
```

### Memory Monitoring
```java
@Service
public class MemoryMonitoringService {
    private final MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
    private final List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
    
    @Scheduled(fixedRate = 60000) // Every minute
    public void logMemoryUsage() {
        MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
        MemoryUsage nonHeapUsage = memoryBean.getNonHeapMemoryUsage();
        
        log.info("Heap Memory - Used: {} MB, Max: {} MB, Usage: {}%",
            heapUsage.getUsed() / 1024 / 1024,
            heapUsage.getMax() / 1024 / 1024,
            (heapUsage.getUsed() * 100.0) / heapUsage.getMax());
        
        log.info("Non-Heap Memory - Used: {} MB, Max: {} MB",
            nonHeapUsage.getUsed() / 1024 / 1024,
            nonHeapUsage.getMax() / 1024 / 1024);
        
        for (GarbageCollectorMXBean gcBean : gcBeans) {
            log.info("GC {} - Collections: {}, Time: {} ms",
                gcBean.getName(),
                gcBean.getCollectionCount(),
                gcBean.getCollectionTime());
        }
    }
    
    public MemoryInfo getMemoryInfo() {
        Runtime runtime = Runtime.getRuntime();
        return MemoryInfo.builder()
            .totalMemory(runtime.totalMemory())
            .freeMemory(runtime.freeMemory())
            .maxMemory(runtime.maxMemory())
            .usedMemory(runtime.totalMemory() - runtime.freeMemory())
            .build();
    }
}
```

## ⚡ Performance Optimization

### JVM Tuning Parameters
```bash
# Common JVM tuning parameters for Spring applications

# Heap size settings
-Xms2g                    # Initial heap size
-Xmx4g                    # Maximum heap size
-XX:NewRatio=3            # Old/Young generation ratio

# Garbage Collection
-XX:+UseG1GC              # Use G1 garbage collector
-XX:MaxGCPauseMillis=200  # Target pause time
-XX:G1HeapRegionSize=16m  # G1 region size

# Memory management
-XX:+UseStringDeduplication  # Deduplicate strings
-XX:+UseCompressedOops       # Compress object pointers

# Monitoring and debugging
-XX:+PrintGC                 # Print GC info
-XX:+PrintGCDetails          # Detailed GC info
-XX:+HeapDumpOnOutOfMemoryError  # Dump heap on OOM
-XX:HeapDumpPath=/tmp/       # Heap dump location

# JIT compilation
-XX:+TieredCompilation       # Enable tiered compilation
-XX:CompileThreshold=10000   # Method compilation threshold
```

### Memory Optimization Techniques
```java
@Service
public class OptimizedDataProcessor {
    
    // Use primitive collections when possible
    private final TIntObjectHashMap<String> primitiveMap = new TIntObjectHashMap<>();
    
    // Object pooling for expensive objects
    private final ObjectPool<ExpensiveObject> objectPool = new GenericObjectPool<>(
        new ExpensiveObjectFactory(),
        new GenericObjectPoolConfig<>()
    );
    
    // Efficient string handling
    public void processLargeText(String text) {
        // Use StringBuilder for string concatenation
        StringBuilder result = new StringBuilder(text.length() * 2);
        
        // Process in chunks to avoid large temporary objects
        int chunkSize = 1000;
        for (int i = 0; i < text.length(); i += chunkSize) {
            int end = Math.min(i + chunkSize, text.length());
            String chunk = text.substring(i, end);
            result.append(processChunk(chunk));
        }
    }
    
    // Use streams efficiently
    public List<ProcessedData> processDataStream(List<RawData> input) {
        return input.stream()
            .filter(this::isValid)
            .map(this::transform)
            .collect(Collectors.toCollection(
                () -> new ArrayList<>(input.size()) // Pre-size collection
            ));
    }
    
    // Minimize object creation in loops
    public void optimizedLoop(List<String> items) {
        StringBuilder buffer = new StringBuilder(); // Reuse
        
        for (String item : items) {
            buffer.setLength(0); // Reset instead of creating new
            buffer.append("Processed: ").append(item);
            processItem(buffer.toString());
        }
    }
    
    private String processChunk(String chunk) {
        return chunk.toUpperCase();
    }
    
    private boolean isValid(RawData data) {
        return data != null;
    }
    
    private ProcessedData transform(RawData data) {
        return new ProcessedData(data);
    }
    
    private void processItem(String item) {
        // Process item
    }
}
```

## 🌸 Spring Boot Memory Optimization

### Configuration for Production
```yaml
# application-prod.yml
spring:
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false
    properties:
      hibernate:
        # Enable batch processing
        jdbc.batch_size: 25
        order_inserts: true
        order_updates: true
        # Use connection pooling
        connection.provider_class: com.zaxxer.hikari.hibernate.HikariConnectionProvider
        
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
    metrics:
      enabled: true

# Connection pool optimization
spring.datasource.hikari:
  maximum-pool-size: 20
  minimum-idle: 5
  connection-timeout: 30000
  idle-timeout: 600000
  max-lifetime: 1800000
```

### Monitoring with Actuator
```java
@Component
public class CustomMetrics {
    private final MeterRegistry meterRegistry;
    private final Counter processedItemsCounter;
    private final Timer processingTimer;
    private final Gauge memoryGauge;
    
    public CustomMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.processedItemsCounter = Counter.builder("processed.items")
            .description("Number of processed items")
            .register(meterRegistry);
        
        this.processingTimer = Timer.builder("processing.time")
            .description("Time spent processing")
            .register(meterRegistry);
        
        this.memoryGauge = Gauge.builder("memory.used.percentage")
            .description("Memory usage percentage")
            .register(meterRegistry, this, CustomMetrics::getMemoryUsagePercentage);
    }
    
    public void recordProcessedItem() {
        processedItemsCounter.increment();
    }
    
    public void recordProcessingTime(Duration duration) {
        processingTimer.record(duration);
    }
    
    private double getMemoryUsagePercentage() {
        Runtime runtime = Runtime.getRuntime();
        long used = runtime.totalMemory() - runtime.freeMemory();
        long max = runtime.maxMemory();
        return (double) used / max * 100;
    }
}
```

## 🏃‍♂️ Practice Exercises

1. Profile a Spring application and identify memory hotspots
2. Implement object pooling for expensive resources
3. Optimize database query performance with JPA
4. Create custom metrics for application monitoring

## 📊 GC Algorithm Comparison

| Algorithm | Use Case | Pros | Cons |
|-----------|----------|------|------|
| **Serial GC** | Small applications | Simple, low overhead | Single-threaded |
| **Parallel GC** | Throughput-focused | Multi-threaded | Longer pause times |
| **G1 GC** | Large heaps, low latency | Predictable pauses | More complex |
| **ZGC/Shenandoah** | Very large heaps | Ultra-low latency | Experimental |

---
**Next Module**: [Dependency Injection Concepts](../module11-di/README.md)
