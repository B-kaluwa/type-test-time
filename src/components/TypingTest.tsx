import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. It is commonly used for typing practice because it includes a variety of common letter combinations and word patterns. Many typing tests use this sentence or similar ones to help people improve their typing speed and accuracy. Regular practice with diverse texts can significantly enhance your typing skills.";

const WORDS = SAMPLE_TEXT.split(' ');
const TEST_DURATION = 60; // seconds

interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

interface TypingTestProps {
  onComplete?: (stats: TypingStats) => void;
}

export const TypingTest = ({ onComplete }: TypingTestProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const calculateStats = useCallback((correct: number, incorrect: number, total: number, timeElapsed: number): TypingStats => {
    const minutes = Math.max(timeElapsed / 60, 1/60); // Minimum 1 second
    const wpm = Math.round((total / 5) / minutes); // Standard WPM calculation
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
    
    return {
      wpm,
      accuracy,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: total,
    };
  }, []);

  const startTest = useCallback(() => {
    setIsActive(true);
    setTimeLeft(TEST_DURATION);
    setCompleted(false);
    inputRef.current?.focus();
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetTest = useCallback(() => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setUserInput('');
    setIsActive(false);
    setTimeLeft(TEST_DURATION);
    setStats({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    });
    setErrors(new Set());
    setCompleted(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    inputRef.current?.focus();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive || completed) return;
    
    const value = e.target.value;
    setUserInput(value);
    
    const currentWord = WORDS[currentWordIndex];
    const expectedText = WORDS.slice(0, currentWordIndex).join(' ') + (currentWordIndex > 0 ? ' ' : '') + currentWord.slice(0, value.length);
    const actualText = WORDS.slice(0, currentWordIndex).join(' ') + (currentWordIndex > 0 ? ' ' : '') + value;
    
    let correct = 0;
    let incorrect = 0;
    const newErrors = new Set<number>();
    
    for (let i = 0; i < Math.max(expectedText.length, actualText.length); i++) {
      if (i < actualText.length) {
        if (actualText[i] === expectedText[i]) {
          correct++;
        } else {
          incorrect++;
          newErrors.add(i);
        }
      }
    }
    
    setErrors(newErrors);
    const timeElapsed = TEST_DURATION - timeLeft;
    const newStats = calculateStats(correct, incorrect, actualText.length, timeElapsed);
    setStats(newStats);
    
    // Handle word completion
    if (value.endsWith(' ') && value.trim() === currentWord) {
      setCurrentWordIndex(prev => prev + 1);
      setCurrentCharIndex(0);
      setUserInput('');
      
      // Check if test is complete
      if (currentWordIndex >= WORDS.length - 1) {
        setIsActive(false);
        setCompleted(true);
      }
    } else {
      setCurrentCharIndex(value.length);
    }
  }, [isActive, completed, currentWordIndex, timeLeft, calculateStats]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive && e.key === 'Enter') {
      e.preventDefault();
      startTest();
      return;
    }
    
    if (!isActive) return;
    
    // Prevent certain keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  }, [isActive, startTest]);

  useEffect(() => {
    if (completed && onComplete) {
      onComplete(stats);
    }
  }, [completed, stats, onComplete]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const renderText = () => {
    return WORDS.map((word, wordIndex) => {
      const isCurrentWord = wordIndex === currentWordIndex;
      const isPastWord = wordIndex < currentWordIndex;
      const isFutureWord = wordIndex > currentWordIndex;
      
      return (
        <span key={wordIndex} className="mr-1">
          {word.split('').map((char, charIndex) => {
            const globalCharIndex = WORDS.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0) + charIndex;
            const isCurrentChar = isCurrentWord && charIndex === currentCharIndex;
            const isTyped = isPastWord || (isCurrentWord && charIndex < userInput.length);
            const isError = errors.has(globalCharIndex);
            
            return (
              <span
                key={charIndex}
                className={cn(
                  'relative transition-colors duration-150',
                  isCurrentChar && 'bg-current text-white animate-pulse',
                  isTyped && !isError && 'text-correct',
                  isTyped && isError && 'text-incorrect bg-incorrect/20',
                  !isTyped && !isCurrentChar && 'text-pending'
                )}
              >
                {char}
              </span>
            );
          })}
          {isCurrentWord && currentCharIndex === word.length && (
            <span className="bg-current text-white animate-pulse"> </span>
          )}
        </span>
      );
    });
  };

  const progressPercent = ((TEST_DURATION - timeLeft) / TEST_DURATION) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">WPM</span>
          </div>
          <div className="text-2xl font-bold text-primary">{stats.wpm}</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-accent">{stats.accuracy}%</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Time</span>
          </div>
          <div className="text-2xl font-bold text-warning">{timeLeft}s</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
          </div>
          <div className="text-2xl font-bold">{Math.round(progressPercent)}%</div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="h-2" />

      {/* Text Display */}
      <Card className="p-8">
        <div className="text-lg leading-relaxed font-mono select-none">
          {renderText()}
        </div>
      </Card>

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={!isActive ? "Press Enter to start or click Start Test..." : "Type the text above..."}
          disabled={completed}
          className="w-full p-4 text-lg font-mono border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-card-foreground disabled:opacity-50"
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isActive && !completed && (
          <Button onClick={startTest} size="lg" className="px-8">
            Start Test
          </Button>
        )}
        
        <Button 
          onClick={resetTest} 
          variant="outline" 
          size="lg"
          className="px-8"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Completion Message */}
      {completed && (
        <Card className="p-6 text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h3 className="text-xl font-bold mb-2">Test Complete! 🎉</h3>
          <p className="text-muted-foreground">
            You typed at <span className="font-bold text-primary">{stats.wpm} WPM</span> with{' '}
            <span className="font-bold text-accent">{stats.accuracy}% accuracy</span>
          </p>
        </Card>
      )}
    </div>
  );
};