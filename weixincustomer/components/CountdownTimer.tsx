import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTime: Date;
  active?: boolean;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  active = true,
  className = 'flex items-center gap-0.5',
  itemClassName = 'bg-white/20 text-white text-[10px] px-1 rounded-sm',
  separatorClassName = 'text-white text-[10px]',
}) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (!active) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ h: '00', m: '00', s: '00' });
        return;
      }
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, active]);

  return (
    <div className={className}>
      <span className={itemClassName}>{timeLeft.h}</span>
      <span className={separatorClassName}>:</span>
      <span className={itemClassName}>{timeLeft.m}</span>
      <span className={separatorClassName}>:</span>
      <span className={itemClassName}>{timeLeft.s}</span>
    </div>
  );
};

export default CountdownTimer;
