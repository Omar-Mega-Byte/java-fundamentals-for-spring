# Module 02: Collections - Student Grade Manager

## Task: Create a Simple Student Grade Management System

Build a basic grade management system using different collection types appropriately.

### Requirements:

### 1. Create a Student class with:
- Fields: studentId (String), name (String)
- Constructor and getters
- Override equals() and hashCode() based on studentId
- Override toString() for easy display

### 2. Create a GradeManager class that uses appropriate collections:
- Store students using a Set (to avoid duplicates)
- Store grades using a Map<Student, List<Integer>>
- Implement the following methods:

```java
public class GradeManager {
    // Choose appropriate collection types
    
    // Add a new student
    public boolean addStudent(Student student) {
        // Implementation needed
    }
    
    // Add a grade for a student
    public void addGrade(Student student, int grade) {
        // Implementation needed
        // Create new list if student doesn't exist
    }
    
    // Get all grades for a student
    public List<Integer> getGrades(Student student) {
        // Implementation needed
    }
    
    // Calculate average grade for a student
    public double getAverageGrade(Student student) {
        // Implementation needed
    }
    
    // Get all students sorted by name
    public List<Student> getStudentsSortedByName() {
        // Implementation needed
    }
    
    // Find top N students by average grade
    public List<Student> getTopStudents(int n) {
        // Implementation needed
        // Use Stream API if you know it, otherwise use traditional loops
    }
    
    // Display all students and their grades
    public void displayAllGrades() {
        // Implementation needed
    }
}
```

### 3. Create a test class with:
```java
public class GradeManagerTest {
    public static void main(String[] args) {
        GradeManager manager = new GradeManager();
        
        // Create students
        Student alice = new Student("S001", "Alice");
        Student bob = new Student("S002", "Bob");
        Student charlie = new Student("S003", "Charlie");
        
        // Add students
        manager.addStudent(alice);
        manager.addStudent(bob);
        manager.addStudent(charlie);
        
        // Add grades
        manager.addGrade(alice, 85);
        manager.addGrade(alice, 92);
        manager.addGrade(alice, 78);
        
        manager.addGrade(bob, 90);
        manager.addGrade(bob, 88);
        
        manager.addGrade(charlie, 95);
        manager.addGrade(charlie, 93);
        manager.addGrade(charlie, 97);
        
        // Display results
        System.out.println("All Grades:");
        manager.displayAllGrades();
        
        System.out.println("\nStudents sorted by name:");
        // Print sorted students
        
        System.out.println("\nTop 2 students:");
        // Print top 2 students
        
        System.out.println("\nAlice's average: " + manager.getAverageGrade(alice));
    }
}
```

### Bonus (Optional):
- Add a method to remove a student and all their grades
- Add a method to get the class average (average of all students' averages)
- Use TreeMap to automatically keep students sorted by name
- Add input validation for grades (0-100 range)
