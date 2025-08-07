# Module 01: OOP - Answers

## MCQ Quiz Answers

### 1. Which principle allows a subclass to provide a specific implementation of a method defined in its parent class?
**Answer: c) Polymorphism**  
*Explanation: Polymorphism allows subclasses to override parent class methods with their own implementation.*

### 2. What is the main purpose of encapsulation in OOP?
**Answer: b) To hide internal implementation details**  
*Explanation: Encapsulation protects the internal state of an object by making fields private and providing controlled access through methods.*

### 3. Which SOLID principle states "Classes should be open for extension but closed for modification"?
**Answer: b) Open/Closed Principle**  
*Explanation: The Open/Closed Principle encourages extending functionality through inheritance or composition rather than modifying existing code.*

### 4. What happens when you try to instantiate an abstract class directly?
**Answer: c) It causes a compilation error**  
*Explanation: Abstract classes cannot be instantiated directly. You must create a concrete subclass first.*

### 5. Which keyword is used to prevent method overriding in Java?
**Answer: b) final**  
*Explanation: The `final` keyword prevents a method from being overridden in subclasses.*

### 6. What is the difference between method overloading and method overriding?
**Answer: b) Overloading is in the same class, overriding is in different classes**  
*Explanation: Overloading = same method name, different parameters in the same class. Overriding = redefining a parent method in a subclass.*

### 7. Which access modifier provides the most restrictive access?
**Answer: d) private**  
*Explanation: Private members are only accessible within the same class.*

### 8. What is the purpose of the `super` keyword?
**Answer: b) To access parent class members**  
*Explanation: `super` is used to call parent class constructors, methods, or access parent class fields.*

### 9. Can an interface have concrete methods in Java 8+?
**Answer: b) Yes, using default and static methods**  
*Explanation: Java 8 introduced default and static methods in interfaces, allowing concrete implementations.*

### 10. What is composition in OOP?
**Answer: b) Building complex objects by combining simpler objects**  
*Explanation: Composition is a "has-a" relationship where one class contains objects of other classes.*

---

## Simple Design Task Solution

```java
// Abstract LibraryItem class
public abstract class LibraryItem {
    protected String itemId;
    
    public LibraryItem(String itemId) {
        this.itemId = itemId;
    }
    
    public abstract String getItemType();
    
    public void displayInfo() {
        System.out.println("Item ID: " + itemId + ", Type: " + getItemType());
    }
    
    public String getItemId() {
        return itemId;
    }
}

// Book class extending LibraryItem
public class Book extends LibraryItem {
    private String title;
    private String author;
    private String isbn;
    private boolean isAvailable;
    
    public Book(String title, String author, String isbn, boolean isAvailable) {
        super(isbn); // Using ISBN as itemId
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.isAvailable = isAvailable;
    }
    
    // Getters
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public boolean isAvailable() { return isAvailable; }
    
    // Book operations
    public void borrowBook() {
        if (isAvailable) {
            isAvailable = false;
            System.out.println("Book '" + title + "' has been borrowed.");
        } else {
            System.out.println("Book '" + title + "' is not available.");
        }
    }
    
    public void returnBook() {
        if (!isAvailable) {
            isAvailable = true;
            System.out.println("Book '" + title + "' has been returned.");
        } else {
            System.out.println("Book '" + title + "' was not borrowed.");
        }
    }
    
    @Override
    public String getItemType() {
        return "Book";
    }
    
    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Title: " + title);
        System.out.println("Author: " + author);
        System.out.println("ISBN: " + isbn);
        System.out.println("Available: " + (isAvailable ? "Yes" : "No"));
        System.out.println("------------------------");
    }
}

// Library class to manage books
import java.util.ArrayList;
import java.util.List;

public class Library {
    private List<Book> books;
    
    public Library() {
        this.books = new ArrayList<>();
    }
    
    public void addBook(Book book) {
        books.add(book);
        System.out.println("Book '" + book.getTitle() + "' added to library.");
    }
    
    public Book findBookByTitle(String title) {
        for (Book book : books) {
            if (book.getTitle().equalsIgnoreCase(title)) {
                return book;
            }
        }
        return null;
    }
    
    public void borrowBook(String title) {
        Book book = findBookByTitle(title);
        if (book != null) {
            book.borrowBook();
        } else {
            System.out.println("Book '" + title + "' not found in library.");
        }
    }
    
    public void returnBook(String title) {
        Book book = findBookByTitle(title);
        if (book != null) {
            book.returnBook();
        } else {
            System.out.println("Book '" + title + "' not found in library.");
        }
    }
    
    public void displayAllBooks() {
        System.out.println("=== Library Books ===");
        for (Book book : books) {
            book.displayInfo();
        }
    }
}

// Test class
public class LibraryTest {
    public static void main(String[] args) {
        // Create library and books
        Library library = new Library();
        Book book1 = new Book("Java Basics", "John Doe", "123456", true);
        Book book2 = new Book("Spring Framework", "Jane Smith", "789012", true);
        
        // Add books to library
        library.addBook(book1);
        library.addBook(book2);
        
        // Display all books
        library.displayAllBooks();
        
        // Borrow a book
        library.borrowBook("Java Basics");
        
        // Try to borrow the same book again
        library.borrowBook("Java Basics");
        
        // Display updated info
        book1.displayInfo();
        
        // Return the book
        library.returnBook("Java Basics");
        
        // Display final state
        book1.displayInfo();
    }
}
```

### Bonus Solution: Adding Member class

```java
public class Member {
    private String name;
    private String memberId;
    private List<Book> borrowedBooks;
    
    public Member(String name, String memberId) {
        this.name = name;
        this.memberId = memberId;
        this.borrowedBooks = new ArrayList<>();
    }
    
    // Getters
    public String getName() { return name; }
    public String getMemberId() { return memberId; }
    public List<Book> getBorrowedBooks() { return new ArrayList<>(borrowedBooks); }
    
    public void borrowBook(Book book) {
        borrowedBooks.add(book);
    }
    
    public void returnBook(Book book) {
        borrowedBooks.remove(book);
    }
    
    public void displayBorrowedBooks() {
        System.out.println("Books borrowed by " + name + ":");
        for (Book book : borrowedBooks) {
            System.out.println("- " + book.getTitle());
        }
    }
}

// Updated Library class method
public void borrowBook(String title, Member member) {
    Book book = findBookByTitle(title);
    if (book != null && book.isAvailable()) {
        book.borrowBook();
        member.borrowBook(book);
        System.out.println("Book borrowed by " + member.getName());
    } else if (book != null) {
        System.out.println("Book is not available.");
    } else {
        System.out.println("Book not found.");
    }
}
```

This solution demonstrates:
- **Inheritance**: Book extends LibraryItem
- **Encapsulation**: Private fields with public getters
- **Abstraction**: Abstract LibraryItem class
- **Polymorphism**: Overriding displayInfo() and implementing getItemType()
- **Composition**: Library contains Books, Member contains borrowed Books
