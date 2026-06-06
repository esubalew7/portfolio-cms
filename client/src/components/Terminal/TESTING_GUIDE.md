# Terminal Component - Testing Guide

## 🧪 Comprehensive Testing Suite

This guide covers all testing scenarios for the enhanced terminal component.

---

## Environment Setup

### Prerequisites
- Node.js installed
- React project running (npm run dev)
- Terminal component installed
- All dependencies met (framer-motion, lucide-react, etc.)

### Test Commands
```bash
cd client
npm run dev
# Open http://localhost:5173
```

---

## Unit Testing

### 1. Command Parser Tests

#### Test: Parse Valid Command
```javascript
// commandParser.test.js
const parser = new CommandParser(COMMAND_REGISTRY);
const result = parser.parse("help");

expect(result).toEqual({
  valid: true,
  command: "help",
  args: [],
});
```

#### Test: Parse Command with Arguments
```javascript
const result = parser.parse("search hello world");

expect(result.valid).toBe(true);
expect(result.args).toEqual(["hello", "world"]);
```

#### Test: Alias Resolution
```javascript
const result = parser.parse("h");

expect(result.command).toBe("help");
```

#### Test: Invalid Command
```javascript
const result = parser.parse("nonexistent");

expect(result.valid).toBe(false);
expect(result.error).toContain("not found");
```

### 2. Command Execution Tests

#### Test: Execute Help Command
```javascript
const parsed = parser.parse("help");
const result = parser.execute(parsed);

expect(result.success).toBe(true);
expect(result.output).toContain("AVAILABLE COMMANDS");
expect(result.type).toBe("response");
```

#### Test: Execute Clear Command
```javascript
const parsed = parser.parse("clear");
const result = parser.execute(parsed);

expect(result.type).toBe("clear");
expect(result.output).toBeNull();
```

#### Test: Link Command
```javascript
const parsed = parser.parse("github");
const result = parser.execute(parsed);

expect(result.type).toBe("link");
expect(result.url).toContain("github.com");
```

#### Test: Download Command
```javascript
const parsed = parser.parse("resume");
const result = parser.execute(parsed);

expect(result.type).toBe("download");
expect(result.fileName).toContain(".pdf");
```

---

## Component Testing

### 1. Terminal Component Tests

#### Test: Renders When Open
```javascript
const { container } = render(
  <Terminal isOpen={true} />
);

expect(container.querySelector(".terminal-content")).toBeInTheDocument();
```

#### Test: Hidden When Closed
```javascript
const { container } = render(
  <Terminal isOpen={false} />
);

expect(container.firstChild).toBeNull();
```

#### Test: Welcome Message Displays
```javascript
const { getByText } = render(<Terminal isOpen={true} />);

expect(getByText(/WELCOME/i)).toBeInTheDocument();
```

#### Test: Command Execution
```javascript
const { getByPlaceholderText, getByText } = render(
  <Terminal isOpen={true} />
);

const input = getByPlaceholderText(/Type a command/i);
fireEvent.change(input, { target: { value: "help" } });
fireEvent.keyDown(input, { key: "Enter" });

// Should show help response
await waitFor(() => {
  expect(getByText(/AVAILABLE COMMANDS/i)).toBeInTheDocument();
});
```

#### Test: Minimize/Maximize
```javascript
const { getByTitle, queryByText } = render(
  <Terminal isOpen={true} />
);

const minimizeBtn = getByTitle("Minimize");
fireEvent.click(minimizeBtn);

// Content should be hidden
expect(queryByText(/Type a command/i)).not.toBeInTheDocument();

fireEvent.click(minimizeBtn);

// Content should be visible again
expect(queryByText(/Type a command/i)).toBeInTheDocument();
```

### 2. Terminal Display Tests

#### Test: Renders History Items
```javascript
const history = [
  { type: "welcome", content: "Welcome!" },
  { type: "command", content: "help" },
  { type: "response", content: "Response text" },
];

const { getByText } = render(
  <TerminalDisplay history={history} />
);

expect(getByText("Welcome!")).toBeInTheDocument();
expect(getByText("help")).toBeInTheDocument();
expect(getByText("Response text")).toBeInTheDocument();
```

#### Test: Auto-scroll on New Items
```javascript
const scrollRef = { current: { scrollToBottom: jest.fn() } };

render(
  <TerminalDisplay
    ref={scrollRef}
    history={[{ type: "response", content: "New item" }]}
  />
);

expect(scrollRef.current.scrollToBottom).toHaveBeenCalled();
```

#### Test: Animated Response Display
```javascript
const history = [
  {
    type: "response",
    content: "Animated text",
    animated: true,
  },
];

const { container } = render(
  <TerminalDisplay history={history} />
);

// TypingEffect component should be rendered
expect(
  container.querySelector(".font-mono")
).toBeInTheDocument();
```

### 3. Terminal Input Tests

#### Test: Command Input
```javascript
const { getByPlaceholderText } = render(
  <TerminalInput
    value=""
    onChange={jest.fn()}
    onExecute={jest.fn()}
  />
);

const input = getByPlaceholderText(/Type a command/i);
expect(input).toBeInTheDocument();
```

#### Test: Enter Executes Command
```javascript
const handleExecute = jest.fn();

const { getByPlaceholderText } = render(
  <TerminalInput
    value="help"
    onChange={jest.fn()}
    onExecute={handleExecute}
  />
);

const input = getByPlaceholderText(/Type a command/i);
fireEvent.keyDown(input, { key: "Enter" });

expect(handleExecute).toHaveBeenCalledWith("help");
```

#### Test: Arrow Up Navigates History
```javascript
const history = [
  { type: "command", content: "help" },
  { type: "command", content: "about" },
];

const handleChange = jest.fn();

const { getByPlaceholderText } = render(
  <TerminalInput
    value=""
    onChange={handleChange}
    onExecute={jest.fn()}
    commandHistory={history}
  />
);

const input = getByPlaceholderText(/Type a command/i);
fireEvent.keyDown(input, { key: "ArrowUp" });

// Should populate with previous command
expect(handleChange).toHaveBeenCalled();
```

---

## Integration Testing

### 1. Full Command Flow

#### Test: Complete Help Command Flow
```javascript
const { getByPlaceholderText, getByText } = render(
  <Terminal isOpen={true} />
);

// User types command
const input = getByPlaceholderText(/Type a command/i);
fireEvent.change(input, { target: { value: "help" } });

// User presses Enter
fireEvent.keyDown(input, { key: "Enter" });

// Wait for response
await waitFor(() => {
  expect(getByText(/AVAILABLE COMMANDS/i)).toBeInTheDocument();
});

// Input should be cleared
expect(input.value).toBe("");
```

#### Test: Alias Resolves Correctly
```javascript
const { getByPlaceholderText, getByText } = render(
  <Terminal isOpen={true} />
);

const input = getByPlaceholderText(/Type a command/i);
fireEvent.change(input, { target: { value: "h" } });
fireEvent.keyDown(input, { key: "Enter" });

// 'h' should execute 'help'
await waitFor(() => {
  expect(getByText(/AVAILABLE COMMANDS/i)).toBeInTheDocument();
});
```

#### Test: Link Command Opens URL
```javascript
const mockOpen = jest.fn();
window.open = mockOpen;

const { getByPlaceholderText } = render(
  <Terminal isOpen={true} />
);

const input = getByPlaceholderText(/Type a command/i);
fireEvent.change(input, { target: { value: "github" } });
fireEvent.keyDown(input, { key: "Enter" });

await waitFor(() => {
  expect(mockOpen).toHaveBeenCalledWith(
    expect.stringContaining("github.com"),
    "_blank",
    "noopener,noreferrer"
  );
});
```

#### Test: Clear Command Resets History
```javascript
const { getByPlaceholderText, queryByText } = render(
  <Terminal isOpen={true} />
);

const input = getByPlaceholderText(/Type a command/i);

// Execute help to add to history
fireEvent.change(input, { target: { value: "help" } });
fireEvent.keyDown(input, { key: "Enter" });

// Execute clear
fireEvent.change(input, { target: { value: "clear" } });
fireEvent.keyDown(input, { key: "Enter" });

// History should be cleared (only terminal ready message)
expect(queryByText(/AVAILABLE COMMANDS/i)).not.toBeInTheDocument();
```

### 2. Multi-Command Sequence

#### Test: Multiple Commands in Sequence
```javascript
const { getByPlaceholderText, getByText } = render(
  <Terminal isOpen={true} />
);

const input = getByPlaceholderText(/Type a command/i);

// Command 1: help
fireEvent.change(input, { target: { value: "help" } });
fireEvent.keyDown(input, { key: "Enter" });

await waitFor(() => {
  expect(getByText(/AVAILABLE COMMANDS/i)).toBeInTheDocument();
});

// Command 2: about
fireEvent.change(input, { target: { value: "about" } });
fireEvent.keyDown(input, { key: "Enter" });

await waitFor(() => {
  expect(getByText(/Full Stack Developer/i)).toBeInTheDocument();
});

// Both responses should be in history
expect(getByText(/AVAILABLE COMMANDS/i)).toBeInTheDocument();
expect(getByText(/Full Stack Developer/i)).toBeInTheDocument();
```

---

## Manual UI Testing

### 1. Visual Regression Testing

#### Checklist:
- [ ] Terminal has glass effect on light background
- [ ] Terminal has glass effect on dark background
- [ ] Header buttons are properly styled (red, yellow, green)
- [ ] Text is readable at all sizes
- [ ] Glow effects are visible
- [ ] Colors match brand guidelines
- [ ] Animations are smooth
- [ ] No visual glitches

### 2. Responsive Design Testing

#### Desktop (1920px)
```bash
✓ Terminal width: 900px
✓ All content visible
✓ No horizontal scroll
✓ Animations smooth at 60fps
```

#### Tablet (768px)
```bash
✓ Terminal width: 800px
✓ Text still readable
✓ Input field usable
✓ No text overflow
```

#### Mobile (375px)
```bash
✓ Terminal full width (minus padding)
✓ Touch targets large enough (44px minimum)
✓ Scrollable content
✓ No horizontal scroll
```

### 3. Accessibility Testing

#### Keyboard Navigation
```bash
✓ Tab navigates through elements
✓ Enter executes commands
✓ Arrow Up/Down navigate history
✓ Focus visible on all interactive elements
```

#### Color Contrast
```bash
✓ Text on background: 7:1 ratio
✓ Button labels readable
✓ Error messages visible
✓ Links distinguishable from text
```

#### Screen Reader
```bash
✓ Terminal has proper ARIA labels
✓ Commands are announced
✓ Responses are announced
✓ Buttons have descriptive titles
```

---

## Performance Testing

### 1. Load Time
```bash
Initial render: < 500ms
Command execution: < 100ms
Response animation: 5-10 seconds (configurable)
Total interaction time: < 1 second
```

### 2. Memory Usage
```bash
Idle state: < 5MB
With 50 commands: < 10MB
With 100 commands: < 15MB
```

### 3. Animation Performance
```bash
FPS during animation: 60fps minimum
GPU acceleration: Enabled
No jank or stutter: Verified
```

### Test Script:
```javascript
// Performance testing
performance.mark("terminal-start");

// Execute command
executeCommand("about");

performance.mark("terminal-end");
performance.measure(
  "terminal-execution",
  "terminal-start",
  "terminal-end"
);

const measure = performance.getEntriesByName(
  "terminal-execution"
)[0];
console.log(`Execution time: ${measure.duration}ms`);
```

---

## Browser Compatibility Testing

### Desktop Browsers
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Mobile Browsers
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Test Each Browser For:
- [ ] Terminal renders correctly
- [ ] Animations play smoothly
- [ ] Input field works
- [ ] Links open properly
- [ ] Downloads trigger
- [ ] Cursor animates smoothly

---

## Edge Case Testing

### 1. Empty Input
```bash
✓ Pressing Enter with no text does nothing
✓ No error message displayed
```

### 2. Very Long Commands
```bash
✓ Command wraps properly
✓ Response displays fully
✓ No layout breaking
```

### 3. Special Characters
```bash
✓ Commands with special chars rejected gracefully
✓ Error message displayed
✓ Terminal remains usable
```

### 4. Rapid Command Execution
```bash
✓ Multiple commands don't break parser
✓ History displays in order
✓ No race conditions
```

### 5. History Overflow
```bash
✓ History limited to max commands
✓ Old commands removed
✓ Performance stays consistent
```

---

## Security Testing

### 1. Command Injection
```javascript
// Attempt command injection
executeCommand("help; rm -rf /");

// Expected: Command not found error
// Should NOT execute multiple commands
```

### 2. XSS Attempts
```javascript
// Attempt to inject HTML
executeCommand("about<img src=x onerror=alert('xss')>");

// Expected: Escaped and displayed as text
// Should NOT execute JavaScript
```

### 3. Link Validation
```javascript
// Attempt to open javascript: URL
// Only https/http URLs should open
```

### 4. File Path Validation
```javascript
// Attempt path traversal on downloads
// Should only download from allowed paths
```

---

## Regression Testing

### After Each Update:

1. **Core Functionality**
   - [ ] All commands still work
   - [ ] Terminal opens/closes
   - [ ] History displays
   - [ ] Input works

2. **New Features**
   - [ ] Aliases resolve
   - [ ] Animations play
   - [ ] Links open
   - [ ] Downloads trigger

3. **Performance**
   - [ ] No memory leaks
   - [ ] Smooth animations
   - [ ] Responsive input

4. **Visual**
   - [ ] No styling regressions
   - [ ] No layout shifts
   - [ ] Animations unchanged

---

## Test Command Reference

### All Commands to Test

```bash
# Information Commands
about
whoami
experience
exp
education
edu
techstack
tech
skills

# Portfolio Commands
projects
proj
resume
cv

# Links
github
gh
linkedin
in
contact
mail
email

# System
help
h
?
clear
cls
rm

# Invalid
invalid
xyz123
unknown
```

---

## Automated Test Suite Template

```javascript
// __tests__/Terminal.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Terminal } from "@/components/Terminal";

describe("Terminal Component", () => {
  it("renders when open", () => {
    render(<Terminal isOpen={true} />);
    expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
  });

  it("executes help command", async () => {
    render(<Terminal isOpen={true} />);
    const input = screen.getByPlaceholderText(/Type a command/i);
    
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.keyDown(input, { key: "Enter" });
    
    await waitFor(() => {
      expect(screen.getByText(/AVAILABLE COMMANDS/i)).toBeInTheDocument();
    });
  });

  // ... more tests
});
```

---

## Test Metrics

### Coverage Goals
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

### Generate Coverage Report
```bash
npm test -- --coverage
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Terminal Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
      - run: npm run build
```

---

## Bug Report Template

When reporting issues, include:

```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Open terminal
2. Execute command: `xxx`
3. Observe behavior

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows, macOS]
- Browser: [e.g., Chrome 120]
- React: [version]
- Framer Motion: [version]

## Screenshots
[If applicable]

## Additional Context
Any other relevant information
```

---

## Success Criteria

All tests should pass for:
- ✅ Unit tests
- ✅ Component tests
- ✅ Integration tests
- ✅ Performance benchmarks
- ✅ Visual regression tests
- ✅ Accessibility audit
- ✅ Security scan
- ✅ Cross-browser compatibility

---

**Happy testing!** 🧪✅
