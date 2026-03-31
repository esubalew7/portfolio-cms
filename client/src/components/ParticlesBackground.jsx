import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "../context/ThemeContext";

export const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Soft dynamic colors matching the overall theme palette
  const particlesColor = isDarkMode ? "#60a5fa" : "#3b82f6"; // Tailwind blue-400 / blue-500
  const linksColor = isDarkMode ? "#1e293b" : "#e2e8f0";     // Tailwind slate-800 / slate-200

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 -z-10" // Stays perfectly behind foreground elements
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120, // High performance animation
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 120,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: particlesColor,
          },
          links: {
            color: linksColor,
            distance: 150,
            enable: true,
            opacity: 0.6,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1, // Slow moving, non-distracting
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 45, // Keep count fairly sparse
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },
        detectRetina: true, // Hi-DPI screen clarity
      }}
    />
  );
};
