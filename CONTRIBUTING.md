# Development Guidelines

## Core Principles

### JavaScript/TypeScript Best Practices
- Use TypeScript for better type safety and developer experience
- Follow ES6+ conventions and modern JavaScript patterns
- Utilize async/await for asynchronous operations
- Implement proper error handling with try/catch blocks
- Use const by default, let when necessary, avoid var

### Clean Code Principles
1. **Single Responsibility Principle (SRP)**
   - Each component/function should do one thing and do it well
   - Keep files focused and cohesive

2. **DRY (Don't Repeat Yourself)**
   - Extract reusable code into shared components or utilities
   - Use SvelteKit's built-in layouts for shared UI elements

3. **KISS (Keep It Simple, Stupid)**
   - Write simple, straightforward code
   - Avoid premature optimization
   - Use clear, descriptive naming conventions

4. **Code Organization**
   - Group related files together
   - Use meaningful directory structure
   - Keep components small and manageable

### Test-Driven Development (TDD)
1. **Write Tests First**
   - Start with failing tests that describe the expected behavior
   - Implement the minimum code needed to pass the tests
   - Refactor while keeping tests green

2. **Testing Guidelines**
   - Unit tests for individual components and functions
   - Integration tests for API endpoints and data flow
   - End-to-end tests for critical user journeys
   - Use Vitest for unit and integration testing
   - Aim for high test coverage on business logic

3. **Test Structure**
   ```javascript
   describe('Component/Function name', () => {
     beforeEach(() => {
       // Setup
     });

     it('should describe expected behavior', () => {
       // Arrange
       // Act
       // Assert
     });
   });
   ```

## Development Workflow
1. Create a new branch for each feature/fix
2. Write failing tests
3. Implement the feature/fix
4. Ensure all tests pass
5. Refactor if necessary
6. Submit PR with clear description
7. Code review
8. Merge after approval

## Code Style
- Use Prettier for consistent formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Write clear, concise comments
- Document complex logic and public APIs
