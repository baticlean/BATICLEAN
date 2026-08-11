import React, { useRef, useState } from 'react';

const SecretAdminTrigger = ({ children, onTrigger }) => {
  const timerRef = useRef(null);
  const clickCountRef = useRef(0);
  const clickResetTimerRef = useRef(null);
  const [isPressing, setIsPressing] = useState(false);

  const handleTouchStart = () => {
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      setIsPressing(false);
      onTrigger();
    }, 3000);
  };

  const handleTouchEnd = () => {
    setIsPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleClick = (e) => {
    clickCountRef.current += 1;
    if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);

    if (clickCountRef.current >= 4) {
      clickCountRef.current = 0;
      onTrigger();
    } else {
      clickResetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

  return (
    <div
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      className={`select-none transition-transform duration-200 ${
        isPressing ? 'scale-95 opacity-80' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default SecretAdminTrigger;
