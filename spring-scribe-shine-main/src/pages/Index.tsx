import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ModuleCard } from "@/components/ui/module-card";
import { FeatureCard } from "@/components/ui/feature-card";
import heroImage from "@/assets/hero-java-spring.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-glow">
                ☕
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Java Core Principles</h1>
                <p className="text-sm text-muted-foreground">Spring Preparation Guide</p>
              </div>
            </div>
            <Button variant="default" asChild className="shadow-elegant">
              <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring" target="_blank" rel="noopener noreferrer">
                🐙 View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Java Spring Development" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Master Java Fundamentals for 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Spring Framework</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            A comprehensive educational system with MCQ quizzes, practical tasks, and complete solutions covering 
            essential Java concepts needed to excel in Spring development. Each module includes hands-on coding 
            exercises with detailed answers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <StatCard number="12" label="Modules" icon="📚" />
            <StatCard number="36" label="Task Files" icon="📄" />
            <StatCard number="24" label="Practical Tasks" icon="💻" />
          </div>
        </div>
      </section>

        {/* About This Project */}
        <section className="py-16 bg-gradient-card border-b border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground mb-4">About This Project</h2>
            <p className="text-lg text-muted-foreground mb-6">
              This guide is designed for backend Java developers who want to master the core principles required for Spring Framework success. It features hands-on modules, practical exercises, and real-world examples to accelerate your learning.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left text-muted-foreground text-base">
              <li className="bg-background p-4 rounded-xl border border-border shadow-card">
                <span className="font-bold text-primary">✔️ Comprehensive Coverage:</span> All essential Java topics for Spring.
              </li>
              <li className="bg-background p-4 rounded-xl border border-border shadow-card">
                <span className="font-bold text-primary">✔️ Community Driven:</span> Open source and always improving.
              </li>
              <li className="bg-background p-4 rounded-xl border border-border shadow-card">
                <span className="font-bold text-primary">✔️ Practice Focused:</span> MCQs, coding tasks, and solutions for every module.
              </li>
            </ul>
          </div>
        </section>

      {/* Module Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Learning Modules</h2>
          
          {/* Core Language Modules */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground text-xl">
                💻
              </div>
              <h3 className="text-3xl font-bold text-foreground">Core Language Modules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ModuleCard
                number="01"
                title="Object-Oriented Programming"
                description="Master the four pillars of OOP and SOLID principles essential for Spring development."
                topics={[
                  "Encapsulation & Abstraction",
                  "Inheritance & Polymorphism", 
                  "SOLID Principles",
                  "Design Patterns Foundation"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module01-oop"
              />
              <ModuleCard
                number="02"
                title="Collections Framework"
                description="Deep dive into Java Collections, Streams API, and performance optimization."
                topics={[
                  "Lists, Sets, Maps & Queues",
                  "Stream API & Functional Operations",
                  "Performance Considerations", 
                  "Custom Collections"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module02-collections"
              />
              <ModuleCard
                number="03"
                title="Exception Handling"
                description="Master robust error handling patterns crucial for Spring applications."
                topics={[
                  "Try-Catch-Finally Patterns",
                  "Custom Exception Classes",
                  "Exception Propagation",
                  "Spring Error Handling"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module03-exceptions"
              />
              <ModuleCard
                number="04"
                title="Generics & Type Safety"
                description="Understand generics, wildcards, and type safety for robust Spring components."
                topics={[
                  "Generic Classes & Methods",
                  "Wildcards & Bounds",
                  "Type Erasure",
                  "Generic Collections"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module04-generics"
              />
              <ModuleCard
                number="05"
                title="Functional Programming"
                description="Master lambdas, streams, and functional interfaces for modern Spring development."
                topics={[
                  "Lambda Expressions",
                  "Method References",
                  "Functional Interfaces",
                  "Stream Operations"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module05-functional"
              />
            </div>
          </div>

          {/* Advanced Concepts */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground text-xl">
                🚀
              </div>
              <h3 className="text-3xl font-bold text-foreground">Advanced Concepts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ModuleCard
                number="06"
                title="Reflection & Annotations"
                description="Understand the foundation of Spring's magic: reflection and annotation processing."
                topics={[
                  "Reflection API",
                  "Custom Annotations",
                  "Annotation Processing",
                  "Spring Annotations Deep Dive"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module06-reflection"
              />
              <ModuleCard
                number="07"
                title="Concurrency & Threading"
                description="Master thread management and async programming for scalable Spring applications."
                topics={[
                  "Thread Management",
                  "Synchronization", 
                  "Concurrent Collections",
                  "Async Programming"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module07-concurrency"
              />
              <ModuleCard
                number="08"
                title="I/O & Serialization"
                description="Handle file operations, JSON processing, and data serialization in Spring apps."
                topics={[
                  "File I/O Operations",
                  "JSON Processing",
                  "Serialization Patterns",
                  "NIO & Performance"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module08-io"
              />
              <ModuleCard
                number="09"
                title="Design Patterns"
                description="Learn essential design patterns that power Spring Framework architecture."
                topics={[
                  "Creational Patterns",
                  "Structural Patterns",
                  "Behavioral Patterns",
                  "Spring Pattern Usage"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module09-patterns"
              />
              <ModuleCard
                number="10"
                title="JVM & Memory Management"
                description="Optimize performance with deep JVM knowledge and memory management."
                topics={[
                  "JVM Architecture",
                  "Garbage Collection",
                  "Memory Areas",
                  "Performance Tuning"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module10-jvm"
              />
            </div>
          </div>

          {/* Spring Prerequisites */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground text-xl">
                🌱
              </div>
              <h3 className="text-3xl font-bold text-foreground">Spring Prerequisites</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <ModuleCard
                number="11"
                title="Dependency Injection Concepts"
                description="Master IoC and DI patterns - the heart of Spring Framework architecture."
                topics={[
                  "Inversion of Control",
                  "Dependency Injection Patterns",
                  "IoC Container Concepts",
                  "Bean Lifecycle"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module11-di"
              />
              <ModuleCard
                number="12"
                title="Testing Fundamentals"
                description="Build robust Spring applications with comprehensive testing strategies."
                topics={[
                  "JUnit 5 Framework",
                  "Mocking with Mockito",
                  "Integration Testing",
                  "Spring Test Context"
                ]}
                href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module12-testing"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Why Choose This Guide?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🌱"
              title="Spring-Focused"
              description="Every concept directly relates to Spring Framework development with practical examples."
            />
            <FeatureCard
              icon="💻"
              title="Practical Examples"
              description="Real-world code samples you can use immediately in your Spring projects."
            />
            <FeatureCard
              icon="⭐"
              title="Best Practices"
              description="Industry-standard approaches and common pitfall avoidance strategies."
            />
            <FeatureCard
              icon="🏋️"
              title="Practice Exercises"
              description="Hands-on exercises to reinforce learning and build muscle memory."
            />
            <FeatureCard
              icon="📖"
              title="Reference Ready"
              description="Organized for quick lookup during development and code reviews."
            />
            <FeatureCard
              icon="👥"
              title="Community Driven"
              description="Open source project welcoming contributions from the Java community."
            />
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Choose Your Learning Path</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're a beginner or experienced developer, we have a path tailored for your journey to Spring mastery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-background p-8 rounded-2xl border border-border shadow-card hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
                🌱
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Beginner Path</h3>
              <p className="text-muted-foreground mb-6">Perfect for developers new to Java or those wanting a solid foundation before diving into Spring.</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Start with OOP fundamentals</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Master Collections & Generics</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Learn Exception Handling</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Practice with guided exercises</li>
              </ul>
              <Button className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module01-oop" target="_blank" rel="noopener noreferrer">
                  Start Beginner Path
                </a>
              </Button>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border shadow-card hover:shadow-lg transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold">MOST POPULAR</span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
                🚀
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Intermediate Path</h3>
              <p className="text-muted-foreground mb-6">For developers with Java basics who want to master advanced concepts essential for Spring development.</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Review core concepts quickly</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Focus on Reflection & Annotations</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Master Design Patterns</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Dependency Injection deep dive</li>
              </ul>
              <Button className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module06-reflection" target="_blank" rel="noopener noreferrer">
                  Start Intermediate Path
                </a>
              </Button>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border shadow-card hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Expert Path</h3>
              <p className="text-muted-foreground mb-6">For experienced Java developers who want to optimize their Spring knowledge and performance skills.</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> JVM optimization techniques</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Advanced concurrency patterns</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Performance tuning strategies</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Production-ready practices</li>
              </ul>
              <Button className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module10-jvm" target="_blank" rel="noopener noreferrer">
                  Start Expert Path
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Learning Tools */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Interactive Learning Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Go beyond reading with hands-on tools designed to reinforce your learning and test your understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">🧠</div>
              <h4 className="text-lg font-bold text-foreground mb-2">MCQ Quizzes</h4>
              <p className="text-sm text-muted-foreground">Test your knowledge with carefully crafted multiple-choice questions for each module.</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">💻</div>
              <h4 className="text-lg font-bold text-foreground mb-2">Code Challenges</h4>
              <p className="text-sm text-muted-foreground">Solve real-world coding problems that mirror Spring development scenarios.</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">🔍</div>
              <h4 className="text-lg font-bold text-foreground mb-2">Code Analysis</h4>
              <p className="text-sm text-muted-foreground">Review and improve existing code snippets with detailed explanations.</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">🏗️</div>
              <h4 className="text-lg font-bold text-foreground mb-2">Mini Projects</h4>
              <p className="text-sm text-muted-foreground">Build small applications that demonstrate key concepts in action.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples Preview */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Real Code, Real Examples</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every concept comes with practical, Spring-relevant code examples you can use immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-background rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-foreground">Dependency Injection Pattern</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Module 11</span>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">
{`@Service
public class UserService {
    private final UserRepository repository;
    
    // Constructor injection - Spring's preferred method
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
    
    public User findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Learn how this fundamental pattern powers Spring's IoC container and enables testable, loosely-coupled code.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-foreground">Stream API with Spring Data</h4>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Module 5</span>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">
{`public List<UserDTO> getActiveUsers() {
    return userRepository.findAll()
        .stream()
        .filter(User::isActive)
        .map(user -> UserDTO.builder()
            .name(user.getName())
            .email(user.getEmail())
            .build())
        .collect(Collectors.toList());
}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Master functional programming concepts that make your Spring services more readable and maintainable.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring" target="_blank" rel="noopener noreferrer">
                View All Code Examples
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Java Fundamentals in Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Java Fundamentals in Action</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how core Java concepts translate directly into Spring development patterns with practical examples.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-background rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-foreground">OOP Principles: Encapsulation</h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Module 1</span>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">
{`public class BankAccount {
    private double balance; // Encapsulated field
    private final String accountNumber;
    
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = Math.max(0, initialBalance);
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
    
    public double getBalance() {
        return balance; // Controlled access
    }
}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Spring Connection:</strong> This encapsulation pattern is exactly how Spring beans protect their internal state while exposing controlled interfaces.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-foreground">Collections: Stream Operations</h4>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Module 2</span>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">
{`List<Employee> employees = Arrays.asList(
    new Employee("Alice", "Engineering", 75000),
    new Employee("Bob", "Marketing", 65000),
    new Employee("Charlie", "Engineering", 80000)
);

// Filter, map, and collect - fundamental for data processing
Map<String, Double> avgSalaryByDept = employees.stream()
    .filter(emp -> emp.getSalary() > 60000)
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.averagingDouble(Employee::getSalary)
    ));

// Result: {Engineering=77500.0, Marketing=65000.0}
System.out.println(avgSalaryByDept);`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Spring Connection:</strong> These stream operations are essential for processing data in Spring REST controllers and service layers.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-foreground">Exception Handling: Custom Exceptions</h4>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">Module 3</span>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">
{`public class UserNotFoundException extends RuntimeException {
    private final Long userId;
    
    public UserNotFoundException(Long userId) {
        super("User not found with ID: " + userId);
        this.userId = userId;
    }
    
    public Long getUserId() {
        return userId;
    }
}

// Usage in service layer
public User findUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Spring Connection:</strong> Custom exceptions like this integrate perfectly with Spring's @ControllerAdvice for global error handling.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-foreground">Generics: Type-Safe Repositories</h4>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Module 4</span>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <pre className="text-green-400">
{`public interface Repository<T, ID> {
    Optional<T> findById(ID id);
    List<T> findAll();
    T save(T entity);
    void deleteById(ID id);
}

public class UserRepository implements Repository<User, Long> {
    private Map<Long, User> storage = new HashMap<>();
    
    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }
    
    @Override
    public User save(User user) {
        storage.put(user.getId(), user);
        return user;
    }
}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>Spring Connection:</strong> This generic pattern is exactly how Spring Data JPA repositories provide type safety and code reuse.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring" target="_blank" rel="noopener noreferrer">
                Explore All Java Fundamentals
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Concept Mastery Challenges */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Concept Mastery Challenges</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test your understanding with real-world scenarios that mirror what you'll encounter in Spring development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-background p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                🧩
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Design Pattern Challenge</h4>
              <p className="text-muted-foreground mb-4">
                Implement the Observer pattern for a notification system. How would this work in a Spring application?
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Design Patterns</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Module 9</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module09-patterns" target="_blank" rel="noopener noreferrer">
                  View Module 9
                </a>
              </Button>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                ⚡
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Concurrency Puzzle</h4>
              <p className="text-muted-foreground mb-4">
                Create a thread-safe counter using different synchronization methods. Compare performance implications.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Threading</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Module 7</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module07-concurrency" target="_blank" rel="noopener noreferrer">
                  View Module 7
                </a>
              </Button>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                🔍
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Reflection Deep Dive</h4>
              <p className="text-muted-foreground mb-4">
                Build a simple dependency injection container using reflection. See how Spring works under the hood!
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Reflection</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Module 6</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module06-reflection" target="_blank" rel="noopener noreferrer">
                  View Module 6
                </a>
              </Button>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                📊
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Performance Optimization</h4>
              <p className="text-muted-foreground mb-4">
                Optimize a data processing pipeline using streams, parallel processing, and memory management techniques.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Performance</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Module 10</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module10-jvm" target="_blank" rel="noopener noreferrer">
                  View Module 10
                </a>
              </Button>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                🧪
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Testing Strategy</h4>
              <p className="text-muted-foreground mb-4">
                Write comprehensive unit tests for a complex service class with multiple dependencies and edge cases.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">Testing</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Module 12</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module12-testing" target="_blank" rel="noopener noreferrer">
                  View Module 12
                </a>
              </Button>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">
                🏗️
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Functional Programming</h4>
              <p className="text-muted-foreground mb-4">
                Transform imperative code into functional style using lambdas, method references, and stream operations.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">Functional</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Module 5</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module05-functional" target="_blank" rel="noopener noreferrer">
                  View Module 5
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Spring Readiness Assessment */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">Spring Readiness Assessment</h2>
              <p className="text-xl text-muted-foreground">
                Evaluate your Java fundamentals knowledge and identify areas to focus on before diving into Spring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-card p-8 rounded-2xl border border-border shadow-card">
                <h3 className="text-2xl font-bold text-foreground mb-6">Core Prerequisites</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span className="text-foreground">Object-Oriented Programming</span>
                    </div>
                    <span className="text-green-600 font-medium">Essential</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span className="text-foreground">Collections Framework</span>
                    </div>
                    <span className="text-green-600 font-medium">Essential</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">~</span>
                      </div>
                      <span className="text-foreground">Exception Handling</span>
                    </div>
                    <span className="text-yellow-600 font-medium">Important</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm">~</span>
                      </div>
                      <span className="text-foreground">Generics & Type Safety</span>
                    </div>
                    <span className="text-yellow-600 font-medium">Important</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-card p-8 rounded-2xl border border-border shadow-card">
                <h3 className="text-2xl font-bold text-foreground mb-6">Advanced Concepts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">★</span>
                      </div>
                      <span className="text-foreground">Reflection & Annotations</span>
                    </div>
                    <span className="text-blue-600 font-medium">Advanced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">★</span>
                      </div>
                      <span className="text-foreground">Dependency Injection</span>
                    </div>
                    <span className="text-blue-600 font-medium">Advanced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">⚡</span>
                      </div>
                      <span className="text-foreground">Concurrency & Threading</span>
                    </div>
                    <span className="text-purple-600 font-medium">Expert</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">⚡</span>
                      </div>
                      <span className="text-foreground">JVM & Performance</span>
                    </div>
                    <span className="text-purple-600 font-medium">Expert</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card">
              <div className="text-center">
                <h4 className="text-xl font-bold text-foreground mb-4">Ready to Start Your Assessment?</h4>
                <p className="text-muted-foreground mb-6">
                  Take our comprehensive assessment to identify your strengths and areas for improvement before diving into Spring Framework.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module01-oop" target="_blank" rel="noopener noreferrer">
                      🚀 Start Assessment
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring" target="_blank" rel="noopener noreferrer">
                      📚 Review All Modules
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Learning Resources */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Open Source Learning Resource</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A community-driven educational project designed to help Java developers master Spring Framework fundamentals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-background p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                  �
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Comprehensive Learning</h4>
                  <p className="text-sm text-muted-foreground">Educational Developer</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Each module builds upon the previous one, creating a solid foundation for Spring development. The practical examples make complex concepts easy to understand."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Structured Learning</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Hands-on</span>
              </div>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                  �️
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Production-Ready Code</h4>
                  <p className="text-sm text-muted-foreground">Enterprise Focus</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "The code examples follow industry best practices and patterns used in real Spring applications. Perfect preparation for professional development."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Best Practices</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Enterprise</span>
              </div>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  🎯
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Spring-Focused Approach</h4>
                  <p className="text-sm text-muted-foreground">Targeted Learning</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Unlike generic Java tutorials, every concept directly relates to Spring Framework usage. This focused approach accelerates the learning process significantly."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Spring-Specific</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Efficient</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">Learning Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">36+</div>
                <div className="text-sm text-muted-foreground">Code Examples</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Open Source</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">MIT</div>
                <div className="text-sm text-muted-foreground">License</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/discussions" target="_blank" rel="noopener noreferrer">
                  💬 Join Discussions
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring" target="_blank" rel="noopener noreferrer">
                  ⭐ Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Master Spring Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Master Spring?</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Start with Module 1 for a complete review, or jump to specific modules based on your needs. 
              Each module is designed to be both standalone and part of a comprehensive learning path.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-card p-6 rounded-2xl border border-border shadow-card">
                <h4 className="text-xl font-bold text-foreground mb-3">🚀 Quick Review Path</h4>
                <p className="text-muted-foreground">Jump to specific modules → Focus on Spring Relevance sections → Complete key exercises</p>
              </div>
              <div className="bg-gradient-card p-6 rounded-2xl border border-border shadow-card">
                <h4 className="text-xl font-bold text-foreground mb-3">📚 Complete Learning Path</h4>
                <p className="text-muted-foreground">Start with Module 1 → Follow sequential order → Complete all exercises → Build projects</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-elegant text-lg px-8 py-6" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/tree/master/module01-oop" target="_blank" rel="noopener noreferrer">
                  ▶️ Start Learning
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring" target="_blank" rel="noopener noreferrer">
                  🐙 Fork on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-card border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground text-lg font-bold">
                  ☕
                </div>
                <h4 className="text-xl font-bold text-foreground">Java Spring Fundamentals Guide</h4>
              </div>
              <p className="text-muted-foreground mb-4">
                Created for backend Java developers preparing for Spring Framework mastery.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <span className="text-lg">🤖</span>
                <span>This educational guide was created with AI assistance and is continuously improved by the community.</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#modules" className="hover:text-primary transition-colors">All Modules</a></li>
                <li><a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/blob/master/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Contributing</a></li>
                <li><a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/blob/master/CHANGELOG.md" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Changelog</a></li>
                <li><a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">License</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/issues" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Report Issues</a></li>
                <li><a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Discussions</a></li>
                <li><a href="https://github.com/Omar-Mega-Byte/java-fundamentals-for-spring" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub Repository</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Java Spring Fundamentals Guide. Licensed under MIT License.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">MIT License</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Java 11+</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Spring Framework</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
