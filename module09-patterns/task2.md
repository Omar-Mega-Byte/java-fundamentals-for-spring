# Module 09: Design Patterns - Coffee Shop System

## Task: Implement Common Design Patterns in a Coffee Shop System

Create a coffee shop ordering system that demonstrates key design patterns.

### Requirements:

### 1. Implement Singleton for Configuration:
```java
public class CoffeeShopConfig {
    private static CoffeeShopConfig instance;
    private String shopName;
    private String location;
    private double taxRate;
    
    private CoffeeShopConfig() {
        // Private constructor
        this.shopName = "Java Beans Coffee";
        this.location = "Downtown";
        this.taxRate = 0.08;
    }
    
    public static CoffeeShopConfig getInstance() {
        // Thread-safe singleton implementation
    }
    
    // Getters and setters
}
```

### 2. Implement Factory for Coffee Creation:
```java
// Coffee types
public abstract class Coffee {
    protected String name;
    protected double price;
    protected String size;
    
    public abstract void prepare();
    public abstract String getDescription();
    
    // Getters
    public String getName() { return name; }
    public double getPrice() { return price; }
    public String getSize() { return size; }
}

public class Espresso extends Coffee {
    public Espresso(String size) {
        // Implementation needed
    }
    
    @Override
    public void prepare() {
        // Implementation needed
    }
    
    @Override
    public String getDescription() {
        // Implementation needed
    }
}

public class Latte extends Coffee {
    // Similar implementation
}

public class Cappuccino extends Coffee {
    // Similar implementation
}

// Factory for creating coffee
public class CoffeeFactory {
    public enum CoffeeType {
        ESPRESSO, LATTE, CAPPUCCINO, AMERICANO
    }
    
    public static Coffee createCoffee(CoffeeType type, String size) {
        // Create and return appropriate coffee instance
    }
}
```

### 3. Implement Decorator for Add-ons:
```java
// Base decorator
public abstract class CoffeeDecorator extends Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription();
    }
    
    @Override
    public double getPrice() {
        return coffee.getPrice();
    }
}

// Concrete decorators
public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        // Add milk to description
    }
    
    @Override
    public double getPrice() {
        // Add milk price
    }
    
    @Override
    public void prepare() {
        // Prepare with milk
    }
}

public class SugarDecorator extends CoffeeDecorator {
    // Similar implementation for sugar
}

public class WhipCreamDecorator extends CoffeeDecorator {
    // Similar implementation for whip cream
}
```

### 4. Implement Observer for Order Updates:
```java
// Observer interface
public interface OrderObserver {
    void onOrderStatusChanged(Order order, OrderStatus status);
}

// Observable order
public class Order {
    private String orderId;
    private Coffee coffee;
    private OrderStatus status;
    private List<OrderObserver> observers;
    
    public Order(String orderId, Coffee coffee) {
        // Implementation needed
        this.observers = new ArrayList<>();
        this.status = OrderStatus.PLACED;
    }
    
    public void addObserver(OrderObserver observer) {
        // Add observer
    }
    
    public void removeObserver(OrderObserver observer) {
        // Remove observer
    }
    
    public void setStatus(OrderStatus status) {
        // Update status and notify observers
    }
    
    private void notifyObservers() {
        // Notify all observers of status change
    }
    
    // Getters
}

public enum OrderStatus {
    PLACED, PREPARING, READY, DELIVERED
}

// Concrete observers
public class CustomerNotifier implements OrderObserver {
    private String customerName;
    
    @Override
    public void onOrderStatusChanged(Order order, OrderStatus status) {
        // Notify customer of order status
    }
}

public class KitchenDisplay implements OrderObserver {
    @Override
    public void onOrderStatusChanged(Order order, OrderStatus status) {
        // Update kitchen display
    }
}
```

### 5. Implement Strategy for Payment Processing:
```java
// Payment strategy interface
public interface PaymentStrategy {
    boolean processPayment(double amount);
    String getPaymentMethod();
}

// Concrete strategies
public class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String holderName;
    
    public CreditCardPayment(String cardNumber, String holderName) {
        this.cardNumber = cardNumber;
        this.holderName = holderName;
    }
    
    @Override
    public boolean processPayment(double amount) {
        // Process credit card payment
        System.out.println("Processing $" + amount + " via Credit Card ending in " + 
                          cardNumber.substring(cardNumber.length() - 4));
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "Credit Card";
    }
}

public class CashPayment implements PaymentStrategy {
    // Implementation for cash payment
}

public class MobilePayment implements PaymentStrategy {
    // Implementation for mobile payment
}

// Context class
public class PaymentProcessor {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public boolean processOrder(Order order) {
        // Calculate total and process payment
    }
}
```

### 6. Create the main CoffeeShop class:
```java
public class CoffeeShop {
    private CoffeeShopConfig config;
    private PaymentProcessor paymentProcessor;
    private List<Order> orders;
    
    public CoffeeShop() {
        // Initialize with singleton config
    }
    
    public Order createOrder(CoffeeFactory.CoffeeType type, String size, 
                           List<String> addons) {
        // Create coffee with factory
        // Apply decorators for add-ons
        // Create and return order
    }
    
    public void processOrder(Order order, PaymentStrategy paymentStrategy) {
        // Set payment strategy and process order
        // Update order status
    }
    
    public void displayMenu() {
        // Display available coffees and prices
    }
}
```

### 7. Test the coffee shop system:
```java
public class CoffeeShopTest {
    public static void main(String[] args) {
        CoffeeShop shop = new CoffeeShop();
        
        // Display menu
        shop.displayMenu();
        
        // Create order with decorators
        Order order1 = shop.createOrder(
            CoffeeFactory.CoffeeType.LATTE, 
            "Large", 
            Arrays.asList("milk", "sugar")
        );
        
        // Add observers
        order1.addObserver(new CustomerNotifier("John Doe"));
        order1.addObserver(new KitchenDisplay());
        
        // Process payment with strategy
        PaymentStrategy creditCard = new CreditCardPayment("1234-5678-9012-3456", "John Doe");
        shop.processOrder(order1, creditCard);
        
        // Update order status (should notify observers)
        order1.setStatus(OrderStatus.PREPARING);
        order1.setStatus(OrderStatus.READY);
        
        // Test different payment methods
        Order order2 = shop.createOrder(
            CoffeeFactory.CoffeeType.CAPPUCCINO, 
            "Medium", 
            Arrays.asList("whip cream")
        );
        
        PaymentStrategy cash = new CashPayment();
        shop.processOrder(order2, cash);
    }
}
```

### Bonus (Optional):
- Implement Builder pattern for complex coffee customization
- Add Command pattern for order queuing
- Implement State pattern for order lifecycle management
- Add Template Method pattern for coffee preparation steps
