# Module 12: Testing Fundamentals - Calculator Testing Suite

## Task: Create a Complete Testing Suite for a Calculator

Build a comprehensive testing suite to understand testing principles, assertions, and best practices.

### Requirements:

### 1. Create the Calculator class to test:
```java
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
```

### 2. Create basic unit tests with JUnit 5:
```java
import org.junit.jupiter.api.*;
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
}
```

### 3. Create memory function tests:
```java
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
}
```

### 4. Create parameterized tests:
```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import java.util.stream.Stream;

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
```

### 5. Create performance and edge case tests:
```java
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
```

### 6. Create a test suite runner:
```java
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
```

### 7. Create a main class to run tests programmatically:
```java
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

### Bonus Tasks (Optional):
1. Add test categories using @Tag annotations
2. Create integration tests that test multiple operations together
3. Add test data from external files (CSV, JSON)
4. Implement custom assertions for better error messages
5. Add test reporting with detailed HTML output
6. Create mutation testing to verify test quality
7. Add benchmark tests for performance regression detection
