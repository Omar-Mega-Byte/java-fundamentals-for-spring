# Module 10: JVM and Performance - Answers

## Task 1: MCQ Quiz Answers

### 1. What are the main components of the JVM?
**Answer: d) All of the above**

Explanation: The JVM consists of three main components: Class Loader (loads classes), Runtime Data Areas (memory areas like heap, stack), and Execution Engine (executes bytecode).

### 2. Which memory area stores object instances?
**Answer: b) Heap**

Explanation: The heap is the runtime data area where object instances are allocated. It's divided into Young Generation and Old Generation for garbage collection purposes.

### 3. What is the purpose of garbage collection?
**Answer: c) To automatically free unused memory**

Explanation: Garbage collection automatically identifies and frees memory that is no longer referenced by the application, preventing memory leaks.

### 4. Which JVM parameter sets the initial heap size?
**Answer: b) -Xms**

Explanation: -Xms sets the initial (minimum) heap size. -Xmx sets the maximum heap size, -XX:NewRatio controls generation ratios, and -verbose:gc enables GC logging.

### 5. What happens in the Method Area (Metaspace)?
**Answer: d) All of the above**

Explanation: The Method Area (Metaspace in Java 8+) stores class metadata, method information, and constant pool data for loaded classes.

### 6. Which garbage collector is best for low-latency applications?
**Answer: c) G1GC**

Explanation: G1GC (Garbage First) is designed for low-latency applications with predictable pause times, though ZGC and Shenandoah are even better for ultra-low latency.

### 7. What does JIT compilation do?
**Answer: b) Compiles frequently used bytecode to native code**

Explanation: The Just-In-Time (JIT) compiler optimizes performance by compiling frequently executed bytecode (hot spots) into native machine code.

### 8. Which tool is used for profiling Java applications?
**Answer: d) All of the above**

Explanation: JProfiler, VisualVM, and Java Flight Recorder are all profiling tools that help analyze application performance, memory usage, and identify bottlenecks.

### 9. What is a memory leak in Java?
**Answer: c) Objects that cannot be garbage collected due to references**

Explanation: A memory leak occurs when objects remain reachable (referenced) but are no longer needed, preventing garbage collection and causing memory consumption to grow.

### 10. Which JVM parameter enables garbage collection logging?
**Answer: a) -verbose:gc**

Explanation: -verbose:gc enables basic garbage collection logging. More detailed logging can be enabled with additional GC logging parameters.

---

## Task 2: JVM Memory Monitoring System Implementation

### Complete Implementation with All Classes:

```java
// ===== MAIN MEMORY MONITORING SYSTEM =====

import java.lang.management.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.io.*;
import java.text.SimpleDateFormat;

public class JVMMemoryMonitor {
    
    // Management interfaces for monitoring
    private final MemoryMXBean memoryBean;
    private final List<MemoryPoolMXBean> memoryPoolBeans;
    private final List<GarbageCollectorMXBean> garbageCollectorBeans;
    private final RuntimeMXBean runtimeBean;
    private final ThreadMXBean threadBean;
    private final OperatingSystemMXBean osBean;
    
    // Monitoring components
    private final ScheduledExecutorService scheduler;
    private final List<MemorySnapshot> snapshots;
    private final AtomicBoolean monitoring;
    private final PrintWriter logWriter;
    
    // Configuration
    private final long monitoringIntervalMs;
    private final int maxSnapshots;
    private final long alertThresholdPercent;
    
    public JVMMemoryMonitor(long intervalMs, int maxSnapshots, long alertThreshold) throws IOException {
        // Initialize MX Beans
        this.memoryBean = ManagementFactory.getMemoryMXBean();
        this.memoryPoolBeans = ManagementFactory.getMemoryPoolMXBeans();
        this.garbageCollectorBeans = ManagementFactory.getGarbageCollectorMXBeans();
        this.runtimeBean = ManagementFactory.getRuntimeMXBean();
        this.threadBean = ManagementFactory.getThreadMXBean();
        this.osBean = ManagementFactory.getOperatingSystemMXBean();
        
        // Initialize monitoring components
        this.scheduler = Executors.newScheduledThreadPool(2);
        this.snapshots = Collections.synchronizedList(new ArrayList<>());
        this.monitoring = new AtomicBoolean(false);
        
        // Configuration
        this.monitoringIntervalMs = intervalMs;
        this.maxSnapshots = maxSnapshots;
        this.alertThresholdPercent = alertThreshold;
        
        // Setup logging
        File logFile = new File("jvm_monitor.log");
        this.logWriter = new PrintWriter(new FileWriter(logFile, true));
        
        System.out.println("JVM Memory Monitor initialized");
        System.out.println("Log file: " + logFile.getAbsolutePath());
        printSystemInfo();
    }
    
    private void printSystemInfo() {
        System.out.println("\n=== JVM System Information ===");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("JVM Name: " + runtimeBean.getVmName());
        System.out.println("JVM Version: " + runtimeBean.getVmVersion());
        System.out.println("JVM Vendor: " + runtimeBean.getVmVendor());
        System.out.println("OS: " + System.getProperty("os.name") + " " + System.getProperty("os.version"));
        System.out.println("Available Processors: " + Runtime.getRuntime().availableProcessors());
        
        // Print memory pools
        System.out.println("\nMemory Pools:");
        for (MemoryPoolMXBean pool : memoryPoolBeans) {
            System.out.println("  - " + pool.getName() + " (" + pool.getType() + ")");
        }
        
        // Print garbage collectors
        System.out.println("\nGarbage Collectors:");
        for (GarbageCollectorMXBean gc : garbageCollectorBeans) {
            System.out.println("  - " + gc.getName() + " (" + Arrays.toString(gc.getMemoryPoolNames()) + ")");
        }
        
        System.out.println("===============================\n");
    }
    
    // Start monitoring
    public void startMonitoring() {
        if (monitoring.compareAndSet(false, true)) {
            System.out.println("Starting JVM memory monitoring...");
            
            // Schedule memory monitoring
            scheduler.scheduleAtFixedRate(this::takeSnapshot, 0, monitoringIntervalMs, TimeUnit.MILLISECONDS);
            
            // Schedule GC monitoring
            scheduler.scheduleAtFixedRate(this::monitorGarbageCollection, 0, 5000, TimeUnit.MILLISECONDS);
            
            logWriter.println(getCurrentTimestamp() + " - Monitoring started");
            logWriter.flush();
        } else {
            System.out.println("Monitoring is already active");
        }
    }
    
    // Stop monitoring
    public void stopMonitoring() {
        if (monitoring.compareAndSet(true, false)) {
            System.out.println("Stopping JVM memory monitoring...");
            
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
            
            logWriter.println(getCurrentTimestamp() + " - Monitoring stopped");
            logWriter.close();
        }
    }
    
    // Take a memory snapshot
    private void takeSnapshot() {
        try {
            MemorySnapshot snapshot = new MemorySnapshot();
            
            // General memory usage
            MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
            MemoryUsage nonHeapUsage = memoryBean.getNonHeapMemoryUsage();
            
            snapshot.timestamp = System.currentTimeMillis();
            snapshot.heapUsed = heapUsage.getUsed();
            snapshot.heapMax = heapUsage.getMax();
            snapshot.heapCommitted = heapUsage.getCommitted();
            snapshot.nonHeapUsed = nonHeapUsage.getUsed();
            snapshot.nonHeapMax = nonHeapUsage.getMax();
            snapshot.nonHeapCommitted = nonHeapUsage.getCommitted();
            
            // Memory pool details
            snapshot.memoryPools = new HashMap<>();
            for (MemoryPoolMXBean pool : memoryPoolBeans) {
                MemoryUsage usage = pool.getUsage();
                if (usage != null) {
                    snapshot.memoryPools.put(pool.getName(), new MemoryPoolInfo(
                        pool.getName(),
                        pool.getType().toString(),
                        usage.getUsed(),
                        usage.getMax(),
                        usage.getCommitted()
                    ));
                }
            }
            
            // Thread information
            snapshot.threadCount = threadBean.getThreadCount();
            snapshot.peakThreadCount = threadBean.getPeakThreadCount();
            snapshot.daemonThreadCount = threadBean.getDaemonThreadCount();
            
            // System load
            if (osBean instanceof com.sun.management.OperatingSystemMXBean) {
                com.sun.management.OperatingSystemMXBean sunOsBean = 
                    (com.sun.management.OperatingSystemMXBean) osBean;
                snapshot.systemCpuLoad = sunOsBean.getSystemCpuLoad();
                snapshot.processCpuLoad = sunOsBean.getProcessCpuLoad();
                snapshot.freePhysicalMemory = sunOsBean.getFreePhysicalMemorySize();
                snapshot.totalPhysicalMemory = sunOsBean.getTotalPhysicalMemorySize();
            }
            
            // Add to collection
            synchronized (snapshots) {
                snapshots.add(snapshot);
                
                // Keep only recent snapshots
                while (snapshots.size() > maxSnapshots) {
                    snapshots.remove(0);
                }
            }
            
            // Check for alerts
            checkMemoryAlerts(snapshot);
            
            // Log snapshot
            logSnapshot(snapshot);
            
        } catch (Exception e) {
            System.err.println("Error taking memory snapshot: " + e.getMessage());
        }
    }
    
    // Monitor garbage collection
    private void monitorGarbageCollection() {
        for (GarbageCollectorMXBean gc : garbageCollectorBeans) {
            long collections = gc.getCollectionCount();
            long time = gc.getCollectionTime();
            
            System.out.printf("GC %s: %d collections, %dms total time%n", 
                            gc.getName(), collections, time);
        }
    }
    
    // Check for memory alerts
    private void checkMemoryAlerts(MemorySnapshot snapshot) {
        // Check heap usage
        double heapUsagePercent = (double) snapshot.heapUsed / snapshot.heapMax * 100;
        if (heapUsagePercent > alertThresholdPercent) {
            String alert = String.format("HIGH HEAP USAGE: %.1f%% (%d MB / %d MB)",
                                        heapUsagePercent,
                                        snapshot.heapUsed / (1024 * 1024),
                                        snapshot.heapMax / (1024 * 1024));
            System.err.println("🚨 " + alert);
            logWriter.println(getCurrentTimestamp() + " - ALERT: " + alert);
            logWriter.flush();
        }
        
        // Check individual memory pools
        for (MemoryPoolInfo pool : snapshot.memoryPools.values()) {
            if (pool.max > 0) {
                double poolUsagePercent = (double) pool.used / pool.max * 100;
                if (poolUsagePercent > alertThresholdPercent) {
                    String alert = String.format("HIGH POOL USAGE in %s: %.1f%% (%d MB / %d MB)",
                                                pool.name,
                                                poolUsagePercent,
                                                pool.used / (1024 * 1024),
                                                pool.max / (1024 * 1024));
                    System.err.println("⚠️ " + alert);
                    logWriter.println(getCurrentTimestamp() + " - ALERT: " + alert);
                    logWriter.flush();
                }
            }
        }
    }
    
    // Log snapshot to file
    private void logSnapshot(MemorySnapshot snapshot) {
        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(snapshot.timestamp));
        
        logWriter.printf("%s,HEAP,%.2f,%.2f,%.2f%n",
                        timestamp,
                        snapshot.heapUsed / (1024.0 * 1024.0),
                        snapshot.heapMax / (1024.0 * 1024.0),
                        (double) snapshot.heapUsed / snapshot.heapMax * 100);
        
        logWriter.printf("%s,NON_HEAP,%.2f,%.2f,%.2f%n",
                        timestamp,
                        snapshot.nonHeapUsed / (1024.0 * 1024.0),
                        snapshot.nonHeapMax > 0 ? snapshot.nonHeapMax / (1024.0 * 1024.0) : -1,
                        snapshot.nonHeapMax > 0 ? (double) snapshot.nonHeapUsed / snapshot.nonHeapMax * 100 : -1);
        
        logWriter.flush();
    }
    
    // Display current memory status
    public void displayCurrentStatus() {
        System.out.println("\n=== Current JVM Memory Status ===");
        
        MemoryUsage heap = memoryBean.getHeapMemoryUsage();
        MemoryUsage nonHeap = memoryBean.getNonHeapMemoryUsage();
        
        System.out.printf("Heap Memory: %d MB used / %d MB max (%.1f%%)%n",
                         heap.getUsed() / (1024 * 1024),
                         heap.getMax() / (1024 * 1024),
                         (double) heap.getUsed() / heap.getMax() * 100);
        
        System.out.printf("Non-Heap Memory: %d MB used / %s MB max%n",
                         nonHeap.getUsed() / (1024 * 1024),
                         nonHeap.getMax() > 0 ? String.valueOf(nonHeap.getMax() / (1024 * 1024)) : "unlimited");
        
        System.out.println("\nMemory Pool Details:");
        for (MemoryPoolMXBean pool : memoryPoolBeans) {
            MemoryUsage usage = pool.getUsage();
            if (usage != null) {
                System.out.printf("  %-25s: %8d MB used / %8s MB max (%.1f%%)%n",
                                pool.getName(),
                                usage.getUsed() / (1024 * 1024),
                                usage.getMax() > 0 ? String.valueOf(usage.getMax() / (1024 * 1024)) : "unlimited",
                                usage.getMax() > 0 ? (double) usage.getUsed() / usage.getMax() * 100 : 0);
            }
        }
        
        System.out.printf("\nThreads: %d active / %d peak / %d daemon%n",
                         threadBean.getThreadCount(),
                         threadBean.getPeakThreadCount(),
                         threadBean.getDaemonThreadCount());
        
        System.out.println("\nGarbage Collection Statistics:");
        for (GarbageCollectorMXBean gc : garbageCollectorBeans) {
            System.out.printf("  %-25s: %8d collections, %8d ms total%n",
                            gc.getName(),
                            gc.getCollectionCount(),
                            gc.getCollectionTime());
        }
        
        System.out.println("================================\n");
    }
    
    // Generate memory stress for testing
    public void generateMemoryStress(int objectCount, int sizeKB) {
        System.out.println("Generating memory stress: " + objectCount + " objects of " + sizeKB + "KB each");
        
        List<byte[]> memoryHogs = new ArrayList<>();
        
        for (int i = 0; i < objectCount; i++) {
            byte[] data = new byte[sizeKB * 1024];
            Arrays.fill(data, (byte) (i % 256));
            memoryHogs.add(data);
            
            if (i % 100 == 0) {
                System.out.println("Created " + i + " objects...");
                try {
                    Thread.sleep(10); // Small delay to see monitoring in action
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
        
        System.out.println("Memory stress complete. Objects will be garbage collected when no longer referenced.");
        
        // Optionally trigger GC
        System.gc();
        
        // Keep references for a while then release
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        memoryHogs.clear();
        System.gc();
        System.out.println("Memory stress objects released and GC suggested");
    }
    
    // Analyze memory trends
    public void analyzeMemoryTrends() {
        synchronized (snapshots) {
            if (snapshots.size() < 2) {
                System.out.println("Insufficient data for trend analysis");
                return;
            }
            
            System.out.println("\n=== Memory Trend Analysis ===");
            
            MemorySnapshot first = snapshots.get(0);
            MemorySnapshot last = snapshots.get(snapshots.size() - 1);
            
            long timeSpanMs = last.timestamp - first.timestamp;
            long heapGrowth = last.heapUsed - first.heapUsed;
            long nonHeapGrowth = last.nonHeapUsed - first.nonHeapUsed;
            
            System.out.printf("Analysis period: %.1f minutes%n", timeSpanMs / (1000.0 * 60.0));
            System.out.printf("Heap memory growth: %+d MB%n", heapGrowth / (1024 * 1024));
            System.out.printf("Non-heap memory growth: %+d MB%n", nonHeapGrowth / (1024 * 1024));
            
            // Calculate average usage
            double avgHeapUsage = snapshots.stream()
                                          .mapToLong(s -> s.heapUsed)
                                          .average()
                                          .orElse(0) / (1024 * 1024);
            
            System.out.printf("Average heap usage: %.1f MB%n", avgHeapUsage);
            
            // Find peak usage
            OptionalLong maxHeap = snapshots.stream().mapToLong(s -> s.heapUsed).max();
            if (maxHeap.isPresent()) {
                System.out.printf("Peak heap usage: %d MB%n", maxHeap.getAsLong() / (1024 * 1024));
            }
            
            System.out.println("=============================\n");
        }
    }
    
    // Force garbage collection and measure impact
    public void forceGCAndMeasure() {
        System.out.println("Measuring garbage collection impact...");
        
        // Take before snapshot
        MemoryUsage beforeHeap = memoryBean.getHeapMemoryUsage();
        long beforeTime = System.currentTimeMillis();
        
        // Get GC stats before
        Map<String, Long> gcCountsBefore = new HashMap<>();
        Map<String, Long> gcTimesBefore = new HashMap<>();
        for (GarbageCollectorMXBean gc : garbageCollectorBeans) {
            gcCountsBefore.put(gc.getName(), gc.getCollectionCount());
            gcTimesBefore.put(gc.getName(), gc.getCollectionTime());
        }
        
        // Force GC
        System.gc();
        
        // Wait a bit for GC to complete
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Take after snapshot
        MemoryUsage afterHeap = memoryBean.getHeapMemoryUsage();
        long afterTime = System.currentTimeMillis();
        
        // Calculate freed memory
        long freedMemory = beforeHeap.getUsed() - afterHeap.getUsed();
        long gcTime = afterTime - beforeTime;
        
        System.out.printf("GC completed in %d ms%n", gcTime);
        System.out.printf("Memory freed: %d MB%n", freedMemory / (1024 * 1024));
        System.out.printf("Heap before: %d MB%n", beforeHeap.getUsed() / (1024 * 1024));
        System.out.printf("Heap after: %d MB%n", afterHeap.getUsed() / (1024 * 1024));
        
        // Show GC stats changes
        System.out.println("\nGC Statistics Changes:");
        for (GarbageCollectorMXBean gc : garbageCollectorBeans) {
            long countDiff = gc.getCollectionCount() - gcCountsBefore.get(gc.getName());
            long timeDiff = gc.getCollectionTime() - gcTimesBefore.get(gc.getName());
            
            if (countDiff > 0 || timeDiff > 0) {
                System.out.printf("  %s: +%d collections, +%d ms%n", 
                                gc.getName(), countDiff, timeDiff);
            }
        }
    }
    
    private String getCurrentTimestamp() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
    
    // Get monitoring statistics
    public MonitoringStats getStatistics() {
        synchronized (snapshots) {
            if (snapshots.isEmpty()) {
                return new MonitoringStats();
            }
            
            MonitoringStats stats = new MonitoringStats();
            stats.snapshotCount = snapshots.size();
            stats.monitoringDurationMs = snapshots.get(snapshots.size() - 1).timestamp - snapshots.get(0).timestamp;
            
            // Calculate averages
            stats.avgHeapUsageMB = snapshots.stream()
                                           .mapToLong(s -> s.heapUsed)
                                           .average()
                                           .orElse(0) / (1024 * 1024);
            
            stats.avgThreadCount = snapshots.stream()
                                           .mapToInt(s -> s.threadCount)
                                           .average()
                                           .orElse(0);
            
            // Find extremes
            stats.maxHeapUsageMB = snapshots.stream()
                                           .mapToLong(s -> s.heapUsed)
                                           .max()
                                           .orElse(0) / (1024 * 1024);
            
            stats.minHeapUsageMB = snapshots.stream()
                                           .mapToLong(s -> s.heapUsed)
                                           .min()
                                           .orElse(0) / (1024 * 1024);
            
            return stats;
        }
    }
}

// ===== MEMORY SNAPSHOT CLASS =====

class MemorySnapshot {
    long timestamp;
    long heapUsed;
    long heapMax;
    long heapCommitted;
    long nonHeapUsed;
    long nonHeapMax;
    long nonHeapCommitted;
    Map<String, MemoryPoolInfo> memoryPools;
    int threadCount;
    int peakThreadCount;
    int daemonThreadCount;
    double systemCpuLoad;
    double processCpuLoad;
    long freePhysicalMemory;
    long totalPhysicalMemory;
}

// ===== MEMORY POOL INFO CLASS =====

class MemoryPoolInfo {
    final String name;
    final String type;
    final long used;
    final long max;
    final long committed;
    
    public MemoryPoolInfo(String name, String type, long used, long max, long committed) {
        this.name = name;
        this.type = type;
        this.used = used;
        this.max = max;
        this.committed = committed;
    }
}

// ===== MONITORING STATISTICS CLASS =====

class MonitoringStats {
    int snapshotCount;
    long monitoringDurationMs;
    double avgHeapUsageMB;
    double avgThreadCount;
    long maxHeapUsageMB;
    long minHeapUsageMB;
    
    @Override
    public String toString() {
        return String.format("MonitoringStats{snapshots=%d, duration=%.1fm, avgHeap=%.1fMB, maxHeap=%dMB, minHeap=%dMB}",
                           snapshotCount,
                           monitoringDurationMs / (1000.0 * 60.0),
                           avgHeapUsageMB,
                           maxHeapUsageMB,
                           minHeapUsageMB);
    }
}

// ===== DEMONSTRATION CLASS =====

public class JVMMonitorDemo {
    public static void main(String[] args) {
        try {
            System.out.println("JVM Memory Monitoring System Demo");
            System.out.println("================================");
            
            // Create monitor with 2-second intervals, max 100 snapshots, 80% alert threshold
            JVMMemoryMonitor monitor = new JVMMemoryMonitor(2000, 100, 80);
            
            // Display initial status
            monitor.displayCurrentStatus();
            
            // Start monitoring
            monitor.startMonitoring();
            
            // Run for a while
            Thread.sleep(5000);
            
            // Generate some memory stress
            monitor.generateMemoryStress(500, 100); // 500 objects of 100KB each
            
            Thread.sleep(5000);
            
            // Force GC and measure
            monitor.forceGCAndMeasure();
            
            Thread.sleep(3000);
            
            // Show trends
            monitor.analyzeMemoryTrends();
            
            // Display final status
            monitor.displayCurrentStatus();
            
            // Show statistics
            MonitoringStats stats = monitor.getStatistics();
            System.out.println("Final Statistics: " + stats);
            
            // Stop monitoring
            monitor.stopMonitoring();
            
            System.out.println("\n=== Demo Completed ===");
            
        } catch (Exception e) {
            System.err.println("Error in demo: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### Expected Output:
```
JVM Memory Monitoring System Demo
================================
JVM Memory Monitor initialized
Log file: C:\path\to\jvm_monitor.log

=== JVM System Information ===
Java Version: 17.0.2
JVM Name: OpenJDK 64-Bit Server VM
JVM Version: 17.0.2+8-86
JVM Vendor: Eclipse Adoptium
OS: Windows 10 10.0
Available Processors: 8

Memory Pools:
  - CodeHeap 'non-nmethods' (NON_HEAP)
  - Metaspace (NON_HEAP)
  - CodeHeap 'profiled nmethods' (NON_HEAP)
  - Compressed Class Space (NON_HEAP)
  - G1 Eden Space (HEAP)
  - G1 Old Gen (HEAP)
  - G1 Survivor Space (HEAP)
  - CodeHeap 'non-profiled nmethods' (NON_HEAP)

Garbage Collectors:
  - G1 Young Generation ([G1 Eden Space, G1 Survivor Space])
  - G1 Old Generation ([G1 Eden Space, G1 Survivor Space, G1 Old Gen])
===============================

=== Current JVM Memory Status ===
Heap Memory: 25 MB used / 1024 MB max (2.4%)
Non-Heap Memory: 45 MB used / unlimited MB max

Memory Pool Details:
  CodeHeap 'non-nmethods' :        2 MB used /        5 MB max (40.0%)
  Metaspace                :       35 MB used / unlimited MB max (0.0%)
  CodeHeap 'profiled nmethods':     8 MB used /      120 MB max (6.7%)
  Compressed Class Space   :        4 MB used /     1024 MB max (0.4%)
  G1 Eden Space           :       15 MB used /       50 MB max (30.0%)
  G1 Old Gen              :        8 MB used /      974 MB max (0.8%)
  G1 Survivor Space       :        2 MB used /        6 MB max (33.3%)
  CodeHeap 'non-profiled nmethods': 1 MB used /      120 MB max (0.8%)

Threads: 15 active / 15 peak / 12 daemon

Garbage Collection Statistics:
  G1 Young Generation     :        3 collections,       15 ms total
  G1 Old Generation       :        0 collections,        0 ms total
================================

Starting JVM memory monitoring...
GC G1 Young Generation: 3 collections, 15ms total time
GC G1 Old Generation: 0 collections, 0ms total time

Generating memory stress: 500 objects of 100KB each
Created 0 objects...
Created 100 objects...
GC G1 Young Generation: 4 collections, 18ms total time
GC G1 Old Generation: 0 collections, 0ms total time
Created 200 objects...
Created 300 objects...
⚠️ HIGH POOL USAGE in G1 Eden Space: 85.2% (43 MB / 50 MB)
Created 400 objects...
🚨 HIGH HEAP USAGE: 82.1% (841 MB / 1024 MB)
Memory stress complete. Objects will be garbage collected when no longer referenced.
GC G1 Young Generation: 5 collections, 22ms total time
GC G1 Old Generation: 0 collections, 0ms total time
Memory stress objects released and GC suggested

Measuring garbage collection impact...
GC completed in 1045 ms
Memory freed: 785 MB
Heap before: 841 MB
Heap after: 56 MB

GC Statistics Changes:
  G1 Young Generation: +2 collections, +8 ms
  G1 Old Generation: +0 collections, +0 ms

=== Memory Trend Analysis ===
Analysis period: 0.3 minutes
Heap memory growth: +31 MB
Non-heap memory growth: +2 MB
Average heap usage: 325.4 MB
Peak heap usage: 841 MB
=============================

=== Current JVM Memory Status ===
Heap Memory: 56 MB used / 1024 MB max (5.5%)
Non-Heap Memory: 47 MB used / unlimited MB max
...
================================

Final Statistics: MonitoringStats{snapshots=18, duration=0.3m, avgHeap=325.4MB, maxHeap=841MB, minHeap=25MB}

Stopping JVM memory monitoring...

=== Demo Completed ===
```

### Key Learning Points:

1. **JVM Memory Areas**:
   - Heap memory (Eden, Survivor, Old Generation)
   - Non-heap memory (Metaspace, Code Cache)
   - Memory pool monitoring and thresholds

2. **Garbage Collection Monitoring**:
   - Different GC algorithms (G1, CMS, Parallel)
   - Collection frequency and timing
   - Memory reclamation effectiveness

3. **Performance Monitoring**:
   - Real-time memory usage tracking
   - Thread management monitoring
   - System resource utilization

4. **Memory Management Best Practices**:
   - Memory leak detection
   - GC tuning considerations
   - Performance alerting and logging

5. **JVM Tuning Parameters**:
   - Heap sizing (-Xms, -Xmx)
   - GC selection and tuning
   - Monitoring and logging options

This comprehensive monitoring system demonstrates essential JVM knowledge for optimizing Spring Framework applications, where understanding memory behavior, garbage collection impact, and performance characteristics is crucial for production deployments.
