# Module 05: Functional Programming - Employee Stream Processing

## Task: Build a Employee Management System with Streams

Create a functional programming solution to process employee data using streams, lambdas, and functional interfaces.

### Requirements:

### 1. Create an Employee class:
```java
public class Employee {
    private String name;
    private String department;
    private double salary;
    private int age;
    private List<String> skills;
    
    // Constructor
    public Employee(String name, String department, double salary, int age, List<String> skills) {
        // Implementation needed
    }
    
    // Getters
    // Implementation needed
    
    @Override
    public String toString() {
        // Implementation needed
    }
}
```

### 2. Create an EmployeeProcessor class using functional programming:
```java
import java.util.function.*;
import java.util.stream.*;
import java.util.*;

public class EmployeeProcessor {
    private List<Employee> employees;
    
    public EmployeeProcessor(List<Employee> employees) {
        this.employees = employees;
    }
    
    // Find employees by department using streams
    public List<Employee> findByDepartment(String department) {
        // Use stream().filter().collect()
    }
    
    // Get employees with salary above threshold
    public List<Employee> getHighEarners(double threshold) {
        // Use streams with lambda expressions
    }
    
    // Get average salary by department
    public Map<String, Double> getAverageSalaryByDepartment() {
        // Use groupingBy and averagingDouble collectors
    }
    
    // Find top N employees by salary
    public List<Employee> getTopEarners(int n) {
        // Use sorted() with comparator and limit()
    }
    
    // Get employees grouped by age ranges
    public Map<String, List<Employee>> groupByAgeRange() {
        // Group: "Young" (<30), "Middle" (30-50), "Senior" (>50)
    }
    
    // Count employees by department
    public Map<String, Long> countByDepartment() {
        // Use groupingBy and counting()
    }
    
    // Get all unique skills across employees
    public Set<String> getAllSkills() {
        // Use flatMap to process nested lists
    }
    
    // Find employees with specific skill
    public List<Employee> findEmployeesWithSkill(String skill) {
        // Filter employees who have the specified skill
    }
    
    // Calculate total salary expense
    public double getTotalSalaryExpense() {
        // Use mapToDouble and sum()
    }
    
    // Get department statistics
    public Map<String, DoubleSummaryStatistics> getDepartmentSalaryStats() {
        // Use summarizingDouble collector
    }
}
```

### 3. Create custom functional interfaces:
```java
// Custom functional interface for employee validation
@FunctionalInterface
public interface EmployeeValidator {
    boolean validate(Employee employee);
}

// Custom functional interface for employee transformation
@FunctionalInterface
public interface EmployeeTransformer<T> {
    T transform(Employee employee);
}

// Custom functional interface for employee comparison
@FunctionalInterface
public interface EmployeeComparator {
    int compare(Employee emp1, Employee emp2);
}
```

### 4. Create a utility class with higher-order functions:
```java
public class FunctionalUtils {
    
    // Filter employees using custom validator
    public static List<Employee> filterEmployees(List<Employee> employees, 
                                               EmployeeValidator validator) {
        // Implementation using streams and custom functional interface
    }
    
    // Transform employees using custom transformer
    public static <T> List<T> transformEmployees(List<Employee> employees,
                                               EmployeeTransformer<T> transformer) {
        // Implementation needed
    }
    
    // Create a composed predicate
    public static Predicate<Employee> createComplexFilter(double minSalary, 
                                                         int maxAge, 
                                                         String department) {
        // Combine multiple predicates using and(), or()
    }
    
    // Create salary increase function
    public static Function<Employee, Employee> createSalaryIncreaser(double percentage) {
        // Return a function that increases salary by percentage
    }
}
```

### 5. Test class demonstrating functional programming concepts:
```java
public class FunctionalTest {
    public static void main(String[] args) {
        // Create sample data
        List<Employee> employees = Arrays.asList(
            new Employee("Alice", "Engineering", 80000, 28, Arrays.asList("Java", "Python")),
            new Employee("Bob", "Engineering", 75000, 32, Arrays.asList("JavaScript", "React")),
            new Employee("Charlie", "Marketing", 60000, 29, Arrays.asList("SEO", "Analytics")),
            new Employee("Diana", "Engineering", 85000, 35, Arrays.asList("Java", "Spring")),
            new Employee("Eve", "HR", 55000, 26, Arrays.asList("Recruitment", "Training")),
            new Employee("Frank", "Marketing", 65000, 31, Arrays.asList("Content", "Social Media"))
        );
        
        EmployeeProcessor processor = new EmployeeProcessor(employees);
        
        // Test various stream operations
        System.out.println("=== High Earners (>70k) ===");
        // Print high earners
        
        System.out.println("\n=== Average Salary by Department ===");
        // Print average salaries
        
        System.out.println("\n=== All Unique Skills ===");
        // Print all skills
        
        System.out.println("\n=== Employees with Java Skill ===");
        // Print Java developers
        
        // Test custom functional interfaces
        EmployeeValidator seniorValidator = emp -> emp.getAge() > 30;
        List<Employee> seniorEmployees = FunctionalUtils.filterEmployees(employees, seniorValidator);
        System.out.println("\n=== Senior Employees ===");
        seniorEmployees.forEach(System.out::println);
        
        // Test method references
        employees.stream()
                .map(Employee::getName)
                .sorted()
                .forEach(System.out::println);
    }
}
```

### Bonus (Optional):
- Implement parallel stream processing for large datasets
- Create a functional pipeline for data validation and transformation
- Use Optional to handle missing data gracefully
- Implement custom collectors for specialized aggregations
