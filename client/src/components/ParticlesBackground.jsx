import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useTheme } from "../context/ThemeContext";

export const ParticlesBackground = () => {
  const { isDarkMode } = useTheme();

  // Engine initialization loads the slim bundle which is highly optimized
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-0 pointer-events-auto"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4, // Amount of particles dropped per click
            },
            repulse: {
              distance: 120, // Hover radius
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            // White for dark mode, subtle slate gray for light mode
            value: isDarkMode ? "#ffffff" : "#475569",
          },
          links: {
            color: isDarkMode ? "#cbd5e1" : "#94a3b8", // Slate-300 / Slate-400
            distance: 150,
            enable: true,
            opacity: isDarkMode ? 0.2 : 0.4,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce", // Bounces within the container
            },
            random: false,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 200, // Base number of particles, will be adjusted by density
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: ["circle", "triangle", "polygon"], // Simple circles for a clean, modern look. Could be extended to polygons or custom shapes if desired. such as triangles or hexagons for more visual interest.
            //  to add the syntax type: ["circle", "triangle", "polygon"] and specify the polygon sides with options.particles.shape.polygon.nb_sides = 5 for pentagons, for example.   
          },
          size: {
            value: { min: 2, max: 3 }, //size means the size of the particles
          },
        },
        detectRetina: true,
        fullScreen: {
          enable: false // Disables sticking to viewport window so it acts like absolute wrapper for the section
        }
      }}
    />
  );
};
