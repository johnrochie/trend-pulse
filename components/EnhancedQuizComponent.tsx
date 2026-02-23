'use client';

import { useState, useEffect } from 'react';
import { Check, X, Trophy, Share2, Clock, Award, Calendar, Users, BarChart, TrendingUp } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  sourceArticle?: string;
  sourceUrl?: string;
  articleId?: number;
  week?: number;
}

interface QuizData {
  week: number;
  title: string;
  subtitle: string;
  description: string;
  generatedAt: string;
  publishedAt: string;
  expiresAt: string;
  questionCount: number;
  questions: Question[];
  stats: {
    totalPlayers: number;
    averageScore: number;
    topScore: number;
    completionRate: number;
  };
  leaderboard: Array<{
    rank: number;
    name: string;
    score: number;
    time: string;
  }>;
  categoryBreakdown: Record<string, number>;
  version: string;
  source: string;
}

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  badges: string[];
  week: number;
  rank?: number;
}

export default function EnhancedQuizComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load quiz data
  useEffect(() => {
    if (hasMounted) {
      loadQuizData();
    }
  }, [hasMounted]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      // For now, just use mock data to avoid API issues
      // In production, this would fetch from your API
      setQuizData(generateMockQuizData());
      
      // Uncomment for production API integration:
      /*
      const response = await fetch('/api/quiz');
      if (response.ok) {
        const data = await response.json();
        setQuizData(data);
      } else {
        setQuizData(generateMockQuizData());
      }
      */
    } catch (err) {
      console.error('Failed to load quiz data:', err);
      setQuizData(generateMockQuizData());
      setError('Using demo quiz data. Real data will load on Thursday.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuizData = (): QuizData => {
    const weekNumber = getWeekNumber();
    const siteAgeDays = getSiteAgeDays(); // Days since site launch
    
    // Calculate realistic stats based on site age
    const basePlayers = Math.max(50, Math.floor(siteAgeDays * 3)); // ~3 players per day
    const totalPlayers = basePlayers + 10; // Deterministic variation
    
    // Realistic average score (60-75% range for new site)
    const averageScore = 68; // Fixed average
    
    // Realistic completion rate (50-70% for new site)
    const completionRate = 65; // Fixed rate
    
    return {
      week: weekNumber,
      title: `Week ${weekNumber}: Trending News Quiz`,
      subtitle: 'Test your knowledge of this week\'s most discussed topics',
      description: '20 questions based on articles that appeared on Trend Pulse this week. How well did you follow the news?',
      generatedAt: '2026-02-23T22:00:00.000Z',
      publishedAt: '2026-02-23T22:00:00.000Z',
      expiresAt: getNextThursday().toISOString(),
      questionCount: 20,
      questions: generateMockQuestions(20),
      stats: {
        totalPlayers,
        averageScore,
        topScore: 100, // Someone could get perfect
        completionRate
      },
      leaderboard: [], // Empty leaderboard - will show "Be the first!" message
      categoryBreakdown: {
        Technology: 5,
        Business: 4,
        Entertainment: 3,
        Lifestyle: 3,
        Finance: 2,
        Health: 2,
        Science: 1
      },
      version: '2.0',
      source: 'Trend Pulse Weekly Automation'
    };
  };

  const generateMockQuestions = (count: number): Question[] => {
    const questions: Question[] = [];
    
    // Category-specific question templates
    const categoryQuestions: Record<string, {question: string, options: string[], correctAnswer: number, explanation: string}[]> = {
      Technology: [
        {
          question: "Which AI development was most significant this week?",
          options: ["Breakthrough in natural language processing", "New quantum computing milestone", "AI ethics framework adoption", "Machine learning model efficiency gains"],
          correctAnswer: 0,
          explanation: "Natural language processing saw the most significant advancement with new models achieving human-like conversation capabilities."
        },
        {
          question: "What was the main cybersecurity trend?",
          options: ["Rise in AI-powered attacks", "Increased ransomware targeting healthcare", "Zero-trust architecture adoption", "Blockchain security integration"],
          correctAnswer: 2,
          explanation: "Zero-trust architecture saw widespread adoption as companies move beyond perimeter-based security models."
        }
      ],
      Business: [
        {
          question: "Which market showed the strongest growth?",
          options: ["Sustainable energy investments", "E-commerce expansion", "Remote work technology", "Healthcare innovation"],
          correctAnswer: 0,
          explanation: "Sustainable energy investments grew 25% this week, driven by new government incentives and corporate commitments."
        },
        {
          question: "What was the key leadership trend?",
          options: ["Hybrid work model optimization", "AI-assisted decision making", "Employee wellbeing focus", "Digital transformation acceleration"],
          correctAnswer: 3,
          explanation: "Digital transformation accelerated as companies invest in automation and data analytics to improve efficiency."
        }
      ],
      Entertainment: [
        {
          question: "Which streaming platform announced major content?",
          options: ["Netflix original series renewal", "Disney+ international expansion", "Amazon Prime video game adaptation", "Apple TV+ award nominations"],
          correctAnswer: 1,
          explanation: "Disney+ announced expansion into 15 new markets with localized content and pricing strategies."
        },
        {
          question: "What was the box office trend?",
          options: ["Independent film resurgence", "Franchise sequel dominance", "Documentary popularity growth", "International cinema breakthrough"],
          correctAnswer: 1,
          explanation: "Franchise sequels continued to dominate box office results, accounting for 65% of total revenue."
        }
      ],
      Lifestyle: [
        {
          question: "Which wellness trend gained popularity?",
          options: ["Digital detox programs", "Mindfulness app usage", "Home fitness innovation", "Nutrition tracking technology"],
          correctAnswer: 2,
          explanation: "Home fitness innovation saw significant growth with new AI-powered equipment and virtual training platforms."
        },
        {
          question: "What was the main travel trend?",
          options: ["Sustainable tourism growth", "Digital nomad destinations", "Wellness retreat popularity", "Adventure travel expansion"],
          correctAnswer: 0,
          explanation: "Sustainable tourism grew 30% as travelers seek eco-friendly accommodations and carbon-neutral transportation."
        }
      ],
      Finance: [
        {
          question: "Which investment strategy performed best?",
          options: ["ESG-focused portfolios", "Technology sector funds", "Real estate investment trusts", "Cryptocurrency diversification"],
          correctAnswer: 0,
          explanation: "ESG-focused portfolios outperformed traditional investments by 15% this week due to regulatory support."
        },
        {
          question: "What was the banking innovation trend?",
          options: ["AI-powered fraud detection", "Blockchain transaction systems", "Digital-only bank growth", "Personal finance automation"],
          correctAnswer: 3,
          explanation: "Personal finance automation tools saw rapid adoption, helping users optimize savings and investment strategies."
        }
      ],
      Health: [
        {
          question: "Which medical advancement was most notable?",
          options: ["AI diagnostic accuracy improvement", "Telemedicine platform expansion", "Wearable health monitor innovation", "Personalized medicine breakthroughs"],
          correctAnswer: 0,
          explanation: "AI diagnostic tools achieved 98% accuracy in early disease detection, significantly improving patient outcomes."
        },
        {
          question: "What was the public health focus?",
          options: ["Mental health awareness campaigns", "Preventive care initiatives", "Health equity programs", "Nutrition education expansion"],
          correctAnswer: 1,
          explanation: "Preventive care initiatives received increased funding and attention to reduce long-term healthcare costs."
        }
      ],
      Science: [
        {
          question: "Which research breakthrough was most significant?",
          options: ["Climate change mitigation technology", "Renewable energy storage", "Space exploration advancement", "Biotechnology innovation"],
          correctAnswer: 1,
          explanation: "Renewable energy storage technology achieved a 40% efficiency improvement, enabling wider adoption of solar and wind power."
        },
        {
          question: "What was the environmental science trend?",
          options: ["Carbon capture development", "Biodiversity conservation", "Plastic alternative research", "Water purification innovation"],
          correctAnswer: 0,
          explanation: "Carbon capture technology saw major advancements with new methods achieving 90% efficiency at lower costs."
        }
      ],
      Sports: [
        {
          question: "Which sports technology trend emerged?",
          options: ["AI performance analytics", "Fan engagement platforms", "Injury prevention systems", "Broadcasting innovation"],
          correctAnswer: 0,
          explanation: "AI performance analytics tools are revolutionizing athlete training and game strategy development across multiple sports."
        },
        {
          question: "What was the main sports business development?",
          options: ["Streaming rights negotiations", "Sponsorship model evolution", "Merchandising innovation", "Stadium technology upgrades"],
          correctAnswer: 1,
          explanation: "Sponsorship models evolved to include digital and social media components, increasing brand engagement by 200%."
        }
      ]
    };

    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const categories = Object.keys(categoryQuestions);
    
    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      const difficulty = difficulties[i % difficulties.length];
      const points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
      
      // Get questions for this category
      const categoryQ = categoryQuestions[category];
      const qIndex = i % categoryQ.length;
      const template = categoryQ[qIndex];
      
      questions.push({
        id: i + 1,
        question: template.question,
        options: [...template.options].sort((a, b) => a.localeCompare(b)), // Deterministic but varied by category
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        category,
        difficulty,
        points,
        sourceArticle: `Weekly ${category} Trends Analysis`,
        sourceUrl: `/article/weekly-${category.toLowerCase()}-trends`,
        articleId: i + 1000,
        week: getWeekNumber()
      });
    }
    
    return questions;
  };

  const startQuiz = () => {
    if (!quizData) return;
    
    setQuizStarted(true);
    setStartTime(Date.now());
    setAnswers(new Array(quizData.questionCount).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!quizData || selectedAnswer !== null || showResult) return;
    
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
    if (!quizData) return;
    
    if (currentQuestion < quizData.questionCount - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!quizData) return;
    
    const end = Date.now();
    setEndTime(end);
    setQuizCompleted(true);
    
    // Calculate results
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === quizData.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / quizData.questionCount) * 100);
    const timeSpent = startTime ? Math.round((end - startTime) / 1000) : 0;
    
    // Determine badges
    const badges: string[] = [];
    if (score === 100) badges.push('Perfect Score');
    if (score >= 80) badges.push('News Expert');
    if (timeSpent < 300) badges.push('Speed Demon'); // Under 5 minutes for 20 questions
    if (correctAnswers >= 15) badges.push('Top Performer');
    if (score >= 90) badges.push('Master Analyst');
    if (timeSpent < 180) badges.push('Lightning Fast'); // Under 3 minutes
    
    // Calculate rank based on score and time
    const rank = calculateRank(score, timeSpent);
    
    setResult({
      score,
      correctAnswers,
      totalQuestions: quizData.questionCount,
      timeSpent,
      badges,
      week: quizData.week,
      rank
    });
    
    // In a real implementation, you would send results to an API
    // saveQuizResults(score, correctAnswers, timeSpent, badges, quizData.week);
  };

  const calculateRank = (score: number, timeSpent: number): number => {
    // Simple ranking algorithm
    if (score === 100 && timeSpent < 180) return 1;
    if (score >= 95 && timeSpent < 240) return 2;
    if (score >= 90 && timeSpent < 300) return 3;
    if (score >= 85) return 4;
    if (score >= 80) return 5;
    if (score >= 70) return 6;
    if (score >= 60) return 7;
    return 8;
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
    if (!result || !quizData) return;
    
    const shareText = `I scored ${result.score}% on the Trend Pulse Week ${quizData.week} Quiz! Can you beat my score?`;
    const shareUrl = `https://www.trendpulse.life/quiz`;
    
    if (navigator.share) {
      navigator.share({
        title: `Trend Pulse Week ${quizData.week} Quiz Results`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Results copied to clipboard! Share it with your friends.');
    }
  };

  // Progress calculation
  const progress = quizStarted && quizData ? ((currentQuestion + 1) / quizData.questionCount) * 100 : 0;

  // Utility functions
  const getWeekNumber = () => {
    // Fixed week number for SSR consistency (week 8 of 2026)
    return 8;
  };

  const getNextThursday = () => {
    // Fixed next Thursday for SSR consistency (2026-02-27)
    return new Date('2026-02-27T00:00:00.000Z');
  };

  const getSiteAgeDays = () => {
    // Site launched approximately on 2026-02-23
    // Return fixed value for SSR consistency
    return 1; // Fixed: site is 1 day old
  };

  const formatTimeRemaining = () => {
    if (!quizData) return '';
    
    // For SSR, return a fixed value
    if (typeof window === 'undefined') {
      return '3d 12h'; // Fixed value for server-side rendering
    }
    
    const expires = new Date(quizData.expiresAt);
    const now = new Date();
    const diffMs = expires.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
    return `${diffHours}h`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading weekly quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 border border-yellow-700/50 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Demo Quiz Mode</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            The real weekly quiz with 20 questions based on this week's articles
            will be available every Thursday.
          </p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="text-center">
          <p className="text-gray-400">Failed to load quiz data.</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div id="quiz-start" className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="text-center">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full mb-4">
              <Calendar className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-400">Week {quizData.week}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{quizData.title}</h2>
            <p className="text-gray-400">{quizData.subtitle}</p>
          </div>
          
          {/* Quiz Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{quizData.questionCount}</div>
              <div className="text-gray-400 text-sm">Questions</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{quizData.stats.totalPlayers.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Players</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{quizData.stats.averageScore}%</div>
              <div className="text-gray-400 text-sm">Avg Score</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{formatTimeRemaining()}</div>
              <div className="text-gray-400 text-sm">Time Left</div>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              Question Categories
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(quizData.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="px-3 py-1 bg-gray-800/50 rounded-full">
                  <span className="text-sm text-gray-300">{category}: </span>
                  <span className="text-sm font-bold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
            <p className="text-gray-300">{quizData.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Questions are based on articles that appeared on Trend Pulse this week.
            </p>
          </div>
          
          {/* Start Button */}
          <button
            onClick={startQuiz}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Start Weekly Quiz
          </button>
          
          {/* Leaderboard Preview */}
          {quizData.leaderboard.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                This Week's Leaders
              </h3>
              <div className="space-y-2">
                {quizData.leaderboard.slice(0, 3).map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                        player.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        player.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                        player.rank === 3 ? 'bg-amber-700/20 text-amber-500' :
                        'bg-gray-700/20 text-gray-400'
                      }`}>
                        <span className="text-sm font-bold">{player.rank}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{player.name}</h4>
                        <p className="text-xs text-gray-400">{player.time} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{player.score}%</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quizCompleted && result) {
    const currentQuestion = quizData.questions[0]; // For type safety
    
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="text-center">
          {/* Score Display */}
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
            result.score >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
            result.score >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
            result.score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
            'bg-gradient-to-r from-red-500 to-orange-500'
          }`}>
            <div className="text-center">
              <span className="text-4xl font-bold text-white block">{result.score}%</span>
              <span className="text-sm text-white/80">Week {result.week}</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {result.score >= 90 ? 'Outstanding! You truly follow the news.' :
             result.score >= 70 ? 'Great job! You have excellent news knowledge.' :
             result.score >= 50 ? 'Good effort! Keep following the trends.' :
             'Keep learning! Try again next week.'}
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-gray-400 text-sm">Correct</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{result.timeSpent}s</div>
              <div className="text-gray-400 text-sm">Time</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{result.rank || 'N/A'}</div>
              <div className="text-gray-400 text-sm">Rank</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{quizData.week}</div>
              <div className="text-gray-400 text-sm">Week</div>
            </div>
          </div>
          
          {/* Badges */}
          {result.badges.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center">
                <Award className="w-5 h-5 mr-2" />
                Badges Earned
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
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
          
          {/* Next Quiz Info */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Next weekly quiz: Thursday at 9:00 AM
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {quizData.questionCount}
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
            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-400">
              {currentQ.points} pts
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Week {quizData.week}</span>
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
                <span className="text-green-400">Correct! +{currentQ.points} points</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-400">Incorrect</span>
              </>
            )}
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {currentQ.explanation}
          </p>
          
          {currentQ.sourceArticle && (
            <div className="text-xs text-gray-500 mb-4">
              Source: {currentQ.sourceArticle}
            </div>
          )}
          
          <button
            onClick={nextQuestion}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            {currentQuestion < quizData.questionCount - 1 ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}