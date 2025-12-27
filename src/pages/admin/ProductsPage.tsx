import { useState, useEffect } from 'react'
import { supabase, Product, DiagnosticType } from '../../lib/supabase'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import ProductModal from '../../components/ProductModal'

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [types, setTypes] = useState<DiagnosticType[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const [{ data: productsData }, { data: typesData }] = await Promise.all([
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('diagnostic_types').select('*'),
        ])

        setProducts(productsData || [])
        setTypes(typesData || [])
        setLoading(false)
    }

    const handleToggleVisibility = async (product: Product) => {
        // Note: product from supabase is based on interface but might need explicit casting if field names differ or to enable update
        // Assuming product variable matches database row exactly enough for update.
        // 'is_visible' check.
        // However, product interface defined earlier as 'is_visible' boolean?
        // Let's check `src/lib/supabase.ts` again... It was NOT defined in the user snippet for supabase.ts.
        // Wait, the user snippet for supabase.ts Task 2:
        /*
        export interface Product {
          id: string
          name: string
          image_url: string | null
          description: string | null
          price: number
          amazon_link: string | null
          rakuten_link: string | null
          review_score: number
          review_count: number
          category: string | null
          brand: string | null
        }
        */
        // It is MISSING `is_visible` in the user provided interface snippet in Task 2.
        // But the SQL schema HAS `is_visible`.
        // And this ProductsPage uses `product.is_visible`.
        // I should probably update `src/lib/supabase.ts` to include `is_visible` to avoid TS errors.
        // I will do that as a quick fix or just cast here. Updating interface is better.

        await supabase
            .from('products')
            .update({ is_visible: !(product as any).is_visible } as any)
            .eq('id', product.id)

        fetchData()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？')) return

        await supabase.from('products').delete().eq('id', id)
        fetchData()
    }

    if (loading) {
        return <div className="text-center py-12">読み込み中...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">商品管理</h2>
                <button
                    onClick={() => {
                        setEditingProduct(null)
                        setModalOpen(true)
                    }}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    <Plus size={20} />
                    新規商品追加
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">画像</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">商品名</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">価格</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">評価</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">カテゴリ</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">表示</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img
                                        src={product.image_url || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-800">{product.name}</div>
                                    <div className="text-sm text-gray-500">{product.brand}</div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-800">¥{product.price?.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className="text-yellow-500">⭐ {product.review_score}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{product.category}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleVisibility(product)}
                                        className="text-gray-600 hover:text-primary-600"
                                    >
                                        {(product as any).is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingProduct(product)
                                                setModalOpen(true)
                                            }}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <ProductModal
                    product={editingProduct}
                    types={types}
                    onClose={() => setModalOpen(false)}
                    onSave={() => {
                        setModalOpen(false)
                        fetchData()
                    }}
                />
            )}
        </div>
    )
}
