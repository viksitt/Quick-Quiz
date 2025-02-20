import React, { useState, useEffect } from "react";
import { Clock, Award, AlertCircle, CheckCircle, XCircle, ArrowRight } from "lucide-react";


const QuizPlatform = () => {
  const [quizStarted, setQuizStarted] = useState(false); //This state variable controls whether the quiz has started or not.
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [outOfAttempts, setOutOfAttempts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);

  //question from given data from assignments
  const quizData = [
    { question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], answer: "Mercury" },
    { question: "Which data structure organizes items in a First-In, First-Out (FIFO) manner?", options: ["Stack", "Queue", "Tree", "Graph"], answer: "Queue" },
    { question: "Which of the following is primarily used for structuring web pages?", options: ["Python", "Java", "HTML", "C++"], answer: "HTML" },
    { question: "Which chemical symbol stands for Gold?", options: ["Au", "Gd", "Ag", "Pt"], answer: "Au" },
    { question: "Which of these processes is not typically involved in refining petroleum?", options: ["Fractional distillation", "Cracking", "Polymerization", "Filtration"], answer: "Filtration" },
    { question: "What is the value of 12 + 28?", type: "integer", answer: 40 },
    { question: "How many states are there in the United States?", type: "integer", answer: 50 },
    { question: "In which year was the Declaration of Independence signed?", type: "integer", answer: 1776 },
    { question: "What is the value of pi rounded to the nearest integer?", type: "integer", answer: 3 },
    { question: "If a car travels at 60 mph for 2 hours, how many miles does it travel?", type: "integer", answer: 120 }
  ];
  
//This effect handles the countdown timer and moves to the next question when time runs out
  useEffect(() => {
    if (!quizStarted || quizCompleted || showNextButton) return;
    if (timeLeft === 0) nextQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, quizCompleted, showNextButton]);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (answer) => {//This function processes the selected answer, updates the score, and manages attempts.
    if (answer === null || answer === "") return;
    setSelectedAnswer(answer);
    setIsAnswerSelected(true);
    const correctAnswer = quizData[currentQuestion].answer;
    const isCorrect = (answer.toString() || "") === (correctAnswer.toString() || "");
    setAttemptHistory([...attemptHistory, { question: quizData[currentQuestion].question, selected: answer, correct: isCorrect }]);
    setFeedback(isCorrect ? "Correct! 🎉" : "Wrong! ❌ Try again.");
    
    if (isCorrect) {
      setScore(score + 1);
      setShowNextButton(true);
    } else {
      if (attemptsLeft > 1) {
        setAttemptsLeft(attemptsLeft - 1);
      } else {
        setOutOfAttempts(true);
        setTimeout(() => {
          setOutOfAttempts(false);
          nextQuestion();
        }, 2000);
      }
    }
  };

  const nextQuestion = () => {   //This function moves to the next question or marks the quiz as completed when all questions are answered.
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setTimeLeft(30);
      setAttemptsLeft(3);
      setFeedback(null);
      setShowNextButton(false);
      setIsAnswerSelected(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const toggleDarkMode = () => { //toggle dark mode
    setDarkMode(!darkMode);
  };

  const getTimeColor = () => {
    if (timeLeft > 20) return "text-green-500";
    if (timeLeft > 10) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className={`min-h-screen flex flex-col items-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'} transition-colors duration-300 p-4`}>
      {/* Theme Toggle */}
      <div className="fixed h-10 top-4 right-4 flex items-center space-x-2 bg-white  dark:bg-gray-800 p-2 rounded-full shadow-lg">
        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {darkMode ? '🌙' : '☀️'}
        </span>
        <button
          onClick={toggleDarkMode}
          className={`w-14 h-7 flex items-center rounded-full p-1 ${
            darkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              darkMode ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className={`w-full max-w-4xl mx-auto mt-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <h1 className="text-5xl font-extrabold text-center mb-8 my-3 tracking-wide drop-shadow-lg">
          Quick Quiz
        </h1>

        <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl`}>
          {!quizStarted ? (
            <div className="text-center space-y-6">
              <h2 className={`text-3xl font-sans font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Welcome to the Quick Quiz!
              </h2>
              <p className={`text-xl font-normal ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Test your knowledge across various topics. Are you ready?
              </p>
              <button 
                onClick={startQuiz}
                className="py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-lg font-bold hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Quiz
              </button>
            </div>
          ) : !quizCompleted ? (
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Award className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} size={24} />
                  <span className="font-bold">Score: {score}/{quizData.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={20} className={getTimeColor()} />
                  <span className={`font-mono font-bold ${getTimeColor()}`}>{timeLeft}s</span>
                </div>
              </div>

              {/* Question Progress */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Question {currentQuestion + 1} of {quizData.length}
                </h2>
                <p className={`text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {quizData[currentQuestion].question}
                </p>

                {/* Attempts Indicator */}
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} className="text-blue-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Attempts remaining: {attemptsLeft}
                  </span>
                </div>

                {/* Answer Options */}
                <div className="space-y-3 mt-6">
                  {quizData[currentQuestion].options ? (
                    quizData[currentQuestion].options.map((option) => (
                      <button 
                        key={option} 
                        onClick={() => !showNextButton && handleAnswer(option)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-102 ${
                          showNextButton
                            ? 'opacity-50 cursor-not-allowed'
                            : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`
                        } ${selectedAnswer === option ? 'ring-2 ring-blue-500' : ''}`}
                        disabled={showNextButton}
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="number"
                        placeholder="Enter your answer..."
                        className={`w-full p-4 rounded-xl border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-100 border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={showNextButton}
                      />
                      {!showNextButton && (
                        <button 
                          onClick={() => handleAnswer(selectedAnswer)}
                          className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
                        >
                          Submit Answer
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className={`mt-4 p-4 rounded-xl ${
                    feedback.includes("Correct")
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {feedback.includes("Correct") ? (
                        <CheckCircle size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                      <span className="font-medium">{feedback}</span>
                    </div>
                  </div>
                )}

                {/* Next Button */}
                {showNextButton && (
                  <button 
                    onClick={nextQuestion}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Quiz Completed! 🎉
                </h2>
                <div className={`text-6xl font-bold mb-4 ${
                  score === quizData.length ? 'text-green-500' : 
                  score >= quizData.length / 2 ? 'text-yellow-500' : 
                  'text-red-500'
                }`}>
                  {Math.round((score / quizData.length) * 100)}%
                </div>
                <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You got {score} out of {quizData.length} questions correct
                </p>
              </div>

              <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Question Summary
                </h3>
                <div className="space-y-4">
                  {attemptHistory.map((attempt, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        attempt.correct 
                          ? darkMode ? 'bg-green-900/20' : 'bg-green-50' 
                          : darkMode ? 'bg-red-900/20' : 'bg-red-50'
                      }`}
                    >
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {index + 1}. {attempt.question}
                      </p>
                      <p className={`mt-2 ${
                        attempt.correct 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        Your answer: {attempt.selected} {attempt.correct ? '✓' : '✗'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlatform;