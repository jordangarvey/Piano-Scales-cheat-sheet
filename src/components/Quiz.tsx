import React, { useState, useEffect } from 'react';
import { SCALES, CHROMATIC_NOTES, generateScale } from '../utils/musicTheory';
import './Quiz.css';

interface Question {
  id: string;
  type: 'scale-identification' | 'interval-identification' | 'note-identification';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizProps {
  onScaleHighlight?: (notes: string[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ onScaleHighlight }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const generateQuestions = (): Question[] => {
    const questionPool: Question[] = [];

    // Scale identification questions
    const scaleTypes = Object.keys(SCALES);
    for (let i = 0; i < 5; i++) {
      const rootNote = CHROMATIC_NOTES[Math.floor(Math.random() * CHROMATIC_NOTES.length)];
      const scaleType = scaleTypes[Math.floor(Math.random() * scaleTypes.length)];
      const scale = generateScale(rootNote, SCALES[scaleType]);
      
      const wrongOptions = scaleTypes.filter(s => s !== scaleType);
      const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
      const allOptions = [SCALES[scaleType].name, ...shuffledWrong.map(s => SCALES[s].name)];
      
      questionPool.push({
        id: `scale-${i}`,
        type: 'scale-identification',
        question: `What type of scale is this?\nNotes: ${scale.notes.join(' - ')}`,
        options: allOptions.sort(() => Math.random() - 0.5),
        correctAnswer: SCALES[scaleType].name,
        explanation: `This is a ${rootNote} ${SCALES[scaleType].name} scale. ${SCALES[scaleType].description}`
      });
    }

    // Interval identification questions
    const intervals = [
      { semitones: 1, name: 'Minor 2nd' },
      { semitones: 2, name: 'Major 2nd' },
      { semitones: 3, name: 'Minor 3rd' },
      { semitones: 4, name: 'Major 3rd' },
      { semitones: 5, name: 'Perfect 4th' },
      { semitones: 7, name: 'Perfect 5th' },
      { semitones: 12, name: 'Octave' }
    ];

    for (let i = 0; i < 3; i++) {
      const rootNote = CHROMATIC_NOTES[Math.floor(Math.random() * CHROMATIC_NOTES.length)];
      const interval = intervals[Math.floor(Math.random() * intervals.length)];
      const targetNoteIndex = (CHROMATIC_NOTES.indexOf(rootNote) + interval.semitones) % 12;
      const targetNote = CHROMATIC_NOTES[targetNoteIndex];
      
      const wrongIntervals = intervals.filter(int => int.name !== interval.name);
      const wrongOptions = wrongIntervals.sort(() => Math.random() - 0.5).slice(0, 3);
      const allOptions = [interval.name, ...wrongOptions.map(int => int.name)];
      
      questionPool.push({
        id: `interval-${i}`,
        type: 'interval-identification',
        question: `What interval is between ${rootNote} and ${targetNote}?`,
        options: allOptions.sort(() => Math.random() - 0.5),
        correctAnswer: interval.name,
        explanation: `From ${rootNote} to ${targetNote} is ${interval.semitones} semitones, which makes it a ${interval.name}.`
      });
    }

    // Note identification questions
    for (let i = 0; i < 2; i++) {
      const targetNote = CHROMATIC_NOTES[Math.floor(Math.random() * CHROMATIC_NOTES.length)];
      const wrongNotes = CHROMATIC_NOTES.filter(note => note !== targetNote);
      const wrongOptions = wrongNotes.sort(() => Math.random() - 0.5).slice(0, 3);
      const allOptions = [targetNote, ...wrongOptions];
      
      questionPool.push({
        id: `note-${i}`,
        type: 'note-identification',
        question: `In the key of C major, which note is the ${getScaleDegreePosition(targetNote)} degree?`,
        options: allOptions.sort(() => Math.random() - 0.5),
        correctAnswer: targetNote,
        explanation: `In C major, ${targetNote} is the ${getScaleDegreePosition(targetNote)} degree of the scale.`
      });
    }

    return questionPool.sort(() => Math.random() - 0.5);
  };

  const getScaleDegreePosition = (note: string): string => {
    const cMajorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const positions = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
    const index = cMajorScale.indexOf(note);
    return index !== -1 ? positions[index] : 'unknown';
  };

  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Highlight scale notes if it's a scale question
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === 'scale-identification' && onScaleHighlight) {
      const questionText = currentQuestion.question;
      const notesMatch = questionText.match(/Notes: (.+)/);
      if (notesMatch) {
        const notes = notesMatch[1].split(' - ');
        onScaleHighlight(notes);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      onScaleHighlight?.([]);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuestions(generateQuestions());
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    onScaleHighlight?.([]);
  };

  if (questions.length === 0) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    if (percentage >= 90) message = 'Excellent! You\'re a music theory master! 🎓';
    else if (percentage >= 70) message = 'Great job! You have a solid understanding! 🎵';
    else if (percentage >= 50) message = 'Good effort! Keep practicing! 🎹';
    else message = 'Keep learning! Review the lessons and try again! 📚';

    return (
      <div className="quiz-container">
        <div className="quiz-completed">
          <h2>Quiz Completed!</h2>
          <div className="score-display">
            <span className="score-number">{score}/{questions.length}</span>
            <span className="score-percentage">({percentage}%)</span>
          </div>
          <p className="score-message">{message}</p>
          <button className="restart-button" onClick={handleRestartQuiz}>
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Music Theory Quiz</h2>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="question-container">
        <div className="question-text">
          {currentQuestion.question.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>

        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selectedAnswer === option ? 'selected' : ''
              } ${
                showResult && option === currentQuestion.correctAnswer ? 'correct' : ''
              } ${
                showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer ? 'incorrect' : ''
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="result-container">
            <div className={`result-message ${
              selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'
            }`}>
              {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            <div className="explanation">
              {currentQuestion.explanation}
            </div>
          </div>
        )}

        <div className="quiz-actions">
          {!showResult ? (
            <button
              className="submit-button"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <button className="next-button" onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>

        <div className="current-score">
          Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
        </div>
      </div>
    </div>
  );
};

export default Quiz;