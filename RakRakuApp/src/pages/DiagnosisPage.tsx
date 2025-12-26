import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, Question } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function DiagnosisPage() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchQuestions()
    }, [])

    const fetchQuestions = async () => {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('question_number', { ascending: true })
            .limit(25)

        if (error) {
            console.error('質問の取得に失敗:', error)
            return
        }

        setQuestions(data || [])
        setLoading(false)
    }

    const handleAnswer = (value: number) => {
        const currentQuestion = questions[currentIndex]
        setAnswers({ ...answers, [currentQuestion.axis_type]: (answers[currentQuestion.axis_type] || 0) + value })

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            // 診断完了 → 結果画面へ
            calculateResult()
        }
    }

    const calculateResult = () => {
        // 各軸のスコアを正規化（0-100）
        // Note: Assuming answers accumulate raw scores. 
        // Logic: (Total Score for Axis) * 4 if max is 25? 
        // User code: Math.min(100, (answers.cost || 0) * 4) 
        // This implies max score per axis is 25 (5 questions * 5 points = 25). 25 * 4 = 100.
        const normalizedScores = {
            cost: Math.min(100, (answers.cost || 0) * 4),
            brand: Math.min(100, (answers.brand || 0) * 4),
            trend: Math.min(100, (answers.trend || 0) * 4),
            practicality: Math.min(100, (answers.practicality || 0) * 4),
            design: Math.min(100, (answers.design || 0) * 4),
            time_saving: Math.min(100, (answers.time_saving || 0) * 4),
        }

        // LocalStorageに保存して結果画面へ遷移
        localStorage.setItem('diagnosis_result', JSON.stringify(normalizedScores))
        navigate('/result')
    }

    const progress = ((currentIndex + 1) / questions.length) * 100

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-green/10">
                <div className="text-xl text-gray-600">質問を読み込み中...</div>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex]
    if (!currentQuestion) return <div>No questions found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-green/10 p-6">
            {/* プログレスバー */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        質問 {currentIndex + 1} / {questions.length}
                    </span>
                    <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-green rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* 質問カード */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        <div className="flex items-center mb-6">
                            <span className="text-4xl mr-4">🤔</span>
                            <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.question_text}</h2>
                        </div>

                        {/* 5段階選択ボタン */}
                        <div className="grid grid-cols-5 gap-3">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <motion.button
                                    key={value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAnswer(value)}
                                    className={`py-4 rounded-xl font-semibold text-lg transition-all ${value <= 2
                                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            : value === 3
                                                ? 'bg-accent-yellow/20 hover:bg-accent-yellow/30 text-gray-800'
                                                : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
                                        }`}
                                >
                                    {value}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex justify-between mt-4 text-sm text-gray-500">
                            <span>全く当てはまらない</span>
                            <span>非常に当てはまる</span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
