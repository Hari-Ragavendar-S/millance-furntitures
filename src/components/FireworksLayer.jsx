import { useEffect, useState } from 'react';

const FireworksLayer = ({ isActive = true }) => {
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setFireworks([]);
      return;
    }

    const colors = ['gold', 'pink', 'purple', 'blue', 'cyan'];
    const positions = [
      { top: '15%', left: '10%' },
      { top: '20%', right: '12%' },
      { top: '40%', left: '8%' },
      { top: '45%', right: '10%' },
      { top: '65%', left: '15%' },
      { top: '70%', right: '15%' },
    ];

    let fireworkId = 0;

    const createFirework = () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      const newFirework = {
        id: fireworkId++,
        color,
        ...position,
        particles: generateParticles()
      };

      setFireworks(prev => [...prev, newFirework]);

      // Remove after animation
      setTimeout(() => {
        setFireworks(prev => prev.filter(f => f.id !== newFirework.id));
      }, 1500);
    };

    const generateParticles = () => {
      const particles = [];
      const particleCount = 12;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (360 / particleCount) * i;
        const distance = 60 + Math.random() * 40;
        const tx = Math.cos((angle * Math.PI) / 180) * distance;
        const ty = Math.sin((angle * Math.PI) / 180) * distance;
        
        particles.push({ tx, ty });
      }
      
      return particles;
    };

    // Create first burst immediately
    createFirework();

    // Continue creating fireworks
    const interval = setInterval(() => {
      createFirework();
    }, 600);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fireworks-layer">
      {fireworks.map((firework) => (
        <div
          key={`firework-${firework.id}`}
          className={`firework-burst firework-${firework.color}`}
          style={{
            top: firework.top,
            left: firework.left,
            right: firework.right,
          }}
        >
          {firework.particles.map((particle, idx) => (
            <div
              key={`particle-${firework.id}-${idx}`}
              className="firework-particle"
              style={{
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`,
                animationDelay: `${idx * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default FireworksLayer;
