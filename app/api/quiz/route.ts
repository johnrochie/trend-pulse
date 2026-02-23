import { NextResponse } from 'next/server';

// This would connect to a database in production
// For now, we'll return mock data

export async function GET() {
  const quizData = {
    week: 8,
    title: "Week 8: Trending Topics Quiz",
    description: "Test your knowledge of this week's most discussed topics across technology, business, and entertainment.",
    questions: [
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
        difficulty: "medium",
        points: 10
      },
      {
        id: 2,
        question: "True or False: Remote work productivity has decreased since 2025 according to recent studies.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Studies show remote work productivity has actually increased by 15% since 2025, with better tools and processes being developed.",
        category: "Business",
        difficulty: "easy",
        points: 5
      },
      {
        id: 3,
        question: "Which streaming service reported the highest subscriber growth in Q1 2026?",
        options: ["Netflix", "Disney+", "Amazon Prime Video", "Apple TV+"],
        correctAnswer: 1,
        explanation: "Disney+ reported 12 million new subscribers in Q1 2026, driven by exclusive content and international expansion.",
        category: "Entertainment",
        difficulty: "medium",
        points: 10
      }
    ],
    stats: {
      totalPlayers: 1248,
      averageScore: 72,
      topScore: 100,
      timeRemaining: "24h"
    },
    leaderboard: [
      { rank: 1, name: "Alex Johnson", score: 100, time: "2:48" },
      { rank: 2, name: "Sarah Miller", score: 95, time: "3:12" },
      { rank: 3, name: "David Chen", score: 90, time: "2:55" },
      { rank: 4, name: "Emma Wilson", score: 85, time: "4:01" },
      { rank: 5, name: "Michael Brown", score: 80, time: "3:45" }
    ],
    badges: [
      { id: "perfect", name: "Perfect Score", description: "Score 100% on the quiz", icon: "🏆" },
      { id: "expert", name: "News Expert", description: "Score 80% or higher", icon: "⭐" },
      { id: "speed", name: "Speed Demon", description: "Complete in under 3 minutes", icon: "⚡" },
      { id: "top", name: "Top Performer", description: "Answer 7+ questions correctly", icon: "👑" }
    ]
  };

  return NextResponse.json(quizData);
}

// For future: POST endpoint to submit quiz results
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In production, this would save to a database
    // For now, just return a success response
    
    const result = {
      success: true,
      message: "Quiz results recorded successfully",
      data: {
        score: body.score || 0,
        correctAnswers: body.correctAnswers || 0,
        totalQuestions: body.totalQuestions || 0,
        timeSpent: body.timeSpent || 0,
        badgesEarned: body.badgesEarned || [],
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process quiz results" },
      { status: 500 }
    );
  }
}