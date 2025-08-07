# Module 05: Functional Programming - Answers

## MCQ Quiz Answers

### 1. What is a lambda expression in Java?
**Answer: b) A concise way to represent anonymous functions**  
*Explanation: Lambda expressions provide a clear and concise way to represent one method interface using an expression.*

### 2. Which functional interface represents a function that takes one argument and returns a result?
**Answer: c) Function**  
*Explanation: Function<T,R> takes one argument of type T and returns a result of type R.*

### 3. What does the :: operator represent in Java?
**Answer: a) Method reference**  
*Explanation: :: is the method reference operator, providing a shorthand for lambda expressions that call a method.*

### 4. Which method is used to convert a collection to a stream?
**Answer: b) stream()**  
*Explanation: The stream() method converts a Collection to a Stream for functional processing.*

### 5. What is the difference between map() and flatMap() in streams?
**Answer: b) map() transforms elements, flatMap() flattens nested structures**  
*Explanation: map() transforms each element 1:1, flatMap() transforms each element to a stream and flattens the result.*

### 6. Which stream operation is a terminal operation?
**Answer: c) collect()**  
*Explanation: Terminal operations like collect() produce a result and close the stream. filter(), map(), skip() are intermediate operations.*

### 7. What does Optional help prevent?
**Answer: b) NullPointerException**  
*Explanation: Optional provides a container that may or may not contain a value, helping avoid null pointer exceptions.*

### 8. Which functional interface is used for operations that don't return a value?
**Answer: c) Consumer**  
*Explanation: Consumer<T> takes an argument and performs an operation without returning a result.*

### 9. What is method chaining in functional programming?
**Answer: b) Linking methods together in a sequence**  
*Explanation: Method chaining allows calling multiple methods in sequence, common in stream operations.*

### 10. Which collector is used to group stream elements by a classifier function?
**Answer: c) groupingBy()**  
*Explanation: Collectors.groupingBy() groups elements by a classifier function into a Map.*

---

## Employee Stream Processing Solution

```java
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

// Employee class
public class Employee {
    private String name;
    private String department;
    private double salary;
    private int age;
    private List<String> skills;
    
    public Employee(String name, String department, double salary, int age, List<String> skills) {
        this.name = name;
        this.department = department;
        this.salary = salary;
        this.age = age;
        this.skills = new ArrayList<>(skills);
    }
    
    // Getters
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public double getSalary() { return salary; }
    public int getAge() { return age; }
    public List<String> getSkills() { return new ArrayList<>(skills); }
    
    // Setters
    public void setSalary(double salary) { this.salary = salary; }
    
    @Override
    public String toString() {
        return String.format("%s (%s, $%.0f, %d years, %s)", 
                           name, department, salary, age, skills);
    }
}

// EmployeeProcessor class using functional programming
public class EmployeeProcessor {
    private List<Employee> employees;
    
    public EmployeeProcessor(List<Employee> employees) {
        this.employees = new ArrayList<>(employees);
    }
    
    // Find employees by department using streams
    public List<Employee> findByDepartment(String department) {
        return employees.stream()
                       .filter(emp -> emp.getDepartment().equals(department))
                       .collect(Collectors.toList());
    }
    
    // Get employees with salary above threshold
    public List<Employee> getHighEarners(double threshold) {
        return employees.stream()
                       .filter(emp -> emp.getSalary() > threshold)
                       .collect(Collectors.toList());
    }
    
    // Get average salary by department
    public Map<String, Double> getAverageSalaryByDepartment() {
        return employees.stream()
                       .collect(Collectors.groupingBy(
                           Employee::getDepartment,
                           Collectors.averagingDouble(Employee::getSalary)
                       ));
    }
    
    // Find top N employees by salary
    public List<Employee> getTopEarners(int n) {
        return employees.stream()
                       .sorted(Comparator.comparingDouble(Employee::getSalary).reversed())
                       .limit(n)
                       .collect(Collectors.toList());
    }
    
    // Get employees grouped by age ranges
    public Map<String, List<Employee>> groupByAgeRange() {
        return employees.stream()
                       .collect(Collectors.groupingBy(emp -> {
                           if (emp.getAge() < 30) return "Young";
                           else if (emp.getAge() <= 50) return "Middle";
                           else return "Senior";
                       }));
    }
    
    // Count employees by department
    public Map<String, Long> countByDepartment() {
        return employees.stream()
                       .collect(Collectors.groupingBy(
                           Employee::getDepartment,
                           Collectors.counting()
                       ));
    }
    
    // Get all unique skills across employees
    public Set<String> getAllSkills() {
        return employees.stream()
                       .flatMap(emp -> emp.getSkills().stream())
                       .collect(Collectors.toSet());
    }
    
    // Find employees with specific skill
    public List<Employee> findEmployeesWithSkill(String skill) {
        return employees.stream()
                       .filter(emp -> emp.getSkills().contains(skill))
                       .collect(Collectors.toList());
    }
    
    // Calculate total salary expense
    public double getTotalSalaryExpense() {
        return employees.stream()
                       .mapToDouble(Employee::getSalary)
                       .sum();
    }
    
    // Get department statistics
    public Map<String, DoubleSummaryStatistics> getDepartmentSalaryStats() {
        return employees.stream()
                       .collect(Collectors.groupingBy(
                           Employee::getDepartment,
                           Collectors.summarizingDouble(Employee::getSalary)
                       ));
    }
    
    // Additional useful methods
    public Optional<Employee> getHighestPaidEmployee() {
        return employees.stream()
                       .max(Comparator.comparingDouble(Employee::getSalary));
    }
    
    public Map<String, List<String>> getSkillsByDepartment() {
        return employees.stream()
                       .collect(Collectors.groupingBy(
                           Employee::getDepartment,
                           Collectors.flatMapping(
                               emp -> emp.getSkills().stream(),
                               Collectors.toList()
                           )
                       ));
    }
}

// Custom functional interfaces
@FunctionalInterface
public interface EmployeeValidator {
    boolean validate(Employee employee);
}

@FunctionalInterface
public interface EmployeeTransformer<T> {
    T transform(Employee employee);
}

@FunctionalInterface
public interface EmployeeComparator {
    int compare(Employee emp1, Employee emp2);
}

// Utility class with higher-order functions
public class FunctionalUtils {
    
    // Filter employees using custom validator
    public static List<Employee> filterEmployees(List<Employee> employees, 
                                               EmployeeValidator validator) {
        return employees.stream()
                       .filter(validator::validate)
                       .collect(Collectors.toList());
    }
    
    // Transform employees using custom transformer
    public static <T> List<T> transformEmployees(List<Employee> employees,
                                               EmployeeTransformer<T> transformer) {
        return employees.stream()
                       .map(transformer::transform)
                       .collect(Collectors.toList());
    }
    
    // Create a composed predicate
    public static Predicate<Employee> createComplexFilter(double minSalary, 
                                                         int maxAge, 
                                                         String department) {
        return emp -> emp.getSalary() >= minSalary
                   && emp.getAge() <= maxAge
                   && emp.getDepartment().equals(department);
    }
    
    // Create salary increase function
    public static Function<Employee, Employee> createSalaryIncreaser(double percentage) {
        return emp -> {
            Employee updated = new Employee(
                emp.getName(),
                emp.getDepartment(),
                emp.getSalary() * (1 + percentage / 100),
                emp.getAge(),
                emp.getSkills()
            );
            return updated;
        };
    }
    
    // Create employee name extractor
    public static Function<Employee, String> getNameExtractor() {
        return Employee::getName;
    }
    
    // Create department name extractor
    public static Function<Employee, String> getDepartmentExtractor() {
        return Employee::getDepartment;
    }
    
    // Compose multiple validators
    public static EmployeeValidator composeValidators(EmployeeValidator... validators) {
        return emp -> Arrays.stream(validators)
                           .allMatch(validator -> validator.validate(emp));
    }
}

// Test class demonstrating functional programming concepts
public class FunctionalTest {
    public static void main(String[] args) {
        // Create sample data
        List<Employee> employees = Arrays.asList(
            new Employee("Alice", "Engineering", 80000, 28, Arrays.asList("Java", "Python")),
            new Employee("Bob", "Engineering", 75000, 32, Arrays.asList("JavaScript", "React")),
            new Employee("Charlie", "Marketing", 60000, 29, Arrays.asList("SEO", "Analytics")),
            new Employee("Diana", "Engineering", 85000, 35, Arrays.asList("Java", "Spring")),
            new Employee("Eve", "HR", 55000, 26, Arrays.asList("Recruitment", "Training")),
            new Employee("Frank", "Marketing", 65000, 31, Arrays.asList("Content", "Social Media")),
            new Employee("Grace", "Engineering", 90000, 33, Arrays.asList("Python", "Machine Learning")),
            new Employee("Henry", "HR", 58000, 29, Arrays.asList("Training", "Development"))
        );
        
        EmployeeProcessor processor = new EmployeeProcessor(employees);
        
        // Test various stream operations
        System.out.println("=== High Earners (>70k) ===");
        processor.getHighEarners(70000)
                .forEach(System.out::println);
        
        System.out.println("\n=== Average Salary by Department ===");
        processor.getAverageSalaryByDepartment()
                .forEach((dept, avg) -> 
                    System.out.printf("%s: $%.2f%n", dept, avg));
        
        System.out.println("\n=== All Unique Skills ===");
        processor.getAllSkills()
                .stream()
                .sorted()
                .forEach(System.out::println);
        
        System.out.println("\n=== Employees with Java Skill ===");
        processor.findEmployeesWithSkill("Java")
                .forEach(System.out::println);
        
        System.out.println("\n=== Top 3 Earners ===");
        processor.getTopEarners(3)
                .forEach(System.out::println);
        
        System.out.println("\n=== Employee Count by Department ===");
        processor.countByDepartment()
                .forEach((dept, count) -> 
                    System.out.printf("%s: %d employees%n", dept, count));
        
        System.out.println("\n=== Age Group Distribution ===");
        processor.groupByAgeRange()
                .forEach((range, empList) -> 
                    System.out.printf("%s: %d employees%n", range, empList.size()));
        
        // Test custom functional interfaces
        System.out.println("\n=== Custom Validators ===");
        
        EmployeeValidator seniorValidator = emp -> emp.getAge() > 30;
        EmployeeValidator highEarnerValidator = emp -> emp.getSalary() > 70000;
        
        List<Employee> seniorEmployees = FunctionalUtils.filterEmployees(employees, seniorValidator);
        System.out.println("Senior Employees (>30): " + seniorEmployees.size());
        
        // Compose validators
        EmployeeValidator seniorHighEarner = FunctionalUtils.composeValidators(
            seniorValidator, highEarnerValidator);
        List<Employee> seniorHighEarners = FunctionalUtils.filterEmployees(employees, seniorHighEarner);
        System.out.println("Senior High Earners: " + seniorHighEarners.size());
        
        // Test transformers
        System.out.println("\n=== Custom Transformers ===");
        
        EmployeeTransformer<String> nameTransformer = Employee::getName;
        List<String> names = FunctionalUtils.transformEmployees(employees, nameTransformer);
        System.out.println("All names: " + names);
        
        EmployeeTransformer<String> summaryTransformer = emp -> 
            emp.getName() + " (" + emp.getDepartment() + ")";
        List<String> summaries = FunctionalUtils.transformEmployees(employees, summaryTransformer);
        System.out.println("Employee summaries: " + summaries);
        
        // Test complex filter
        System.out.println("\n=== Complex Filter ===");
        Predicate<Employee> complexFilter = FunctionalUtils.createComplexFilter(60000, 32, "Engineering");
        List<Employee> filtered = employees.stream()
                                          .filter(complexFilter)
                                          .collect(Collectors.toList());
        System.out.println("Engineering employees <= 32 years with salary >= 60k:");
        filtered.forEach(System.out::println);
        
        // Test salary increase function
        System.out.println("\n=== Salary Increase (10%) ===");
        Function<Employee, Employee> salaryIncreaser = FunctionalUtils.createSalaryIncreaser(10.0);
        employees.stream()
                .map(salaryIncreaser)
                .forEach(emp -> System.out.printf("%s: $%.2f%n", emp.getName(), emp.getSalary()));
        
        // Test method references
        System.out.println("\n=== Sorted Employee Names (Method Reference) ===");
        employees.stream()
                .map(Employee::getName)
                .sorted()
                .forEach(System.out::println);
        
        // Test Optional
        System.out.println("\n=== Optional Usage ===");
        Optional<Employee> highestPaid = processor.getHighestPaidEmployee();
        highestPaid.ifPresent(emp -> 
            System.out.println("Highest paid: " + emp.getName() + " - $" + emp.getSalary()));
        
        // Test parallel streams
        System.out.println("\n=== Parallel Processing ===");
        long start = System.currentTimeMillis();
        double totalSalary = employees.parallelStream()
                                    .mapToDouble(Employee::getSalary)
                                    .sum();
        long end = System.currentTimeMillis();
        System.out.printf("Total salary (parallel): $%.2f (processed in %d ms)%n", 
                         totalSalary, end - start);
        
        // Test statistics
        System.out.println("\n=== Department Salary Statistics ===");
        processor.getDepartmentSalaryStats()
                .forEach((dept, stats) -> {
                    System.out.printf("%s: Count=%d, Min=$%.2f, Max=$%.2f, Avg=$%.2f%n",
                                    dept, stats.getCount(), stats.getMin(), 
                                    stats.getMax(), stats.getAverage());
                });
    }
}
```

## Key Functional Programming Concepts Demonstrated:

1. **Lambda Expressions**: `emp -> emp.getSalary() > threshold`
2. **Method References**: `Employee::getName`, `System.out::println`
3. **Functional Interfaces**: Predicate, Function, Consumer, Supplier
4. **Stream Operations**: filter, map, flatMap, collect, reduce
5. **Collectors**: groupingBy, averagingDouble, summarizingDouble
6. **Optional**: Safe handling of potentially null values
7. **Higher-Order Functions**: Functions that take or return other functions
8. **Function Composition**: Combining multiple functions
9. **Parallel Streams**: Processing collections in parallel
10. **Custom Functional Interfaces**: Domain-specific functional types

This solution demonstrates how functional programming makes code more concise, readable, and expressive while maintaining type safety and performance.
