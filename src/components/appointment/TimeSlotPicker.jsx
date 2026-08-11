import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const timeSlots = [
  '08:30 - 10:00',
  '10:00 - 11:30',
  '11:30 - 13:00',
  '14:00 - 15:30',
  '15:30 - 17:00',
  '17:00 - 18:30',
];

const TimeSlotPicker = ({ selectedSlot, onSelectSlot }) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Créneaux Horaires Disponibles *
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-[#195D9B] bg-[#EBF4FC] text-[#195D9B] ring-2 ring-[#195D9B]/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#195D9B]' : 'text-slate-400'}`} />
                <span>{slot}</span>
              </div>
              {isSelected && <CheckCircle className="w-4 h-4 text-[#195D9B]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
