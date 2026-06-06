/**
 * Terminal Component Integration Guide
 * 
 * Quick implementation examples for your portfolio
 */

// ============================================
// OPTION 1: Add to Home Page
// ============================================

import { Terminal } from "@/components/Terminal";

export function HomeWithTerminal() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  return (
    <div>
      {/* Your existing home content */}
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />

      {/* Terminal Component */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        position={{ x: 40, y: 60 }}
      />
    </div>
  );
}

// ============================================
// OPTION 2: Add Terminal Toggle Button
// ============================================

import { Terminal } from "@/components/Terminal";
import { Code2 } from "lucide-react";

export function PortfolioWithTerminalButton() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <div>
      {/* Content */}
      <MainLayout>
        <HomePage />
      </MainLayout>

      {/* Terminal Toggle Button */}
      <button
        onClick={() => setIsTerminalOpen(!isTerminalOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Toggle Terminal"
      >
        <Code2 size={24} className="text-white" />
      </button>

      {/* Terminal Component */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        position={{ x: 50, y: 100 }}
      />
    </div>
  );
}

// ============================================
// OPTION 3: Terminal Triggered by Hot Key
// ============================================

import { useEffect, useState } from "react";
import { Terminal } from "@/components/Terminal";

export function PortfolioWithHotkey() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open terminal with Ctrl+Shift+T (or Cmd+Shift+T on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyT") {
        e.preventDefault();
        setIsTerminalOpen(!isTerminalOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalOpen]);

  return (
    <div>
      <MainLayout>
        <HomePage />
      </MainLayout>

      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      <HotkeyHint open={isTerminalOpen} />
    </div>
  );
}

// ============================================
// OPTION 4: Multiple Terminal Instances
// ============================================

export function PortfolioWithMultipleTerminals() {
  const [terminals, setTerminals] = useState([
    { id: 1, isOpen: true, position: { x: 40, y: 60 } },
  ]);

  const addTerminal = () => {
    const newId = Math.max(...terminals.map((t) => t.id)) + 1;
    setTerminals([
      ...terminals,
      {
        id: newId,
        isOpen: true,
        position: {
          x: 40 + newId * 30,
          y: 60 + newId * 30,
        },
      },
    ]);
  };

  const removeTerminal = (id) => {
    setTerminals(terminals.filter((t) => t.id !== id));
  };

  return (
    <div>
      <MainLayout>
        <HomePage />
        <button onClick={addTerminal} className="btn">
          Open New Terminal
        </button>
      </MainLayout>

      {terminals.map((terminal) => (
        <Terminal
          key={terminal.id}
          isOpen={terminal.isOpen}
          onClose={() => removeTerminal(terminal.id)}
          position={terminal.position}
        />
      ))}
    </div>
  );
}

// ============================================
// OPTION 5: Responsive Terminal (Hide on Mobile)
// ============================================

import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ResponsivePortfolioWithTerminal() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div>
      <MainLayout>
        <HomePage />
      </MainLayout>

      {/* Only show terminal on desktop */}
      {isDesktop && (
        <Terminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          position={{ x: 40, y: 60 }}
        />
      )}

      {/* Show mobile-friendly toggle for smaller screens */}
      {!isDesktop && (
        <button
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className="fixed bottom-4 right-4 bg-cyan-500 p-3 rounded-full"
        >
          <Code2 size={20} />
        </button>
      )}
    </div>
  );
}

// ============================================
// OPTION 6: Terminal with Context (Global State)
// ============================================

import { createContext, useContext, useState } from "react";

const TerminalContext = createContext();

export function TerminalProvider({ children }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <TerminalContext.Provider value={{ isTerminalOpen, setIsTerminalOpen }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  return useContext(TerminalContext);
}

// Usage:
export function AppWithTerminalProvider() {
  return (
    <TerminalProvider>
      <MainApp />
    </TerminalProvider>
  );
}

export function MainApp() {
  const { isTerminalOpen, setIsTerminalOpen } = useTerminal();

  return (
    <>
      <MainLayout>
        <HomePage />
      </MainLayout>
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  );
}

// ============================================
// SETUP IN YOUR ROUTES
// ============================================

/*
In your router configuration (e.g., App.jsx or router.jsx):

import { Terminal } from "@/components/Terminal";
import { useState } from "react";

function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* Terminal available on all routes */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </Router>
  );
}

export default App;
*/

// ============================================
// CUSTOMIZATION CHECKLIST
// ============================================

/*
After integration, customize these items:

1. Command Responses
   - Edit terminalConfig.js with your actual info
   - Update about, skills, projects, contact content
   - Add your GitHub URL
   - Add your LinkedIn URL

2. Colors
   - Adjust cyan/purple theme to match your brand
   - Modify in Terminal.jsx and TerminalDisplay.jsx

3. Position
   - Set default position via position prop
   - Or leave it draggable and users can position it

4. Initial State
   - Set isOpen={true} to show by default
   - Set isOpen={false} to hide and show toggle button

5. Commands
   - Add new commands in terminalConfig.js
   - Add command handlers in Terminal.jsx executeCommand()

6. Animations
   - Adjust timing in Framer Motion variants
   - Enable/disable specific animations as needed
*/
