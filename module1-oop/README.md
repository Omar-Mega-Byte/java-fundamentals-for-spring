# Module 1: Object-Oriented Programming

## 📋 Overview
Essential OOP concepts that form the foundation of Spring Framework development.

## 🎯 Learning Objectives
- Master the four pillars of OOP
- Understand Java class design principles
- Apply SOLID principles effectively
- Recognize OOP patterns used in Spring

## 📚 Core Concepts

### 1. Encapsulation
**Definition**: Bundling data and methods that operate on that data within a single unit.

```java
public class BankAccount {
    private double balance;  // Encapsulated field
    private String accountNumber;
    
    // Controlled access through methods
    public double getBalance() {
        return balance;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
}
```

**Spring Relevance**: Spring beans use encapsulation to hide internal state and expose controlled interfaces.

### 2. Inheritance
**Definition**: Mechanism where a new class inherits properties and methods from an existing class.

```java
// Base class
public abstract class Vehicle {
    protected String brand;
    protected int year;
    
    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    // Template method pattern
    public abstract void start();
    
    public void displayInfo() {
        System.out.println(brand + " " + year);
    }
}

// Derived class
public class Car extends Vehicle {
    private int doors;
    
    public Car(String brand, int year, int doors) {
        super(brand, year);
        this.doors = doors;
    }
    
    @Override
    public void start() {
        System.out.println("Car engine started");
    }
}
```

**Spring Relevance**: Spring uses inheritance in many places, like extending `ApplicationContextAware` or implementing callback interfaces.

### 3. Polymorphism
**Definition**: Ability of objects of different types to be treated as instances of the same type through a common interface.

```java
// Interface defining contract
public interface PaymentProcessor {
    boolean processPayment(double amount);
    String getPaymentMethod();
}

// Different implementations
public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // Credit card processing logic
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "Credit Card";
    }
}

public class PayPalProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // PayPal processing logic
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "PayPal";
    }
}

// Polymorphic usage
public class PaymentService {
    public void processOrder(PaymentProcessor processor, double amount) {
        if (processor.processPayment(amount)) {
            System.out.println("Payment successful via " + processor.getPaymentMethod());
        }
    }
}
```

**Spring Relevance**: Dependency injection relies heavily on polymorphism to inject different implementations.

### 4. Abstraction
**Definition**: Hiding complex implementation details while exposing only essential features.

```java
// Abstract class providing template
public abstract class DatabaseConnection {
    // Template method
    public final void connect() {
        openConnection();
        authenticate();
        configureSettings();
    }
    
    // Abstract methods to be implemented by subclasses
    protected abstract void openConnection();
    protected abstract void authenticate();
    
    // Common implementation
    protected void configureSettings() {
        System.out.println("Applying default settings");
    }
}

// Interface for data access abstraction
public interface UserRepository {
    User findById(Long id);
    List<User> findAll();
    void save(User user);
    void delete(Long id);
}
```

**Spring Relevance**: Spring Data repositories are perfect examples of abstraction in action.

## 🏗️ SOLID Principles

### Single Responsibility Principle (SRP)
Each class should have only one reason to change.

```java
// BAD: Multiple responsibilities
public class UserProcessor {
    public void saveUser(User user) { /* DB logic */ }
    public void sendEmail(User user) { /* Email logic */ }
    public void validateUser(User user) { /* Validation logic */ }
}

// GOOD: Single responsibility
public class UserRepository {
    public void save(User user) { /* Only DB operations */ }
}

public class EmailService {
    public void sendWelcomeEmail(User user) { /* Only email logic */ }
}

public class UserValidator {
    public boolean validate(User user) { /* Only validation logic */ }
}
```

### Open/Closed Principle (OCP)
Classes should be open for extension but closed for modification.

```java
// Using Strategy pattern to follow OCP
public interface DiscountStrategy {
    double calculateDiscount(double amount);
}

public class RegularCustomerDiscount implements DiscountStrategy {
    @Override
    public double calculateDiscount(double amount) {
        return amount * 0.05; // 5% discount
    }
}

public class PremiumCustomerDiscount implements DiscountStrategy {
    @Override
    public double calculateDiscount(double amount) {
        return amount * 0.15; // 15% discount
    }
}

public class OrderProcessor {
    public double processOrder(double amount, DiscountStrategy strategy) {
        double discount = strategy.calculateDiscount(amount);
        return amount - discount;
    }
}
```

### Liskov Substitution Principle (LSP)
Objects should be replaceable with instances of their subtypes without altering program correctness.

```java
public abstract class Bird {
    public abstract void eat();
    public abstract void makeSound();
}

public class Sparrow extends Bird {
    @Override
    public void eat() {
        System.out.println("Sparrow eats seeds");
    }
    
    @Override
    public void makeSound() {
        System.out.println("Chirp chirp");
    }
    
    public void fly() {
        System.out.println("Sparrow flies");
    }
}

// Any Bird reference can be replaced with Sparrow
Bird bird = new Sparrow();
bird.eat(); // Works correctly
```

### Interface Segregation Principle (ISP)
Clients shouldn't be forced to depend on interfaces they don't use.

```java
// BAD: Fat interface
public interface Worker {
    void work();
    void eat();
    void sleep();
}

// GOOD: Segregated interfaces
public interface Workable {
    void work();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

public class Human implements Workable, Eatable, Sleepable {
    @Override
    public void work() { /* implementation */ }
    
    @Override
    public void eat() { /* implementation */ }
    
    @Override
    public void sleep() { /* implementation */ }
}

public class Robot implements Workable {
    @Override
    public void work() { /* implementation */ }
    // Robot doesn't need to eat or sleep
}
```

### Dependency Inversion Principle (DIP)
High-level modules shouldn't depend on low-level modules. Both should depend on abstractions.

```java
// BAD: High-level class depends on low-level class
public class OrderService {
    private MySQLDatabase database; // Direct dependency
    
    public void saveOrder(Order order) {
        database.save(order);
    }
}

// GOOD: Both depend on abstraction
public interface Database {
    void save(Order order);
}

public class OrderService {
    private Database database; // Depends on abstraction
    
    public OrderService(Database database) {
        this.database = database;
    }
    
    public void saveOrder(Order order) {
        database.save(order);
    }
}

public class MySQLDatabase implements Database {
    @Override
    public void save(Order order) {
        // MySQL specific implementation
    }
}
```

**Spring Relevance**: This is the foundation of Spring's Dependency Injection!

## 🎯 Spring Framework Connections

### 1. Bean Definition and Lifecycle
Spring beans are Java objects managed by the IoC container, following OOP principles:

```java
@Component
public class UserService {
    private final UserRepository userRepository;
    
    // Constructor injection following DIP
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(String username, String email) {
        // Business logic encapsulated
        User user = new User(username, email);
        return userRepository.save(user);
    }
}
```

### 2. Interface-Based Design
Spring heavily uses interfaces for loose coupling:

```java
public interface UserService {
    User findById(Long id);
    User save(User user);
}

@Service
public class UserServiceImpl implements UserService {
    // Implementation details hidden
}
```

## ⚠️ Common Pitfalls

1. **God Classes**: Avoid classes that do too much
2. **Tight Coupling**: Always program to interfaces
3. **Inheritance Overuse**: Favor composition over inheritance
4. **Breaking Encapsulation**: Avoid public fields

## 🏃‍♂️ Practice Exercises

1. Design a simple e-commerce system using all four OOP pillars
2. Refactor a monolithic class to follow SOLID principles
3. Create a payment processing system using polymorphism
4. Implement a logging framework using the Template Method pattern

## 📖 Further Reading

- Effective Java by Joshua Bloch (Items 15-24)
- Clean Code by Robert Martin (Chapter 6: Objects and Data Structures)
- Design Patterns: Elements of Reusable Object-Oriented Software

---
**Next Module**: [Collections Framework](../module2-collections/README.md)
