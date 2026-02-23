import EnhancedQuizComponent from '@/components/EnhancedQuizComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weekly Quiz | Test Your News Knowledge - Trend Pulse',
  description: 'Take our weekly news quiz! Test your knowledge of trending topics, current events, and industry insights. Challenge yourself and share your results.',
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Weekly News Quiz
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Test your knowledge of this week's trending topics. Can you score 100%?
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Live</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-400">Updated weekly</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-400">10 questions</span>
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">1,248</div>
            <div className="text-gray-400">Players This Week</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">72%</div>
            <div className="text-gray-400">Average Score</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">24h</div>
            <div className="text-gray-400">Time Remaining</div>
          </div>
        </div>

        {/* Quiz Component */}
        <EnhancedQuizComponent />

        {/* How It Works */}
        <div className="mt-16 bg-gray-800/30 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-bold text-white">Take the Quiz</h3>
              <p className="text-gray-400 text-sm">
                Answer 10 questions about this week's trending news topics.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <h3 className="font-bold text-white">Get Your Score</h3>
              <p className="text-gray-400 text-sm">
                See how you compare to other players and earn badges.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h3 className="font-bold text-white">Share & Challenge</h3>
              <p className="text-gray-400 text-sm">
                Share your results and challenge friends to beat your score.
              </p>
            </div>
          </div>
        </div>

        {/* Previous Winners */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Last Week's Top Players</h2>
          <div className="space-y-4">
            {[
              { name: 'Alex Johnson', score: 100, time: '2:48' },
              { name: 'Sarah Miller', score: 95, time: '3:12' },
              { name: 'David Chen', score: 90, time: '2:55' },
              { name: 'Emma Wilson', score: 85, time: '4:01' },
              { name: 'Michael Brown', score: 80, time: '3:45' },
            ].map((player, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg">
                    <span className="text-sm font-bold text-gray-300">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{player.name}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-400">{player.time} min</span>
                    </div>
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

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Test Your Knowledge?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of players who take our weekly quiz. Stay informed and have fun!
          </p>
          <a 
            href="#quiz-start"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Quiz Now
          </a>
        </div>
      </div>
    </div>
  );
}