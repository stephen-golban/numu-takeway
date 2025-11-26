---
type: "always_apply"
---

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bunx ultracite fix`
- **Check for issues**: `bunx ultracite check`
- **Diagnose setup**: `bunx ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React Native & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Follow React Native accessibility best practices:
  - Add `accessible={true}` and `accessibilityLabel` to interactive elements
  - Use `accessibilityRole` to indicate component purpose (button, header, link, etc.)
  - Include `accessibilityHint` for additional context when needed
  - Use `accessibilityState` to communicate state (disabled, selected, etc.)
  - Ensure sufficient touch target sizes (minimum 44x44 points)
  - Test with TalkBack (Android) and VoiceOver (iOS)

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)

### React Native & Expo Guidance

**Components:**
- Use `View`, `Text`, `TouchableOpacity`, `Pressable` from `react-native`
- Use `SafeAreaView` from `react-native-safe-area-context` for safe area handling
- Use Expo Router for navigation (`useRouter`, `Link`, `Stack`)
- Use NativeWind with `className` prop for styling (Tailwind CSS syntax)

**Styling:**
- Use NativeWind/Tailwind classes via `className` prop
- Use `cn()` utility from `lib/utils` for conditional class merging
- Avoid inline styles when NativeWind classes can achieve the same result

**Expo-Specific:**
- Use `expo-router` for file-based routing
- Use Expo SDK packages when available (e.g., `expo-image`, `expo-application`)
- Configure providers in `app/_layout.tsx`
- Use environment variables with `EXPO_PUBLIC_` prefix

**Web3/Wallet:**
- Use Reown AppKit hooks (`useAppKit`, `useAccount`, `useProvider`)
- Use ethers.js v6 for contract interactions
- Handle wallet connection state appropriately

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `bunx ultracite fix` before committing to ensure compliance.
