import React, { useEffect, useRef } from 'react';

/**
 * 60fps Vertical (9:16) Canvas Animation of an ASIC Bitcoin Mining Data Center Pod
 * Displays high-density racks, spinning dual-intake cooling fans, glowing green/orange
 * hashboard LEDs, airflow particles, and digital hash computation waves.
 */
export const MiningPodReelCanvas: React.FC<{ activeMode?: number }> = ({ activeMode = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 340;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle airflow stream
    const particles: { x: number; y: number; speed: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 340),
        y: Math.random() * (canvas.height || 600),
        speed: 1.5 + Math.random() * 2.5,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.5,
      });
    }

    const render = () => {
      time += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Data Center Dark Backdrop & Isometric Depth
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#090D16');
      bgGrad.addColorStop(0.5, '#0B1120');
      bgGrad.addColorStop(1, '#05070D');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Floor grid perspective
      ctx.strokeStyle = 'rgba(247, 147, 26, 0.08)';
      ctx.lineWidth = 1;
      const horizonY = h * 0.4;
      for (let x = -w; x < w * 2; x += 35) {
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = horizonY; y < h; y += (y - horizonY) * 0.25 + 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. High-Density ASIC Server Racks (Dual Racks in Center)
      const rackWidth = w * 0.72;
      const rackLeft = (w - rackWidth) / 2;
      const rackTop = h * 0.16;
      const rackHeight = h * 0.70;

      // Outer Rack Steel Cabinet
      ctx.fillStyle = '#111827';
      ctx.fillRect(rackLeft, rackTop, rackWidth, rackHeight);
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.strokeRect(rackLeft, rackTop, rackWidth, rackHeight);

      // Vertical Cable Trays / Orange Busbars
      ctx.fillStyle = 'rgba(247, 147, 26, 0.25)';
      ctx.fillRect(rackLeft - 6, rackTop, 4, rackHeight);
      ctx.fillRect(rackLeft + rackWidth + 2, rackTop, 4, rackHeight);

      // ASIC Miner Chassis Units (Stacked Slots)
      const minerCount = 7;
      const minerHeight = (rackHeight - 30) / minerCount;

      for (let i = 0; i < minerCount; i++) {
        const my = rackTop + 15 + i * minerHeight;
        const mw = rackWidth - 20;
        const mx = rackLeft + 10;

        // Miner Metal Casing
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(mx, my, mw, minerHeight - 6);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(mx, my, mw, minerHeight - 6);

        // Dual High-RPM Cooling Fans
        const fanRadius = (minerHeight - 16) / 2;
        const fan1X = mx + 25;
        const fan2X = mx + 60;
        const fanY = my + (minerHeight - 6) / 2;

        [fan1X, fan2X].forEach((fx, fIdx) => {
          // Fan Bezel Housing
          ctx.beginPath();
          ctx.arc(fx, fanY, fanRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#0F172A';
          ctx.fill();
          ctx.strokeStyle = '#475569';
          ctx.stroke();

          // Rotating Fan Blades (High-Speed Blur Effect)
          const angle = time * (8 + (i % 3) * 2) + fIdx * Math.PI;
          ctx.strokeStyle = 'rgba(247, 147, 26, 0.4)';
          ctx.lineWidth = 2;
          for (let b = 0; b < 4; b++) {
            const bAngle = angle + (b * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(fx, fanY);
            ctx.lineTo(fx + Math.cos(bAngle) * (fanRadius - 2), fanY + Math.sin(bAngle) * (fanRadius - 2));
            ctx.stroke();
          }

          // Fan Hub
          ctx.beginPath();
          ctx.arc(fx, fanY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#CBD5E1';
          ctx.fill();
        });

        // ASIC Hashing Control Board & Status LEDs
        const cbX = mx + 88;
        const cbW = mw - 96;
        ctx.fillStyle = '#0B1120';
        ctx.fillRect(cbX, my + 6, cbW, minerHeight - 18);

        // Blinking Green & Orange Hashing Activity Lights
        for (let led = 0; led < 5; led++) {
          const ledX = cbX + 8 + led * 14;
          const ledY = my + (minerHeight - 6) / 2;
          const isBlinking = Math.sin(time * 6 + i * 2 + led) > -0.2;

          ctx.beginPath();
          ctx.arc(ledX, ledY, 2.2, 0, Math.PI * 2);
          if (led === 0) {
            ctx.fillStyle = isBlinking ? '#10B981' : '#047857'; // Normal Run (Green)
          } else if (led === 1) {
            ctx.fillStyle = isBlinking ? '#F7931A' : '#7C2D12'; // Hash Activity (Orange)
          } else {
            ctx.fillStyle = isBlinking ? '#38BDF8' : '#0369A1'; // Network Stratum (Cyan)
          }
          ctx.fill();
        }

        // Ethernet Port Clip Indicator
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(cbX + cbW - 14, my + (minerHeight - 6) / 2 - 4, 8, 8);
      }

      // 3. Airflow & Thermal Exhaust Particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = h;
          p.x = rackLeft + Math.random() * rackWidth;
        }

        ctx.fillStyle = `rgba(247, 147, 26, ${p.opacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. SHA-256 Hashing Waves / Hex Stream overlay on sides
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(247, 147, 26, 0.18)';
      const hexChars = '0123456789ABCDEF';
      for (let row = 0; row < 12; row++) {
        let hex = '';
        for (let col = 0; col < 6; col++) {
          hex += hexChars[Math.floor(Math.abs(Math.sin(time + row + col) * 16)) % 16];
        }
        ctx.fillText(hex, 8, rackTop + 30 + row * 24);
        ctx.fillText(hex, w - 48, rackTop + 30 + row * 24);
      }

      // 5. Thermal Heat Shield Vignette
      const glowGrad = ctx.createRadialGradient(w / 2, h * 0.5, 40, w / 2, h * 0.5, w * 0.8);
      glowGrad.addColorStop(0, 'rgba(247, 147, 26, 0.06)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    />
  );
};
