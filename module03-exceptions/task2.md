# Module 03: Exception Handling - Banking Transaction System

## Task: Build a Robust Banking Transaction System

Create a banking system that demonstrates proper exception handling for various error scenarios.

### Requirements:

### 1. Create custom exception classes:
```java
// Base custom exception
public class BankingException extends Exception {
    private final String errorCode;
    
    public BankingException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public BankingException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}

// Specific banking exceptions
public class InsufficientFundsException extends BankingException {
    public InsufficientFundsException(String message) {
        super(message, "INSUFFICIENT_FUNDS");
    }
}

public class AccountNotFoundException extends BankingException {
    public AccountNotFoundException(String message) {
        super(message, "ACCOUNT_NOT_FOUND");
    }
}

public class InvalidTransactionException extends BankingException {
    public InvalidTransactionException(String message) {
        super(message, "INVALID_TRANSACTION");
    }
}

public class AccountLockedException extends BankingException {
    public AccountLockedException(String message) {
        super(message, "ACCOUNT_LOCKED");
    }
}

public class DatabaseConnectionException extends BankingException {
    public DatabaseConnectionException(String message, Throwable cause) {
        super(message, "DATABASE_ERROR", cause);
    }
}
```

### 2. Create the Account class:
```java
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.concurrent.locks.ReentrantLock;

public class Account {
    private final String accountNumber;
    private final String ownerName;
    private BigDecimal balance;
    private boolean isLocked;
    private int failedTransactionCount;
    private LocalDateTime lastTransactionTime;
    private final ReentrantLock lock = new ReentrantLock();
    
    public Account(String accountNumber, String ownerName, BigDecimal initialBalance) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = initialBalance;
        this.isLocked = false;
        this.failedTransactionCount = 0;
        this.lastTransactionTime = LocalDateTime.now();
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public BigDecimal getBalance() {
        lock.lock();
        try {
            return balance;
        } finally {
            lock.unlock();
        }
    }
    
    public boolean isLocked() {
        return isLocked;
    }
    
    public void lockAccount() {
        this.isLocked = true;
    }
    
    public void unlockAccount() {
        this.isLocked = false;
        this.failedTransactionCount = 0;
    }
    
    public void incrementFailedTransactions() {
        this.failedTransactionCount++;
        if (failedTransactionCount >= 3) {
            lockAccount();
        }
    }
    
    public void updateBalance(BigDecimal newBalance) {
        lock.lock();
        try {
            this.balance = newBalance;
            this.lastTransactionTime = LocalDateTime.now();
        } finally {
            lock.unlock();
        }
    }
    
    public LocalDateTime getLastTransactionTime() {
        return lastTransactionTime;
    }
    
    @Override
    public String toString() {
        return String.format("Account{number='%s', owner='%s', balance=%s, locked=%s}", 
                           accountNumber, ownerName, balance, isLocked);
    }
}
```

### 3. Create the BankingService class:
```java
import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.logging.Level;

public class BankingService {
    private static final Logger logger = Logger.getLogger(BankingService.class.getName());
    private final Map<String, Account> accounts = new ConcurrentHashMap<>();
    private final DatabaseService databaseService;
    private boolean maintenanceMode = false;
    
    public BankingService(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }
    
    // Create a new account
    public void createAccount(String accountNumber, String ownerName, BigDecimal initialBalance) 
            throws BankingException {
        
        validateAccountCreation(accountNumber, ownerName, initialBalance);
        
        if (accounts.containsKey(accountNumber)) {
            throw new InvalidTransactionException("Account with number " + accountNumber + " already exists");
        }
        
        try {
            Account account = new Account(accountNumber, ownerName, initialBalance);
            accounts.put(accountNumber, account);
            databaseService.saveAccount(account);
            
            logger.info("Account created successfully: " + accountNumber);
        } catch (Exception e) {
            throw new DatabaseConnectionException("Failed to create account in database", e);
        }
    }
    
    // Get account balance
    public BigDecimal getBalance(String accountNumber) throws AccountNotFoundException {
        Account account = findAccount(accountNumber);
        return account.getBalance();
    }
    
    // Deposit money
    public void deposit(String accountNumber, BigDecimal amount) throws BankingException {
        validateTransaction(accountNumber, amount);
        
        Account account = findAccount(accountNumber);
        checkAccountStatus(account);
        
        try {
            BigDecimal newBalance = account.getBalance().add(amount);
            account.updateBalance(newBalance);
            databaseService.updateAccount(account);
            
            logger.info(String.format("Deposit successful: %s deposited %s, new balance: %s", 
                                    accountNumber, amount, newBalance));
        } catch (Exception e) {
            account.incrementFailedTransactions();
            throw new DatabaseConnectionException("Failed to process deposit", e);
        }
    }
    
    // Withdraw money
    public void withdraw(String accountNumber, BigDecimal amount) throws BankingException {
        validateTransaction(accountNumber, amount);
        
        Account account = findAccount(accountNumber);
        checkAccountStatus(account);
        
        BigDecimal currentBalance = account.getBalance();
        if (currentBalance.compareTo(amount) < 0) {
            account.incrementFailedTransactions();
            throw new InsufficientFundsException(
                String.format("Insufficient funds. Available: %s, Requested: %s", 
                            currentBalance, amount));
        }
        
        try {
            BigDecimal newBalance = currentBalance.subtract(amount);
            account.updateBalance(newBalance);
            databaseService.updateAccount(account);
            
            logger.info(String.format("Withdrawal successful: %s withdrew %s, new balance: %s", 
                                    accountNumber, amount, newBalance));
        } catch (Exception e) {
            account.incrementFailedTransactions();
            throw new DatabaseConnectionException("Failed to process withdrawal", e);
        }
    }
    
    // Transfer money between accounts
    public void transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) 
            throws BankingException {
        
        if (fromAccountNumber.equals(toAccountNumber)) {
            throw new InvalidTransactionException("Cannot transfer to the same account");
        }
        
        validateTransaction(fromAccountNumber, amount);
        
        Account fromAccount = findAccount(fromAccountNumber);
        Account toAccount = findAccount(toAccountNumber);
        
        checkAccountStatus(fromAccount);
        checkAccountStatus(toAccount);
        
        // Check sufficient funds
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            fromAccount.incrementFailedTransactions();
            throw new InsufficientFundsException(
                String.format("Insufficient funds for transfer. Available: %s, Requested: %s", 
                            fromAccount.getBalance(), amount));
        }
        
        // Perform transfer (this should be atomic in real implementation)
        try {
            BigDecimal fromNewBalance = fromAccount.getBalance().subtract(amount);
            BigDecimal toNewBalance = toAccount.getBalance().add(amount);
            
            fromAccount.updateBalance(fromNewBalance);
            toAccount.updateBalance(toNewBalance);
            
            databaseService.updateAccounts(fromAccount, toAccount);
            
            logger.info(String.format("Transfer successful: %s -> %s, Amount: %s", 
                                    fromAccountNumber, toAccountNumber, amount));
        } catch (Exception e) {
            fromAccount.incrementFailedTransactions();
            throw new DatabaseConnectionException("Failed to process transfer", e);
        }
    }
    
    // Get account information
    public Account getAccountInfo(String accountNumber) throws AccountNotFoundException {
        return findAccount(accountNumber);
    }
    
    // Lock an account
    public void lockAccount(String accountNumber) throws AccountNotFoundException {
        Account account = findAccount(accountNumber);
        account.lockAccount();
        logger.warning("Account locked: " + accountNumber);
    }
    
    // Unlock an account
    public void unlockAccount(String accountNumber) throws AccountNotFoundException {
        Account account = findAccount(accountNumber);
        account.unlockAccount();
        logger.info("Account unlocked: " + accountNumber);
    }
    
    // Validation methods
    private void validateAccountCreation(String accountNumber, String ownerName, BigDecimal initialBalance) 
            throws InvalidTransactionException {
        
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new InvalidTransactionException("Account number cannot be empty");
        }
        
        if (ownerName == null || ownerName.trim().isEmpty()) {
            throw new InvalidTransactionException("Owner name cannot be empty");
        }
        
        if (initialBalance == null || initialBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidTransactionException("Initial balance cannot be negative");
        }
    }
    
    private void validateTransaction(String accountNumber, BigDecimal amount) 
            throws InvalidTransactionException {
        
        if (maintenanceMode) {
            throw new InvalidTransactionException("System is under maintenance. Please try again later.");
        }
        
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            throw new InvalidTransactionException("Account number cannot be empty");
        }
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Transaction amount must be positive");
        }
        
        if (amount.compareTo(new BigDecimal("1000000")) > 0) {
            throw new InvalidTransactionException("Transaction amount exceeds daily limit");
        }
    }
    
    private Account findAccount(String accountNumber) throws AccountNotFoundException {
        Account account = accounts.get(accountNumber);
        if (account == null) {
            throw new AccountNotFoundException("Account not found: " + accountNumber);
        }
        return account;
    }
    
    private void checkAccountStatus(Account account) throws AccountLockedException {
        if (account.isLocked()) {
            throw new AccountLockedException("Account is locked: " + account.getAccountNumber());
        }
    }
    
    // Utility methods
    public void setMaintenanceMode(boolean maintenanceMode) {
        this.maintenanceMode = maintenanceMode;
        logger.info("Maintenance mode: " + maintenanceMode);
    }
    
    public int getAccountCount() {
        return accounts.size();
    }
}
```

### 4. Create a mock DatabaseService:
```java
import java.util.Random;

public class DatabaseService {
    private final Random random = new Random();
    private boolean simulateFailures = false;
    
    public void saveAccount(Account account) throws Exception {
        simulateOperation("Saving account: " + account.getAccountNumber());
    }
    
    public void updateAccount(Account account) throws Exception {
        simulateOperation("Updating account: " + account.getAccountNumber());
    }
    
    public void updateAccounts(Account account1, Account account2) throws Exception {
        simulateOperation("Updating accounts: " + account1.getAccountNumber() + 
                         " and " + account2.getAccountNumber());
    }
    
    private void simulateOperation(String operation) throws Exception {
        System.out.println("Database: " + operation);
        
        // Simulate processing time
        Thread.sleep(50);
        
        // Simulate occasional failures if enabled
        if (simulateFailures && random.nextDouble() < 0.1) { // 10% failure rate
            throw new Exception("Database connection timeout");
        }
    }
    
    public void enableFailureSimulation() {
        this.simulateFailures = true;
    }
    
    public void disableFailureSimulation() {
        this.simulateFailures = false;
    }
}
```

### 5. Create comprehensive test scenarios:
```java
import java.math.BigDecimal;

public class BankingSystemTest {
    private static BankingService bankingService;
    private static DatabaseService databaseService;
    
    public static void main(String[] args) {
        databaseService = new DatabaseService();
        bankingService = new BankingService(databaseService);
        
        System.out.println("=== Banking System Exception Handling Demo ===\n");
        
        runAllTests();
        
        System.out.println("\n=== All Tests Completed ===");
    }
    
    private static void runAllTests() {
        testAccountCreation();
        testBasicTransactions();
        testExceptionScenarios();
        testAccountLocking();
        testDatabaseFailures();
        testConcurrentAccess();
    }
    
    private static void testAccountCreation() {
        System.out.println("1. Testing Account Creation");
        System.out.println("========================");
        
        try {
            bankingService.createAccount("ACC001", "John Doe", new BigDecimal("1000"));
            System.out.println("✓ Account created successfully");
        } catch (BankingException e) {
            System.err.println("✗ Failed to create account: " + e.getMessage());
        }
        
        // Test duplicate account
        try {
            bankingService.createAccount("ACC001", "Jane Doe", new BigDecimal("500"));
            System.err.println("✗ Should not allow duplicate account");
        } catch (InvalidTransactionException e) {
            System.out.println("✓ Correctly prevented duplicate account: " + e.getMessage());
        } catch (BankingException e) {
            System.err.println("✗ Unexpected exception: " + e.getMessage());
        }
        
        // Test invalid account creation
        try {
            bankingService.createAccount("", "Invalid User", new BigDecimal("-100"));
            System.err.println("✗ Should not allow invalid account");
        } catch (InvalidTransactionException e) {
            System.out.println("✓ Correctly prevented invalid account: " + e.getMessage());
        } catch (BankingException e) {
            System.err.println("✗ Unexpected exception: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static void testBasicTransactions() {
        System.out.println("2. Testing Basic Transactions");
        System.out.println("============================");
        
        try {
            bankingService.createAccount("ACC002", "Alice Smith", new BigDecimal("500"));
            
            // Test deposit
            bankingService.deposit("ACC001", new BigDecimal("200"));
            System.out.println("✓ Deposit successful. Balance: " + bankingService.getBalance("ACC001"));
            
            // Test withdrawal
            bankingService.withdraw("ACC001", new BigDecimal("150"));
            System.out.println("✓ Withdrawal successful. Balance: " + bankingService.getBalance("ACC001"));
            
            // Test transfer
            bankingService.transfer("ACC001", "ACC002", new BigDecimal("100"));
            System.out.println("✓ Transfer successful. ACC001 Balance: " + bankingService.getBalance("ACC001"));
            System.out.println("✓ Transfer successful. ACC002 Balance: " + bankingService.getBalance("ACC002"));
            
        } catch (BankingException e) {
            System.err.println("✗ Transaction failed: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static void testExceptionScenarios() {
        System.out.println("3. Testing Exception Scenarios");
        System.out.println("==============================");
        
        // Test insufficient funds
        try {
            bankingService.withdraw("ACC001", new BigDecimal("10000"));
            System.err.println("✗ Should not allow overdraft");
        } catch (InsufficientFundsException e) {
            System.out.println("✓ Correctly prevented overdraft: " + e.getMessage());
            System.out.println("  Error Code: " + e.getErrorCode());
        } catch (BankingException e) {
            System.err.println("✗ Unexpected exception: " + e.getMessage());
        }
        
        // Test account not found
        try {
            bankingService.getBalance("NONEXISTENT");
            System.err.println("✗ Should not find non-existent account");
        } catch (AccountNotFoundException e) {
            System.out.println("✓ Correctly handled missing account: " + e.getMessage());
            System.out.println("  Error Code: " + e.getErrorCode());
        }
        
        // Test invalid transaction amounts
        try {
            bankingService.deposit("ACC001", new BigDecimal("-50"));
            System.err.println("✗ Should not allow negative deposit");
        } catch (InvalidTransactionException e) {
            System.out.println("✓ Correctly prevented negative deposit: " + e.getMessage());
        } catch (BankingException e) {
            System.err.println("✗ Unexpected exception: " + e.getMessage());
        }
        
        // Test large transaction limit
        try {
            bankingService.deposit("ACC001", new BigDecimal("2000000"));
            System.err.println("✗ Should not allow transaction exceeding limit");
        } catch (InvalidTransactionException e) {
            System.out.println("✓ Correctly prevented large transaction: " + e.getMessage());
        } catch (BankingException e) {
            System.err.println("✗ Unexpected exception: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static void testAccountLocking() {
        System.out.println("4. Testing Account Locking");
        System.out.println("=========================");
        
        try {
            bankingService.createAccount("ACC003", "Bob Wilson", new BigDecimal("1000"));
            
            // Trigger multiple failed transactions
            for (int i = 0; i < 3; i++) {
                try {
                    bankingService.withdraw("ACC003", new BigDecimal("2000"));
                } catch (InsufficientFundsException e) {
                    System.out.println("Failed transaction " + (i + 1) + ": " + e.getMessage());
                }
            }
            
            // Account should now be locked
            try {
                bankingService.deposit("ACC003", new BigDecimal("100"));
                System.err.println("✗ Should not allow transaction on locked account");
            } catch (AccountLockedException e) {
                System.out.println("✓ Account correctly locked: " + e.getMessage());
                System.out.println("  Error Code: " + e.getErrorCode());
            }
            
            // Unlock and test
            bankingService.unlockAccount("ACC003");
            bankingService.deposit("ACC003", new BigDecimal("100"));
            System.out.println("✓ Account unlocked and transaction successful");
            
        } catch (BankingException e) {
            System.err.println("✗ Test failed: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static void testDatabaseFailures() {
        System.out.println("5. Testing Database Failures");
        System.out.println("============================");
        
        // Enable failure simulation
        databaseService.enableFailureSimulation();
        
        try {
            bankingService.createAccount("ACC004", "Charlie Brown", new BigDecimal("1000"));
            
            // Try multiple operations - some may fail
            for (int i = 0; i < 5; i++) {
                try {
                    bankingService.deposit("ACC004", new BigDecimal("10"));
                    System.out.println("✓ Deposit " + (i + 1) + " successful");
                } catch (DatabaseConnectionException e) {
                    System.out.println("✗ Deposit " + (i + 1) + " failed (simulated): " + e.getMessage());
                    System.out.println("  Error Code: " + e.getErrorCode());
                    System.out.println("  Caused by: " + e.getCause().getMessage());
                }
                
                // Small delay between operations
                try {
                    Thread.sleep(100);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            }
            
        } catch (BankingException e) {
            System.err.println("✗ Test setup failed: " + e.getMessage());
        }
        
        // Disable failure simulation
        databaseService.disableFailureSimulation();
        System.out.println();
    }
    
    private static void testConcurrentAccess() {
        System.out.println("6. Testing Concurrent Access");
        System.out.println("============================");
        
        try {
            bankingService.createAccount("ACC005", "David Lee", new BigDecimal("1000"));
            
            // Create multiple threads performing transactions
            Thread[] threads = new Thread[5];
            
            for (int i = 0; i < threads.length; i++) {
                final int threadId = i;
                threads[i] = new Thread(() -> {
                    try {
                        for (int j = 0; j < 3; j++) {
                            bankingService.deposit("ACC005", new BigDecimal("10"));
                            Thread.sleep(50);
                            bankingService.withdraw("ACC005", new BigDecimal("5"));
                            Thread.sleep(50);
                        }
                        System.out.println("✓ Thread " + threadId + " completed successfully");
                    } catch (BankingException e) {
                        System.err.println("✗ Thread " + threadId + " failed: " + e.getMessage());
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                });
            }
            
            // Start all threads
            for (Thread thread : threads) {
                thread.start();
            }
            
            // Wait for all threads to complete
            for (Thread thread : threads) {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            
            System.out.println("Final balance: " + bankingService.getBalance("ACC005"));
            
        } catch (BankingException e) {
            System.err.println("✗ Concurrent test failed: " + e.getMessage());
        }
        
        System.out.println();
    }
}
```

### Bonus Features (Optional):
- Add transaction logging with timestamps
- Implement retry mechanisms for database failures
- Add email notifications for account locks
- Create transaction history tracking
- Implement transaction rollback capabilities
