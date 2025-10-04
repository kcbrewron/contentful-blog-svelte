# GitHub Copilot Instructions

## Project Overview
This is a SvelteKit project template using JavaScript, Cloudflare D1 database, and TailwindCSS. When working with this codebase, please follow these guidelines for optimal GitHub Copilot assistance.

## Code Style & Patterns

### JavaScript Best Practices
```javascript
// DO: Use JSDoc for type documentation and better IntelliSense
/**
 * @typedef {Object} User
 * @property {string} id - The user's unique identifier
 * @property {string} name - The user's full name
 * @property {string} email - The user's email address
 */

/**
 * @param {*} data - Raw user data
 * @returns {User} - Validated user object
 */
function validateUser(data) {
  // Implementation
}

// DO: Use named functions for better stack traces and debugging
function handleError(error) {
  // Implementation
}

// DON'T: Avoid arrow functions for primary function declarations
// const handleError = (error) => { ... }; // ❌
```

### SvelteKit Patterns
```javascript
// DO: Use JSDoc for documenting page data
/**
 * @typedef {Object} PageLoad
 * @property {Array<Item>} items - List of items for the page
 */

/**
 * @param {Object} params - URL parameters
 * @returns {Promise<PageLoad>} Page data
 */
export function load({ params }) {
  // Implementation
}

// DO: Use named event handlers
/**
 * @param {SubmitEvent} event - Form submission event
 */
function handleSubmit(event) {
  // Implementation
}
```

### Database Operations
```javascript
/**
 * @typedef {Object} DBUser
 * @property {number} id - User's database ID
 * @property {string} email - User's email address
 */

/**
 * @param {number} id - User ID to fetch
 * @returns {Promise<?DBUser>} User data or null if not found
 */
function getUser(id) {
  // Implementation
}
```

## Testing Guidelines

### Unit Tests
```javascript
// DO: Write descriptive test blocks with named functions
describe('UserComponent', () => {
  /** @type {User} */
  let testUser;

  beforeEach(function setupTestUser() {
    testUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    };
  });

  it('should display user information when data is loaded', function testUserDisplay() {
    // Test implementation
  });
});

// DO: Use proper assertions
expect(result).toBeDefined();
expect(response.status).toBe(200);
```

## Copilot Prompts

### Effective Prompting
When working with Copilot, use these patterns for better suggestions:

1. **Component Creation**
```javascript
/**
 * Create a new Svelte component that handles user authentication
 * Requirements:
 * - Email/password form
 * - Validation
 * - Error handling
 */
```

2. **Database Queries**
```javascript
/**
 * Create a D1 database query to fetch users
 * with pagination and sorting
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} sortBy - Sort field
 */
```

3. **API Endpoints**
```javascript
/**
 * Create an API endpoint for user registration
 * Include:
 * - Input validation
 * - Password hashing
 * - Error handling
 */
```

## Best Practices

### Component Organization
- Keep components small and focused
- Use JSDoc for prop documentation
- Implement error boundaries
- Follow SvelteKit's routing conventions

### State Management
- Use Svelte stores appropriately
- Implement proper loading states
- Handle errors gracefully

### Performance
- Implement proper caching strategies
- Use lazy loading for routes
- Optimize database queries

### Security
- Validate all user inputs
- Implement proper CSRF protection
- Use parameterized queries for D1

## Maintenance

### Code Reviews
When reviewing code with Copilot:
- Check for proper JSDoc documentation
- Verify error handling
- Ensure test coverage
- Validate security practices

### Documentation
When documenting code:
```javascript
/**
 * Fetches user data from D1 database
 * @function getUserData
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<User>} The user object
 * @throws {Error} When user is not found
 */
function getUserData(userId) {
  // Implementation
}
```

## Example Workflows

### Creating a New Feature
1. Write JSDoc documentation
2. Create unit tests
3. Implement the feature
4. Add error handling
5. Document the code
6. Add integration tests

### Debugging
1. Use VSCode debugger
2. Check error boundaries
3. Verify database queries
4. Test edge cases

## Tools Integration

### Development Tools
- Use ESLint for code quality
- Implement Prettier for formatting
- Use Vitest for testing
- Use JSDoc for documentation generation

### CI/CD
- Run linting checks
- Execute test suite
- Verify build process
- Check bundle size
- Generate documentation

## Project Overview
This is a SvelteKit project template using TypeScript, Cloudflare D1 database, and TailwindCSS. When working with this codebase, please follow these guidelines for optimal GitHub Copilot assistance.

## Code Style & Patterns


### SvelteKit Patterns
```typescript
// DO: Use strong typing for page data
export const load = async ({ params }): Promise<{ items: Item[] }> => {
  // Implementation
};

// DO: Use typed event handlers
function handleSubmit(event: SubmitEvent) {
  // Implementation
}
```

### Database Operations
```typescript
// DO: Use typed database queries
interface DBUser {
  id: number;
  email: string;
}

const getUser = async (id: number): Promise<DBUser | null> => {
  // Implementation
};
```

## Testing Guidelines

### Unit Tests
```javascript
// DO: Write descriptive test blocks
describe('UserComponent', () => {
  it('should display user information when data is loaded', () => {
    // Test implementation
  });
});

// DO: Use proper assertions
expect(result).toBeDefined();
expect(response.status).toBe(200);
```

## Copilot Prompts

### Effective Prompting
When working with Copilot, use these patterns for better suggestions:

1. **Component Creation**
```typescript
// Create a new Svelte component that handles user authentication
// Requirements:
// - Email/password form
// - Validation
// - Error handling
```

2. **Database Queries**
```javascript
// Create a D1 database query to fetch users
// with pagination and sorting
// Parameters: page, limit, sortBy
```

3. **API Endpoints**
```javascript
// Create an API endpoint for user registration
// Include:
// - Input validation
// - Password hashing
// - Error handling
```

## Best Practices

### Component Organization
- Keep components small and focused
- Use TypeScript for prop definitions
- Implement error boundaries
- Follow SvelteKit's routing conventions

### State Management
- Use Svelte stores appropriately
- Implement proper loading states
- Handle errors gracefully

### Performance
- Implement proper caching strategies
- Use lazy loading for routes
- Optimize database queries

### Security
- Validate all user inputs
- Implement proper CSRF protection
- Use parameterized queries for D1

## Maintenance

### Code Reviews
When reviewing code with Copilot:
- Check for proper type usage
- Verify error handling
- Ensure test coverage
- Validate security practices

### Documentation
When documenting code:
```typescript
/**
 * @function getUserData
 * @description Fetches user data from D1 database
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<User>} The user object
 * @throws {Error} When user is not found
 */
```

## Example Workflows

### Creating a New Feature
1. Define necessary data inputs and outputs
2. Write JSDoc documentation
2. Create unit tests
3. Implement the feature
4. Add error handling
5. Document the code
6. Add integration tests

### Debugging
1. Use javascript to identify issues
2. Check error boundaries
3. Verify database queries
4. Test edge cases

## Tools Integration

### Development Tools
- Use ESLint for code quality
- Implement Prettier for formatting
- Use Vitest for testing
- Implement Storybook for components

### CI/CD
- Run type checks
- Execute test suite
- Verify build process
- Check bundle size
