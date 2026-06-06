# Developer Terminal Component

A premium interactive developer terminal component for React portfolios with Mac-style UI, glassmorphism design, and smooth animations.

## Features

✨ **Premium Design**
- Mac-style floating window with draggable header
- Dark glassmorphism effect with backdrop blur
- Cyan/purple gradient glow effects
- Responsive design for all screen sizes

🎯 **Terminal Features**
- Command input with history navigation (Arrow Up/Down)
- Animated blinking cursor
- Auto-scroll to latest command
- Command history display with proper formatting
- Error handling for unknown commands

🎨 **Animation & UX**
- Smooth entrance/exit animations (Framer Motion)
- Staggered command history display
- Pulsing welcome message
- Minimize/maximize functionality
- Drag-to-reposition capability

## File Structure

```
Terminal/
├── Terminal.jsx              # Main terminal component
├── TerminalDisplay.jsx       # Command history display
├── TerminalInput.jsx         # Input field with cursor
├── terminalConfig.js         # Commands and responses
└── index.js                  # Exports
```

## Installation

The component requires these dependencies (already in your project):
- `react` >= 18.0
- `framer-motion` >= 12.0
- `lucide-react` >= 0.4
- `tailwindcss` >= 3.0

## Usage

### Basic Implementation

```jsx
import { Terminal } from "@/components/Terminal";

function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  return (
    <div>
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        position={{ x: 40, y: 60 }}
      />
    </div>
  );
}
```

### Props

| Prop       | Type     | Default             | Description                    |
|-----------|----------|---------------------|--------------------------------|
| `isOpen`  | boolean  | `true`              | Control terminal visibility    |
| `onClose` | function | `undefined`         | Callback when close button hit  |
| `position`| object   | `{ x: 40, y: 60 }` | Initial position on screen     |
| `className`| string  | `""`                | Additional CSS classes         |

### Available Commands

| Command  | Description              |
|----------|--------------------------|
| `help`   | Show all available commands |
| `about`  | Information about you    |
| `skills` | Display technical skills |
| `projects` | Show your projects     |
| `contact` | Contact information     |
| `github` | Open GitHub profile      |
| `linkedin` | Open LinkedIn profile   |
| `clear`  | Clear terminal history   |

## Customization

### Modify Commands

Edit `terminalConfig.js`:

```javascript
export const TERMINAL_COMMANDS = {
  mycommand: {
    description: "My custom command",
    response: `
      Custom response text here
    `,
  },
  // ... more commands
};
```

### Customize Welcome Message

```javascript
export const WELCOME_MESSAGE = `
  Your custom welcome message here
`;
```

### Update External Links

In `Terminal.jsx`, find the github/linkedin handlers and update URLs:

```javascript
if (trimmedCommand === "github") {
  const url = "https://github.com/YOUR_USERNAME";
  window.open(url, "_blank");
}
```

### Styling

The component uses Tailwind CSS classes. Key colors:
- Primary: `cyan-400` / `cyan-500`
- Secondary: `purple-500`
- Success: `green-500`
- Error: `red-400`
- Background: `gray-900` / `gray-800`

Modify color scheme in:
- `Terminal.jsx` - Main container and header
- `TerminalDisplay.jsx` - Text colors by type
- `TerminalInput.jsx` - Input styling

### Animation Tweaks

Adjust animation timing in:

**Entrance Animation:**
```javascript
// Terminal.jsx, line ~43
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: "spring", stiffness: 300, damping: 30 }}
```

**History Display Stagger:**
```javascript
// TerminalDisplay.jsx, line ~32
transition: {
  staggerChildren: 0.05,  // Adjust timing between items
  delayChildren: 0.1,
}
```

**Cursor Blink Speed:**
```javascript
// TerminalInput.jsx, line ~87
duration: 0.8,  // Adjust blink speed
```

## Advanced Features

### Command History Navigation

Users can navigate command history:
- **Arrow Up**: Previous command
- **Arrow Down**: Next command
- **Enter**: Execute command
- **Clear**: Type "clear" to clear history

### Drag-to-Move

Click and drag the terminal header to reposition. The terminal maintains its position across renders.

### Minimize/Maximize

Click the yellow button in the header to minimize/maximize the terminal window.

### Responsive Design

The terminal adjusts size based on screen:
- Mobile: Full width minus padding
- Tablet: 800px width
- Desktop: 900px width

## Performance Considerations

1. **History Limit**: Set in `terminalConfig.js` (default 50 commands)
2. **Lazy Animations**: Only animate when terminal is open
3. **Optimized Scrolling**: Auto-scroll only triggers when needed
4. **Memoization**: Components are optimized for re-renders

## Accessibility

- ✅ Keyboard navigation (Arrow keys, Enter)
- ✅ Proper focus management
- ✅ Color-contrast compliant
- ✅ Semantic HTML with proper roles

## Browser Support

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Integration Tips

### 1. Add to Home Page

```jsx
import { Terminal } from "@/components/Terminal";

export function Home() {
  return (
    <>
      <HeroSection />
      <Terminal isOpen={true} />
    </>
  );
}
```

### 2. Add Toggle Button

```jsx
<button
  onClick={() => setTerminalOpen(!terminalOpen)}
  className="fixed bottom-4 right-4 bg-cyan-500 p-3 rounded-full"
>
  Terminal
</button>
```

### 3. Hide on Mobile

```jsx
<Terminal
  isOpen={isTerminalOpen && !isMobile}
  // ... other props
/>
```

## Troubleshooting

**Terminal not dragging properly:**
- Ensure `dragRef` is attached to the motion.div container
- Check for pointer-events blocking

**Commands not executing:**
- Verify command name matches `terminalConfig.js` exactly (case-insensitive)
- Check for typos in command string

**Animations stuttering:**
- Reduce `staggerChildren` delay
- Disable animations on low-end devices

**Scroll not auto-updating:**
- Check that `TerminalDisplay.jsx` ref is properly forwarded
- Ensure `displayRef.current` exists before scrolling

## Future Enhancements

Ideas for extending the component:
- Command aliases (e.g., "cls" for "clear")
- Command autocomplete with suggestions
- File system simulation
- Terminal themes (light, dark, custom)
- Command output with syntax highlighting
- Persistent history (localStorage)
- Multi-tab support
- AI/Chatbot integration

## License

Feel free to use and modify this component in your projects.

## Support

For issues or questions, refer to the main documentation or customize as needed for your use case.
