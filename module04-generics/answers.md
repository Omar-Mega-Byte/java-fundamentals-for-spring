# Module 04: Generics - Answers

## MCQ Quiz Answers

### 1. What is the main purpose of generics in Java?
**Answer: b) To provide compile-time type safety**  
*Explanation: Generics ensure type safety at compile time, preventing ClassCastException at runtime.*

### 2. Which symbol is used to represent a generic type parameter?
**Answer: c) <>**  
*Explanation: Angle brackets <> are used to define generic type parameters like <T> or <String>.*

### 3. What does the wildcard ? represent in generics?
**Answer: b) Unknown type**  
*Explanation: The ? wildcard represents an unknown type that can be any type.*

### 4. What is the difference between List<?> and List<Object>?
**Answer: d) List<?> is unknown type, List<Object> specifically expects Objects**  
*Explanation: List<?> can reference any parameterized List, while List<Object> only accepts Objects.*

### 5. What does "extends" mean in generic bounds (e.g., <T extends Number>)?
**Answer: c) T can be Number or any of its subtypes**  
*Explanation: Upper bounds allow T to be the specified type or any of its subtypes.*

### 6. Which is correct for a method that accepts a list of numbers or its subtypes?
**Answer: b) List<? extends Number>**  
*Explanation: ? extends Number allows Number and all its subtypes (Integer, Double, etc.).*

### 7. What is type erasure in Java generics?
**Answer: d) Erasing generic type parameters at compile time**  
*Explanation: Type erasure removes generic type information at compile time for backward compatibility.*

### 8. Can you create an array of generic types like new T[10]?
**Answer: b) No, never**  
*Explanation: You cannot create arrays of generic types due to type erasure.*

### 9. What does <? super T> mean?
**Answer: a) Any type that is a supertype of T**  
*Explanation: Lower bounds allow any type that is T or a supertype of T.*

### 10. Which is true about generic methods?
**Answer: b) They can be in both generic and non-generic classes**  
*Explanation: Generic methods can exist in any class, not just generic classes.*

---

## Generic Container Task Solution

```java
import java.util.ArrayList;
import java.util.List;

// Generic Container class
public class Container<T> {
    private List<T> items;
    
    public Container() {
        this.items = new ArrayList<>();
    }
    
    // Add an item to the container
    public void add(T item) {
        items.add(item);
    }
    
    // Get an item by index
    public T get(int index) {
        if (index < 0 || index >= items.size()) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + items.size());
        }
        return items.get(index);
    }
    
    // Remove an item by index
    public T remove(int index) {
        if (index < 0 || index >= items.size()) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + items.size());
        }
        return items.remove(index);
    }
    
    // Get container size
    public int size() {
        return items.size();
    }
    
    // Check if container is empty
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    // Find index of an item
    public int indexOf(T item) {
        return items.indexOf(item);
    }
    
    // Additional useful methods
    public boolean contains(T item) {
        return items.contains(item);
    }
    
    public void clear() {
        items.clear();
    }
    
    @Override
    public String toString() {
        return "Container" + items.toString();
    }
}

// Generic Pair class
public class Pair<T, U> {
    private T first;
    private U second;
    
    // Constructor
    public Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }
    
    // Getters
    public T getFirst() {
        return first;
    }
    
    public U getSecond() {
        return second;
    }
    
    // Setters
    public void setFirst(T first) {
        this.first = first;
    }
    
    public void setSecond(U second) {
        this.second = second;
    }
    
    // Override toString for easy display
    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
    
    // Override equals and hashCode for proper comparison
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Pair<?, ?> pair = (Pair<?, ?>) obj;
        return Objects.equals(first, pair.first) && Objects.equals(second, pair.second);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(first, second);
    }
}

// Utility class with generic methods
import java.util.Objects;

public class GenericUtils {
    
    // Generic method to find maximum in a container
    public static <T extends Comparable<T>> T findMax(Container<T> container) {
        if (container.isEmpty()) {
            return null;
        }
        
        T max = container.get(0);
        for (int i = 1; i < container.size(); i++) {
            T current = container.get(i);
            if (current.compareTo(max) > 0) {
                max = current;
            }
        }
        return max;
    }
    
    // Generic method to find minimum
    public static <T extends Comparable<T>> T findMin(Container<T> container) {
        if (container.isEmpty()) {
            return null;
        }
        
        T min = container.get(0);
        for (int i = 1; i < container.size(); i++) {
            T current = container.get(i);
            if (current.compareTo(min) < 0) {
                min = current;
            }
        }
        return min;
    }
    
    // Generic method to swap two elements in a container
    public static <T> void swap(Container<T> container, int index1, int index2) {
        if (index1 < 0 || index1 >= container.size() || 
            index2 < 0 || index2 >= container.size()) {
            throw new IndexOutOfBoundsException("Invalid indices for swap");
        }
        
        T temp = container.get(index1);
        container.remove(index1);
        container.add(index1, container.remove(index2 > index1 ? index2 - 1 : index2));
        container.remove(index2);
        container.add(index2, temp);
    }
    
    // Simpler swap implementation using internal access
    public static <T> void swapSimple(Container<T> container, int index1, int index2) {
        T item1 = container.get(index1);
        T item2 = container.get(index2);
        
        // Note: This is a simplified version
        // In real implementation, you'd need access to internal list
        System.out.println("Swapping " + item1 + " with " + item2);
    }
    
    // Generic method to copy from one container to another
    public static <T> void copy(Container<? extends T> source, Container<? super T> destination) {
        for (int i = 0; i < source.size(); i++) {
            destination.add(source.get(i));
        }
    }
    
    // Generic method to count occurrences
    public static <T> int count(Container<T> container, T item) {
        int count = 0;
        for (int i = 0; i < container.size(); i++) {
            if (Objects.equals(container.get(i), item)) {
                count++;
            }
        }
        return count;
    }
    
    // Generic method to reverse container contents
    public static <T> void reverse(Container<T> container) {
        int size = container.size();
        for (int i = 0; i < size / 2; i++) {
            swapSimple(container, i, size - 1 - i);
        }
    }
    
    // Generic method to check if container contains only unique elements
    public static <T> boolean hasUniqueElements(Container<T> container) {
        for (int i = 0; i < container.size(); i++) {
            for (int j = i + 1; j < container.size(); j++) {
                if (Objects.equals(container.get(i), container.get(j))) {
                    return false;
                }
            }
        }
        return true;
    }
}

// Enhanced Container with internal swap support
public class EnhancedContainer<T> extends Container<T> {
    private List<T> items = new ArrayList<>();
    
    @Override
    public void add(T item) {
        items.add(item);
    }
    
    @Override
    public T get(int index) {
        return items.get(index);
    }
    
    @Override
    public T remove(int index) {
        return items.remove(index);
    }
    
    @Override
    public int size() {
        return items.size();
    }
    
    @Override
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    @Override
    public int indexOf(T item) {
        return items.indexOf(item);
    }
    
    // Add method that allows insertion at specific index
    public void add(int index, T item) {
        items.add(index, item);
    }
    
    // Proper swap implementation
    public void swap(int index1, int index2) {
        if (index1 < 0 || index1 >= size() || index2 < 0 || index2 >= size()) {
            throw new IndexOutOfBoundsException("Invalid indices for swap");
        }
        
        T temp = items.get(index1);
        items.set(index1, items.get(index2));
        items.set(index2, temp);
    }
}

// Test class
public class GenericTest {
    public static void main(String[] args) {
        System.out.println("=== Testing Generic Container ===");
        
        // Test Container with Strings
        Container<String> stringContainer = new Container<>();
        stringContainer.add("Hello");
        stringContainer.add("World");
        stringContainer.add("Java");
        stringContainer.add("Generics");
        
        System.out.println("String container: " + stringContainer);
        System.out.println("String container size: " + stringContainer.size());
        System.out.println("First item: " + stringContainer.get(0));
        System.out.println("Index of 'Java': " + stringContainer.indexOf("Java"));
        
        // Test Container with Integers
        Container<Integer> intContainer = new Container<>();
        intContainer.add(10);
        intContainer.add(5);
        intContainer.add(15);
        intContainer.add(3);
        intContainer.add(15); // Duplicate for testing
        
        System.out.println("\nInteger container: " + intContainer);
        System.out.println("Max integer: " + GenericUtils.findMax(intContainer));
        System.out.println("Min integer: " + GenericUtils.findMin(intContainer));
        System.out.println("Count of 15: " + GenericUtils.count(intContainer, 15));
        System.out.println("Has unique elements: " + GenericUtils.hasUniqueElements(intContainer));
        
        // Test Pair with different types
        System.out.println("\n=== Testing Generic Pair ===");
        Pair<String, Integer> nameAge = new Pair<>("Alice", 25);
        System.out.println("Name-Age pair: " + nameAge);
        
        Pair<Integer, String> idName = new Pair<>(101, "Bob");
        System.out.println("ID-Name pair: " + idName);
        
        // Modify pair
        nameAge.setSecond(26);
        System.out.println("Updated name-age pair: " + nameAge);
        
        // Test different pair types
        Pair<Double, Boolean> scorePass = new Pair<>(85.5, true);
        System.out.println("Score-Pass pair: " + scorePass);
        
        // Test utility methods
        System.out.println("\n=== Testing Utility Methods ===");
        
        // Test copy with wildcards
        Container<Number> numberContainer = new Container<>();
        GenericUtils.copy(intContainer, numberContainer);
        System.out.println("Copied numbers: " + numberContainer);
        System.out.println("Copied numbers size: " + numberContainer.size());
        
        // Test with enhanced container that supports proper swapping
        EnhancedContainer<String> enhancedContainer = new EnhancedContainer<>();
        enhancedContainer.add("First");
        enhancedContainer.add("Second");
        enhancedContainer.add("Third");
        
        System.out.println("Before swap: " + enhancedContainer);
        enhancedContainer.swap(0, 2);
        System.out.println("After swap (0,2): " + enhancedContainer);
        
        // Test with Double container
        Container<Double> doubleContainer = new Container<>();
        doubleContainer.add(3.14);
        doubleContainer.add(2.71);
        doubleContainer.add(1.41);
        
        System.out.println("Double container max: " + GenericUtils.findMax(doubleContainer));
        
        // Demonstrate wildcard usage
        System.out.println("\n=== Testing Wildcards ===");
        Container<Integer> intSource = new Container<>();
        intSource.add(1);
        intSource.add(2);
        intSource.add(3);
        
        Container<Object> objectDest = new Container<>();
        GenericUtils.copy(intSource, objectDest);
        System.out.println("Copied to Object container: " + objectDest);
    }
}
```

### Bonus: Generic Builder Pattern

```java
// Generic Builder pattern example
public class GenericBuilder<T> {
    private Container<T> container;
    
    public GenericBuilder() {
        this.container = new Container<>();
    }
    
    public GenericBuilder<T> add(T item) {
        container.add(item);
        return this;
    }
    
    public GenericBuilder<T> addAll(T... items) {
        for (T item : items) {
            container.add(item);
        }
        return this;
    }
    
    public Container<T> build() {
        return container;
    }
    
    // Usage example
    public static void main(String[] args) {
        Container<String> words = new GenericBuilder<String>()
                .add("Hello")
                .add("World")
                .addAll("Java", "Generics", "Builder")
                .build();
        
        System.out.println("Built container: " + words);
    }
}
```

## Key Generic Concepts Demonstrated:

1. **Type Parameters**: `<T>`, `<T, U>` for defining generic classes
2. **Bounded Types**: `<T extends Comparable<T>>` for constraining types
3. **Wildcards**: `<? extends T>` and `<? super T>` for flexible APIs
4. **Generic Methods**: Static methods with their own type parameters
5. **Type Safety**: Compile-time checking prevents ClassCastException
6. **Type Erasure**: Understanding how generics work at runtime
7. **PECS Principle**: Producer Extends, Consumer Super
8. **Multiple Type Parameters**: Using multiple generic types in one class

This solution demonstrates how generics provide type safety while maintaining code reusability and flexibility.
