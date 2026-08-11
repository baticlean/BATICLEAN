import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, duration = 1500, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let numericTarget = 0;
    if (typeof value === 'number') {
      numericTarget = value;
    } else if (typeof value === 'string') {
      const parsed = parseInt(value.replace(/\D/g, ''), 10);
      numericTarget = isNaN(parsed) ? 0 : parsed;
    }

    if (numericTarget === 0) {
      setCount(0);
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericTarget));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  // Handle display formatted suffix if value is non-numeric string like "100%" or "24h"
  if (typeof value === 'string' && isNaN(parseInt(value, 10))) {
    return <span>{value}</span>;
  }

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
