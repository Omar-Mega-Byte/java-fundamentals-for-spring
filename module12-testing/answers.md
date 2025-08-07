# Module 12: Testing Fundamentals - Answers

## Task 1: MCQ Quiz Answers

### 1. What is the primary purpose of unit testing?
**Answer: b) To test individual components in isolation**

Explanation: Unit testing focuses on testing individual units (methods, classes) in isolation from other components to ensure they work correctly on their own.

### 2. Which testing framework is most commonly used for Java unit testing?
**Answer: b) JUnit**

Explanation: JUnit is the most widely used testing framework for Java. While TestNG and Mockito are also popular (Mockito for mocking), JUnit is the de facto standard for unit testing in Java.

### 3. What is a test fixture in unit testing?
**Answer: b) The setup and teardown code for tests**

Explanation: A test fixture refers to the setup (@BeforeEach, @BeforeAll) and teardown (@AfterEach, @AfterAll) code that prepares and cleans up the test environment.

### 4. What does the @Test annotation do in JUnit?
**Answer: a) Marks a method as a test case**

Explanation: The @Test annotation tells JUnit that a method is a test case that should be executed when running tests.

### 5. What is the AAA pattern in testing?
**Answer: b) Arrange, Act, Assert**

Explanation: AAA is a common pattern for structuring tests: Arrange (setup), Act (execute the code under test), Assert (verify the results).

### 6. What is a mock object in testing?
**Answer: b) A fake object that simulates real behavior**

Explanation: Mock objects are test doubles that simulate the behavior of real objects, allowing you to test code in isolation by controlling dependencies.

### 7. Which assertion would you use to check if two objects are equal?
**Answer: c) assertEquals()**

Explanation: assertEquals() is used to verify that two values are equal. assertTrue() checks boolean conditions, assertFalse() checks for false conditions, and assertNull() checks for null values.

### 8. What is test-driven development (TDD)?
**Answer: b) Writing tests before the code**

Explanation: TDD is a development approach where you write tests first, then write the minimum code to make them pass, then refactor.

### 9. What is the purpose of @BeforeEach in JUnit 5?
**Answer: b) Run before each test method**

Explanation: @BeforeEach methods execute before each individual test method, typically used for test setup. @BeforeAll runs once before all tests.

### 10. What is code coverage in testing?
**Answer: b) How much code is tested by tests**

Explanation: Code coverage measures the percentage of code that is executed when tests run, helping identify untested code areas.

---

## Task 2: Calculator Testing Suite Implementation

### Complete Implementation with All Classes:

```java
// ===== CALCULATOR CLASS (CLASS UNDER TEST) =====

public class Calculator {
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public double subtract(double a, double b) {
        return a - b;
    }
    
    public double multiply(double a, double b) {
        return a * b;
    }
    
    public double divide(double a, double b) {
        if (b == 0) {
            throw new IllegalArgumentException("Cannot divide by zero");
        }
        return a / b;
    }
    
    public double power(double base, double exponent) {
        if (base == 0 && exponent < 0) {
            throw new IllegalArgumentException("Cannot raise 0 to negative power");
        }
        return Math.pow(base, exponent);
    }
    
    public double squareRoot(double number) {
        if (number < 0) {
            throw new IllegalArgumentException("Cannot calculate square root of negative number");
        }
        return Math.sqrt(number);
    }
    
    public long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Cannot calculate factorial of negative number");
        }
        if (n > 20) {
            throw new IllegalArgumentException("Factorial too large, maximum input is 20");
        }
        
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    public boolean isPrime(int number) {
        if (number < 2) {
            return false;
        }
        if (number == 2) {
            return true;
        }
        if (number % 2 == 0) {
            return false;
        }
        
        for (int i = 3; i <= Math.sqrt(number); i += 2) {
            if (number % i == 0) {
                return false;
            }
        }
        return true;
    }
    
    // Memory functionality
    private double memory = 0.0;
    
    public void memoryClear() {
        memory = 0.0;
    }
    
    public void memoryStore(double value) {
        memory = value;
    }
    
    public double memoryRecall() {
        return memory;
    }
    
    public void memoryAdd(double value) {
        memory += value;
    }
    
    public void memorySubtract(double value) {
        memory -= value;
    }
}

// ===== COMPLETE TEST SUITE =====

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {
    
    private Calculator calculator;
    
    @BeforeEach
    void setUp() {
        calculator = new Calculator();
        System.out.println("Setting up test - Calculator created");
    }
    
    @AfterEach
    void tearDown() {
        calculator = null;
        System.out.println("Tearing down test - Calculator cleaned up");
    }
    
    @BeforeAll
    static void setUpAll() {
        System.out.println("Starting Calculator Test Suite");
    }
    
    @AfterAll
    static void tearDownAll() {
        System.out.println("Calculator Test Suite completed");
    }
    
    // ===== BASIC ARITHMETIC TESTS =====
    
    @Test
    @DisplayName("Addition should work correctly")
    void testAddition() {
        // Arrange
        double a = 5.0;
        double b = 3.0;
        double expected = 8.0;
        
        // Act
        double result = calculator.add(a, b);
        
        // Assert
        assertEquals(expected, result, "5 + 3 should equal 8");
    }
    
    @Test
    @DisplayName("Addition with negative numbers")
    void testAdditionWithNegatives() {
        assertEquals(-2.0, calculator.add(-5.0, 3.0));
        assertEquals(-8.0, calculator.add(-5.0, -3.0));
        assertEquals(2.0, calculator.add(5.0, -3.0));
    }
    
    @Test
    @DisplayName("Addition with zero")
    void testAdditionWithZero() {
        assertEquals(5.0, calculator.add(5.0, 0.0));
        assertEquals(5.0, calculator.add(0.0, 5.0));
        assertEquals(0.0, calculator.add(0.0, 0.0));
    }
    
    @Test
    @DisplayName("Subtraction should work correctly")
    void testSubtraction() {
        assertEquals(2.0, calculator.subtract(5.0, 3.0));
        assertEquals(-2.0, calculator.subtract(3.0, 5.0));
        assertEquals(0.0, calculator.subtract(5.0, 5.0));
    }
    
    @Test
    @DisplayName("Multiplication should work correctly")
    void testMultiplication() {
        assertEquals(15.0, calculator.multiply(5.0, 3.0));
        assertEquals(-15.0, calculator.multiply(-5.0, 3.0));
        assertEquals(25.0, calculator.multiply(5.0, 5.0));
        assertEquals(0.0, calculator.multiply(5.0, 0.0));
    }
    
    @Test
    @DisplayName("Division should work correctly")
    void testDivision() {
        assertEquals(2.0, calculator.divide(6.0, 3.0));
        assertEquals(1.5, calculator.divide(3.0, 2.0), 0.001);
        assertEquals(-2.0, calculator.divide(-6.0, 3.0));
    }
    
    @Test
    @DisplayName("Division by zero should throw exception")
    void testDivisionByZero() {
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> calculator.divide(5.0, 0.0),
            "Division by zero should throw IllegalArgumentException"
        );
        
        assertEquals("Cannot divide by zero", exception.getMessage());
    }
    
    // ===== ADVANCED OPERATION TESTS =====
    
    @Test
    @DisplayName("Power function should work correctly")
    void testPower() {
        assertEquals(8.0, calculator.power(2.0, 3.0));
        assertEquals(1.0, calculator.power(5.0, 0.0));
        assertEquals(0.25, calculator.power(2.0, -2.0), 0.001);
    }
    
    @Test
    @DisplayName("Power with zero base and negative exponent should throw exception")
    void testPowerZeroBaseNegativeExponent() {
        assertThrows(
            IllegalArgumentException.class,
            () -> calculator.power(0.0, -1.0),
            "Zero to negative power should throw exception"
        );
    }
    
    @Test
    @DisplayName("Square root should work correctly")
    void testSquareRoot() {
        assertEquals(3.0, calculator.squareRoot(9.0));
        assertEquals(0.0, calculator.squareRoot(0.0));
        assertEquals(1.0, calculator.squareRoot(1.0));
        assertEquals(2.0, calculator.squareRoot(4.0));
    }
    
    @Test
    @DisplayName("Square root of negative number should throw exception")
    void testSquareRootNegative() {
        assertThrows(
            IllegalArgumentException.class,
            () -> calculator.squareRoot(-1.0),
            "Square root of negative should throw exception"
        );
    }
    
    @Test
    @DisplayName("Factorial should work correctly")
    void testFactorial() {
        assertEquals(1, calculator.factorial(0));
        assertEquals(1, calculator.factorial(1));
        assertEquals(2, calculator.factorial(2));
        assertEquals(6, calculator.factorial(3));
        assertEquals(24, calculator.factorial(4));
        assertEquals(120, calculator.factorial(5));
    }
    
    @Test
    @DisplayName("Factorial of negative number should throw exception")
    void testFactorialNegative() {
        assertThrows(
            IllegalArgumentException.class,
            () -> calculator.factorial(-1),
            "Factorial of negative should throw exception"
        );
    }
    
    @Test
    @DisplayName("Factorial of large number should throw exception")
    void testFactorialTooLarge() {
        assertThrows(
            IllegalArgumentException.class,
            () -> calculator.factorial(21),
            "Factorial of number > 20 should throw exception"
        );
    }
    
    @Test
    @DisplayName("Prime number detection should work correctly")
    void testIsPrime() {
        // Test prime numbers
        assertTrue(calculator.isPrime(2), "2 should be prime");
        assertTrue(calculator.isPrime(3), "3 should be prime");
        assertTrue(calculator.isPrime(5), "5 should be prime");
        assertTrue(calculator.isPrime(7), "7 should be prime");
        assertTrue(calculator.isPrime(11), "11 should be prime");
        assertTrue(calculator.isPrime(13), "13 should be prime");
        
        // Test non-prime numbers
        assertFalse(calculator.isPrime(1), "1 should not be prime");
        assertFalse(calculator.isPrime(4), "4 should not be prime");
        assertFalse(calculator.isPrime(6), "6 should not be prime");
        assertFalse(calculator.isPrime(8), "8 should not be prime");
        assertFalse(calculator.isPrime(9), "9 should not be prime");
        assertFalse(calculator.isPrime(10), "10 should not be prime");
        
        // Test edge cases
        assertFalse(calculator.isPrime(0), "0 should not be prime");
        assertFalse(calculator.isPrime(-5), "Negative numbers should not be prime");
    }
    
    // ===== MEMORY FUNCTION TESTS =====
    
    @Nested
    @DisplayName("Memory Function Tests")
    class MemoryTests {
        
        @Test
        @DisplayName("Memory should initialize to zero")
        void testMemoryInitialization() {
            assertEquals(0.0, calculator.memoryRecall(), "Memory should start at 0");
        }
        
        @Test
        @DisplayName("Memory store and recall should work")
        void testMemoryStoreRecall() {
            double value = 42.5;
            calculator.memoryStore(value);
            assertEquals(value, calculator.memoryRecall(), "Memory should store and recall correctly");
        }
        
        @Test
        @DisplayName("Memory clear should reset to zero")
        void testMemoryClear() {
            calculator.memoryStore(100.0);
            calculator.memoryClear();
            assertEquals(0.0, calculator.memoryRecall(), "Memory should be cleared to 0");
        }
        
        @Test
        @DisplayName("Memory add should accumulate values")
        void testMemoryAdd() {
            calculator.memoryStore(10.0);
            calculator.memoryAdd(5.0);
            assertEquals(15.0, calculator.memoryRecall(), "Memory add should accumulate");
            
            calculator.memoryAdd(-3.0);
            assertEquals(12.0, calculator.memoryRecall(), "Memory add with negative should work");
        }
        
        @Test
        @DisplayName("Memory subtract should work correctly")
        void testMemorySubtract() {
            calculator.memoryStore(20.0);
            calculator.memorySubtract(5.0);
            assertEquals(15.0, calculator.memoryRecall(), "Memory subtract should work");
            
            calculator.memorySubtract(-3.0);
            assertEquals(18.0, calculator.memoryRecall(), "Memory subtract with negative should work");
        }
        
        @Test
        @DisplayName("Complex memory operations")
        void testComplexMemoryOperations() {
            calculator.memoryClear();
            calculator.memoryAdd(10.0);
            calculator.memoryAdd(5.0);
            calculator.memorySubtract(3.0);
            calculator.memoryAdd(calculator.multiply(2.0, 4.0)); // Add 8.0
            
            double expected = 0.0 + 10.0 + 5.0 - 3.0 + 8.0; // = 20.0
            assertEquals(expected, calculator.memoryRecall(), "Complex memory operations should work");
        }
        
        @Test
        @DisplayName("Memory operations with extreme values")
        void testMemoryWithExtremeValues() {
            calculator.memoryStore(Double.MAX_VALUE);
            assertEquals(Double.MAX_VALUE, calculator.memoryRecall());
            
            calculator.memoryStore(Double.MIN_VALUE);
            assertEquals(Double.MIN_VALUE, calculator.memoryRecall());
            
            calculator.memoryStore(-Double.MAX_VALUE);
            assertEquals(-Double.MAX_VALUE, calculator.memoryRecall());
        }
    }
    
    // ===== PARAMETERIZED TESTS =====
    
    @Nested
    @DisplayName("Parameterized Tests")
    class ParameterizedTests {
        
        @ParameterizedTest
        @DisplayName("Addition with multiple inputs")
        @CsvSource({
            "1.0, 2.0, 3.0",
            "0.0, 0.0, 0.0", 
            "-1.0, 1.0, 0.0",
            "10.5, 5.5, 16.0",
            "-5.0, -3.0, -8.0"
        })
        void testAdditionParameterized(double a, double b, double expected) {
            assertEquals(expected, calculator.add(a, b), 0.001,
                () -> String.format("%.1f + %.1f should equal %.1f", a, b, expected));
        }
        
        @ParameterizedTest
        @DisplayName("Prime number testing with value source")
        @ValueSource(ints = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29})
        void testPrimeNumbers(int number) {
            assertTrue(calculator.isPrime(number), 
                () -> number + " should be a prime number");
        }
        
        @ParameterizedTest
        @DisplayName("Non-prime number testing")
        @ValueSource(ints = {1, 4, 6, 8, 9, 10, 12, 14, 15, 16})
        void testNonPrimeNumbers(int number) {
            assertFalse(calculator.isPrime(number), 
                () -> number + " should not be a prime number");
        }
        
        @ParameterizedTest
        @DisplayName("Division operations")
        @MethodSource("divisionTestData")
        void testDivisionParameterized(double dividend, double divisor, double expected) {
            assertEquals(expected, calculator.divide(dividend, divisor), 0.001);
        }
        
        private static Stream<Arguments> divisionTestData() {
            return Stream.of(
                Arguments.of(10.0, 2.0, 5.0),
                Arguments.of(15.0, 3.0, 5.0),
                Arguments.of(7.0, 2.0, 3.5),
                Arguments.of(-10.0, 2.0, -5.0),
                Arguments.of(10.0, -2.0, -5.0),
                Arguments.of(0.0, 5.0, 0.0)
            );
        }
        
        @ParameterizedTest
        @DisplayName("Factorial calculations")
        @CsvSource({
            "0, 1",
            "1, 1", 
            "2, 2",
            "3, 6",
            "4, 24",
            "5, 120",
            "6, 720"
        })
        void testFactorialParameterized(int input, long expected) {
            assertEquals(expected, calculator.factorial(input));
        }
    }
    
    // ===== PERFORMANCE AND EDGE CASE TESTS =====
    
    @Nested
    @DisplayName("Performance and Edge Case Tests")
    class PerformanceAndEdgeCaseTests {
        
        @Test
        @DisplayName("Large number arithmetic")
        void testLargeNumbers() {
            double large1 = Double.MAX_VALUE / 2;
            double large2 = Double.MAX_VALUE / 3;
            
            // Test that it doesn't overflow to infinity
            double result = calculator.add(large1, large2);
            assertFalse(Double.isInfinite(result), "Large number addition should not overflow");
            assertTrue(result > 0, "Result should be positive");
        }
        
        @Test
        @DisplayName("Very small number arithmetic")
        void testVerySmallNumbers() {
            double small1 = Double.MIN_VALUE;
            double small2 = Double.MIN_VALUE;
            
            double result = calculator.add(small1, small2);
            assertTrue(result > 0, "Adding small positive numbers should be positive");
            assertEquals(small1 * 2, result, Double.MIN_VALUE, "Should handle very small numbers");
        }
        
        @Test
        @DisplayName("Floating point precision")
        void testFloatingPointPrecision() {
            // Test the classic 0.1 + 0.2 != 0.3 problem
            double result = calculator.add(0.1, 0.2);
            assertEquals(0.3, result, 0.000001, "Should handle floating point precision");
        }
        
        @Test
        @DisplayName("Division by very small number")
        void testDivisionByVerySmallNumber() {
            double result = calculator.divide(1.0, 0.0001);
            assertEquals(10000.0, result, 0.001, "Division by small number should work");
        }
        
        @Test
        @DisplayName("Multiple operations performance")
        @Timeout(value = 1, unit = TimeUnit.SECONDS)
        void testMultipleOperationsPerformance() {
            // Perform many operations quickly
            for (int i = 0; i < 100000; i++) {
                calculator.add(i, i + 1);
                calculator.multiply(i, 2);
                if (i > 0) {
                    calculator.divide(i, i);
                }
            }
            // Test should complete within 1 second
            assertTrue(true, "Performance test completed");
        }
        
        @Test
        @DisplayName("Special double values")
        void testSpecialDoubleValues() {
            // Test with special values
            assertTrue(Double.isNaN(calculator.add(Double.NaN, 5.0)), "NaN + number should be NaN");
            assertEquals(Double.POSITIVE_INFINITY, 
                        calculator.add(Double.POSITIVE_INFINITY, 5.0), 
                        "Infinity + number should be infinity");
            assertTrue(Double.isNaN(
                        calculator.add(Double.POSITIVE_INFINITY, Double.NEGATIVE_INFINITY)), 
                        "Infinity + (-Infinity) should be NaN");
        }
    }
}

// ===== TEST SUITE RUNNER =====

import org.junit.platform.suite.api.*;

@Suite
@SuiteDisplayName("Calculator Complete Test Suite")
@SelectClasses({
    CalculatorTest.class,
    CalculatorTest.MemoryTests.class,
    CalculatorTest.ParameterizedTests.class,
    CalculatorTest.PerformanceAndEdgeCaseTests.class
})
public class CalculatorTestSuite {
    // This class remains empty, used only as a test suite holder
}

// ===== PROGRAMMATIC TEST RUNNER =====

import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.launcher.listeners.TestExecutionSummary;

import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

public class TestRunner {
    public static void main(String[] args) {
        System.out.println("Running Calculator Test Suite Programmatically");
        System.out.println("===============================================");
        
        // Create launcher
        Launcher launcher = LauncherFactory.create();
        
        // Create summary listener
        SummaryGeneratingListener listener = new SummaryGeneratingListener();
        
        // Build discovery request
        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
            .selectors(selectClass(CalculatorTest.class))
            .build();
        
        // Register listener and execute tests
        launcher.registerTestExecutionListeners(listener);
        launcher.execute(request);
        
        // Get and display summary
        TestExecutionSummary summary = listener.getSummary();
        
        System.out.println("\n=== Test Execution Summary ===");
        System.out.println("Tests found: " + summary.getTestsFoundCount());
        System.out.println("Tests started: " + summary.getTestsStartedCount());
        System.out.println("Tests successful: " + summary.getTestsSucceededCount());
        System.out.println("Tests failed: " + summary.getTestsFailedCount());
        System.out.println("Tests skipped: " + summary.getTestsSkippedCount());
        System.out.println("Total time: " + summary.getTotalTime().toMillis() + "ms");
        
        // Print failure details
        if (summary.getTestsFailedCount() > 0) {
            System.out.println("\n=== Failure Details ===");
            summary.getFailures().forEach(failure -> {
                System.out.println("Failed: " + failure.getTestIdentifier().getDisplayName());
                System.out.println("Reason: " + failure.getException().getMessage());
            });
        }
        
        System.out.println("\n=== Test Run Complete ===");
    }
}
```

### Expected Test Output:
```
Starting Calculator Test Suite

Setting up test - Calculator created
Tearing down test - Calculator cleaned up
Setting up test - Calculator created
Tearing down test - Calculator cleaned up
... (repeated for each test)

=== Test Execution Summary ===
Tests found: 35
Tests started: 35
Tests successful: 35
Tests failed: 0
Tests skipped: 0
Total time: 1250ms

Calculator Test Suite completed
=== Test Run Complete ===
```

### Key Testing Concepts Demonstrated:

1. **Test Structure (AAA Pattern)**:
   - **Arrange**: Set up test data and conditions
   - **Act**: Execute the method under test
   - **Assert**: Verify the results

2. **Test Lifecycle Management**:
   - `@BeforeEach`: Setup before each test
   - `@AfterEach`: Cleanup after each test
   - `@BeforeAll`/`@AfterAll`: Setup/cleanup for all tests

3. **Different Types of Assertions**:
   - `assertEquals()`: Value equality
   - `assertTrue()`/`assertFalse()`: Boolean conditions
   - `assertThrows()`: Exception testing
   - `assertNull()`/`assertNotNull()`: Null checking

4. **Exception Testing**:
   - Testing that exceptions are thrown correctly
   - Verifying exception messages
   - Ensuring proper error handling

5. **Parameterized Testing**:
   - `@ValueSource`: Single parameter testing
   - `@CsvSource`: Multiple parameter testing
   - `@MethodSource`: Complex parameter testing

6. **Test Organization**:
   - `@Nested` classes for grouping related tests
   - `@DisplayName` for readable test names
   - Test suites for running multiple test classes

7. **Edge Case Testing**:
   - Boundary values (zero, negative, maximum)
   - Special floating-point values (NaN, infinity)
   - Performance testing with `@Timeout`

8. **Best Practices**:
   - Descriptive test names
   - Independent tests (no dependencies between tests)
   - Clear arrange-act-assert structure
   - Comprehensive coverage of normal and edge cases

This comprehensive testing suite demonstrates professional-level testing practices that prepare you for Spring Framework development where testing is crucial for maintaining code quality and reliability.
