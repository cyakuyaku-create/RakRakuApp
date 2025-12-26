import { useState, useEffect } from 'react'
import { supabase, DiagnosticType } from '../../lib/supabase'
import { Upload } from 'lucide-react'

export default function TypesPage() {
    const [types, setTypes] = useState<DiagnosticType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTypes()
    }, [])

    const fetchTypes = async () => {
        const { data } = await supabase.from('diagnostic_types').select('*')
        setTypes(data || [])
        setLoading(false)
    }

    const handleImageUpload = async (typeId: string, file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${typeId}.${fileExt}`

        // Upsert not always supported directly via upload options depending on client version, 
        // but the user prompt usage implies it works or suggests this pattern.
        // 'upsert: true' is a valid option in newer JS client.
        const { error: uploadError } = await supabase.storage
            .from('character-images')
            .upload(fileName, file, { upsert: true })

        if (uploadError) {
            console.error('画像アップロードエラー:', uploadError)
            return
        }

        const { data } = supabase.storage.from('character-images').getPublicUrl(fileName)

        await supabase
            .from('diagnostic_types')
            .update({ character_image_url: data.publicUrl })
            .eq('id', typeId)

        fetchTypes()
    }

    if (loading) {
        return <div className="text-center py-12">読み込み中...</div>
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">タイプ管理</h2>

            <div className="grid grid-cols-2 gap-6">
                {types.map((type) => (
                    <div key={type.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                {type.character_image_url ? (
                                    <img
                                        src={type.character_image_url}
                                        alt={type.type_name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{type.type_name}</h3>
                                <p className="text-sm text-gray-500 mb-3">{type.type_name_en}</p>
                                <p className="text-gray-600 text-sm mb-4">{type.description}</p>

                                <label className="flex items-center gap-2 bg-primary-100 hover:bg-primary-200 text-primary-700 px-4 py-2 rounded-lg cursor-pointer transition-colors w-fit">
                                    <Upload size={16} />
                                    <span className="text-sm font-semibold">画像を変更</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleImageUpload(type.id, file)
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* 6軸スコア表示 */}
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">評価軸スコア</h4>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                {Object.entries(type.axes_scores).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-gray-600">
                                            {key === 'cost' && 'コスパ'}
                                            {key === 'brand' && 'ブランド'}
                                            {key === 'trend' && 'トレンド'}
                                            {key === 'practicality' && '実用性'}
                                            {key === 'design' && 'デザイン'}
                                            {key === 'time_saving' && '時短'}
                                        </span>
                                        <span className="font-semibold text-primary-600">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
