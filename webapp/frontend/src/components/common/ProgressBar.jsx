import { motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Progress bar component showing the steps of diagram generation
 */
const ProgressBar = ({ currentStep = 'idle', isVisible = false }) => {
  const steps = [
    { id: 'parsing', label: 'Parsing' },
    { id: 'validation', label: 'Validation' },
    { id: 'generation', label: 'Génération' },
    { id: 'rendering', label: 'Rendu' },
  ];

  const getStepStatus = (stepId) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    if (currentStep === 'completed') return 'completed';
    if (currentStep === 'error') return 'error';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepCircleClass = (status) => {
    if (status === 'completed') {
      return 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/50';
    }
    if (status === 'active') {
      return 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/50';
    }
    if (status === 'error') {
      return 'bg-gradient-to-br from-red-500 to-rose-600 border-red-400';
    }
    return 'bg-slate-800 border-slate-600';
  };

  const getStepLabelClass = (status) => {
    if (status === 'completed') return 'text-green-400';
    if (status === 'active') return 'text-blue-400';
    return 'text-slate-500';
  };

  const renderStepIcon = (status, index) => {
    if (status === 'completed') {
      return <Check className="w-5 h-5 text-white" />;
    }
    if (status === 'active') {
      return <Loader2 className="w-5 h-5 animate-spin text-white" />;
    }
    return <span className="text-sm font-semibold text-slate-400">{index + 1}</span>;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-slate-700/50 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300">
          {currentStep === 'completed' ? '✓ Génération terminée' : 'Génération en cours...'}
        </h3>
        {currentStep !== 'completed' && currentStep !== 'error' && (
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        )}
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-700" />

        {/* Active progress line */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: '0%' }}
          animate={{
            width:
              currentStep === 'completed'
                ? '100%'
                : `${(steps.findIndex((s) => s.id === currentStep) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Circle indicator */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: status === 'active' ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${getStepCircleClass(status)}`}
                >
                  {renderStepIcon(status, index)}
                </motion.div>

                {/* Step label */}
                <motion.span
                  initial={{ opacity: 0.5 }}
                  animate={{
                    opacity: status === 'active' || status === 'completed' ? 1 : 0.5,
                  }}
                  className={`mt-2 text-xs font-medium ${getStepLabelClass(status)}`}
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

ProgressBar.propTypes = {
  currentStep: PropTypes.oneOf([
    'idle',
    'parsing',
    'validation',
    'generation',
    'rendering',
    'completed',
    'error',
  ]),
  isVisible: PropTypes.bool,
};

export default ProgressBar;
