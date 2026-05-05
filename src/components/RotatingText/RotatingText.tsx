import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './RotatingText.css';

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  staggerDuration?: number;
  className?: string;
  splitBy?: string;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  rotationInterval = 2000,
  staggerDuration = 0.025,
  className = '',
  splitBy = 'characters'
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: Array.from(word),
        needsSpace: i !== words.length - 1
      }));
    }
    return currentText.split(' ').map((word, i, arr) => ({
      characters: [word],
      needsSpace: i !== arr.length - 1
    }));
  }, [texts, currentTextIndex, splitBy]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex(prev => (prev === texts.length - 1 ? 0 : prev + 1));
    }, rotationInterval);
    return () => clearInterval(intervalId);
  }, [texts.length, rotationInterval]);

  return (
    <span className={`text-rotate ${className}`}>
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={currentTextIndex} className="text-rotate" aria-hidden="true">
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
            return (
              <span key={wordIndex} className="text-rotate-word">
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-120%', opacity: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 25,
                      stiffness: 300,
                      delay: (previousCharsCount + charIndex) * staggerDuration
                    }}
                    className="text-rotate-element"
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span>&nbsp;</span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
