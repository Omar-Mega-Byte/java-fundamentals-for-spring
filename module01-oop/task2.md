# Module 01: OOP - Simple Design Task

## Task: Create a Simple Library System

Design a basic library management system with the following requirements:

### 1. Create a Book class with:
- Private fields: title, author, isbn, isAvailable
- Constructor to initialize all fields
- Getter methods for all fields
- A method `borrowBook()` that sets isAvailable to false
- A method `returnBook()` that sets isAvailable to true

### 2. Create an abstract LibraryItem class with:
- Protected field: itemId
- Abstract method: `getItemType()`
- Concrete method: `displayInfo()` that prints basic item information

### 3. Make Book extend LibraryItem and:
- Implement the `getItemType()` method to return "Book"
- Override `displayInfo()` to show book-specific information

### 4. Create a simple Library class with:
- A list to store books
- Method `addBook(Book book)` 
- Method `findBookByTitle(String title)` that returns a Book or null
- Method `borrowBook(String title)` that finds and borrows a book if available

### Expected Code Structure:
```java
// Your implementation should look something like this:

public abstract class LibraryItem {
    // Implementation needed
}

public class Book extends LibraryItem {
    // Implementation needed
}

public class Library {
    // Implementation needed
}

// Test your implementation
public class LibraryTest {
    public static void main(String[] args) {
        Library library = new Library();
        Book book1 = new Book("Java Basics", "John Doe", "123456", true);
        
        library.addBook(book1);
        library.borrowBook("Java Basics");
        
        // Should show the book is not available
        book1.displayInfo();
    }
}
```

### Bonus (Optional):
- Add a `Member` class with name and memberId
- Modify `borrowBook()` to accept a Member parameter
- Keep track of who borrowed which book
