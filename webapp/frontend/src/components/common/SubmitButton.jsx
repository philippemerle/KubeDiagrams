import { motion } from 'motion/react';

function SubmitButton({ onClick, className = '', children = 'Submit', disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`bg-[var(--color-accent)] hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default SubmitButton;
