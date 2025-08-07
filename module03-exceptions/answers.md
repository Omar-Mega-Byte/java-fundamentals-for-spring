# Module 03: Exception Handling - Answers

## MCQ Quiz Answers

### 1. Which is the correct exception hierarchy in Java?
**Answer: b) Throwable → Exception → RuntimeException**  
*Explanation: Throwable is the root, Exception extends Throwable, RuntimeException extends Exception.*

### 2. What happens if you don't handle a checked exception?
**Answer: b) Compilation error**  
*Explanation: Checked exceptions must be either caught or declared in the method signature using throws.*

### 3. Which is the best practice for exception handling?
**Answer: c) Catch specific exceptions rather than general ones**  
*Explanation: Catching specific exceptions allows for more precise error handling and better debugging.*

### 4. What is the purpose of the finally block?
**Answer: c) Execute code regardless of whether an exception occurs**  
*Explanation: Finally block always executes (except in case of System.exit() or JVM crash).*

### 5. When should you create custom exceptions?
**Answer: b) When you need to provide specific error information**  
*Explanation: Custom exceptions should add value by providing specific context or behavior.*

### 6. What is the difference between throw and throws?
**Answer: c) throw is used to actually throw an exception, throws declares exceptions**  
*Explanation: throw keyword throws an exception, throws keyword declares what exceptions a method might throw.*

### 7. Which statement about try-with-resources is correct?
**Answer: c) Automatically closes resources that implement AutoCloseable**  
*Explanation: Try-with-resources automatically calls close() on resources implementing AutoCloseable.*

### 8. What happens when an exception is thrown in a finally block?
**Answer: b) It suppresses the original exception**  
*Explanation: If finally block throws an exception, it can suppress the original exception unless properly handled.*

### 9. Which type of exception should you typically NOT catch?
**Answer: d) OutOfMemoryError**  
*Explanation: Errors indicate serious problems that applications shouldn't try to catch.*

### 10. What is exception chaining?
**Answer: a) Wrapping one exception inside another**  
*Explanation: Exception chaining preserves the original exception as the cause of a new exception.*

---

## File Reader Task Solution

```java
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.logging.Logger;
import java.util.logging.Level;

// Custom exceptions
class FileReadException extends Exception {
    public FileReadException(String message, Throwable cause) {
        super(message, cause);
    }
}

class InvalidFileFormatException extends FileReadException {
    public InvalidFileFormatException(String message) {
        super(message, null);
    }
}

// Main FileReader class
public class SafeFileReader {
    private static final Logger logger = Logger.getLogger(SafeFileReader.class.getName());
    
    // Read file with comprehensive error handling
    public List<String> readFile(String filePath) throws FileReadException {
        // Validate input
        if (filePath == null || filePath.trim().isEmpty()) {
            throw new IllegalArgumentException("File path cannot be null or empty");
        }
        
        Path path = Paths.get(filePath);
        List<String> lines = new ArrayList<>();
        
        // Check if file exists and is readable
        if (!Files.exists(path)) {
            throw new FileReadException("File does not exist: " + filePath, null);
        }
        
        if (!Files.isReadable(path)) {
            throw new FileReadException("File is not readable: " + filePath, null);
        }
        
        // Try-with-resources for automatic resource management
        try (BufferedReader reader = Files.newBufferedReader(path)) {
            String line;
            int lineNumber = 0;
            
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                
                // Basic validation - skip empty lines
                if (!line.trim().isEmpty()) {
                    lines.add(line);
                }
            }
            
            logger.info("Successfully read " + lines.size() + " lines from " + filePath);
            return lines;
            
        } catch (IOException e) {
            String errorMsg = "Failed to read file: " + filePath;
            logger.log(Level.SEVERE, errorMsg, e);
            throw new FileReadException(errorMsg, e);
        }
    }
    
    // Read CSV file with validation
    public List<String[]> readCSVFile(String filePath) throws FileReadException, InvalidFileFormatException {
        // First read the file
        List<String> lines = readFile(filePath);
        List<String[]> csvData = new ArrayList<>();
        
        if (lines.isEmpty()) {
            throw new InvalidFileFormatException("CSV file is empty");
        }
        
        // Parse CSV data
        int expectedColumns = -1;
        int lineNumber = 0;
        
        try {
            for (String line : lines) {
                lineNumber++;
                String[] columns = line.split(",");
                
                // Remove leading/trailing whitespace
                for (int i = 0; i < columns.length; i++) {
                    columns[i] = columns[i].trim();
                }
                
                // Validate column count consistency
                if (expectedColumns == -1) {
                    expectedColumns = columns.length;
                } else if (columns.length != expectedColumns) {
                    throw new InvalidFileFormatException(
                        String.format("Inconsistent column count at line %d. Expected %d, found %d", 
                                    lineNumber, expectedColumns, columns.length));
                }
                
                csvData.add(columns);
            }
            
            logger.info("Successfully parsed " + csvData.size() + " CSV rows");
            return csvData;
            
        } catch (Exception e) {
            if (e instanceof InvalidFileFormatException) {
                throw e; // Re-throw our custom exception
            }
            throw new FileReadException("Error parsing CSV at line " + lineNumber, e);
        }
    }
    
    // Safe file reading with retry mechanism
    public List<String> readFileWithRetry(String filePath, int maxRetries) throws FileReadException {
        FileReadException lastException = null;
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return readFile(filePath);
                
            } catch (FileReadException e) {
                lastException = e;
                logger.warning("Attempt " + attempt + " failed: " + e.getMessage());
                
                if (attempt < maxRetries) {
                    try {
                        // Wait before retry (exponential backoff)
                        Thread.sleep(1000 * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new FileReadException("Interrupted during retry", ie);
                    }
                }
            }
        }
        
        throw new FileReadException("Failed after " + maxRetries + " attempts", lastException);
    }
    
    // Method that handles multiple file types
    public Object readFileByType(String filePath) throws FileReadException {
        String extension = getFileExtension(filePath);
        
        try {
            switch (extension.toLowerCase()) {
                case "txt":
                    return readFile(filePath);
                case "csv":
                    return readCSVFile(filePath);
                default:
                    throw new InvalidFileFormatException("Unsupported file type: " + extension);
            }
        } catch (InvalidFileFormatException e) {
            throw new FileReadException("Invalid file format", e);
        }
    }
    
    // Helper method to get file extension
    private String getFileExtension(String filePath) {
        int lastDotIndex = filePath.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filePath.substring(lastDotIndex + 1);
    }
    
    // Cleanup method for resource management
    public void cleanup() {
        // Any cleanup operations if needed
        logger.info("FileReader cleanup completed");
    }
}

// Test class demonstrating exception handling
public class FileReaderTest {
    public static void main(String[] args) {
        SafeFileReader reader = new SafeFileReader();
        
        // Test 1: Reading a normal file
        try {
            System.out.println("=== Test 1: Reading normal file ===");
            List<String> lines = reader.readFile("test.txt");
            System.out.println("Read " + lines.size() + " lines");
            
        } catch (FileReadException e) {
            System.err.println("Error reading file: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Cause: " + e.getCause().getMessage());
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid argument: " + e.getMessage());
        }
        
        // Test 2: Reading non-existent file
        try {
            System.out.println("\n=== Test 2: Reading non-existent file ===");
            reader.readFile("nonexistent.txt");
            
        } catch (FileReadException e) {
            System.err.println("Expected error: " + e.getMessage());
        }
        
        // Test 3: Reading CSV file
        try {
            System.out.println("\n=== Test 3: Reading CSV file ===");
            List<String[]> csvData = reader.readCSVFile("data.csv");
            System.out.println("Read " + csvData.size() + " CSV rows");
            
            // Display first row if available
            if (!csvData.isEmpty()) {
                System.out.println("First row: " + Arrays.toString(csvData.get(0)));
            }
            
        } catch (FileReadException | InvalidFileFormatException e) {
            System.err.println("CSV Error: " + e.getMessage());
        }
        
        // Test 4: Reading with retry
        try {
            System.out.println("\n=== Test 4: Reading with retry ===");
            List<String> lines = reader.readFileWithRetry("test.txt", 3);
            System.out.println("Successfully read with retry: " + lines.size() + " lines");
            
        } catch (FileReadException e) {
            System.err.println("Failed even with retry: " + e.getMessage());
        }
        
        // Test 5: Reading by file type
        try {
            System.out.println("\n=== Test 5: Reading by file type ===");
            Object result = reader.readFileByType("data.csv");
            
            if (result instanceof List) {
                @SuppressWarnings("unchecked")
                List<String[]> csvResult = (List<String[]>) result;
                System.out.println("Auto-detected CSV: " + csvResult.size() + " rows");
            }
            
        } catch (FileReadException e) {
            System.err.println("Type-based reading error: " + e.getMessage());
        }
        
        // Test 6: Exception chaining example
        try {
            System.out.println("\n=== Test 6: Exception chaining ===");
            throw new FileReadException("High-level error", 
                    new IOException("Low-level IO error"));
                    
        } catch (FileReadException e) {
            System.err.println("Main exception: " + e.getMessage());
            System.err.println("Root cause: " + e.getCause().getMessage());
            
            // Print full stack trace for debugging
            e.printStackTrace();
        }
        
        // Cleanup
        finally {
            reader.cleanup();
        }
    }
}

// Utility class for creating test files
public class TestFileCreator {
    public static void createTestFiles() {
        // Create a simple text file
        try (PrintWriter writer = new PrintWriter("test.txt")) {
            writer.println("Line 1: Hello World");
            writer.println("Line 2: Java Exception Handling");
            writer.println("Line 3: Try-catch-finally blocks");
            writer.println("");  // Empty line (will be skipped)
            writer.println("Line 4: Custom exceptions");
        } catch (IOException e) {
            System.err.println("Failed to create test.txt: " + e.getMessage());
        }
        
        // Create a CSV file
        try (PrintWriter writer = new PrintWriter("data.csv")) {
            writer.println("Name, Age, City");
            writer.println("Alice, 25, New York");
            writer.println("Bob, 30, London");
            writer.println("Charlie, 35, Tokyo");
        } catch (IOException e) {
            System.err.println("Failed to create data.csv: " + e.getMessage());
        }
        
        System.out.println("Test files created successfully");
    }
    
    public static void main(String[] args) {
        createTestFiles();
    }
}
```

## Key Exception Handling Concepts Demonstrated:

1. **Custom Exceptions**: Created `FileReadException` and `InvalidFileFormatException`
2. **Exception Chaining**: Using `cause` parameter to preserve original exceptions
3. **Try-with-Resources**: Automatic resource management with `BufferedReader`
4. **Multiple Catch Blocks**: Handling different exception types appropriately
5. **Finally Block**: Cleanup operations that always execute
6. **Input Validation**: Checking parameters before processing
7. **Logging**: Using Java's built-in logging for error tracking
8. **Retry Mechanism**: Implementing exponential backoff for transient failures
9. **Resource Management**: Proper cleanup of system resources
10. **Exception Documentation**: Clear error messages with context

This solution demonstrates production-ready exception handling patterns that provide robustness, debugging information, and graceful error recovery.
