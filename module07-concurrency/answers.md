# Module 07: Concurrency and Multithreading - Answers

## Task 1: MCQ Quiz Answers

### 1. What is the difference between concurrent and parallel execution?
**Answer: d) Concurrent can run on single core, parallel requires multiple cores**

Explanation: Concurrent execution means tasks appear to run simultaneously through time-slicing on a single core, while parallel execution requires multiple cores to truly run simultaneously.

### 2. Which method is used to create a new thread in Java?
**Answer: d) Both a and b**

Explanation: You can create threads either by extending the Thread class or by implementing the Runnable interface. Both are valid approaches.

### 3. What is the purpose of the synchronized keyword?
**Answer: b) To ensure thread-safe access to shared resources**

Explanation: The synchronized keyword provides mutual exclusion, ensuring only one thread can access a synchronized block or method at a time.

### 4. What happens when you call thread.start()?
**Answer: b) Creates a new thread and calls run() method**

Explanation: start() creates a new thread and executes the run() method in that new thread. Calling run() directly would execute in the current thread.

### 5. Which of these is NOT a thread state in Java?
**Answer: d) SUSPENDED**

Explanation: Java thread states are NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, and TERMINATED. SUSPENDED is not a valid thread state.

### 6. What is a race condition?
**Answer: c) When multiple threads access shared data and the outcome depends on timing**

Explanation: A race condition occurs when the correctness of the program depends on the relative timing of events, typically when multiple threads access shared resources.

### 7. Which executor service method waits for all tasks to complete?
**Answer: c) awaitTermination()**

Explanation: awaitTermination() blocks until all tasks complete after a shutdown request, or the timeout occurs, or the current thread is interrupted.

### 8. What is deadlock in multithreading?
**Answer: b) Two or more threads waiting for each other indefinitely**

Explanation: Deadlock occurs when two or more threads are blocked forever, waiting for each other to release resources they need.

### 9. Which concurrent collection is thread-safe?
**Answer: c) ConcurrentHashMap**

Explanation: ConcurrentHashMap is designed for concurrent access and is thread-safe. ArrayList and HashMap are not thread-safe.

### 10. What does the volatile keyword ensure?
**Answer: d) All of the above**

Explanation: The volatile keyword ensures visibility of changes across threads, prevents compiler optimizations that could reorder operations, and provides a happens-before relationship.

---

## Task 2: Thread Pool Task Manager Implementation

### Complete Implementation with All Classes:

```java
// ===== TASK INTERFACE =====

public interface Task {
    String getId();
    String getName();
    TaskPriority getPriority();
    void execute();
    TaskStatus getStatus();
    void setStatus(TaskStatus status);
}

// ===== ENUMS =====

public enum TaskPriority {
    LOW(1), MEDIUM(2), HIGH(3), CRITICAL(4);
    
    private final int level;
    
    TaskPriority(int level) {
        this.level = level;
    }
    
    public int getLevel() {
        return level;
    }
}

public enum TaskStatus {
    PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
}

// ===== CONCRETE TASK IMPLEMENTATION =====

import java.util.concurrent.atomic.AtomicReference;
import java.util.UUID;

public class SimpleTask implements Task {
    private final String id;
    private final String name;
    private final TaskPriority priority;
    private final Runnable operation;
    private final AtomicReference<TaskStatus> status;
    
    public SimpleTask(String name, TaskPriority priority, Runnable operation) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.priority = priority;
        this.operation = operation;
        this.status = new AtomicReference<>(TaskStatus.PENDING);
    }
    
    @Override
    public String getId() {
        return id;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public TaskPriority getPriority() {
        return priority;
    }
    
    @Override
    public void execute() {
        try {
            setStatus(TaskStatus.RUNNING);
            System.out.println("Executing task: " + name + " [" + Thread.currentThread().getName() + "]");
            operation.run();
            setStatus(TaskStatus.COMPLETED);
            System.out.println("Completed task: " + name);
        } catch (Exception e) {
            setStatus(TaskStatus.FAILED);
            System.err.println("Failed task: " + name + " - " + e.getMessage());
        }
    }
    
    @Override
    public TaskStatus getStatus() {
        return status.get();
    }
    
    @Override
    public void setStatus(TaskStatus status) {
        this.status.set(status);
    }
    
    @Override
    public String toString() {
        return String.format("Task{id='%s', name='%s', priority=%s, status=%s}", 
                           id.substring(0, 8), name, priority, status.get());
    }
}

// ===== THREAD POOL TASK MANAGER =====

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ThreadPoolTaskManager {
    private final ThreadPoolExecutor executor;
    private final PriorityBlockingQueue<Runnable> taskQueue;
    private final Map<String, Task> tasks;
    private final AtomicInteger completedTasks;
    private final AtomicInteger failedTasks;
    private final AtomicLong totalExecutionTime;
    private final Object statsLock = new Object();
    
    public ThreadPoolTaskManager(int corePoolSize, int maximumPoolSize, long keepAliveTime) {
        // Priority queue that orders tasks by priority
        this.taskQueue = new PriorityBlockingQueue<>(10, this::compareTaskPriority);
        
        this.executor = new ThreadPoolExecutor(
            corePoolSize,
            maximumPoolSize,
            keepAliveTime,
            TimeUnit.MILLISECONDS,
            taskQueue,
            new CustomThreadFactory(),
            new CustomRejectedExecutionHandler()
        );
        
        this.tasks = new ConcurrentHashMap<>();
        this.completedTasks = new AtomicInteger(0);
        this.failedTasks = new AtomicInteger(0);
        this.totalExecutionTime = new AtomicLong(0);
        
        System.out.println("ThreadPoolTaskManager created with " + corePoolSize + 
                         " core threads, max " + maximumPoolSize + " threads");
    }
    
    // Compare tasks by priority for ordering in queue
    private int compareTaskPriority(Runnable r1, Runnable r2) {
        if (r1 instanceof TaskWrapper && r2 instanceof TaskWrapper) {
            TaskWrapper t1 = (TaskWrapper) r1;
            TaskWrapper t2 = (TaskWrapper) r2;
            // Higher priority comes first (reverse order)
            return Integer.compare(t2.getTask().getPriority().getLevel(), 
                                 t1.getTask().getPriority().getLevel());
        }
        return 0;
    }
    
    // Submit a task for execution
    public Future<Void> submitTask(Task task) {
        tasks.put(task.getId(), task);
        TaskWrapper wrapper = new TaskWrapper(task, this);
        
        try {
            Future<Void> future = executor.submit(wrapper, null);
            System.out.println("Submitted task: " + task.getName() + 
                             " [Priority: " + task.getPriority() + "]");
            return future;
        } catch (RejectedExecutionException e) {
            task.setStatus(TaskStatus.CANCELLED);
            System.err.println("Task rejected: " + task.getName());
            throw e;
        }
    }
    
    // Submit multiple tasks
    public List<Future<Void>> submitTasks(List<Task> taskList) {
        List<Future<Void>> futures = new ArrayList<>();
        for (Task task : taskList) {
            try {
                futures.add(submitTask(task));
            } catch (RejectedExecutionException e) {
                System.err.println("Failed to submit task: " + task.getName());
            }
        }
        return futures;
    }
    
    // Cancel a specific task
    public boolean cancelTask(String taskId) {
        Task task = tasks.get(taskId);
        if (task != null && task.getStatus() == TaskStatus.PENDING) {
            task.setStatus(TaskStatus.CANCELLED);
            System.out.println("Cancelled task: " + task.getName());
            return true;
        }
        return false;
    }
    
    // Get task by ID
    public Task getTask(String taskId) {
        return tasks.get(taskId);
    }
    
    // Get all tasks with specific status
    public List<Task> getTasksByStatus(TaskStatus status) {
        return tasks.values().stream()
                   .filter(task -> task.getStatus() == status)
                   .collect(java.util.stream.Collectors.toList());
    }
    
    // Get current pool statistics
    public void printPoolStatistics() {
        synchronized (statsLock) {
            System.out.println("\n=== Thread Pool Statistics ===");
            System.out.println("Active threads: " + executor.getActiveCount());
            System.out.println("Pool size: " + executor.getPoolSize());
            System.out.println("Core pool size: " + executor.getCorePoolSize());
            System.out.println("Maximum pool size: " + executor.getMaximumPoolSize());
            System.out.println("Queue size: " + executor.getQueue().size());
            System.out.println("Completed task count: " + executor.getCompletedTaskCount());
            System.out.println("Total task count: " + executor.getTaskCount());
            System.out.println("Successful tasks: " + completedTasks.get());
            System.out.println("Failed tasks: " + failedTasks.get());
            System.out.println("Average execution time: " + 
                             (completedTasks.get() > 0 ? totalExecutionTime.get() / completedTasks.get() : 0) + "ms");
            System.out.println("==============================\n");
        }
    }
    
    // Update statistics when task completes
    void updateStatistics(Task task, long executionTime) {
        synchronized (statsLock) {
            if (task.getStatus() == TaskStatus.COMPLETED) {
                completedTasks.incrementAndGet();
                totalExecutionTime.addAndGet(executionTime);
            } else if (task.getStatus() == TaskStatus.FAILED) {
                failedTasks.incrementAndGet();
            }
        }
    }
    
    // Graceful shutdown
    public void shutdown() {
        System.out.println("Initiating shutdown...");
        executor.shutdown();
        try {
            if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
                System.out.println("Forcing shutdown...");
                executor.shutdownNow();
                if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                    System.err.println("Thread pool did not terminate gracefully");
                }
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
        
        printFinalStatistics();
    }
    
    private void printFinalStatistics() {
        System.out.println("\n=== Final Statistics ===");
        System.out.println("Total tasks submitted: " + tasks.size());
        System.out.println("Tasks by status:");
        for (TaskStatus status : TaskStatus.values()) {
            long count = tasks.values().stream()
                             .filter(task -> task.getStatus() == status)
                             .count();
            System.out.println("  " + status + ": " + count);
        }
        System.out.println("========================\n");
    }
    
    // Check if shutdown
    public boolean isShutdown() {
        return executor.isShutdown();
    }
    
    // Check if terminated
    public boolean isTerminated() {
        return executor.isTerminated();
    }
}

// ===== TASK WRAPPER =====

class TaskWrapper implements Runnable {
    private final Task task;
    private final ThreadPoolTaskManager manager;
    
    public TaskWrapper(Task task, ThreadPoolTaskManager manager) {
        this.task = task;
        this.manager = manager;
    }
    
    @Override
    public void run() {
        long startTime = System.currentTimeMillis();
        try {
            task.execute();
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;
            manager.updateStatistics(task, executionTime);
        }
    }
    
    public Task getTask() {
        return task;
    }
}

// ===== CUSTOM THREAD FACTORY =====

class CustomThreadFactory implements ThreadFactory {
    private final AtomicInteger threadNumber = new AtomicInteger(1);
    private final String namePrefix = "TaskManager-Thread-";
    
    @Override
    public Thread newThread(Runnable r) {
        Thread thread = new Thread(r, namePrefix + threadNumber.getAndIncrement());
        thread.setDaemon(false); // Ensure threads are not daemon threads
        thread.setPriority(Thread.NORM_PRIORITY);
        System.out.println("Created new thread: " + thread.getName());
        return thread;
    }
}

// ===== CUSTOM REJECTED EXECUTION HANDLER =====

class CustomRejectedExecutionHandler implements RejectedExecutionHandler {
    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        if (r instanceof TaskWrapper) {
            Task task = ((TaskWrapper) r).getTask();
            task.setStatus(TaskStatus.CANCELLED);
            System.err.println("Task rejected due to capacity: " + task.getName());
        }
        
        if (!executor.isShutdown()) {
            System.err.println("Thread pool at capacity. Consider increasing pool size or queue capacity.");
        }
    }
}

// ===== DEMONSTRATION CLASS =====

public class TaskManagerDemo {
    public static void main(String[] args) {
        System.out.println("Starting ThreadPoolTaskManager Demo");
        System.out.println("==================================");
        
        // Create task manager with 3 core threads, max 5 threads, 60 second keep-alive
        ThreadPoolTaskManager manager = new ThreadPoolTaskManager(3, 5, 60000);
        
        // Test 1: Basic task submission
        System.out.println("\n=== Test 1: Basic Task Submission ===");
        testBasicTaskSubmission(manager);
        
        // Wait a bit and check statistics
        sleep(2000);
        manager.printPoolStatistics();
        
        // Test 2: Priority-based execution
        System.out.println("\n=== Test 2: Priority-Based Execution ===");
        testPriorityExecution(manager);
        
        sleep(3000);
        manager.printPoolStatistics();
        
        // Test 3: Heavy load testing
        System.out.println("\n=== Test 3: Heavy Load Testing ===");
        testHeavyLoad(manager);
        
        sleep(5000);
        manager.printPoolStatistics();
        
        // Test 4: Task cancellation
        System.out.println("\n=== Test 4: Task Cancellation ===");
        testTaskCancellation(manager);
        
        sleep(2000);
        
        // Shutdown gracefully
        manager.shutdown();
        
        System.out.println("Demo completed successfully!");
    }
    
    private static void testBasicTaskSubmission(ThreadPoolTaskManager manager) {
        List<Task> tasks = Arrays.asList(
            new SimpleTask("Database Backup", TaskPriority.HIGH, () -> {
                System.out.println("  Backing up database...");
                sleep(1000);
                System.out.println("  Database backup completed");
            }),
            
            new SimpleTask("Send Email", TaskPriority.MEDIUM, () -> {
                System.out.println("  Sending email notification...");
                sleep(500);
                System.out.println("  Email sent successfully");
            }),
            
            new SimpleTask("Generate Report", TaskPriority.LOW, () -> {
                System.out.println("  Generating monthly report...");
                sleep(1500);
                System.out.println("  Report generated");
            })
        );
        
        manager.submitTasks(tasks);
    }
    
    private static void testPriorityExecution(ThreadPoolTaskManager manager) {
        // Submit tasks in reverse priority order to see if they execute by priority
        List<Task> tasks = Arrays.asList(
            new SimpleTask("Low Priority Log Cleanup", TaskPriority.LOW, () -> {
                System.out.println("  Cleaning up old logs...");
                sleep(800);
            }),
            
            new SimpleTask("Critical Security Alert", TaskPriority.CRITICAL, () -> {
                System.out.println("  Processing critical security alert!");
                sleep(300);
            }),
            
            new SimpleTask("Medium Priority Data Sync", TaskPriority.MEDIUM, () -> {
                System.out.println("  Synchronizing data...");
                sleep(600);
            }),
            
            new SimpleTask("High Priority User Request", TaskPriority.HIGH, () -> {
                System.out.println("  Processing urgent user request...");
                sleep(400);
            })
        );
        
        manager.submitTasks(tasks);
    }
    
    private static void testHeavyLoad(ThreadPoolTaskManager manager) {
        List<Task> heavyTasks = new ArrayList<>();
        
        // Create many tasks to test thread pool behavior
        for (int i = 1; i <= 10; i++) {
            final int taskNumber = i;
            heavyTasks.add(new SimpleTask("Heavy Task " + i, TaskPriority.MEDIUM, () -> {
                System.out.println("  Processing heavy task " + taskNumber + "...");
                sleep(2000); // Simulate heavy work
                System.out.println("  Heavy task " + taskNumber + " completed");
            }));
        }
        
        manager.submitTasks(heavyTasks);
    }
    
    private static void testTaskCancellation(ThreadPoolTaskManager manager) {
        // Submit a long-running task
        Task longTask = new SimpleTask("Long Running Task", TaskPriority.MEDIUM, () -> {
            System.out.println("  Starting long-running task...");
            sleep(5000);
            System.out.println("  Long-running task completed");
        });
        
        Future<Void> future = manager.submitTask(longTask);
        
        // Submit a task to be cancelled
        Task taskToCancel = new SimpleTask("Task to Cancel", TaskPriority.LOW, () -> {
            System.out.println("  This task should be cancelled");
            sleep(1000);
        });
        
        manager.submitTask(taskToCancel);
        
        // Cancel the task after a short delay
        sleep(100);
        boolean cancelled = manager.cancelTask(taskToCancel.getId());
        System.out.println("Task cancellation " + (cancelled ? "successful" : "failed"));
    }
    
    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

### Expected Output:
```
Starting ThreadPoolTaskManager Demo
==================================
ThreadPoolTaskManager created with 3 core threads, max 5 threads
Created new thread: TaskManager-Thread-1
Created new thread: TaskManager-Thread-2
Created new thread: TaskManager-Thread-3

=== Test 1: Basic Task Submission ===
Submitted task: Database Backup [Priority: HIGH]
Submitted task: Send Email [Priority: MEDIUM]
Submitted task: Generate Report [Priority: LOW]
Executing task: Database Backup [TaskManager-Thread-1]
Executing task: Send Email [TaskManager-Thread-2]
Executing task: Generate Report [TaskManager-Thread-3]
  Backing up database...
  Sending email notification...
  Generating monthly report...
  Email sent successfully
Completed task: Send Email
  Database backup completed
Completed task: Database Backup
  Report generated
Completed task: Generate Report

=== Thread Pool Statistics ===
Active threads: 0
Pool size: 3
Core pool size: 3
Maximum pool size: 5
Queue size: 0
Completed task count: 3
Total task count: 3
Successful tasks: 3
Failed tasks: 0
Average execution time: 1000ms
==============================
```

### Key Learning Points:

1. **Thread Pool Management**:
   - Core vs maximum thread count
   - Queue management for pending tasks
   - Thread lifecycle and reuse

2. **Task Priority System**:
   - Priority-based task execution
   - Custom comparators for task ordering
   - Queue implementation with priorities

3. **Concurrency Control**:
   - Thread-safe collections (ConcurrentHashMap)
   - Atomic variables for statistics
   - Synchronization for critical sections

4. **Resource Management**:
   - Graceful shutdown procedures
   - Thread factory customization
   - Rejected execution handling

5. **Monitoring and Statistics**:
   - Real-time pool statistics
   - Task execution tracking
   - Performance metrics collection

6. **Error Handling**:
   - Exception handling in tasks
   - Task cancellation mechanisms
   - Failure recovery strategies

This implementation demonstrates enterprise-level thread pool management that's essential for Spring Framework applications where concurrent request handling and background task processing are crucial.
