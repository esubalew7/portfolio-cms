# Terminal Component - API Reference

Complete API documentation for the Terminal component system v2.

---

## Core Components

### Terminal

Main terminal component with drag support and window controls.

```jsx
import { Terminal } from "@/components/Terminal";

<Terminal
  isOpen={true}
  onClose={() => {}}
  position={{ x: 40, y: 60 }}
  className=""
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `true` | Show/hide terminal |
| `onClose` | `function` | `undefined` | Callback on close button |
| `position` | `object` | `{ x: 40, y: 60 }` | Initial position `{ x, y }` |
| `className` | `string` | `""` | Additional CSS classes |

#### Methods (via ref)

None - Terminal is a controlled component via props.

#### Events

- `onClose()` - Called when user clicks close button

---

### TerminalDisplay

Displays command history with animations.

```jsx
import { TerminalDisplay } from "@/components/Terminal";

<TerminalDisplay
  ref={displayRef}
  history={historyArray}
  className="flex-1 overflow-y-auto p-4"
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `history` | `array` | Array of history entries |
| `className` | `string` | CSS classes for container |
| `ref` | `RefObject` | Ref for scroll control |

#### History Entry Format

```javascript
{
  type: "command" | "response" | "error" | "welcome",
  content: "Text content",
  animated: false,  // Optional - enable typing animation
  timestamp: Date,  // Optional
}
```

#### Methods (via ref)

```javascript
displayRef.current.scrollToBottom()  // Auto-scroll to bottom
```

---

### TerminalInput

Command input field with history navigation and cursor animation.

```jsx
import { TerminalInput } from "@/components/Terminal";

<TerminalInput
  value={inputValue}
  onChange={setInputValue}
  onExecute={executeCommand}
  commandHistory={historyItems}
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Current input value |
| `onChange` | `function` | Called when input changes |
| `onExecute` | `function(command)` | Called when Enter pressed |
| `commandHistory` | `array` | History items for Up/Down nav |

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Execute command |
| `Arrow Up` | Previous command |
| `Arrow Down` | Next command |
| `Escape` | (Future: clear input) |

---

### TypingEffect

Animated text typing effect component.

```jsx
import { TypingEffect } from "@/components/Terminal";

<TypingEffect
  text="Text to animate"
  speed={8}
  onComplete={() => console.log("done")}
  className="text-cyan-400"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `""` | Text to animate |
| `speed` | `number` | `10` | Delay between chars (ms) |
| `onComplete` | `function` | `null` | Callback when done |
| `className` | `string` | `""` | CSS classes |

#### Speed Guidelines

```
3-5      Very fast (hacker style)
8-10     Normal readable speed
15-20    Slow for drama
30+      Very slow intentional pauses
```

---

## Utilities

### CommandParser

Advanced command parsing engine with alias resolution.

```javascript
import CommandParser from "@/components/Terminal/commandParser";
import { COMMAND_REGISTRY } from "@/components/Terminal";

const parser = new CommandParser(COMMAND_REGISTRY);
```

#### Methods

##### `parse(input: string): ParsedCommand`

Parse raw user input into command structure.

```javascript
const parsed = parser.parse("help --verbose");

// Returns:
{
  valid: true,
  command: "help",
  originalInput: "help --verbose",
  args: ["--verbose"],
  description: "Show all commands",
  metadata: { category: "System" }
}
```

##### `execute(parsed: ParsedCommand): ExecutionResult`

Execute a parsed command.

```javascript
const result = parser.execute(parsed);

// Returns:
{
  success: true,
  output: "Command output text",
  type: "response",
  animated: true,
  command: "help"
}
```

##### `getAvailableCommands(): Command[]`

Get list of all available commands.

```javascript
const commands = parser.getAvailableCommands();

// Returns:
[
  {
    name: "help",
    description: "Show available commands",
    aliases: ["h", "?"],
    category: "System"
  },
  // ...
]
```

##### `commandExists(name: string): boolean`

Check if command exists (resolves aliases).

```javascript
parser.commandExists("help")    // true
parser.commandExists("h")        // true (alias)
parser.commandExists("invalid")  // false
```

##### `getCommand(name: string): Command | null`

Get command object by name.

```javascript
const cmd = parser.getCommand("help");
// or
const cmd = parser.getCommand("h");  // Alias resolved
```

---

## Configuration

### COMMAND_REGISTRY

Central configuration for all commands.

```javascript
export const COMMAND_REGISTRY = {
  aliases: {
    [alias]: "commandName",
  },
  commands: {
    [commandName]: {
      description: string,
      metadata: object,
      response: string | function,
    },
  },
}
```

#### Aliases

```javascript
aliases: {
  h: "help",
  ?: "help",
  cls: "clear",
  rm: "clear",
  exp: "experience",
  edu: "education",
  cv: "resume",
  tech: "techstack",
  whoami: "about",
  // Add more as needed
}
```

#### Command Definition

```javascript
commands: {
  mycommand: {
    description: "What this command does",
    
    metadata: {
      category: "Information",      // Command category
      animated: true,               // Enable typing animation
      type: "response",             // or "link", "download"
      url: "https://...",          // For link type
      fileUrl: "/path/file.pdf",   // For download type
      fileName: "filename.pdf",     // Download filename
    },
    
    response: "Static text"         // or function
  },
}
```

#### Response Types

**Static String:**
```javascript
response: "This is the response text"
```

**Dynamic Function:**
```javascript
response: (args, input) => {
  return `You typed: ${input}`;
}
```

- `args` - Array of command arguments
- `input` - Original user input string

---

## Constants

### WELCOME_MESSAGE

Initial welcome message displayed when terminal opens.

```javascript
export const WELCOME_MESSAGE = `
╔════════════════════════════════════════════════════════════╗
║        WELCOME TO MY INTERACTIVE DEVELOPER TERMINAL        ║
╚════════════════════════════════════════════════════════════╝
...
`;
```

### COMMAND_HISTORY_LIMIT

Maximum commands to keep in history (default: 100).

```javascript
export const COMMAND_HISTORY_LIMIT = 100;
```

---

## Type Definitions

### ParsedCommand

```typescript
interface ParsedCommand {
  valid: boolean;
  command: string | null;
  originalInput?: string;
  args: string[];
  description?: string;
  metadata?: Record<string, any>;
  error?: string;
}
```

### ExecutionResult

```typescript
interface ExecutionResult {
  success: boolean;
  output: string | null;
  type: "response" | "error" | "link" | "download" | "clear";
  animated?: boolean;
  command?: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
}
```

### HistoryEntry

```typescript
interface HistoryEntry {
  type: "command" | "response" | "error" | "welcome";
  content: string;
  animated?: boolean;
  timestamp?: Date;
}
```

### Command

```typescript
interface Command {
  description: string;
  metadata?: {
    category?: string;
    animated?: boolean;
    type?: "response" | "link" | "download" | "clear";
    url?: string;
    fileUrl?: string;
    fileName?: string;
  };
  response: string | ((args: string[], input: string) => string);
}
```

---

## Hooks (if needed)

Currently, no custom hooks are exposed. The component is fully self-contained.

Future hooks to consider:
- `useTerminal()` - Access terminal state
- `useCommandParser()` - Access parser instance
- `useTerminalHistory()` - Manage history

---

## Events & Callbacks

### Terminal

```javascript
<Terminal
  onClose={() => console.log("Terminal closed")}
/>
```

### TerminalInput

```javascript
<TerminalInput
  onChange={(value) => console.log("Input changed:", value)}
  onExecute={(command) => console.log("Command executed:", command)}
/>
```

---

## CSS Classes & Styling

### Tailwind Classes Used

**Spacing:**
- `p-4` - Padding 1rem
- `gap-2`, `gap-4` - Gaps between elements
- `px-4`, `py-2` - Horizontal/vertical padding

**Colors:**
- `cyan-400`, `cyan-500` - Primary accent
- `purple-500` - Glow effect
- `green-500` - Command prompt
- `red-400` - Errors
- `gray-900`, `gray-800` - Background
- `white` - Text

**Effects:**
- `backdrop-blur-lg` - Glass effect
- `drop-shadow-lg` - Shadows
- `rounded-lg` - Border radius
- `border` - Borders

### Custom Animation Classes

```css
/* In TerminalDisplay.jsx */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
```

---

## Performance Optimization

### Memoization

Components are optimized with:
- `React.forwardRef` for display component
- `useCallback` for event handlers
- `useRef` for parser instance

### Animation Performance

- Framer Motion uses GPU acceleration
- Animations only play when visible
- Staggered animations with controlled delays

### History Management

- History limited to 100 items max
- Old commands removed automatically
- Efficient re-renders with key props

---

## Browser Support

### Desktop
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile
- iOS Safari 14+
- Android Chrome
- Samsung Internet

### Features by Browser

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Terminal | ✅ | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ |
| Backdrop Blur | ✅ | ✅ | ✅ | ✅ |
| Drag | ✅ | ✅ | ✅ | ✅ |

---

## Troubleshooting

### Issue: Aliases not working

**Check:**
- Alias name is lowercase
- Target command exists in `commands`
- Restarted dev server

### Issue: Animations not showing

**Check:**
- `animated: true` in metadata
- Framer Motion installed
- Motion components imported

### Issue: Links not opening

**Check:**
- `type: "link"` in metadata
- `url` is specified and valid
- Not blocked by browser popup blocker

### Issue: Parser throwing errors

**Check:**
- Command registry properly exported
- Parser instantiated with registry
- No circular imports

---

## FAQs

**Q: Can I use the terminal without React?**
A: No, it's a React component library.

**Q: Can I customize animations?**
A: Yes, edit Framer Motion props in source files.

**Q: How do I add new commands?**
A: Add to `COMMAND_REGISTRY.commands` object.

**Q: Can I persist command history?**
A: Not built-in, but you can add localStorage logic.

**Q: Is it accessible?**
A: Yes, includes keyboard navigation and screen reader support.

**Q: Can I use it without Tailwind?**
A: You'd need to add CSS classes or convert to inline styles.

---

## Migration from v1

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for upgrade instructions.

---

## Code Examples

### Basic Setup

```javascript
import { Terminal } from "@/components/Terminal";

export default function App() {
  return (
    <div>
      <Terminal isOpen={true} />
    </div>
  );
}
```

### With Toggle

```javascript
import { useState } from "react";
import { Terminal } from "@/components/Terminal";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        Toggle Terminal
      </button>
      <Terminal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
```

### Direct Parser Usage

```javascript
import CommandParser from "@/components/Terminal/commandParser";
import { COMMAND_REGISTRY } from "@/components/Terminal";

const parser = new CommandParser(COMMAND_REGISTRY);

const parsed = parser.parse("about");
const result = parser.execute(parsed);
console.log(result.output);
```

---

## Additional Resources

- [README.md](README.md) - Getting started
- [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) - Detailed features
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Upgrade guide
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing procedures
- [Source Code](.) - Well-commented files

---

**Last Updated:** 2026-06-06
**Version:** 2.0.0
