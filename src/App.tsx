import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DiagnosisPage from './pages/DiagnosisPage'
import ResultPage from './pages/ResultPage'
import LoginPage from './pages/admin/LoginPage'
import ProductsPage from './pages/admin/ProductsPage'
import TypesPage from './pages/admin/TypesPage'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ユーザー向け画面 */}
                <Route path="/" element={<DiagnosisPage />} />
                <Route path="/result" element={<ResultPage />} />

                {/* 管理画面 */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/admin/products" replace />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="types" element={<TypesPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
