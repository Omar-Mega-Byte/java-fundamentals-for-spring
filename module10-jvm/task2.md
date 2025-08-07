# Module 10: JVM & Memory Management - Memory Monitor Task

## Task: Create a Simple Memory Monitoring System

Build a basic memory monitoring and optimization system.

### Requirements:

### 1. Create a MemoryMonitor class:
```java
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

public class MemoryMonitor {
    private final MemoryMXBean memoryBean;
    
    public MemoryMonitor() {
        this.memoryBean = ManagementFactory.getMemoryMXBean();
    }
    
    // Get current heap memory usage
    public MemoryInfo getHeapMemoryInfo() {
        MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
        return new MemoryInfo(
            heapUsage.getUsed(),
            heapUsage.getMax(),
            heapUsage.getCommitted(),
            "Heap"
        );
    }
    
    // Get non-heap memory usage (Method Area/Metaspace)
    public MemoryInfo getNonHeapMemoryInfo() {
        MemoryUsage nonHeapUsage = memoryBean.getNonHeapMemoryUsage();
        return new MemoryInfo(
            nonHeapUsage.getUsed(),
            nonHeapUsage.getMax(),
            nonHeapUsage.getCommitted(),
            "Non-Heap"
        );
    }
    
    // Force garbage collection
    public void forceGC() {
        System.gc();
        System.out.println("Garbage collection requested");
    }
    
    // Check if memory usage is critical
    public boolean isMemoryCritical(double threshold) {
        MemoryInfo heap = getHeapMemoryInfo();
        return heap.getUsagePercentage() > threshold;
    }
    
    // Display memory status
    public void displayMemoryStatus() {
        MemoryInfo heap = getHeapMemoryInfo();
        MemoryInfo nonHeap = getNonHeapMemoryInfo();
        
        System.out.println("=== Memory Status ===");
        System.out.println(heap);
        System.out.println(nonHeap);
    }
    
    public static class MemoryInfo {
        private final long used;
        private final long max;
        private final long committed;
        private final String type;
        
        public MemoryInfo(long used, long max, long committed, String type) {
            this.used = used;
            this.max = max;
            this.committed = committed;
            this.type = type;
        }
        
        public double getUsagePercentage() {
            return max > 0 ? (double) used / max * 100 : 0;
        }
        
        public long getUsedMB() {
            return used / (1024 * 1024);
        }
        
        public long getMaxMB() {
            return max / (1024 * 1024);
        }
        
        @Override
        public String toString() {
            return String.format("%s Memory: %d MB / %d MB (%.1f%% used)",
                               type, getUsedMB(), getMaxMB(), getUsagePercentage());
        }
        
        // Getters
        public long getUsed() { return used; }
        public long getMax() { return max; }
        public long getCommitted() { return committed; }
        public String getType() { return type; }
    }
}
```

### 2. Create a MemoryIntensiveTask for testing:
```java
import java.util.*;

public class MemoryIntensiveTask {
    private List<byte[]> memoryHog = new ArrayList<>();
    
    // Allocate memory in chunks
    public void allocateMemory(int sizeInMB) {
        try {
            for (int i = 0; i < sizeInMB; i++) {
                byte[] chunk = new byte[1024 * 1024]; // 1 MB chunk
                Arrays.fill(chunk, (byte) i); // Fill with data
                memoryHog.add(chunk);
                
                if (i % 10 == 0) {
                    System.out.println("Allocated " + (i + 1) + " MB");
                }
            }
        } catch (OutOfMemoryError e) {
            System.err.println("Out of memory after allocating " + memoryHog.size() + " MB");
            throw e;
        }
    }
    
    // Create many small objects
    public void createManyObjects(int count) {
        List<String> objects = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            objects.add("Object " + i + " with some content to use memory");
            
            if (i % 10000 == 0) {
                System.out.println("Created " + (i + 1) + " objects");
            }
        }
        System.out.println("Total objects created: " + objects.size());
    }
    
    // Release memory
    public void releaseMemory() {
        memoryHog.clear();
        System.out.println("Memory released");
    }
    
    // Get current memory usage
    public int getCurrentUsageMB() {
        return memoryHog.size();
    }
}
```

### 3. Create a MemoryOptimizer:
```java
public class MemoryOptimizer {
    private final MemoryMonitor monitor;
    private final double warningThreshold = 80.0; // 80%
    private final double criticalThreshold = 90.0; // 90%
    
    public MemoryOptimizer(MemoryMonitor monitor) {
        this.monitor = monitor;
    }
    
    // Check memory and take action if needed
    public void checkAndOptimize() {
        MemoryMonitor.MemoryInfo heap = monitor.getHeapMemoryInfo();
        double usage = heap.getUsagePercentage();
        
        if (usage > criticalThreshold) {
            System.out.println("CRITICAL: Memory usage at " + String.format("%.1f", usage) + "%");
            handleCriticalMemory();
        } else if (usage > warningThreshold) {
            System.out.println("WARNING: Memory usage at " + String.format("%.1f", usage) + "%");
            handleWarningMemory();
        } else {
            System.out.println("Memory usage normal: " + String.format("%.1f", usage) + "%");
        }
    }
    
    private void handleCriticalMemory() {
        System.out.println("Taking critical memory actions:");
        System.out.println("1. Forcing garbage collection");
        monitor.forceGC();
        
        // Wait a bit for GC to complete
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Check again
        MemoryMonitor.MemoryInfo heap = monitor.getHeapMemoryInfo();
        System.out.println("After GC: " + heap);
    }
    
    private void handleWarningMemory() {
        System.out.println("Taking warning level actions:");
        System.out.println("1. Suggesting garbage collection");
        monitor.forceGC();
    }
    
    // Monitor memory continuously
    public void startMonitoring(int intervalSeconds) {
        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                checkAndOptimize();
            }
        }, 0, intervalSeconds * 1000);
        
        System.out.println("Memory monitoring started (interval: " + intervalSeconds + " seconds)");
    }
}
```

### 4. Test the memory management system:
```java
public class MemoryManagementTest {
    public static void main(String[] args) {
        MemoryMonitor monitor = new MemoryMonitor();
        MemoryOptimizer optimizer = new MemoryOptimizer(monitor);
        MemoryIntensiveTask task = new MemoryIntensiveTask();
        
        // Display initial memory status
        System.out.println("=== Initial Memory Status ===");
        monitor.displayMemoryStatus();
        
        // Start memory monitoring in background
        optimizer.startMonitoring(5); // Check every 5 seconds
        
        try {
            // Test 1: Create many small objects
            System.out.println("\n=== Test 1: Creating many objects ===");
            task.createManyObjects(100000);
            monitor.displayMemoryStatus();
            optimizer.checkAndOptimize();
            
            Thread.sleep(2000); // Wait a bit
            
            // Test 2: Allocate large chunks of memory
            System.out.println("\n=== Test 2: Allocating large memory chunks ===");
            try {
                task.allocateMemory(50); // Try to allocate 50 MB
                monitor.displayMemoryStatus();
                optimizer.checkAndOptimize();
                
                Thread.sleep(2000);
                
                // Allocate more to trigger warnings
                task.allocateMemory(100); // More memory
                monitor.displayMemoryStatus();
                optimizer.checkAndOptimize();
                
            } catch (OutOfMemoryError e) {
                System.err.println("Caught OutOfMemoryError: " + e.getMessage());
                monitor.displayMemoryStatus();
            }
            
            // Test 3: Release memory
            System.out.println("\n=== Test 3: Releasing memory ===");
            task.releaseMemory();
            monitor.forceGC();
            Thread.sleep(2000); // Wait for GC
            monitor.displayMemoryStatus();
            
            // Test 4: Memory leak simulation
            System.out.println("\n=== Test 4: Memory leak simulation ===");
            simulateMemoryLeak();
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        System.out.println("\nMemory management test completed");
    }
    
    private static void simulateMemoryLeak() {
        // Simulate a memory leak by keeping references to objects
        List<String> leakyList = new ArrayList<>();
        
        for (int i = 0; i < 50000; i++) {
            leakyList.add("Leaked object " + i + " that won't be garbage collected");
        }
        
        System.out.println("Created potential memory leak with " + leakyList.size() + " objects");
        // Objects in leakyList won't be garbage collected while this method is running
    }
}
```

### Bonus (Optional):
- Add heap dump generation when memory is critical
- Monitor different memory pools (Eden, Survivor, Old Generation)
- Create memory usage graphs
- Add alerts for memory leaks detection
- Implement automatic memory optimization strategies
