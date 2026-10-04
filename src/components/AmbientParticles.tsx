import React, { useMemo } from 'react';

interface AmbientParticlesProps {
  enabled: boolean;
  accentColor: string;
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ enabled, accentColor }) => {
  if (!enabled) return null;

  // Reduced, highly efficient particle set with zero box-shadow filter passes
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: (i * 19 + 7) % 94 + 3,
      y: (i * 29 + 11) % 92 + 4,
      size: 2 + (i % 3) * 1.5,
      duration: 22 + (i % 6) * 3,
      delay: (i % 5) * 1.5,
      opacity: 0.2 + (i % 3) * 0.15,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      aria-hidden="true"
      style={{
        contain: 'strict',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: accentColor || '#f59e0b',
            opacity: p.opacity,
            willChange: 'transform, opacity',
            animation: `ambient-drift ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes ambient-drift {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.15;
          }
          50% {
            transform: translate3d(12px, -18px, 0);
            opacity: 0.35;
          }
          100% {
            transform: translate3d(-12px, -36px, 0);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
};
