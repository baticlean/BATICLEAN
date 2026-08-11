import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImage, afterImage, title }) => {
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPos(e.target.value);
  };

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg select-none border border-slate-200">
      <img
        src={afterImage || '/logo.png'}
        alt={`${title} Après`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImage || '/logo.png'}
          alt={`${title} Avant`}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: '100%' }}
        />
        <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Pendant le Chantier (Avant)
        </span>
      </div>

      <span className="absolute top-4 right-4 bg-[#195D9B]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        Livré par Baticlean (Après)
      </span>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-white text-[#195D9B] shadow-xl border border-slate-200 flex items-center justify-center -ml-3.5">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={handleSliderChange}
        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
      />
    </div>
  );
};

export default BeforeAfterSlider;
