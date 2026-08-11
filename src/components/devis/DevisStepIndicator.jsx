import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { num: 1, title: 'Demandeur' },
  { num: 2, title: 'Localisation' },
  { num: 3, title: 'Bâtiment' },
  { num: 4, title: 'Besoins' },
  { num: 5, title: 'Médias & Fichiers' },
  { num: 6, title: 'Planification' },
  { num: 7, title: 'Confirmation' },
];

const DevisStepIndicator = ({ currentStep }) => {
  return (
    <div className="w-full py-4 mb-8">
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 -z-10" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-[#195D9B] -translate-y-1/2 -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="flex flex-col items-center gap-2 bg-[#FEFEFE] px-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#195D9B] text-white shadow-md'
                    : isCurrent
                    ? 'bg-[#EF9437] text-white ring-4 ring-[#EF9437]/20 shadow-lg scale-110'
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.num}
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight ${
                  isCurrent ? 'text-[#195D9B]' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EF9437] text-white font-bold text-sm flex items-center justify-center">
            {currentStep}
          </div>
          <div>
            <p className="text-xs font-bold text-[#195D9B] uppercase tracking-wider">
              Étape {currentStep} sur 7
            </p>
            <p className="text-sm font-extrabold text-slate-900">{steps[currentStep - 1]?.title}</p>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {Math.round((currentStep / 7) * 100)}%
        </div>
      </div>
    </div>
  );
};

export default DevisStepIndicator;
