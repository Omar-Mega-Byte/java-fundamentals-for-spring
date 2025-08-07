# Module 8: I/O & Serialization

## 📋 Overview
Master Java I/O operations and serialization techniques essential for data handling in Spring applications.

## 🎯 Learning Objectives
- Understand different I/O streams and operations
- Master file handling and NIO.2
- Apply serialization and deserialization techniques
- Handle JSON processing effectively in Spring

## 📚 I/O Fundamentals

### File Operations with NIO.2
```java
@Service
public class FileService {
    
    public void demonstrateFileOperations() throws IOException {
        Path filePath = Paths.get("data", "users.txt");
        
        // Create directories if they don't exist
        Files.createDirectories(filePath.getParent());
        
        // Write to file
        List<String> lines = Arrays.asList("John,john@example.com", "Jane,jane@example.com");
        Files.write(filePath, lines, StandardCharsets.UTF_8);
        
        // Read from file
        List<String> readLines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
        
        // Stream file lines
        try (Stream<String> stream = Files.lines(filePath)) {
            List<User> users = stream
                .map(line -> line.split(","))
                .map(parts -> new User(parts[0], parts[1]))
                .collect(Collectors.toList());
        }
        
        // Copy file
        Path backup = Paths.get("data", "users_backup.txt");
        Files.copy(filePath, backup, StandardCopyOption.REPLACE_EXISTING);
        
        // Delete file
        Files.deleteIfExists(backup);
    }
    
    public void processLargeFile(Path filePath) throws IOException {
        // For large files, use buffered reading
        try (BufferedReader reader = Files.newBufferedReader(filePath)) {
            String line;
            while ((line = reader.readLine()) != null) {
                processLine(line);
            }
        }
    }
    
    private void processLine(String line) {
        // Process individual line
    }
}
```

### JSON Processing
```java
@Service
public class JsonProcessingService {
    private final ObjectMapper objectMapper;
    
    public JsonProcessingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    // Serialize object to JSON
    public String toJson(Object object) throws JsonProcessingException {
        return objectMapper.writeValueAsString(object);
    }
    
    // Deserialize JSON to object
    public <T> T fromJson(String json, Class<T> clazz) throws JsonProcessingException {
        return objectMapper.readValue(json, clazz);
    }
    
    // Handle generic types
    public <T> T fromJson(String json, TypeReference<T> typeRef) throws JsonProcessingException {
        return objectMapper.readValue(json, typeRef);
    }
    
    // Stream processing for large JSON arrays
    public void processLargeJsonArray(InputStream inputStream) throws IOException {
        try (JsonParser parser = objectMapper.getFactory().createParser(inputStream)) {
            if (parser.nextToken() == JsonToken.START_ARRAY) {
                while (parser.nextToken() == JsonToken.START_OBJECT) {
                    User user = objectMapper.readValue(parser, User.class);
                    processUser(user);
                }
            }
        }
    }
    
    private void processUser(User user) {
        // Process individual user
    }
}
```

## 🌸 Spring I/O Integration

### Resource Handling
```java
@Service
public class ResourceService {
    
    @Value("classpath:config/application.properties")
    private Resource configResource;
    
    public Properties loadProperties() throws IOException {
        Properties props = new Properties();
        try (InputStream is = configResource.getInputStream()) {
            props.load(is);
        }
        return props;
    }
    
    public void processFile(@Value("${file.path}") String filePath) throws IOException {
        Resource resource = new FileSystemResource(filePath);
        
        if (resource.exists() && resource.isReadable()) {
            try (InputStream is = resource.getInputStream()) {
                // Process file
            }
        }
    }
}
```

---
**Next Module**: [Design Patterns](../module9-patterns/README.md)
