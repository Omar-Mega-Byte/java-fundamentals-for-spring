# Module 07: Concurrency & Threading - Bank Account Task

## Task: Create a Thread-Safe Bank Account System

Build a concurrent bank account system that handles multiple transactions safely.

### Requirements:

### 1. Create a thread-safe BankAccount class:
```java
public class BankAccount {
    private double balance;
    private final String accountNumber;
    
    public BankAccount(String accountNumber, double initialBalance) {
        // Implementation needed
    }
    
    // Thread-safe deposit method
    public synchronized void deposit(double amount) {
        // Implementation needed
        // Add validation and update balance
    }
    
    // Thread-safe withdrawal method
    public synchronized boolean withdraw(double amount) {
        // Implementation needed
        // Check sufficient funds and update balance
        // Return true if successful, false otherwise
    }
    
    // Thread-safe balance inquiry
    public synchronized double getBalance() {
        // Implementation needed
    }
    
    // Thread-safe transfer between accounts
    public static void transfer(BankAccount from, BankAccount to, double amount) {
        // Implementation needed
        // Use proper locking order to avoid deadlock
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
}
```

### 2. Create a TransactionProcessor using ExecutorService:
```java
import java.util.concurrent.*;

public class TransactionProcessor {
    private final ExecutorService executor;
    private final int threadPoolSize;
    
    public TransactionProcessor(int threadPoolSize) {
        // Initialize executor service
    }
    
    // Submit deposit transaction
    public Future<Boolean> submitDeposit(BankAccount account, double amount) {
        // Submit task to executor and return Future
    }
    
    // Submit withdrawal transaction
    public Future<Boolean> submitWithdrawal(BankAccount account, double amount) {
        // Submit task to executor and return Future
    }
    
    // Submit transfer transaction
    public Future<Boolean> submitTransfer(BankAccount from, BankAccount to, double amount) {
        // Submit task to executor and return Future
    }
    
    // Process batch of transactions
    public void processBatch(List<Runnable> transactions) {
        // Submit all transactions and wait for completion
    }
    
    // Shutdown the processor
    public void shutdown() {
        // Properly shutdown executor service
    }
}
```

### 3. Create a transaction monitoring system:
```java
import java.util.concurrent.atomic.*;

public class TransactionMonitor {
    private final AtomicLong transactionCount = new AtomicLong(0);
    private final AtomicLong successfulTransactions = new AtomicLong(0);
    private final AtomicLong failedTransactions = new AtomicLong(0);
    private volatile double totalAmountProcessed = 0.0;
    
    // Record successful transaction
    public void recordSuccess(double amount) {
        // Implementation using atomic operations
    }
    
    // Record failed transaction
    public void recordFailure() {
        // Implementation using atomic operations
    }
    
    // Get statistics
    public TransactionStats getStats() {
        // Return current statistics
    }
    
    public static class TransactionStats {
        public final long totalTransactions;
        public final long successful;
        public final long failed;
        public final double totalAmount;
        
        // Constructor needed
    }
}
```

### 4. Test with multiple threads:
```java
public class ConcurrencyTest {
    public static void main(String[] args) throws InterruptedException {
        // Create accounts
        BankAccount account1 = new BankAccount("ACC001", 1000.0);
        BankAccount account2 = new BankAccount("ACC002", 1500.0);
        BankAccount account3 = new BankAccount("ACC003", 800.0);
        
        TransactionProcessor processor = new TransactionProcessor(5);
        TransactionMonitor monitor = new TransactionMonitor();
        
        // Create multiple threads performing various operations
        List<Future<Boolean>> futures = new ArrayList<>();
        
        // Submit various transactions
        for (int i = 0; i < 100; i++) {
            // Mix of deposits, withdrawals, and transfers
        }
        
        // Wait for all transactions to complete
        
        // Print final balances and statistics
        
        processor.shutdown();
    }
}
```

### Bonus (Optional):
- Add account locking mechanism to prevent deadlocks
- Implement transaction history with thread-safe logging
- Add timeout handling for long-running transactions
- Create a load testing scenario with thousands of transactions
