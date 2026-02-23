'use client';

import { useState, useEffect } from 'react';
import { Check, X, Trophy, Share2, Clock, Award } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  badges: string[];
}

export default function QuizComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Weekly quiz questions (would come from API in production)
  const questions: Question[] = [
    {
      id: 1,
      question: "Which technology is expected to see the most investment growth in 2026 according to recent market analysis?",
      options: [
        "Artificial Intelligence and Machine Learning",
        "Quantum Computing",
        "Virtual Reality",
        "5G Infrastructure"
      ],
      correctAnswer: 0,
      explanation: "AI and ML continue to dominate investment trends, with projected growth of 35% year-over-year according to Gartner's latest report.",
      category: "Technology",
      difficulty: "medium"
    },
    {
      id: 2,
      question: "True or False: Remote work productivity has decreased since 2025 according to recent studies.",
      options: [
        "True",
        "False"
      ],
      correctAnswer: 1,
      explanation: "Studies show remote work productivity has actually increased by 15% since 2025, with better tools and processes being developed.",
      category: "Business",
      difficulty: "easy"
    },
    {
      id: 3,
      question: "Which streaming service reported the highest subscriber growth in Q1 2026?",
      options: [
        "Netflix",
        "Disney+",
        "Amazon Prime Video",
        "Apple TV+"
      ],
      correctAnswer: 1,
      explanation: "Disney+ reported 12 million new subscribers in Q1 2026, driven by exclusive content and international expansion.",
      category: "Entertainment",
      difficulty: "medium"
    },
    {
      id: 4,
      question: "What percentage of adults now use mental health apps regularly according to recent surveys?",
      options: [
        "25%",
        "42%",
        "58%",
        "67%"
      ],
      correctAnswer: 2,
      explanation: "Recent surveys show 58% of adults use mental health apps regularly, up from 35% in 2024.",
      category: "Health",
      difficulty: "hard"
    },
    {
      id: 5,
      question: "Which cryptocurrency regulation framework has been adopted by the most countries?",
      options: [
        "MiCA (Markets in Crypto-Assets)",
        "FATF Travel Rule",
        "SEC Guidelines",
        "IRS Reporting Rules"
      ],
      correctAnswer: 0,
      explanation: "The EU's MiCA framework has been adopted or used as a model by 45 countries worldwide.",
      category: "Finance",
      difficulty: "hard"
    },
    {
      id: 6,
      question: "True or False: Esports revenue is expected to surpass traditional sports revenue by 2027.",
      options: [
        "True",
        "False"
      ],
      correctAnswer: 1,
      explanation: "While growing rapidly, esports revenue is projected to reach $3.5B by 2027, still below traditional sports.",
      category: "Sports",
      difficulty: "medium"
    },
    {
      id: 7,
      question: "Which renewable energy source saw the largest capacity increase in 2025?",
      options: [
        "Solar",
        "Wind",
        "Hydro",
        "Geothermal"
      ],
      correctAnswer: 0,
      explanation: "Solar energy capacity increased by 28% in 2025, the largest growth among renewable sources.",
      category: "Science",
      difficulty: "medium"
    },
    {
      id: 8,
      question: "What is the average daily screen time for adults in 2026 according to recent studies?",
      options: [
        "4.2 hours",
        "5.8 hours",
        "7.1 hours",
        "8.5 hours"
      ],
      correctAnswer: 2,
      explanation: "Studies show average daily screen time has increased to 7.1 hours, up from 6.5 hours in 2024.",
      category: "Lifestyle",
      difficulty: "easy"
    },
    {
      id: 9,
      question: "Which company leads in quantum computing patents as of 2026?",
      options: [
        "IBM",
        "Google",
        "Microsoft",
        "Intel"
      ],
      correctAnswer: 0,
      explanation: "IBM holds 1,245 quantum computing patents, leading the industry according to patent office data.",
      category: "Technology",
      difficulty: "hard"
    },
    {
      id: 10,
      question: "True or False: Sustainable investing funds have outperformed traditional funds over the past 3 years.",
      options: [
        "True",
        "False"
      ],
      correctAnswer: 0,
      explanation: "ESG funds have shown 12% average annual returns vs 9% for traditional funds over the past 3 years.",
      category: "Finance",
      difficulty: "medium"
    }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setAnswers(new Array(questions.length).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;
    
    setSelectedAnswer(answerIndex);
    
    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    
    // Show result after delay
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const end = Date.now();
    setEndTime(end);
    setQuizCompleted(true);
    
    // Calculate results
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = startTime ? Math.round((end - startTime) / 1000) : 0;
    
    // Determine badges
    const badges: string[] = [];
    if (score === 100) badges.push('Perfect Score');
    if (score >= 80) badges.push('News Expert');
    if (timeSpent < 180) badges.push('Speed Demon');
    if (correctAnswers >= 7) badges.push('Top Performer');
    
    setResult({
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      badges
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizStarted(false);
    setQuizCompleted(false);
    setAnswers([]);
    setStartTime(null);
    setEndTime(null);
    setResult(null);
  };

  const shareResults = () => {
    if (!result) return;
    
    const shareText = `I scored ${result.score}% on the Trend Pulse Weekly Quiz! Can you beat my score?`;
    const shareUrl = `https://www.trendpulse.life/quiz`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Trend Pulse Quiz Results',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Results copied to clipboard!');
    }
  };

  // Progress calculation
  const progress = quizStarted ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (!quizStarted) {
    return (
      <div id="quiz-start" className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Weekly News Quiz</h2>
          <p className="text-gray-400 mb-6">
            Test your knowledge of this week's trending topics. 10 questions, 100% fun!
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <span className="text-gray-300">Questions</span>
              <span className="text-white font-bold">10</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <span className="text-gray-300">Time Limit</span>
              <span className="text-white font-bold">No limit</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <span className="text-gray-300">Difficulty</span>
              <span className="text-white font-bold">Mixed</span>
            </div>
          </div>
          
          <button
            onClick={startQuiz}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted && result) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            result.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
            result.score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
            'bg-gradient-to-r from-red-500 to-orange-500'
          }`}>
            <span className="text-3xl font-bold text-white">{result.score}%</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-gray-400 mb-8">
            {result.score >= 80 ? 'Excellent work! You really know your stuff.' :
             result.score >= 60 ? 'Good job! You have solid news knowledge.' :
             'Keep learning! Try again next week.'}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-gray-400 text-sm">Correct Answers</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{result.timeSpent}s</div>
              <div className="text-gray-400 text-sm">Time Spent</div>
            </div>
          </div>
          
          {result.badges.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Badges Earned</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={shareResults}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Results</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQ.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              currentQ.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {currentQ.difficulty.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
              {currentQ.category}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">No time limit</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-6">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            let optionClass = "p-4 rounded-lg text-left transition-all ";
            
            if (selectedAnswer === index) {
              optionClass += isCorrect 
                ? "bg-green-500/20 border border-green-500/30" 
                : "bg-red-500/20 border border-red-500/30";
            } else if (selectedAnswer !== null && index === currentQ.correctAnswer) {
              optionClass += "bg-green-500/20 border border-green-500/30";
            } else {
              optionClass += "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700";
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`${optionClass} w-full flex items-center justify-between`}
              >
                <span className={`font-medium ${
                  selectedAnswer === index || (selectedAnswer !== null && index === currentQ.correctAnswer)
                    ? 'text-white'
                    : 'text-gray-300'
                }`}>
                  {option}
                </span>
                {selectedAnswer === index && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <X className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Next Button */}
      {showResult && (
        <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <h3 className="font-bold text-white mb-2 flex items-center">
            {isCorrect ? (
              <>
                <Check className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400">Correct!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-400">Incorrect</span>
              </>
            )}
          </h3>
          <p className="text-gray-300 text-sm">
            {currentQ.explanation}
          </p>
          
          <button
            onClick={nextQuestion}
            className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}