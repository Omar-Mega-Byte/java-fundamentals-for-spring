# Module 09: Design Patterns - Answers

## Task 1: MCQ Quiz Answers

### 1. What type of pattern is Singleton?
**Answer: a) Creational**

Explanation: Singleton is a creational pattern that ensures a class has only one instance and provides global access to that instance.

### 2. Which pattern is used to create families of related objects?
**Answer: b) Abstract Factory**

Explanation: Abstract Factory pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes.

### 3. What is the main purpose of the Observer pattern?
**Answer: c) To notify multiple objects about state changes**

Explanation: Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified automatically.

### 4. Which pattern allows incompatible interfaces to work together?
**Answer: a) Adapter**

Explanation: Adapter pattern allows objects with incompatible interfaces to collaborate by converting the interface of one class into another interface that clients expect.

### 5. What does the Strategy pattern help achieve?
**Answer: d) All of the above**

Explanation: Strategy pattern encapsulates algorithms (different ways of doing something), allows swapping at runtime, and promotes loose coupling between client and algorithms.

### 6. Which pattern is used to add new functionality to objects dynamically?
**Answer: b) Decorator**

Explanation: Decorator pattern allows behavior to be added to objects dynamically without altering their structure, providing a flexible alternative to subclassing.

### 7. What is a key characteristic of the Factory Method pattern?
**Answer: c) Subclasses decide which class to instantiate**

Explanation: Factory Method pattern defines an interface for creating objects, but lets subclasses decide which class to instantiate, promoting loose coupling.

### 8. Which pattern ensures only one instance of a class exists?
**Answer: a) Singleton**

Explanation: Singleton pattern restricts instantiation of a class to one single instance and provides global access to that instance.

### 9. What does the Command pattern encapsulate?
**Answer: b) Requests as objects**

Explanation: Command pattern encapsulates a request as an object, allowing you to parameterize clients with different requests, queue operations, and support undo functionality.

### 10. Which pattern is used to simplify complex subsystems?
**Answer: d) Facade**

Explanation: Facade pattern provides a unified interface to a set of interfaces in a subsystem, making the subsystem easier to use by hiding its complexity.

---

## Task 2: E-commerce System with Design Patterns

### Complete Implementation with All Classes:

```java
// ===== SINGLETON PATTERN - CONFIGURATION MANAGER =====

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ConfigurationManager {
    private static volatile ConfigurationManager instance;
    private final Map<String, String> properties;
    
    private ConfigurationManager() {
        properties = new ConcurrentHashMap<>();
        loadDefaultProperties();
    }
    
    public static ConfigurationManager getInstance() {
        if (instance == null) {
            synchronized (ConfigurationManager.class) {
                if (instance == null) {
                    instance = new ConfigurationManager();
                }
            }
        }
        return instance;
    }
    
    private void loadDefaultProperties() {
        properties.put("max.cart.items", "50");
        properties.put("shipping.free.threshold", "100.0");
        properties.put("tax.rate", "0.08");
        properties.put("currency", "USD");
        properties.put("payment.timeout", "300");
        System.out.println("Configuration loaded with default properties");
    }
    
    public String getProperty(String key) {
        return properties.get(key);
    }
    
    public void setProperty(String key, String value) {
        properties.put(key, value);
        System.out.println("Configuration updated: " + key + " = " + value);
    }
    
    public double getDoubleProperty(String key, double defaultValue) {
        String value = properties.get(key);
        try {
            return value != null ? Double.parseDouble(value) : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    public int getIntProperty(String key, int defaultValue) {
        String value = properties.get(key);
        try {
            return value != null ? Integer.parseInt(value) : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}

// ===== FACTORY PATTERN - PRODUCT FACTORY =====

// Product interface
interface Product {
    String getId();
    String getName();
    double getPrice();
    String getCategory();
    String getDescription();
    boolean isAvailable();
    void setAvailable(boolean available);
}

// Product implementations
class Electronics implements Product {
    private String id;
    private String name;
    private double price;
    private String brand;
    private int warrantyMonths;
    private boolean available;
    
    public Electronics(String id, String name, double price, String brand, int warrantyMonths) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.brand = brand;
        this.warrantyMonths = warrantyMonths;
        this.available = true;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getName() { return name; }
    
    @Override
    public double getPrice() { return price; }
    
    @Override
    public String getCategory() { return "Electronics"; }
    
    @Override
    public String getDescription() {
        return String.format("%s by %s - %d months warranty", name, brand, warrantyMonths);
    }
    
    @Override
    public boolean isAvailable() { return available; }
    
    @Override
    public void setAvailable(boolean available) { this.available = available; }
    
    public String getBrand() { return brand; }
    public int getWarrantyMonths() { return warrantyMonths; }
}

class Clothing implements Product {
    private String id;
    private String name;
    private double price;
    private String size;
    private String color;
    private String material;
    private boolean available;
    
    public Clothing(String id, String name, double price, String size, String color, String material) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.size = size;
        this.color = color;
        this.material = material;
        this.available = true;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getName() { return name; }
    
    @Override
    public double getPrice() { return price; }
    
    @Override
    public String getCategory() { return "Clothing"; }
    
    @Override
    public String getDescription() {
        return String.format("%s - Size %s, %s %s", name, size, color, material);
    }
    
    @Override
    public boolean isAvailable() { return available; }
    
    @Override
    public void setAvailable(boolean available) { this.available = available; }
    
    public String getSize() { return size; }
    public String getColor() { return color; }
    public String getMaterial() { return material; }
}

class Books implements Product {
    private String id;
    private String name;
    private double price;
    private String author;
    private String isbn;
    private int pages;
    private boolean available;
    
    public Books(String id, String name, double price, String author, String isbn, int pages) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.author = author;
        this.isbn = isbn;
        this.pages = pages;
        this.available = true;
    }
    
    @Override
    public String getId() { return id; }
    
    @Override
    public String getName() { return name; }
    
    @Override
    public double getPrice() { return price; }
    
    @Override
    public String getCategory() { return "Books"; }
    
    @Override
    public String getDescription() {
        return String.format("%s by %s - %d pages (ISBN: %s)", name, author, pages, isbn);
    }
    
    @Override
    public boolean isAvailable() { return available; }
    
    @Override
    public void setAvailable(boolean available) { this.available = available; }
    
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public int getPages() { return pages; }
}

// Factory for creating products
class ProductFactory {
    public static Product createElectronics(String id, String name, double price, 
                                          String brand, int warrantyMonths) {
        return new Electronics(id, name, price, brand, warrantyMonths);
    }
    
    public static Product createClothing(String id, String name, double price, 
                                       String size, String color, String material) {
        return new Clothing(id, name, price, size, color, material);
    }
    
    public static Product createBook(String id, String name, double price, 
                                   String author, String isbn, int pages) {
        return new Books(id, name, price, author, isbn, pages);
    }
    
    // Generic factory method
    public static Product createProduct(String type, String id, String name, double price, 
                                      Map<String, Object> attributes) {
        switch (type.toLowerCase()) {
            case "electronics":
                return createElectronics(id, name, price,
                    (String) attributes.get("brand"),
                    (Integer) attributes.get("warrantyMonths"));
            case "clothing":
                return createClothing(id, name, price,
                    (String) attributes.get("size"),
                    (String) attributes.get("color"),
                    (String) attributes.get("material"));
            case "books":
                return createBook(id, name, price,
                    (String) attributes.get("author"),
                    (String) attributes.get("isbn"),
                    (Integer) attributes.get("pages"));
            default:
                throw new IllegalArgumentException("Unknown product type: " + type);
        }
    }
}

// ===== OBSERVER PATTERN - INVENTORY MANAGEMENT =====

import java.util.concurrent.CopyOnWriteArrayList;

// Observer interface
interface InventoryObserver {
    void onStockChanged(String productId, int newStock, int oldStock);
    void onLowStock(String productId, int currentStock, int threshold);
    void onOutOfStock(String productId);
}

// Subject (Observable)
interface InventorySubject {
    void addObserver(InventoryObserver observer);
    void removeObserver(InventoryObserver observer);
    void notifyObservers(String productId, int newStock, int oldStock);
}

// Inventory management with observer pattern
class InventoryManager implements InventorySubject {
    private final Map<String, Integer> stock;
    private final Map<String, Integer> lowStockThresholds;
    private final List<InventoryObserver> observers;
    
    public InventoryManager() {
        this.stock = new ConcurrentHashMap<>();
        this.lowStockThresholds = new ConcurrentHashMap<>();
        this.observers = new CopyOnWriteArrayList<>();
    }
    
    @Override
    public void addObserver(InventoryObserver observer) {
        observers.add(observer);
        System.out.println("Observer added to inventory manager");
    }
    
    @Override
    public void removeObserver(InventoryObserver observer) {
        observers.remove(observer);
        System.out.println("Observer removed from inventory manager");
    }
    
    @Override
    public void notifyObservers(String productId, int newStock, int oldStock) {
        for (InventoryObserver observer : observers) {
            observer.onStockChanged(productId, newStock, oldStock);
            
            int threshold = lowStockThresholds.getOrDefault(productId, 5);
            if (newStock <= threshold && newStock > 0) {
                observer.onLowStock(productId, newStock, threshold);
            } else if (newStock == 0) {
                observer.onOutOfStock(productId);
            }
        }
    }
    
    public void setStock(String productId, int quantity) {
        int oldStock = stock.getOrDefault(productId, 0);
        stock.put(productId, quantity);
        notifyObservers(productId, quantity, oldStock);
    }
    
    public void adjustStock(String productId, int change) {
        int oldStock = stock.getOrDefault(productId, 0);
        int newStock = Math.max(0, oldStock + change);
        stock.put(productId, newStock);
        notifyObservers(productId, newStock, oldStock);
    }
    
    public int getStock(String productId) {
        return stock.getOrDefault(productId, 0);
    }
    
    public void setLowStockThreshold(String productId, int threshold) {
        lowStockThresholds.put(productId, threshold);
    }
    
    public boolean isInStock(String productId) {
        return getStock(productId) > 0;
    }
}

// Concrete observers
class NotificationService implements InventoryObserver {
    @Override
    public void onStockChanged(String productId, int newStock, int oldStock) {
        System.out.println("📧 NOTIFICATION: Stock changed for " + productId + 
                         " from " + oldStock + " to " + newStock);
    }
    
    @Override
    public void onLowStock(String productId, int currentStock, int threshold) {
        System.out.println("⚠️ LOW STOCK ALERT: Product " + productId + 
                         " has only " + currentStock + " items left (threshold: " + threshold + ")");
    }
    
    @Override
    public void onOutOfStock(String productId) {
        System.out.println("🚨 OUT OF STOCK: Product " + productId + " is no longer available");
    }
}

class ReorderService implements InventoryObserver {
    @Override
    public void onStockChanged(String productId, int newStock, int oldStock) {
        // Only log significant changes
        if (Math.abs(newStock - oldStock) >= 10) {
            System.out.println("📊 REORDER: Significant stock change for " + productId);
        }
    }
    
    @Override
    public void onLowStock(String productId, int currentStock, int threshold) {
        System.out.println("🔄 AUTO-REORDER: Initiating reorder for " + productId + 
                         " (current: " + currentStock + ")");
    }
    
    @Override
    public void onOutOfStock(String productId) {
        System.out.println("🚨 URGENT REORDER: Emergency reorder needed for " + productId);
    }
}

// ===== STRATEGY PATTERN - PAYMENT PROCESSING =====

// Payment strategy interface
interface PaymentStrategy {
    PaymentResult processPayment(double amount, String currency);
    String getPaymentMethodName();
    boolean isAvailable();
}

// Payment result class
class PaymentResult {
    private final boolean success;
    private final String transactionId;
    private final String message;
    private final double amount;
    
    public PaymentResult(boolean success, String transactionId, String message, double amount) {
        this.success = success;
        this.transactionId = transactionId;
        this.message = message;
        this.amount = amount;
    }
    
    public boolean isSuccess() { return success; }
    public String getTransactionId() { return transactionId; }
    public String getMessage() { return message; }
    public double getAmount() { return amount; }
    
    @Override
    public String toString() {
        return String.format("PaymentResult{success=%s, id='%s', amount=%.2f, message='%s'}",
                           success, transactionId, amount, message);
    }
}

// Concrete payment strategies
class CreditCardPayment implements PaymentStrategy {
    private final String cardNumber;
    private final String cardHolder;
    private final String expiryDate;
    
    public CreditCardPayment(String cardNumber, String cardHolder, String expiryDate) {
        this.cardNumber = maskCardNumber(cardNumber);
        this.cardHolder = cardHolder;
        this.expiryDate = expiryDate;
    }
    
    private String maskCardNumber(String cardNumber) {
        if (cardNumber.length() < 4) return cardNumber;
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }
    
    @Override
    public PaymentResult processPayment(double amount, String currency) {
        // Simulate payment processing
        try {
            Thread.sleep(1000); // Simulate network delay
            
            if (amount > 10000) {
                return new PaymentResult(false, null, "Amount exceeds credit limit", amount);
            }
            
            String transactionId = "CC" + System.currentTimeMillis();
            return new PaymentResult(true, transactionId, 
                                   "Credit card payment successful", amount);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new PaymentResult(false, null, "Payment interrupted", amount);
        }
    }
    
    @Override
    public String getPaymentMethodName() {
        return "Credit Card (" + cardNumber + ")";
    }
    
    @Override
    public boolean isAvailable() {
        return true; // Credit cards are always available
    }
}

class PayPalPayment implements PaymentStrategy {
    private final String email;
    private boolean loggedIn;
    
    public PayPalPayment(String email) {
        this.email = email;
        this.loggedIn = false;
    }
    
    public void login() {
        loggedIn = true;
        System.out.println("PayPal: Logged in as " + email);
    }
    
    @Override
    public PaymentResult processPayment(double amount, String currency) {
        if (!loggedIn) {
            return new PaymentResult(false, null, "Not logged in to PayPal", amount);
        }
        
        try {
            Thread.sleep(800); // Simulate API call
            
            String transactionId = "PP" + System.currentTimeMillis();
            return new PaymentResult(true, transactionId, 
                                   "PayPal payment successful", amount);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new PaymentResult(false, null, "Payment interrupted", amount);
        }
    }
    
    @Override
    public String getPaymentMethodName() {
        return "PayPal (" + email + ")";
    }
    
    @Override
    public boolean isAvailable() {
        return loggedIn;
    }
}

class BankTransferPayment implements PaymentStrategy {
    private final String accountNumber;
    private final String bankCode;
    
    public BankTransferPayment(String accountNumber, String bankCode) {
        this.accountNumber = maskAccountNumber(accountNumber);
        this.bankCode = bankCode;
    }
    
    private String maskAccountNumber(String accountNumber) {
        if (accountNumber.length() < 4) return accountNumber;
        return "****" + accountNumber.substring(accountNumber.length() - 4);
    }
    
    @Override
    public PaymentResult processPayment(double amount, String currency) {
        try {
            Thread.sleep(1500); // Bank transfers take longer
            
            // Simulate business hours check
            Calendar cal = Calendar.getInstance();
            int hour = cal.get(Calendar.HOUR_OF_DAY);
            if (hour < 9 || hour > 17) {
                return new PaymentResult(false, null, 
                                       "Bank transfers only available during business hours", amount);
            }
            
            String transactionId = "BT" + System.currentTimeMillis();
            return new PaymentResult(true, transactionId, 
                                   "Bank transfer initiated successfully", amount);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new PaymentResult(false, null, "Payment interrupted", amount);
        }
    }
    
    @Override
    public String getPaymentMethodName() {
        return "Bank Transfer (" + accountNumber + ")";
    }
    
    @Override
    public boolean isAvailable() {
        Calendar cal = Calendar.getInstance();
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        return hour >= 9 && hour <= 17; // Business hours only
    }
}

// Payment processor context
class PaymentProcessor {
    private PaymentStrategy strategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
        System.out.println("Payment method set to: " + strategy.getPaymentMethodName());
    }
    
    public PaymentResult processPayment(double amount, String currency) {
        if (strategy == null) {
            return new PaymentResult(false, null, "No payment method selected", amount);
        }
        
        if (!strategy.isAvailable()) {
            return new PaymentResult(false, null, 
                                   "Payment method not available: " + strategy.getPaymentMethodName(), 
                                   amount);
        }
        
        System.out.println("Processing payment of " + amount + " " + currency + 
                         " using " + strategy.getPaymentMethodName());
        
        return strategy.processPayment(amount, currency);
    }
}

// ===== DECORATOR PATTERN - SHIPPING =====

// Base shipping interface
interface Shipping {
    double calculateCost(double weight, String destination);
    String getDescription();
    int getEstimatedDays();
}

// Base shipping implementation
class StandardShipping implements Shipping {
    @Override
    public double calculateCost(double weight, String destination) {
        return weight * 2.0; // $2 per kg
    }
    
    @Override
    public String getDescription() {
        return "Standard Shipping";
    }
    
    @Override
    public int getEstimatedDays() {
        return 7;
    }
}

// Base shipping decorator
abstract class ShippingDecorator implements Shipping {
    protected Shipping shipping;
    
    public ShippingDecorator(Shipping shipping) {
        this.shipping = shipping;
    }
    
    @Override
    public double calculateCost(double weight, String destination) {
        return shipping.calculateCost(weight, destination);
    }
    
    @Override
    public String getDescription() {
        return shipping.getDescription();
    }
    
    @Override
    public int getEstimatedDays() {
        return shipping.getEstimatedDays();
    }
}

// Concrete decorators
class ExpressShipping extends ShippingDecorator {
    public ExpressShipping(Shipping shipping) {
        super(shipping);
    }
    
    @Override
    public double calculateCost(double weight, String destination) {
        return super.calculateCost(weight, destination) + 15.0; // +$15 for express
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + " + Express";
    }
    
    @Override
    public int getEstimatedDays() {
        return Math.max(1, super.getEstimatedDays() - 4); // 4 days faster
    }
}

class InsuredShipping extends ShippingDecorator {
    private final double insuranceValue;
    
    public InsuredShipping(Shipping shipping, double insuranceValue) {
        super(shipping);
        this.insuranceValue = insuranceValue;
    }
    
    @Override
    public double calculateCost(double weight, String destination) {
        double baseCost = super.calculateCost(weight, destination);
        double insuranceCost = insuranceValue * 0.01; // 1% of value
        return baseCost + insuranceCost;
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + " + Insurance ($" + insuranceValue + ")";
    }
}

class SignatureRequiredShipping extends ShippingDecorator {
    public SignatureRequiredShipping(Shipping shipping) {
        super(shipping);
    }
    
    @Override
    public double calculateCost(double weight, String destination) {
        return super.calculateCost(weight, destination) + 5.0; // +$5 for signature
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + " + Signature Required";
    }
}

// ===== MAIN E-COMMERCE SYSTEM =====

class ECommerceSystem {
    private final ConfigurationManager config;
    private final InventoryManager inventory;
    private final PaymentProcessor paymentProcessor;
    private final Map<String, Product> products;
    private final NotificationService notificationService;
    private final ReorderService reorderService;
    
    public ECommerceSystem() {
        this.config = ConfigurationManager.getInstance();
        this.inventory = new InventoryManager();
        this.paymentProcessor = new PaymentProcessor();
        this.products = new ConcurrentHashMap<>();
        
        // Set up observers
        this.notificationService = new NotificationService();
        this.reorderService = new ReorderService();
        
        inventory.addObserver(notificationService);
        inventory.addObserver(reorderService);
        
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        System.out.println("Initializing e-commerce system with sample data...");
        
        // Create sample products
        Map<String, Object> electronicsAttrs = new HashMap<>();
        electronicsAttrs.put("brand", "TechCorp");
        electronicsAttrs.put("warrantyMonths", 24);
        
        Product laptop = ProductFactory.createProduct("electronics", "E001", 
            "Gaming Laptop", 1299.99, electronicsAttrs);
        
        Map<String, Object> clothingAttrs = new HashMap<>();
        clothingAttrs.put("size", "M");
        clothingAttrs.put("color", "Blue");
        clothingAttrs.put("material", "Cotton");
        
        Product shirt = ProductFactory.createProduct("clothing", "C001", 
            "Casual Shirt", 39.99, clothingAttrs);
        
        Map<String, Object> bookAttrs = new HashMap<>();
        bookAttrs.put("author", "John Smith");
        bookAttrs.put("isbn", "978-1234567890");
        bookAttrs.put("pages", 350);
        
        Product book = ProductFactory.createProduct("books", "B001", 
            "Java Programming Guide", 49.99, bookAttrs);
        
        // Add products to catalog
        products.put(laptop.getId(), laptop);
        products.put(shirt.getId(), shirt);
        products.put(book.getId(), book);
        
        // Set initial inventory
        inventory.setStock("E001", 25);
        inventory.setStock("C001", 100);
        inventory.setStock("B001", 50);
        
        // Set low stock thresholds
        inventory.setLowStockThreshold("E001", 5);
        inventory.setLowStockThreshold("C001", 20);
        inventory.setLowStockThreshold("B001", 10);
        
        System.out.println("Sample data initialized successfully");
    }
    
    public void demonstratePatterns() {
        System.out.println("\n=== E-Commerce System Pattern Demonstration ===");
        
        // Demonstrate Singleton pattern
        demonstrateSingleton();
        
        // Demonstrate Factory pattern
        demonstrateFactory();
        
        // Demonstrate Observer pattern
        demonstrateObserver();
        
        // Demonstrate Strategy pattern
        demonstrateStrategy();
        
        // Demonstrate Decorator pattern
        demonstrateDecorator();
    }
    
    private void demonstrateSingleton() {
        System.out.println("\n--- Singleton Pattern (Configuration) ---");
        
        ConfigurationManager config1 = ConfigurationManager.getInstance();
        ConfigurationManager config2 = ConfigurationManager.getInstance();
        
        System.out.println("Same instance? " + (config1 == config2));
        System.out.println("Tax rate: " + config1.getProperty("tax.rate"));
        
        config1.setProperty("discount.rate", "0.10");
        System.out.println("Discount rate from config2: " + config2.getProperty("discount.rate"));
    }
    
    private void demonstrateFactory() {
        System.out.println("\n--- Factory Pattern (Product Creation) ---");
        
        // Create products using factory
        Map<String, Object> attrs = new HashMap<>();
        attrs.put("brand", "Samsung");
        attrs.put("warrantyMonths", 12);
        
        Product phone = ProductFactory.createProduct("electronics", "E002", 
            "Smartphone", 699.99, attrs);
        
        System.out.println("Created product: " + phone.getDescription());
        products.put(phone.getId(), phone);
        inventory.setStock(phone.getId(), 30);
    }
    
    private void demonstrateObserver() {
        System.out.println("\n--- Observer Pattern (Inventory Changes) ---");
        
        System.out.println("Simulating sales and inventory changes...");
        
        // Simulate sales
        inventory.adjustStock("E001", -20); // Trigger low stock
        inventory.adjustStock("C001", -85);  // Trigger low stock
        inventory.adjustStock("B001", -50);  // Trigger out of stock
    }
    
    private void demonstrateStrategy() {
        System.out.println("\n--- Strategy Pattern (Payment Processing) ---");
        
        double amount = 299.99;
        
        // Try different payment methods
        PaymentStrategy creditCard = new CreditCardPayment("1234567890123456", "John Doe", "12/25");
        paymentProcessor.setPaymentStrategy(creditCard);
        PaymentResult result1 = paymentProcessor.processPayment(amount, "USD");
        System.out.println("Credit Card Result: " + result1);
        
        PayPalPayment paypal = new PayPalPayment("john@example.com");
        paypal.login();
        paymentProcessor.setPaymentStrategy(paypal);
        PaymentResult result2 = paymentProcessor.processPayment(amount, "USD");
        System.out.println("PayPal Result: " + result2);
        
        PaymentStrategy bankTransfer = new BankTransferPayment("9876543210", "BANK001");
        paymentProcessor.setPaymentStrategy(bankTransfer);
        PaymentResult result3 = paymentProcessor.processPayment(amount, "USD");
        System.out.println("Bank Transfer Result: " + result3);
    }
    
    private void demonstrateDecorator() {
        System.out.println("\n--- Decorator Pattern (Shipping Options) ---");
        
        double weight = 2.5; // kg
        String destination = "New York";
        
        // Base shipping
        Shipping shipping = new StandardShipping();
        System.out.println(shipping.getDescription() + ": $" + 
                          shipping.calculateCost(weight, destination) + 
                          " (" + shipping.getEstimatedDays() + " days)");
        
        // Add express shipping
        shipping = new ExpressShipping(shipping);
        System.out.println(shipping.getDescription() + ": $" + 
                          shipping.calculateCost(weight, destination) + 
                          " (" + shipping.getEstimatedDays() + " days)");
        
        // Add insurance
        shipping = new InsuredShipping(shipping, 500.0);
        System.out.println(shipping.getDescription() + ": $" + 
                          shipping.calculateCost(weight, destination) + 
                          " (" + shipping.getEstimatedDays() + " days)");
        
        // Add signature required
        shipping = new SignatureRequiredShipping(shipping);
        System.out.println(shipping.getDescription() + ": $" + 
                          shipping.calculateCost(weight, destination) + 
                          " (" + shipping.getEstimatedDays() + " days)");
    }
    
    public void listProducts() {
        System.out.println("\n=== Product Catalog ===");
        for (Product product : products.values()) {
            int stock = inventory.getStock(product.getId());
            System.out.printf("%-10s | %-30s | $%8.2f | Stock: %3d | %s%n",
                product.getId(),
                product.getName(),
                product.getPrice(),
                stock,
                product.getDescription());
        }
    }
}

// ===== MAIN DEMONSTRATION =====

public class ECommerceDemo {
    public static void main(String[] args) {
        try {
            System.out.println("E-Commerce System with Design Patterns");
            System.out.println("=====================================");
            
            ECommerceSystem system = new ECommerceSystem();
            
            // Show initial state
            system.listProducts();
            
            // Demonstrate all patterns
            system.demonstratePatterns();
            
            // Show final state
            system.listProducts();
            
            System.out.println("\n=== Demo Completed Successfully ===");
            
        } catch (Exception e) {
            System.err.println("Error in demo: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### Expected Output:
```
Configuration loaded with default properties
Initializing e-commerce system with sample data...
Observer added to inventory manager
Observer added to inventory manager
📧 NOTIFICATION: Stock changed for E001 from 0 to 25
📧 NOTIFICATION: Stock changed for C001 from 0 to 100
📧 NOTIFICATION: Stock changed for B001 from 0 to 50
Sample data initialized successfully

=== Product Catalog ===
E001       | Gaming Laptop                  | $ 1299.99 | Stock:  25 | Gaming Laptop by TechCorp - 24 months warranty
C001       | Casual Shirt                   | $   39.99 | Stock: 100 | Casual Shirt - Size M, Blue Cotton
B001       | Java Programming Guide         | $   49.99 | Stock:  50 | Java Programming Guide by John Smith - 350 pages (ISBN: 978-1234567890)

=== E-Commerce System Pattern Demonstration ===

--- Singleton Pattern (Configuration) ---
Same instance? true
Tax rate: 0.08
Configuration updated: discount.rate = 0.10
Discount rate from config2: 0.10

--- Factory Pattern (Product Creation) ---
📧 NOTIFICATION: Stock changed for E002 from 0 to 30
Created product: Smartphone by Samsung - 12 months warranty

--- Observer Pattern (Inventory Changes) ---
Simulating sales and inventory changes...
📧 NOTIFICATION: Stock changed for E001 from 25 to 5
⚠️ LOW STOCK ALERT: Product E001 has only 5 items left (threshold: 5)
🔄 AUTO-REORDER: Initiating reorder for E001 (current: 5)
📧 NOTIFICATION: Stock changed for C001 from 100 to 15
⚠️ LOW STOCK ALERT: Product C001 has only 15 items left (threshold: 20)
🔄 AUTO-REORDER: Initiating reorder for C001 (current: 15)
📧 NOTIFICATION: Stock changed for B001 from 50 to 0
🚨 OUT OF STOCK: Product B001 is no longer available
🚨 URGENT REORDER: Emergency reorder needed for B001

--- Strategy Pattern (Payment Processing) ---
Payment method set to: Credit Card (**** **** **** 3456)
Processing payment of 299.99 USD using Credit Card (**** **** **** 3456)
Credit Card Result: PaymentResult{success=true, id='CC1705834567890', amount=299.99, message='Credit card payment successful'}
PayPal: Logged in as john@example.com
Payment method set to: PayPal (john@example.com)
Processing payment of 299.99 USD using PayPal (john@example.com)
PayPal Result: PaymentResult{success=true, id='PP1705834568890', amount=299.99, message='PayPal payment successful'}
Payment method set to: Bank Transfer (****3210)
Processing payment of 299.99 USD using Bank Transfer (****3210)
Bank Transfer Result: PaymentResult{success=true, id='BT1705834569890', amount=299.99, message='Bank transfer initiated successfully'}

--- Decorator Pattern (Shipping Options) ---
Standard Shipping: $5.0 (7 days)
Standard Shipping + Express: $20.0 (3 days)
Standard Shipping + Express + Insurance ($500.0): $25.0 (3 days)
Standard Shipping + Express + Insurance ($500.0) + Signature Required: $30.0 (3 days)
```

### Key Learning Points:

1. **Singleton Pattern**: Ensures single instance of configuration manager with thread-safe implementation
2. **Factory Pattern**: Creates different product types without exposing creation logic
3. **Observer Pattern**: Notifies multiple services when inventory changes occur
4. **Strategy Pattern**: Allows switching between different payment methods at runtime
5. **Decorator Pattern**: Adds shipping features dynamically without modifying base classes

This implementation demonstrates real-world usage of design patterns in e-commerce systems, which is essential knowledge for Spring Framework development where these patterns are extensively used.
