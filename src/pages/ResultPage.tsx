import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { supabase, DiagnosticType, Product } from '../lib/supabase'

export default function ResultPage() {
    const [userScores, setUserScores] = useState<any>(null)
    const [matchedType, setMatchedType] = useState<DiagnosticType | null>(null)
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadResults()
    }, [])

    const loadResults = async () => {
        // LocalStorageから診断結果を取得
        const scoresStr = localStorage.getItem('diagnosis_result')
        if (!scoresStr) {
            setLoading(false);
            return
        }

        const scores = JSON.parse(scoresStr)
        setUserScores(scores)

        // 最もマッチするタイプを計算
        const { data: types } = await supabase.from('diagnostic_types').select('*')
        if (!types) return

        let bestMatch = types[0]
        let minDistance = Infinity

        types.forEach((type) => {
            // type.axes_scores is JSONB, assumed to be object score
            // Need to cast to any or specific type if typescript complains about index access on JSONB
            const typeScores = type.axes_scores as any;
            const distance = Object.keys(scores).reduce((sum, key) => {
                return sum + Math.abs(scores[key] - (typeScores[key] || 0))
            }, 0)

            if (distance < minDistance) {
                minDistance = distance
                bestMatch = type
            }
        })

        setMatchedType(bestMatch)

        // タイプに基づいて商品を推薦
        const { data: mappings } = await supabase
            .from('product_type_mapping')
            .select('product_id, products(*)')
            .eq('type_id', bestMatch.id)
            .order('priority', { ascending: false })
            .limit(5)

        if (mappings) {
            // Mapping result structure: { product_id: ..., products: {...} }
            // We need to type cast properly
            const products = mappings
                .map((m: any) => m.products)
                .filter((p: any) => p !== null) as Product[]; // Ensure not null
            setRecommendedProducts(products)
        }

        setLoading(false)
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">結果を計算中...</div>
    }

    if (!userScores) {
        return <div className="p-8 text-center">診断結果が見つかりません。まずは診断を受けてください。</div>
    }

    const radarData = [
        { axis: 'コスパ', value: userScores.cost },
        { axis: 'ブランド', value: userScores.brand },
        { axis: 'トレンド', value: userScores.trend },
        { axis: '実用性', value: userScores.practicality },
        { axis: 'デザイン', value: userScores.design },
        { axis: '時短', value: userScores.time_saving },
    ]

    const handleShare = (platform: string) => {
        const text = `私は「${matchedType?.type_name}」タイプでした！ #GadgetMatch`
        const url = window.location.origin

        const shareUrls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        }

        window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-green/10 p-6">
            <div className="max-w-4xl mx-auto">
                {/* タイプ表示 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center"
                >
                    {matchedType?.character_image_url && (
                        <img src={matchedType.character_image_url} alt={matchedType.type_name} className="w-32 h-32 mx-auto mb-4" />
                    )}
                    <h1 className="text-4xl font-bold text-primary-600 mb-2">あなたは</h1>
                    {/* Using optional chaining safety */}
                    <h2 className="text-5xl font-extrabold text-gray-800 mb-4">{matchedType?.type_name}</h2>
                    <p className="text-gray-600">{matchedType?.description}</p>

                    {/* SNSシェアボタン */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={() => handleShare('twitter')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
                        >
                            𝕏でシェア
                        </button>
                        <button
                            onClick={() => handleShare('facebook')}
                            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800"
                        >
                            Facebookでシェア
                        </button>
                    </div>
                </motion.div>

                {/* レーダーチャート */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">あなたの家電選び傾向</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="axis" />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} />
                            <Radar name="あなた" dataKey="value" stroke="#1890ff" fill="#1890ff" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* おすすめ商品 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">あなたにぴったりの家電TOP5</h3>
                    <div className="space-y-6">
                        {recommendedProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex-shrink-0">
                                    <img src={product.image_url || '/placeholder.png'} alt={product.name} className="w-24 h-24 object-cover rounded" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">#{index + 1}</span>
                                        <h4 className="font-bold text-lg">{product.name}</h4>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-xl text-primary-600">¥{product.price?.toLocaleString()}</span>
                                        <span className="text-yellow-500">⭐ {product.review_score}</span>
                                        <div className="flex gap-2 ml-auto">
                                            {product.amazon_link && (
                                                <a href={product.amazon_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                                    Amazonで見る
                                                </a>
                                            )}
                                            {product.rakuten_link && (
                                                <a href={product.rakuten_link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline text-sm">
                                                    楽天で見る
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
