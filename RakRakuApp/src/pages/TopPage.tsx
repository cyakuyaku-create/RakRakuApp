import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Sparkles, Zap, DollarSign } from 'lucide-react';

export const TopPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 max-w-2xl mx-auto mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                        あなたの<span className="text-blue-600">家電タイプ</span>を<br />
                        診断します
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        たった25問で、あなたにぴったりのガジェットや家電が見つかります。<br />
                        MBTI風の診断で、あなたの隠れた「家電性格」を発見しましょう。
                    </p>
                    <div className="mt-8">
                        <Button size="lg" onClick={() => navigate('/diagnosis')} className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                            診断をスタートする
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                {[
                    {
                        icon: Zap,
                        title: "8つのタイプ",
                        desc: "「時短魔術師」や「デザイン至上主義者」など、ユニークなタイプに分類。"
                    },
                    {
                        icon: Sparkles,
                        title: "精度の高い提案",
                        desc: "あなたの性格やライフスタイルにマッチした家電を厳選して提案します。"
                    },
                    {
                        icon: DollarSign,
                        title: "コスパも重視",
                        desc: "価格だけでなく、実用性やトレンドなど多角的な視点で分析します。"
                    }
                ].map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    >
                        <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm">
                            <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </section>
        </div>
    );
};
