'use client';

interface Step {
  id: number;
  label: string;
  title: string;
  icon: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div
                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all min-w-max ${
                  isActive
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : isCompleted
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-2xl">{step.icon}</div>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                    Step {step.id}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-colors ${
                    isCompleted ? 'bg-purple-200' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
