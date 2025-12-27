import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')




// Image Optimization Helper
export const getOptimizedImageUrl = (url: string | null | undefined, width = 400) => {
    if (!url) return url || '/placeholder.png'
    return `${url}?width=${width}&quality=80`
}

// User-requested type definitions
export interface DiagnosticType {
    id: string
    type_name: string
    type_name_en: string
    character_image_url: string | null
    description: string | null
    axes_scores: {
        cost: number
        brand: number
        trend: number
        practicality: number
        design: number
        time_saving: number
    }
}

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
    is_visible: boolean
}

export interface Question {
    id: string
    question_number: number
    question_text: string
    axis_type: string
    weight: number
}
