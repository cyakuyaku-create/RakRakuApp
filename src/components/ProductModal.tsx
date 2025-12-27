import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase, Product, DiagnosticType } from '../lib/supabase'
import { X, Upload } from 'lucide-react'

interface ProductModalProps {
    product: Product | null
    types: DiagnosticType[]
    onClose: () => void
    onSave: () => void
}

interface ProductFormData {
    name: string
    description: string
    price: number
    category: string
    brand: string
    review_score: number
    review_count: number
    amazon_link: string
    rakuten_link: string
    is_visible: boolean
}

export default function ProductModal({ product, types, onClose, onSave }: ProductModalProps) {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '')
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
        defaultValues: product ? {
            ...product,
            is_visible: (product as any).is_visible // Casting because user interface omitted it
        } : {
            is_visible: true,
            review_score: 4.5,
            review_count: 0,
        },
    })

    useEffect(() => {
        if (product) {
            fetchProductTypes()
        }
    }, [product])

    const fetchProductTypes = async () => {
        if (!product) return

        const { data } = await supabase
            .from('product_type_mapping')
            .select('type_id')
            .eq('product_id', product.id)

        if (data) {
            setSelectedTypes(data.map((m) => m.type_id))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return product?.image_url || null

        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, imageFile)

        if (uploadError) {
            console.error('画像アップロードエラー:', uploadError)
            return null
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
        return data.publicUrl
    }

    const onSubmit = async (data: ProductFormData) => {
        setUploading(true)

        const imageUrl = await uploadImage()

        const productData = {
            ...data,
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
        }

        let productId = product?.id

        if (product) {
            // 更新
            await supabase.from('products').update(productData).eq('id', product.id)
        } else {
            // 新規作成
            const { data: newProduct } = await supabase
                .from('products')
                .insert(productData)
                .select()
                .single()

            productId = newProduct?.id
        }

        // タイプとのマッピングを更新
        if (productId) {
            await supabase.from('product_type_mapping').delete().eq('product_id', productId)

            const mappings = selectedTypes.map((typeId, index) => ({
                product_id: productId,
                type_id: typeId,
                priority: 100 - index * 10,
            }))

            await supabase.from('product_type_mapping').insert(mappings)
        }

        setUploading(false)
        onSave()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-2xl font-bold text-gray-800">
                        {product ? '商品を編集' : '新規商品を追加'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* 画像アップロード */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">商品画像</label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <img src={imagePreview} alt="プレビュー" className="w-24 h-24 object-cover rounded" />
                            )}
                            <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                                <Upload size={20} />
                                <span>画像を選択</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* 商品名 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">商品名 *</label>
                        <input
                            {...register('name', { required: '商品名は必須です' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* 説明 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* 価格・ブランド */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">価格 (円) *</label>
                            <input
                                type="number"
                                {...register('price', { required: '価格は必須です', valueAsNumber: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ブランド</label>
                            <input
                                {...register('brand')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* カテゴリ・評価 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                            <select
                                {...register('category')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="キッチン">キッチン</option>
                                <option value="掃除">掃除</option>
                                <option value="美容">美容</option>
                                <option value="スマートホーム">スマートホーム</option>
                                <option value="オーディオ">オーディオ</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">評価 (1-5)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                {...register('review_score', { valueAsNumber: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* アフィリエイトリンク */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amazonリンク</label>
                            <input
                                {...register('amazon_link')}
                                placeholder="https://amazon.co.jp/..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">楽天リンク</label>
                            <input
                                {...register('rakuten_link')}
                                placeholder="https://rakuten.co.jp/..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* タイプ選択 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            対応する診断タイプ（複数選択可）
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {types.map((type) => (
                                <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTypes([...selectedTypes, type.id])
                                            } else {
                                                setSelectedTypes(selectedTypes.filter((id) => id !== type.id))
                                            }
                                        }}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">{type.type_name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 表示/非表示 */}
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('is_visible')}
                                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-700">ユーザーに表示する</span>
                        </label>
                    </div>

                    {/* 送信ボタン */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {uploading ? '保存中...' : '保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
