# Module 04: Generics - Generic Container Task

## Task: Create a Generic Storage Container

Build a generic storage container that can hold any type of objects with type safety.

### Requirements:

### 1. Create a generic Container class:
```java
public class Container<T> {
    // Implementation needed
    
    // Add an item to the container
    public void add(T item) {
        // Implementation needed
    }
    
    // Get an item by index
    public T get(int index) {
        // Implementation needed
    }
    
    // Remove an item by index
    public T remove(int index) {
        // Implementation needed
    }
    
    // Get container size
    public int size() {
        // Implementation needed
    }
    
    // Check if container is empty
    public boolean isEmpty() {
        // Implementation needed
    }
    
    // Find index of an item
    public int indexOf(T item) {
        // Implementation needed
    }
}
```

### 2. Create a generic Pair class:
```java
public class Pair<T, U> {
    // Hold two values of potentially different types
    
    // Constructor
    public Pair(T first, U second) {
        // Implementation needed
    }
    
    // Getters
    public T getFirst() {
        // Implementation needed
    }
    
    public U getSecond() {
        // Implementation needed
    }
    
    // Setters
    public void setFirst(T first) {
        // Implementation needed
    }
    
    public void setSecond(U second) {
        // Implementation needed
    }
    
    // Override toString for easy display
    @Override
    public String toString() {
        // Implementation needed
    }
}
```

### 3. Create a utility class with generic methods:
```java
public class GenericUtils {
    
    // Generic method to find maximum in a container
    public static <T extends Comparable<T>> T findMax(Container<T> container) {
        // Implementation needed
    }
    
    // Generic method to swap two elements in a container
    public static <T> void swap(Container<T> container, int index1, int index2) {
        // Implementation needed
    }
    
    // Generic method to copy from one container to another
    public static <T> void copy(Container<? extends T> source, Container<? super T> destination) {
        // Implementation needed
        // Use wildcards appropriately
    }
    
    // Generic method to count occurrences
    public static <T> int count(Container<T> container, T item) {
        // Implementation needed
    }
}
```

### 4. Test your implementation:
```java
public class GenericTest {
    public static void main(String[] args) {
        // Test Container with Strings
        Container<String> stringContainer = new Container<>();
        stringContainer.add("Hello");
        stringContainer.add("World");
        stringContainer.add("Java");
        
        System.out.println("String container size: " + stringContainer.size());
        System.out.println("First item: " + stringContainer.get(0));
        
        // Test Container with Integers
        Container<Integer> intContainer = new Container<>();
        intContainer.add(10);
        intContainer.add(5);
        intContainer.add(15);
        intContainer.add(3);
        
        System.out.println("Max integer: " + GenericUtils.findMax(intContainer));
        
        // Test Pair with different types
        Pair<String, Integer> nameAge = new Pair<>("Alice", 25);
        System.out.println("Name-Age pair: " + nameAge);
        
        Pair<Integer, String> idName = new Pair<>(101, "Bob");
        System.out.println("ID-Name pair: " + idName);
        
        // Test utility methods
        GenericUtils.swap(stringContainer, 0, 1);
        System.out.println("After swap, first item: " + stringContainer.get(0));
        
        // Test copy with wildcards
        Container<Number> numberContainer = new Container<>();
        GenericUtils.copy(intContainer, numberContainer);
        System.out.println("Copied numbers size: " + numberContainer.size());
    }
}
```

### Bonus (Optional):
- Add bounds to generic types where appropriate
- Implement a generic method that works with wildcards
- Create a generic Builder pattern
- Add type-safe iteration support
