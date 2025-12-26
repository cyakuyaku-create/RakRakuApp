import { Link, useNavigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Package, Image, LogOut } from 'lucide-react'

export default function AdminLayout() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-gray-800">GadgetMatch 管理画面</h1>
                        <nav className="flex gap-6">
                            <Link
                                to="/admin/products"
                                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                <Package size={20} />
                                商品管理
                            </Link>
                            <Link
                                to="/admin/types"
                                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                <Image size={20} />
                                タイプ管理
                            </Link>
                        </nav>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                    >
                        <LogOut size={20} />
                        ログアウト
                    </button>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    )
}
