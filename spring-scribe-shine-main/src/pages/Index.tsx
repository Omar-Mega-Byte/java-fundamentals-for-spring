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

      {/* Getting Started */}
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
