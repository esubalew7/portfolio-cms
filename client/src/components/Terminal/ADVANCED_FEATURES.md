# Terminal Component - Advanced Features Guide

## 🚀 New Enhancements

This guide covers the advanced features added to the terminal component system.

---

## Command Parser System

The terminal now uses an advanced command parsing system that handles:
- Command parsing and validation
- Alias resolution
- Dynamic command execution
- Multiple response types (text, links, downloads)

### How It Works

```javascript
import CommandParser from "@/components/Terminal/commandParser";
import { COMMAND_REGISTRY } from "@/components/Terminal/commandRegistry";

const parser = new CommandParser(COMMAND_REGISTRY);

// Parse a command
const parsed = parser.parse("help --verbose");
// Returns: { valid, command, args, description, metadata }

// Execute the parsed command
const result = parser.execute(parsed);
// Returns: { success, output, type, animated }
```

### Parser Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `parse(input)` | Parse user input | Parsed command object |
| `execute(parsed)` | Execute parsed command | Result object with output |
| `getAvailableCommands()` | List all commands | Array of command objects |
| `commandExists(name)` | Check if command exists | Boolean |
| `getCommand(name)` | Get command details | Command object or null |

---

## Command Registry

All commands are defined in `commandRegistry.js` with a centralized configuration system.

### Command Structure

```javascript
const COMMAND_REGISTRY = {
  aliases: {
    h: "help",      // 'h' becomes 'help'
    cls: "clear",   // 'cls' becomes 'clear'
  },

  commands: {
    help: {
      description: "Show all commands",
      metadata: {
        category: "System",
        animated: true,
      },
      response: "Response text or function",
    },
  },
};
```

### Command Metadata Options

```javascript
metadata: {
  category: "Information",        // Command category
  animated: true,                 // Animate response text
  type: "link",                   // Special type: link, download
  url: "https://example.com",    // For link type
  fileUrl: "/path/to/file.pdf",  // For download type
  fileName: "resume.pdf",         // Download filename
}
```

---

## Dynamic Command Responses

Commands can have static text or dynamic functions:

### Static Response

```javascript
about: {
  description: "About me",
  response: "I'm a developer...",
}
```

### Dynamic Response Function

```javascript
skills: {
  description: "View skills",
  response: (args, input) => {
    // args: array of command arguments
    // input: original command input
    return `Skills response based on: ${input}`;
  },
}
```

---

## Typing Animation

Responses can be animated with a typing effect using the new `TypingEffect` component.

### Enable Animation

Set `animated: true` in command metadata:

```javascript
about: {
  metadata: {
    animated: true,  // Enable typing animation
  },
  response: "Your response text...",
}
```

### Control Animation Speed

In `TerminalDisplay.jsx`:

```javascript
<TypingEffect
  text={content}
  speed={8}  // Lower = faster (default 10)
  className="whitespace-pre-wrap"
/>
```

Speed values:
- `3-5`: Very fast (hacker-like)
- `8-10`: Normal (readable)
- `15-20`: Slow (dramatic)
- `30+`: Very slow (intentional pauses)

---

## Command Aliases

Aliases provide shortcuts for commands:

### Predefined Aliases

```javascript
aliases: {
  h: "help",           // 'h' or 'help'
  ?: "help",           // '?' for help
  cls: "clear",        // 'cls' or 'clear'
  rm: "clear",         // 'rm' or 'clear'
  exp: "experience",   // 'exp' or 'experience'
  edu: "education",    // 'edu' or 'education'
  cv: "resume",        // 'cv' or 'resume'
  tech: "techstack",   // 'tech' or 'techstack'
  whoami: "about",     // 'whoami' or 'about'
}
```

### Add Custom Alias

Edit `commandRegistry.js`:

```javascript
aliases: {
  // ... existing aliases
  myalias: "actualcommand",
}
```

---

## Command Types

### 1. Regular Response

Standard text response displayed in terminal:

```javascript
experience: {
  metadata: { category: "Information" },
  response: "Professional experience...",
}
```

### 2. Link Commands

Opens external URL in new tab:

```javascript
github: {
  metadata: {
    type: "link",
    url: "https://github.com/yourprofile",
  },
  response: "Opening GitHub...",
}
```

### 3. Download Commands

Triggers file download:

```javascript
resume: {
  metadata: {
    type: "download",
    fileUrl: "/resume.pdf",
    fileName: "Resume_Developer.pdf",
  },
  response: "Downloading resume...",
}
```

### 4. Special Commands

- **clear**: Resets terminal history
- **help**: Shows formatted command table

---

## New Commands

### experience
Shows professional work history with company details and achievements.

**Aliases**: `exp`

```bash
> experience
> exp
```

### education
Displays educational background, certifications, and coursework.

**Aliases**: `edu`

```bash
> education
> edu
```

### techstack
Lists technical skills organized by category with proficiency levels.

**Aliases**: `tech`, `skills`

```bash
> techstack
> tech
> skills
```

### resume
Downloads CV/Resume as PDF.

**Aliases**: `cv`

```bash
> resume
> cv
```

---

## Startup Animation

The terminal now includes a smooth startup animation sequence:

1. **0ms**: Terminal fades in with scale animation
2. **200ms**: Header starts fading in
3. **300ms**: Header buttons cascade in (red, yellow, green)
4. **300ms**: Border glow animation begins
5. **400ms**: Glow effect fades in
6. **500ms**: Terminal content animates

These timings create a polished, professional entrance effect.

### Customize Startup Animation

In `Terminal.jsx`:

```javascript
<motion.div
  initial={{ opacity: 0, scale: 0.8, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{
    type: "spring",
    stiffness: 300,  // Increase for snappier
    damping: 30,     // Decrease for bouncier
    duration: 0.5,   // Increase for slower
  }}
>
```

---

## History Navigation

Use Arrow Keys to navigate command history:

- **Arrow Up**: Previous command
- **Arrow Down**: Next command
- **Enter**: Execute
- **Escape**: Clear selection (if implemented)

This is handled in `TerminalInput.jsx`.

---

## Styling Advanced Features

### Typing Animation Colors

Edit in `TypingEffect.jsx`:

```javascript
<motion.span
  className="text-cyan-400"  // Change color here
>
  ▊
</motion.span>
```

### Response Animation Timing

In `TerminalDisplay.jsx`:

```javascript
variants: {
  itemVariants: {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },  // Adjust here
    },
  },
  containerVariants: {
    staggerChildren: 0.05,  // Delay between items
  },
}
```

### Glow Effects

Modify glassmorphism in `Terminal.jsx`:

```javascript
<motion.div
  className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-500/10"
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4, duration: 0.6 }}
/>
```

---

## Production Ready Features

### Error Handling

Commands handle errors gracefully:

```javascript
{
  success: false,
  output: "Error executing command: ...",
  type: "error",
}
```

### Performance Optimized

- Command parser is cached in a ref
- History limited to 100 commands
- Animations use Framer Motion GPU acceleration
- Lazy rendering of terminal content

### Security

- Command input is sanitized
- Links open with `noopener,noreferrer`
- No eval or unsafe command execution
- All commands are whitelisted

### Accessibility

- Keyboard navigation (Arrow keys)
- Proper focus management
- Semantic HTML
- High contrast colors

---

## Extending the Terminal

### Add New Command

1. Edit `commandRegistry.js`:

```javascript
export const COMMAND_REGISTRY = {
  aliases: {
    myalias: "mycommand",
  },
  commands: {
    mycommand: {
      description: "What my command does",
      metadata: {
        category: "Information",
        animated: true,
      },
      response: (args, input) => {
        // Return dynamic response
        return "Response based on: " + input;
      },
    },
  },
};
```

2. That's it! The parser automatically handles it.

### Add Command with Arguments

```javascript
search: {
  description: "Search for something",
  response: (args, input) => {
    const query = args.join(" ");
    return `Searching for: ${query}...`;
  },
}
```

Usage:
```bash
> search hello world
Searching for: hello world...
```

### Custom Response Based on Arguments

```javascript
echo: {
  description: "Echo back input",
  response: (args, input) => {
    return args.length > 0 
      ? args.join(" ") 
      : "Echo needs text!";
  },
}
```

---

## API Reference

### CommandParser Class

```javascript
class CommandParser {
  constructor(commandRegistry)
  parse(input) → parsed object
  execute(parsed) → result object
  getAvailableCommands() → array
  commandExists(name) → boolean
  getCommand(name) → command or null
}
```

### Parsed Command Object

```javascript
{
  valid: boolean,
  command: string,           // Resolved command name
  originalInput: string,     // Original user input
  args: string[],            // Command arguments
  description: string,       // Command description
  metadata: object,          // Command metadata
  error: string,            // Error message if invalid
}
```

### Execution Result Object

```javascript
{
  success: boolean,
  output: string,            // Response text
  type: string,              // response, error, link, download, clear
  animated: boolean,         // Animate response?
  command: string,           // Executed command name
  url: string,              // For link type
  fileUrl: string,          // For download type
  fileName: string,         // Download filename
}
```

---

## Troubleshooting Advanced Features

### Animations Not Playing

- Verify `animated: true` in command metadata
- Check Framer Motion is installed
- Ensure motion components are properly imported

### Aliases Not Working

- Check spelling in `aliases` object
- Verify alias points to valid command name
- Restart dev server after changes

### Download Not Triggering

- Check `fileUrl` is valid path
- Verify file exists at specified path
- Ensure `fileName` has proper extension

### Links Opening in Same Tab

- Check `metadata.type === "link"`
- Verify URL is set in metadata
- Ensure `window.open()` isn't blocked by browser

---

## Performance Tips

1. **Limit History**: Edit `COMMAND_HISTORY_LIMIT` in config
2. **Reduce Animation Speed**: Increase `speed` in TypingEffect
3. **Disable Animations**: Set `animated: false` on commands
4. **Lazy Load**: Only show terminal when needed

---

## Next Steps

1. ✅ Customize commands in `commandRegistry.js`
2. ✅ Update URLs (GitHub, LinkedIn, Resume)
3. ✅ Add custom aliases for your workflow
4. ✅ Tweak animation timings for your brand
5. ✅ Test on mobile and desktop
6. ✅ Deploy and enjoy!

---

## Questions or Issues?

Refer to:
- [README.md](README.md) - Basic documentation
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick lookup
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Setup examples
- Source files - Well-commented code
