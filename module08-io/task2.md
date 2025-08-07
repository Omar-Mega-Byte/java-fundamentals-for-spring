# Module 08: I/O & Serialization - File Manager Task

## Task: Create a Simple File Management System

Build a file management system that demonstrates I/O operations and serialization.

### Requirements:

### 1. Create a Document class for serialization:
```java
import java.io.Serializable;
import java.time.LocalDateTime;

public class Document implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private transient String tempData; // Won't be serialized
    
    public Document(String title, String content, String author) {
        // Implementation needed
    }
    
    // Update content and modification date
    public void updateContent(String newContent) {
        // Implementation needed
    }
    
    // Getters and setters
    // toString method for display
}
```

### 2. Create a FileManager class:
```java
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class FileManager {
    private final Path baseDirectory;
    
    public FileManager(String baseDir) throws IOException {
        // Create base directory if it doesn't exist
    }
    
    // Write text to file using try-with-resources
    public void writeTextFile(String filename, String content) throws IOException {
        // Use BufferedWriter for efficient writing
    }
    
    // Read text from file
    public String readTextFile(String filename) throws IOException {
        // Use BufferedReader for efficient reading
    }
    
    // Copy file from source to destination
    public void copyFile(String source, String destination) throws IOException {
        // Use Files.copy() for efficient copying
    }
    
    // List all files in directory
    public List<String> listFiles() throws IOException {
        // Return list of filenames
    }
    
    // Delete file
    public boolean deleteFile(String filename) {
        // Delete file and return success status
    }
    
    // Get file size
    public long getFileSize(String filename) throws IOException {
        // Return file size in bytes
    }
    
    // Check if file exists
    public boolean fileExists(String filename) {
        // Check file existence
    }
}
```

### 3. Create a DocumentSerializer for object serialization:
```java
public class DocumentSerializer {
    
    // Serialize document to file
    public void saveDocument(Document document, String filename) throws IOException {
        // Use ObjectOutputStream with try-with-resources
    }
    
    // Deserialize document from file
    public Document loadDocument(String filename) throws IOException, ClassNotFoundException {
        // Use ObjectInputStream with try-with-resources
    }
    
    // Save multiple documents to one file
    public void saveDocuments(List<Document> documents, String filename) throws IOException {
        // Serialize list of documents
    }
    
    // Load multiple documents from file
    public List<Document> loadDocuments(String filename) throws IOException, ClassNotFoundException {
        // Deserialize list of documents
    }
    
    // Export document to JSON-like text format
    public void exportToText(Document document, String filename) throws IOException {
        // Create human-readable export
    }
}
```

### 4. Create a LogManager for file logging:
```java
import java.time.format.DateTimeFormatter;

public class LogManager {
    private final Path logFile;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public LogManager(String logFileName) throws IOException {
        // Initialize log file
    }
    
    // Log message with timestamp
    public synchronized void log(String message) {
        // Append timestamped message to log file
        // Use synchronized for thread safety
    }
    
    // Log with different levels
    public void logInfo(String message) {
        log("INFO: " + message);
    }
    
    public void logError(String message) {
        log("ERROR: " + message);
    }
    
    public void logWarning(String message) {
        log("WARNING: " + message);
    }
    
    // Read recent log entries
    public List<String> getRecentLogs(int count) throws IOException {
        // Return last 'count' log entries
    }
    
    // Clear log file
    public void clearLog() throws IOException {
        // Clear the log file
    }
}
```

### 5. Test the file management system:
```java
public class FileIOTest {
    public static void main(String[] args) {
        try {
            // Initialize managers
            FileManager fileManager = new FileManager("test_files");
            DocumentSerializer serializer = new DocumentSerializer();
            LogManager logger = new LogManager("application.log");
            
            // Test text file operations
            System.out.println("=== Testing Text File Operations ===");
            fileManager.writeTextFile("sample.txt", "Hello, File I/O World!");
            String content = fileManager.readTextFile("sample.txt");
            System.out.println("Read content: " + content);
            
            // Test document serialization
            System.out.println("\n=== Testing Document Serialization ===");
            Document doc1 = new Document("Java I/O Guide", "This is a comprehensive guide...", "Author1");
            Document doc2 = new Document("NIO Tutorial", "New I/O features...", "Author2");
            
            serializer.saveDocument(doc1, "doc1.ser");
            Document loadedDoc = serializer.loadDocument("doc1.ser");
            System.out.println("Loaded document: " + loadedDoc);
            
            // Test multiple documents
            List<Document> docs = Arrays.asList(doc1, doc2);
            serializer.saveDocuments(docs, "all_docs.ser");
            List<Document> loadedDocs = serializer.loadDocuments("all_docs.ser");
            System.out.println("Loaded " + loadedDocs.size() + " documents");
            
            // Test file operations
            System.out.println("\n=== Testing File Operations ===");
            System.out.println("Files in directory: " + fileManager.listFiles());
            System.out.println("sample.txt size: " + fileManager.getFileSize("sample.txt") + " bytes");
            
            // Test copying
            fileManager.copyFile("sample.txt", "sample_copy.txt");
            System.out.println("File copied successfully");
            
            // Test logging
            System.out.println("\n=== Testing Logging ===");
            logger.logInfo("Application started");
            logger.logWarning("This is a warning");
            logger.logError("This is an error");
            
            List<String> logs = logger.getRecentLogs(5);
            System.out.println("Recent logs:");
            logs.forEach(System.out::println);
            
            // Test export
            serializer.exportToText(doc1, "doc1_export.txt");
            System.out.println("Document exported to text format");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Bonus (Optional):
- Add file compression/decompression
- Implement file watching for automatic updates
- Add binary file handling
- Create file backup and restore functionality
- Implement file encryption/decryption
