import React, { useEffect, useRef } from 'react';

/**
 * High-performance Canvas renderer depicting the Muscat MCT-01
 * Containerized Mining Facility with wind turbines, power substation,
 * desert terrain, and atmospheric sky matching the actual facility footage.
 */
export const FacilityCanvasAnimation: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
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
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Sky & Cloud Backdrop (Desert Horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      skyGrad.addColorStop(0, '#1E293B');
      skyGrad.addColorStop(0.5, '#334155');
      skyGrad.addColorStop(1, '#64748B');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.65);

      // Clouds
      ctx.fillStyle = 'rgba(241, 245, 249, 0.12)';
      for (let i = 0; i < 4; i++) {
        const cx = ((time * 8 + i * (w / 3.5)) % (w + 300)) - 150;
        const cy = h * (0.12 + i * 0.08);
        ctx.beginPath();
        ctx.ellipse(cx, cy, 140, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 60, cy - 10, 90, 25, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Far Desert Horizon / Dunes
      const duneGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
      duneGrad.addColorStop(0, '#B45309');
      duneGrad.addColorStop(0.3, '#78350F');
      duneGrad.addColorStop(1, '#1C1917');
      ctx.fillStyle = duneGrad;

      ctx.beginPath();
      ctx.moveTo(0, h * 0.58);
      ctx.bezierCurveTo(w * 0.25, h * 0.54, w * 0.6, h * 0.62, w, h * 0.56);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Gravel Facility Ground Pad
      const groundGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
      groundGrad.addColorStop(0, '#475569');
      groundGrad.addColorStop(0.3, '#334155');
      groundGrad.addColorStop(1, '#0F172A');
      ctx.fillStyle = groundGrad;

      ctx.beginPath();
      ctx.moveTo(0, h * 0.64);
      ctx.lineTo(w, h * 0.64);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // 3. Wind Turbines in the Background
      const turbinePositions = [
        { x: w * 0.12, y: h * 0.58, scale: 0.85, speed: 1.1 },
        { x: w * 0.48, y: h * 0.56, scale: 1.05, speed: 1.0 },
        { x: w * 0.88, y: h * 0.57, scale: 0.92, speed: 0.95 },
      ];

      turbinePositions.forEach((turb, idx) => {
        const { x, y, scale, speed } = turb;
        const towerHeight = 110 * scale;

        // Tower Mast
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.moveTo(x - 3 * scale, y);
        ctx.lineTo(x + 3 * scale, y);
        ctx.lineTo(x + 1.5 * scale, y - towerHeight);
        ctx.lineTo(x - 1.5 * scale, y - towerHeight);
        ctx.closePath();
        ctx.fill();

        // Hub
        const hubY = y - towerHeight;
        ctx.beginPath();
        ctx.arc(x, hubY, 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#CBD5E1';
        ctx.fill();

        // Rotating Blades (3 blades at 120 deg)
        const bladeAngle = (time * speed * 1.5) + idx * 2.1;
        const bladeLength = 65 * scale;

        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 2.5 * scale;
        ctx.lineCap = 'round';

        for (let b = 0; b < 3; b++) {
          const angle = bladeAngle + (b * Math.PI * 2) / 3;
          const tipX = x + Math.cos(angle) * bladeLength;
          const tipY = hubY + Math.sin(angle) * bladeLength;

          ctx.beginPath();
          ctx.moveTo(x, hubY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        }
      });

      // 4. Substation / Transformers on Left
      const subX = w * 0.04;
      const subY = h * 0.65;
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(subX, subY, 70, 45);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(subX, subY, 70, 45);

      // Transformer coils & blinking indicators
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(subX + 10 + c * 20, subY - 14, 12, 14);
        // Green power pulse
        ctx.fillStyle = Math.sin(time * 4 + c) > 0 ? '#10B981' : '#059669';
        ctx.beginPath();
        ctx.arc(subX + 16 + c * 20, subY - 16, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Containerized Modular Mining Pods (Rows like the video footage)
      const rows = 3;
      const podsPerRow = 4;
      const startX = w * 0.22;
      const startY = h * 0.68;

      for (let r = 0; r < rows; r++) {
        for (let p = 0; p < podsPerRow; p++) {
          // Isometric-style perspective projection
          const podX = startX + p * (w * 0.18) + (r * 18);
          const podY = startY + r * 38;
          const podW = 68;
          const podH = 26;

          // Cabin Body (White containerized enclosure)
          ctx.fillStyle = '#F1F5F9';
          ctx.fillRect(podX, podY, podW, podH);
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1;
          ctx.strokeRect(podX, podY, podW, podH);

          // Roof Sunshade / Awnings (Matching drone footage)
          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.moveTo(podX - 4, podY);
          ctx.lineTo(podX + podW + 4, podY);
          ctx.lineTo(podX + podW + 2, podY - 6);
          ctx.lineTo(podX - 2, podY - 6);
          ctx.closePath();
          ctx.fill();

          // Louver Vents / Exhaust Fans
          ctx.fillStyle = '#334155';
          ctx.fillRect(podX + 6, podY + 6, 20, 14);
          ctx.fillRect(podX + 32, podY + 6, 20, 14);

          // Active ASIC Activity Glow (Orange/Green LEDs)
          const ledPulse = Math.sin(time * 3 + p + r) > 0.1;
          ctx.fillStyle = ledPulse ? '#F7931A' : '#10B981';
          ctx.beginPath();
          ctx.arc(podX + podW - 8, podY + 12, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Security Fencing along bottom
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      const fenceY = h * 0.88;
      ctx.beginPath();
      ctx.moveTo(0, fenceY);
      ctx.lineTo(w, fenceY);
      ctx.stroke();

      for (let f = 0; f < w; f += 24) {
        ctx.beginPath();
        ctx.moveTo(f, fenceY - 14);
        ctx.lineTo(f, fenceY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      style={{ opacity }}
    />
  );
};
