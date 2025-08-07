# Module 02: Collections - Answers

## MCQ Quiz Answers

### 1. Which collection allows duplicate elements and maintains insertion order?
**Answer: c) ArrayList**  
*Explanation: ArrayList allows duplicates and maintains insertion order. HashSet doesn't allow duplicates, TreeSet doesn't maintain insertion order.*

### 2. What is the time complexity of adding an element to a HashMap?
**Answer: a) O(1) average case**  
*Explanation: HashMap uses hash table with O(1) average time complexity for basic operations.*

### 3. Which collection is best for implementing a LIFO (Last In, First Out) structure?
**Answer: c) Stack**  
*Explanation: Stack is specifically designed for LIFO operations with push() and pop() methods.*

### 4. What happens when you try to add a duplicate element to a TreeSet?
**Answer: c) It ignores the duplicate**  
*Explanation: TreeSet doesn't allow duplicates. It uses compareTo() or Comparator to detect duplicates.*

### 5. Which interface does not extend Collection interface?
**Answer: d) Map**  
*Explanation: Map is a separate interface that doesn't extend Collection. It represents key-value pairs.*

### 6. What is the main difference between ArrayList and LinkedList?
**Answer: b) ArrayList uses array, LinkedList uses doubly-linked nodes**  
*Explanation: ArrayList uses resizable array for storage, LinkedList uses doubly-linked nodes.*

### 7. Which method is used to iterate over a Map's key-value pairs?
**Answer: c) entrySet()**  
*Explanation: entrySet() returns a Set of Map.Entry objects, allowing iteration over key-value pairs.*

### 8. What does the Collections.sort() method require from the elements?
**Answer: b) Elements must implement Comparable or provide a Comparator**  
*Explanation: Sorting requires a way to compare elements, either through Comparable interface or a Comparator.*

### 9. Which collection provides O(1) insertion and deletion at both ends?
**Answer: c) ArrayDeque**  
*Explanation: ArrayDeque provides O(1) operations at both ends, making it ideal for queue and stack operations.*

### 10. What is the difference between fail-fast and fail-safe iterators?
**Answer: b) Fail-fast throws exception on modification, fail-safe works on copy**  
*Explanation: Fail-fast iterators throw ConcurrentModificationException, fail-safe work on a copy of the collection.*

---

## Student Grade Manager Solution

```java
import java.util.*;
import java.util.stream.Collectors;

// Student class with proper equals and hashCode
public class Student {
    private String studentId;
    private String name;
    
    public Student(String studentId, String name) {
        this.studentId = studentId;
        this.name = name;
    }
    
    // Getters
    public String getStudentId() { return studentId; }
    public String getName() { return name; }
    
    // Override equals and hashCode based on studentId
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Student student = (Student) obj;
        return Objects.equals(studentId, student.studentId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(studentId);
    }
    
    @Override
    public String toString() {
        return name + " (" + studentId + ")";
    }
}

// GradeManager class using appropriate collections
public class GradeManager {
    // HashSet to store unique students
    private Set<Student> students;
    // HashMap to map students to their grades
    private Map<Student, List<Integer>> grades;
    
    public GradeManager() {
        this.students = new HashSet<>();
        this.grades = new HashMap<>();
    }
    
    // Add a new student
    public boolean addStudent(Student student) {
        boolean added = students.add(student);
        if (added) {
            grades.put(student, new ArrayList<>());
        }
        return added;
    }
    
    // Add a grade for a student
    public void addGrade(Student student, int grade) {
        // Validate grade range
        if (grade < 0 || grade > 100) {
            throw new IllegalArgumentException("Grade must be between 0 and 100");
        }
        
        // Add student if not exists
        if (!students.contains(student)) {
            addStudent(student);
        }
        
        grades.get(student).add(grade);
    }
    
    // Get all grades for a student
    public List<Integer> getGrades(Student student) {
        List<Integer> studentGrades = grades.get(student);
        return studentGrades != null ? new ArrayList<>(studentGrades) : new ArrayList<>();
    }
    
    // Calculate average grade for a student
    public double getAverageGrade(Student student) {
        List<Integer> studentGrades = grades.get(student);
        if (studentGrades == null || studentGrades.isEmpty()) {
            return 0.0;
        }
        
        double sum = 0;
        for (int grade : studentGrades) {
            sum += grade;
        }
        return sum / studentGrades.size();
    }
    
    // Get all students sorted by name
    public List<Student> getStudentsSortedByName() {
        List<Student> sortedStudents = new ArrayList<>(students);
        sortedStudents.sort(Comparator.comparing(Student::getName));
        return sortedStudents;
    }
    
    // Find top N students by average grade
    public List<Student> getTopStudents(int n) {
        List<Student> allStudents = new ArrayList<>(students);
        
        // Sort by average grade in descending order
        allStudents.sort((s1, s2) -> {
            double avg1 = getAverageGrade(s1);
            double avg2 = getAverageGrade(s2);
            return Double.compare(avg2, avg1); // Descending order
        });
        
        // Return top N students
        return allStudents.subList(0, Math.min(n, allStudents.size()));
    }
    
    // Alternative using Stream API (if you know streams)
    public List<Student> getTopStudentsWithStreams(int n) {
        return students.stream()
                      .sorted((s1, s2) -> Double.compare(getAverageGrade(s2), getAverageGrade(s1)))
                      .limit(n)
                      .collect(Collectors.toList());
    }
    
    // Display all students and their grades
    public void displayAllGrades() {
        for (Student student : getStudentsSortedByName()) {
            List<Integer> studentGrades = grades.get(student);
            System.out.printf("%s: %s (Average: %.2f)%n", 
                            student, studentGrades, getAverageGrade(student));
        }
    }
    
    // Bonus: Remove student and all grades
    public boolean removeStudent(Student student) {
        boolean removed = students.remove(student);
        if (removed) {
            grades.remove(student);
        }
        return removed;
    }
    
    // Bonus: Get class average
    public double getClassAverage() {
        if (students.isEmpty()) {
            return 0.0;
        }
        
        double sum = 0;
        for (Student student : students) {
            sum += getAverageGrade(student);
        }
        return sum / students.size();
    }
}

// Test class
public class GradeManagerTest {
    public static void main(String[] args) {
        GradeManager manager = new GradeManager();
        
        // Create students
        Student alice = new Student("S001", "Alice");
        Student bob = new Student("S002", "Bob");
        Student charlie = new Student("S003", "Charlie");
        
        // Add students
        System.out.println("Adding students...");
        System.out.println("Alice added: " + manager.addStudent(alice));
        System.out.println("Bob added: " + manager.addStudent(bob));
        System.out.println("Charlie added: " + manager.addStudent(charlie));
        
        // Try adding duplicate
        System.out.println("Alice added again: " + manager.addStudent(alice));
        
        // Add grades
        System.out.println("\nAdding grades...");
        manager.addGrade(alice, 85);
        manager.addGrade(alice, 92);
        manager.addGrade(alice, 78);
        
        manager.addGrade(bob, 90);
        manager.addGrade(bob, 88);
        
        manager.addGrade(charlie, 95);
        manager.addGrade(charlie, 93);
        manager.addGrade(charlie, 97);
        
        // Display results
        System.out.println("\nAll Grades:");
        manager.displayAllGrades();
        
        System.out.println("\nStudents sorted by name:");
        for (Student student : manager.getStudentsSortedByName()) {
            System.out.println(student);
        }
        
        System.out.println("\nTop 2 students:");
        for (Student student : manager.getTopStudents(2)) {
            System.out.printf("%s - Average: %.2f%n", student, manager.getAverageGrade(student));
        }
        
        System.out.printf("\nAlice's average: %.2f%n", manager.getAverageGrade(alice));
        System.out.printf("Class average: %.2f%n", manager.getClassAverage());
        
        // Test individual student grades
        System.out.println("\nAlice's grades: " + manager.getGrades(alice));
    }
}
```

## Alternative Implementation Using TreeMap (Bonus)

```java
// Version that automatically keeps students sorted by name
public class SortedGradeManager {
    // TreeMap automatically sorts by key (requires Student to implement Comparable)
    private Map<Student, List<Integer>> grades;
    
    public SortedGradeManager() {
        // Sort students by name automatically
        this.grades = new TreeMap<>(Comparator.comparing(Student::getName));
    }
    
    public void addGrade(Student student, int grade) {
        grades.computeIfAbsent(student, k -> new ArrayList<>()).add(grade);
    }
    
    public Set<Student> getAllStudents() {
        return grades.keySet(); // Already sorted by name
    }
    
    // Other methods similar to above...
}
```

## Key Collection Concepts Demonstrated:

1. **HashSet**: Used for storing unique students
2. **HashMap**: Used for mapping students to their grades
3. **ArrayList**: Used for storing grades (allows duplicates, maintains order)
4. **TreeMap**: Bonus implementation for automatic sorting
5. **Comparator**: Used for custom sorting
6. **Stream API**: Modern approach for filtering and sorting
7. **equals() and hashCode()**: Proper implementation for custom objects in collections

This solution shows how to choose appropriate collection types based on requirements:
- **Set** for uniqueness
- **Map** for key-value relationships  
- **List** for ordered, duplicate-allowing collections
