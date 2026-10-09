import { motion, AnimatePresence } from 'framer-motion';
import './DigitalNumberDisplay.css';

const DigitalNumberDisplay = ({ number, isAnimating = false }) => {
  // Pad number to 4 digits
  const displayNumber = String(number).padStart(4, '0');
  const digits = displayNumber.split('');

  return (
    <div className="digital-number-display">
      <div className="digit-slots-container">
        {digits.map((digit, index) => (
          <div key={index} className="digit-slot">
            <div className="digit-slot-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${digit}-${index}-${isAnimating}`}
                  className="digit-value"
                  initial={{ y: isAnimating ? -100 : 0, opacity: isAnimating ? 0 : 1, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: 100, opacity: 0, filter: 'blur(4px)' }}
                  transition={{
                    duration: isAnimating ? 0.1 : 0.3,
                    ease: isAnimating ? 'linear' : 'easeOut'
                  }}
                >
                  {digit}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Glow effect */}
            <div className="digit-glow"></div>
          </div>
        ))}
      </div>
      
      {/* Bottom label */}
      <div className="display-label">PARTICIPANT NUMBER</div>
    </div>
  );
};

export default DigitalNumberDisplay;
