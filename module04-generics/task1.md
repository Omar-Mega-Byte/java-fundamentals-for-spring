# Module 04: Generics - MCQ Quiz

## Choose the best answer for each question:

### 1. What is the main purpose of generics in Java?
a) To improve performance  
b) To provide compile-time type safety  
c) To enable multiple inheritance  
d) To reduce memory usage

### 2. Which symbol is used to represent a generic type parameter?
a) {}  
b) []  
c) <>  
d) ()

### 3. What does the wildcard ? represent in generics?
a) Any specific type  
b) Unknown type  
c) Primitive types only  
d) Object type only

### 4. What is the difference between List<?> and List<Object>?
a) No difference  
b) List<?> is read-only, List<Object> is not  
c) List<?> can hold any type, List<Object> only Objects  
d) List<?> is unknown type, List<Object> specifically expects Objects

### 5. What does "extends" mean in generic bounds (e.g., <T extends Number>)?
a) T must be a subclass of Number  
b) T must extend Number using inheritance  
c) T can be Number or any of its subtypes  
d) T must implement Number interface

### 6. Which is correct for a method that accepts a list of numbers or its subtypes?
a) List<Number>  
b) List<? extends Number>  
c) List<? super Number>  
d) List<Object>

### 7. What is type erasure in Java generics?
a) Deleting generic code at runtime  
b) Removing type information at compile time  
c) Converting generics to Object types at runtime  
d) Erasing generic type parameters at compile time

### 8. Can you create an array of generic types like new T[10]?
a) Yes, always  
b) No, never  
c) Only with bounded types  
d) Only with wildcards

### 9. What does <? super T> mean?
a) Any type that is a supertype of T  
b) Any type that extends T  
c) T and its subtypes  
d) Only T itself

### 10. Which is true about generic methods?
a) They can only be in generic classes  
b) They can be in both generic and non-generic classes  
c) They don't provide type safety  
d) They always return generic types
