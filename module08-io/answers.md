# Module 08: I/O and NIO - Answers

## Task 1: MCQ Quiz Answers

### 1. What is the main difference between InputStream and OutputStream?
**Answer: a) InputStream reads data, OutputStream writes data**

Explanation: InputStream is for reading data from a source, while OutputStream is for writing data to a destination. This is the fundamental difference between input and output streams.

### 2. Which class is used for reading text files efficiently?
**Answer: c) BufferedReader**

Explanation: BufferedReader provides efficient reading of text by buffering characters, reducing the number of system calls. It's the preferred choice for reading text files.

### 3. What does NIO stand for?
**Answer: b) New Input/Output**

Explanation: NIO stands for New Input/Output, introduced in Java 1.4 to provide more efficient I/O operations, especially for network programming.

### 4. Which NIO component allows non-blocking I/O operations?
**Answer: b) Selector**

Explanation: Selector enables non-blocking I/O by allowing a single thread to monitor multiple channels for readiness (read, write, connect, accept).

### 5. What is the main advantage of using FileChannel over FileInputStream?
**Answer: c) Better performance for large files**

Explanation: FileChannel provides better performance through features like memory-mapped files, direct buffer transfers, and the ability to work with specific regions of files.

### 6. Which method is used to create a directory in NIO.2?
**Answer: b) Files.createDirectory()**

Explanation: Files.createDirectory() is the NIO.2 method for creating directories. It's part of the modern file system API introduced in Java 7.

### 7. What is a ByteBuffer used for?
**Answer: d) All of the above**

Explanation: ByteBuffer is used for storing binary data, providing efficient access to byte arrays, and serving as the primary data container in NIO operations.

### 8. Which class provides utilities for file operations in NIO.2?
**Answer: a) Files**

Explanation: The Files utility class provides static methods for common file operations like copy, move, delete, read, and write in the NIO.2 API.

### 9. What is the purpose of a WatchService?
**Answer: c) To monitor file system changes**

Explanation: WatchService monitors directories for changes (file creation, modification, deletion) and notifies the application when events occur.

### 10. Which is faster for large file transfers?
**Answer: d) transferTo() with FileChannel**

Explanation: FileChannel's transferTo() method uses zero-copy transfer, which is the most efficient way to transfer large files as it avoids copying data through Java heap memory.

---

## Task 2: File Processing System Implementation

### Complete Implementation with All Classes:

```java
// ===== MAIN FILE PROCESSING SYSTEM =====

import java.io.*;
import java.nio.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.nio.file.attribute.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class FileProcessingSystem {
    private final Path workingDirectory;
    private final ExecutorService executorService;
    private final Map<String, FileProcessor> processors;
    private WatchService watchService;
    private volatile boolean monitoring = false;
    
    public FileProcessingSystem(String workingDir) throws IOException {
        this.workingDirectory = Paths.get(workingDir);
        this.executorService = Executors.newFixedThreadPool(4);
        this.processors = new HashMap<>();
        
        // Create working directory if it doesn't exist
        if (!Files.exists(workingDirectory)) {
            Files.createDirectories(workingDirectory);
            System.out.println("Created working directory: " + workingDirectory);
        }
        
        initializeProcessors();
        setupWatchService();
    }
    
    private void initializeProcessors() {
        processors.put("txt", new TextFileProcessor());
        processors.put("csv", new CsvFileProcessor());
        processors.put("log", new LogFileProcessor());
        processors.put("json", new JsonFileProcessor());
        System.out.println("Initialized file processors for: " + processors.keySet());
    }
    
    private void setupWatchService() throws IOException {
        watchService = FileSystems.getDefault().newWatchService();
        workingDirectory.register(watchService,
            StandardWatchEventKinds.ENTRY_CREATE,
            StandardWatchEventKinds.ENTRY_MODIFY,
            StandardWatchEventKinds.ENTRY_DELETE);
        System.out.println("Watch service setup for: " + workingDirectory);
    }
    
    // ===== BASIC FILE OPERATIONS =====
    
    public void createSampleFiles() throws IOException {
        System.out.println("\n=== Creating Sample Files ===");
        
        // Create text file with traditional I/O
        createTextFile();
        
        // Create CSV file with NIO
        createCsvFile();
        
        // Create binary file with FileChannel
        createBinaryFile();
        
        // Create JSON file
        createJsonFile();
        
        System.out.println("Sample files created successfully");
    }
    
    private void createTextFile() throws IOException {
        Path textFile = workingDirectory.resolve("sample.txt");
        try (BufferedWriter writer = Files.newBufferedWriter(textFile, StandardCharsets.UTF_8)) {
            writer.write("Welcome to File Processing System\n");
            writer.write("This is a sample text file.\n");
            writer.write("It contains multiple lines of text.\n");
            writer.write("Each line demonstrates different content.\n");
            writer.write("Total lines: 5\n");
        }
        System.out.println("Created: " + textFile.getFileName());
    }
    
    private void createCsvFile() throws IOException {
        Path csvFile = workingDirectory.resolve("data.csv");
        List<String> csvLines = Arrays.asList(
            "Name,Age,City,Salary",
            "John Doe,30,New York,75000",
            "Jane Smith,25,Los Angeles,68000",
            "Bob Johnson,35,Chicago,82000",
            "Alice Brown,28,Houston,71000",
            "Charlie Wilson,32,Phoenix,79000"
        );
        Files.write(csvFile, csvLines, StandardCharsets.UTF_8);
        System.out.println("Created: " + csvFile.getFileName());
    }
    
    private void createBinaryFile() throws IOException {
        Path binaryFile = workingDirectory.resolve("data.bin");
        try (FileChannel channel = FileChannel.open(binaryFile, 
                StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
            
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            
            // Write some binary data
            buffer.putInt(12345);
            buffer.putDouble(3.14159);
            buffer.putLong(System.currentTimeMillis());
            buffer.put("Binary data example".getBytes(StandardCharsets.UTF_8));
            
            buffer.flip();
            channel.write(buffer);
        }
        System.out.println("Created: " + binaryFile.getFileName());
    }
    
    private void createJsonFile() throws IOException {
        Path jsonFile = workingDirectory.resolve("config.json");
        String jsonContent = "{\n" +
            "  \"application\": {\n" +
            "    \"name\": \"File Processing System\",\n" +
            "    \"version\": \"1.0.0\",\n" +
            "    \"settings\": {\n" +
            "      \"maxFileSize\": 10485760,\n" +
            "      \"allowedExtensions\": [\"txt\", \"csv\", \"json\", \"log\"],\n" +
            "      \"enableWatching\": true\n" +
            "    }\n" +
            "  }\n" +
            "}";
        Files.write(jsonFile, jsonContent.getBytes(StandardCharsets.UTF_8));
        System.out.println("Created: " + jsonFile.getFileName());
    }
    
    // ===== FILE PROCESSING =====
    
    public void processAllFiles() throws IOException {
        System.out.println("\n=== Processing All Files ===");
        
        try (Stream<Path> paths = Files.walk(workingDirectory)) {
            List<Path> files = paths.filter(Files::isRegularFile)
                                   .collect(Collectors.toList());
            
            for (Path file : files) {
                processFile(file);
            }
        }
    }
    
    public void processFile(Path file) {
        String extension = getFileExtension(file);
        FileProcessor processor = processors.get(extension);
        
        if (processor != null) {
            CompletableFuture.supplyAsync(() -> {
                try {
                    return processor.process(file);
                } catch (IOException e) {
                    System.err.println("Error processing " + file + ": " + e.getMessage());
                    return new ProcessingResult(file, false, "Error: " + e.getMessage());
                }
            }, executorService).thenAccept(result -> {
                System.out.println("Processed: " + result);
            });
        } else {
            System.out.println("No processor found for: " + file.getFileName() + " (." + extension + ")");
        }
    }
    
    private String getFileExtension(Path file) {
        String fileName = file.getFileName().toString();
        int lastDot = fileName.lastIndexOf('.');
        return lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : "";
    }
    
    // ===== FILE MONITORING =====
    
    public void startMonitoring() {
        if (monitoring) {
            System.out.println("Monitoring is already active");
            return;
        }
        
        monitoring = true;
        System.out.println("\n=== Starting File Monitoring ===");
        
        CompletableFuture.runAsync(() -> {
            while (monitoring) {
                try {
                    WatchKey key = watchService.take();
                    
                    for (WatchEvent<?> event : key.pollEvents()) {
                        WatchEvent.Kind<?> kind = event.kind();
                        
                        if (kind == StandardWatchEventKinds.OVERFLOW) {
                            continue;
                        }
                        
                        @SuppressWarnings("unchecked")
                        WatchEvent<Path> pathEvent = (WatchEvent<Path>) event;
                        Path fileName = pathEvent.context();
                        Path fullPath = workingDirectory.resolve(fileName);
                        
                        handleFileEvent(kind, fullPath);
                    }
                    
                    if (!key.reset()) {
                        break;
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }, executorService);
    }
    
    private void handleFileEvent(WatchEvent.Kind<?> kind, Path file) {
        System.out.println("File event: " + kind.name() + " - " + file.getFileName());
        
        if (kind == StandardWatchEventKinds.ENTRY_CREATE && Files.isRegularFile(file)) {
            // Process newly created files
            processFile(file);
        } else if (kind == StandardWatchEventKinds.ENTRY_MODIFY && Files.isRegularFile(file)) {
            // Re-process modified files
            processFile(file);
        } else if (kind == StandardWatchEventKinds.ENTRY_DELETE) {
            System.out.println("File deleted: " + file.getFileName());
        }
    }
    
    public void stopMonitoring() {
        monitoring = false;
        System.out.println("File monitoring stopped");
    }
    
    // ===== FILE UTILITIES =====
    
    public void copyFile(String source, String destination) throws IOException {
        Path sourcePath = workingDirectory.resolve(source);
        Path destPath = workingDirectory.resolve(destination);
        
        // Demonstrate different copy methods
        if (Files.size(sourcePath) > 1024 * 1024) { // > 1MB
            copyLargeFileWithChannel(sourcePath, destPath);
        } else {
            Files.copy(sourcePath, destPath, StandardCopyOption.REPLACE_EXISTING);
        }
        
        System.out.println("Copied: " + source + " -> " + destination);
    }
    
    private void copyLargeFileWithChannel(Path source, Path destination) throws IOException {
        try (FileChannel sourceChannel = FileChannel.open(source, StandardOpenOption.READ);
             FileChannel destChannel = FileChannel.open(destination, 
                StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
            
            long size = sourceChannel.size();
            long transferred = 0;
            
            while (transferred < size) {
                long count = sourceChannel.transferTo(transferred, size - transferred, destChannel);
                transferred += count;
            }
        }
    }
    
    public void listDirectoryContents() throws IOException {
        System.out.println("\n=== Directory Contents ===");
        
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(workingDirectory)) {
            for (Path entry : stream) {
                BasicFileAttributes attrs = Files.readAttributes(entry, BasicFileAttributes.class);
                
                System.out.printf("%-20s | %s | %8d bytes | %s%n",
                    entry.getFileName(),
                    attrs.isDirectory() ? "DIR " : "FILE",
                    attrs.size(),
                    attrs.lastModifiedTime());
            }
        }
    }
    
    public void demonstrateNIOOperations() throws IOException {
        System.out.println("\n=== NIO Operations Demo ===");
        
        // Memory-mapped file example
        demonstrateMemoryMappedFile();
        
        // ByteBuffer operations
        demonstrateByteBufferOperations();
        
        // File attributes
        demonstrateFileAttributes();
    }
    
    private void demonstrateMemoryMappedFile() throws IOException {
        Path file = workingDirectory.resolve("mmap_test.txt");
        String content = "Memory mapped file demonstration with some sample content.";
        Files.write(file, content.getBytes(StandardCharsets.UTF_8));
        
        try (RandomAccessFile raf = new RandomAccessFile(file.toFile(), "r");
             FileChannel channel = raf.getChannel()) {
            
            MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_ONLY, 0, channel.size());
            
            // Read content using memory-mapped buffer
            byte[] data = new byte[(int) channel.size()];
            buffer.get(data);
            String result = new String(data, StandardCharsets.UTF_8);
            
            System.out.println("Memory-mapped content: " + result);
        }
    }
    
    private void demonstrateByteBufferOperations() {
        System.out.println("ByteBuffer operations:");
        
        ByteBuffer buffer = ByteBuffer.allocate(64);
        
        // Put some data
        buffer.putInt(42);
        buffer.putDouble(3.14159);
        buffer.put("Hello".getBytes(StandardCharsets.UTF_8));
        
        // Flip to read mode
        buffer.flip();
        
        // Read data back
        int intValue = buffer.getInt();
        double doubleValue = buffer.getDouble();
        byte[] stringBytes = new byte[5];
        buffer.get(stringBytes);
        String stringValue = new String(stringBytes, StandardCharsets.UTF_8);
        
        System.out.println("  Int: " + intValue + ", Double: " + doubleValue + ", String: " + stringValue);
        System.out.println("  Buffer position: " + buffer.position() + ", limit: " + buffer.limit());
    }
    
    private void demonstrateFileAttributes() throws IOException {
        Path file = workingDirectory.resolve("sample.txt");
        
        if (Files.exists(file)) {
            BasicFileAttributes basic = Files.readAttributes(file, BasicFileAttributes.class);
            
            System.out.println("File attributes for " + file.getFileName() + ":");
            System.out.println("  Size: " + basic.size() + " bytes");
            System.out.println("  Created: " + basic.creationTime());
            System.out.println("  Modified: " + basic.lastModifiedTime());
            System.out.println("  Is directory: " + basic.isDirectory());
            System.out.println("  Is regular file: " + basic.isRegularFile());
        }
    }
    
    // ===== CLEANUP AND SHUTDOWN =====
    
    public void shutdown() throws IOException {
        System.out.println("\n=== Shutting Down File Processing System ===");
        
        stopMonitoring();
        
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
        
        if (watchService != null) {
            watchService.close();
        }
        
        System.out.println("File Processing System shutdown complete");
    }
}

// ===== FILE PROCESSOR INTERFACE =====

interface FileProcessor {
    ProcessingResult process(Path file) throws IOException;
    String getSupportedExtension();
}

// ===== PROCESSING RESULT CLASS =====

class ProcessingResult {
    private final Path filePath;
    private final boolean success;
    private final String message;
    private final long processingTime;
    
    public ProcessingResult(Path filePath, boolean success, String message) {
        this.filePath = filePath;
        this.success = success;
        this.message = message;
        this.processingTime = System.currentTimeMillis();
    }
    
    @Override
    public String toString() {
        return String.format("%s - %s: %s", 
            filePath.getFileName(), 
            success ? "SUCCESS" : "FAILED", 
            message);
    }
    
    // Getters
    public Path getFilePath() { return filePath; }
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public long getProcessingTime() { return processingTime; }
}

// ===== SPECIFIC FILE PROCESSORS =====

class TextFileProcessor implements FileProcessor {
    @Override
    public ProcessingResult process(Path file) throws IOException {
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        long wordCount = lines.stream()
                             .mapToLong(line -> line.split("\\s+").length)
                             .sum();
        
        String message = String.format("Lines: %d, Words: %d", lines.size(), wordCount);
        return new ProcessingResult(file, true, message);
    }
    
    @Override
    public String getSupportedExtension() {
        return "txt";
    }
}

class CsvFileProcessor implements FileProcessor {
    @Override
    public ProcessingResult process(Path file) throws IOException {
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        
        if (lines.isEmpty()) {
            return new ProcessingResult(file, false, "Empty CSV file");
        }
        
        String[] headers = lines.get(0).split(",");
        int dataRows = lines.size() - 1;
        
        String message = String.format("Columns: %d, Data rows: %d", headers.length, dataRows);
        return new ProcessingResult(file, true, message);
    }
    
    @Override
    public String getSupportedExtension() {
        return "csv";
    }
}

class LogFileProcessor implements FileProcessor {
    @Override
    public ProcessingResult process(Path file) throws IOException {
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        
        long errorCount = lines.stream()
                               .filter(line -> line.toLowerCase().contains("error"))
                               .count();
        
        long warningCount = lines.stream()
                                 .filter(line -> line.toLowerCase().contains("warning"))
                                 .count();
        
        String message = String.format("Total: %d, Errors: %d, Warnings: %d", 
                                     lines.size(), errorCount, warningCount);
        return new ProcessingResult(file, true, message);
    }
    
    @Override
    public String getSupportedExtension() {
        return "log";
    }
}

class JsonFileProcessor implements FileProcessor {
    @Override
    public ProcessingResult process(Path file) throws IOException {
        String content = Files.readString(file, StandardCharsets.UTF_8);
        
        // Simple JSON validation (count braces)
        long openBraces = content.chars().filter(ch -> ch == '{').count();
        long closeBraces = content.chars().filter(ch -> ch == '}').count();
        
        boolean valid = openBraces == closeBraces && openBraces > 0;
        String message = valid ? "Valid JSON structure" : "Invalid JSON structure";
        
        return new ProcessingResult(file, valid, message);
    }
    
    @Override
    public String getSupportedExtension() {
        return "json";
    }
}

// ===== MAIN DEMONSTRATION CLASS =====

public class FileProcessingDemo {
    public static void main(String[] args) {
        String workingDir = "./file_processing_demo";
        
        try {
            // Initialize the file processing system
            FileProcessingSystem system = new FileProcessingSystem(workingDir);
            
            // Create sample files
            system.createSampleFiles();
            
            // List directory contents
            system.listDirectoryContents();
            
            // Process all files
            system.processAllFiles();
            
            // Wait for processing to complete
            Thread.sleep(2000);
            
            // Demonstrate file copying
            system.copyFile("sample.txt", "sample_copy.txt");
            
            // Demonstrate NIO operations
            system.demonstrateNIOOperations();
            
            // Start file monitoring
            system.startMonitoring();
            
            // Simulate file changes (you could add more files manually)
            System.out.println("\nMonitoring active. Add/modify files in: " + workingDir);
            Thread.sleep(5000);
            
            // Clean up
            system.shutdown();
            
        } catch (Exception e) {
            System.err.println("Error in demo: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### Expected Output:
```
Created working directory: .\file_processing_demo
Initialized file processors for: [csv, txt, log, json]
Watch service setup for: .\file_processing_demo

=== Creating Sample Files ===
Created: sample.txt
Created: data.csv
Created: data.bin
Created: config.json
Sample files created successfully

=== Directory Contents ===
config.json          | FILE |      198 bytes | 2024-01-15T10:30:45.123Z
data.bin             | FILE |       43 bytes | 2024-01-15T10:30:45.098Z
data.csv             | FILE |      156 bytes | 2024-01-15T10:30:45.087Z
sample.txt           | FILE |      142 bytes | 2024-01-15T10:30:45.076Z

=== Processing All Files ===
Processed: config.json - SUCCESS: Valid JSON structure
Processed: data.csv - SUCCESS: Columns: 4, Data rows: 5
Processed: sample.txt - SUCCESS: Lines: 5, Words: 23
No processor found for: data.bin (.bin)

Copied: sample.txt -> sample_copy.txt

=== NIO Operations Demo ===
Memory-mapped content: Memory mapped file demonstration with some sample content.
ByteBuffer operations:
  Int: 42, Double: 3.14159, String: Hello
  Buffer position: 17, limit: 17
File attributes for sample.txt:
  Size: 142 bytes
  Created: 2024-01-15T10:30:45.076Z
  Modified: 2024-01-15T10:30:45.076Z
  Is directory: false
  Is regular file: true

=== Starting File Monitoring ===
Monitoring active. Add/modify files in: ./file_processing_demo

=== Shutting Down File Processing System ===
File monitoring stopped
File Processing System shutdown complete
```

### Key Learning Points:

1. **Traditional I/O vs NIO**:
   - BufferedReader/Writer for text files
   - FileChannel for binary operations
   - Files utility class for modern operations

2. **File Processing Patterns**:
   - Strategy pattern for different file types
   - Asynchronous processing with CompletableFuture
   - Error handling and result reporting

3. **NIO Features**:
   - ByteBuffer for efficient data handling
   - Memory-mapped files for large file access
   - FileChannel for zero-copy operations

4. **File System Monitoring**:
   - WatchService for real-time file events
   - Event handling for create/modify/delete
   - Background monitoring with thread pools

5. **Performance Considerations**:
   - Buffered I/O for small files
   - Channel-based transfer for large files
   - Concurrent processing for multiple files

This implementation demonstrates modern Java I/O capabilities essential for enterprise applications and Spring Framework development where file processing, configuration management, and resource handling are common requirements.
