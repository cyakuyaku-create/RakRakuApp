export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            diagnostic_types: {
                Row: {
                    id: string
                    type_name: string
                    type_name_en: string
                    character_image_url: string | null
                    description: string | null
                    axes_scores: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    type_name: string
                    type_name_en: string
                    character_image_url?: string | null
                    description?: string | null
                    axes_scores: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    type_name?: string
                    type_name_en?: string
                    character_image_url?: string | null
                    description?: string | null
                    axes_scores?: Json
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    image_url: string | null
                    description: string | null
                    price: number | null
                    amazon_link: string | null
                    rakuten_link: string | null
                    review_score: number | null
                    review_count: number | null
                    category: string | null
                    brand: string | null
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    image_url?: string | null
                    description?: string | null
                    price?: number | null
                    amazon_link?: string | null
                    rakuten_link?: string | null
                    review_score?: number | null
                    review_count?: number | null
                    category?: string | null
                    brand?: string | null
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    image_url?: string | null
                    description?: string | null
                    price?: number | null
                    amazon_link?: string | null
                    rakuten_link?: string | null
                    review_score?: number | null
                    review_count?: number | null
                    category?: string | null
                    brand?: string | null
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            product_type_mapping: {
                Row: {
                    id: string
                    product_id: string
                    type_id: string
                    priority: number
                }
                Insert: {
                    id?: string
                    product_id: string
                    type_id: string
                    priority?: number
                }
                Update: {
                    id?: string
                    product_id?: string
                    type_id?: string
                    priority?: number
                }
            }
            questions: {
                Row: {
                    id: string
                    question_number: number
                    question_text: string
                    axis_type: string
                    weight: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    question_number: number
                    question_text: string
                    axis_type: string
                    weight?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    question_number?: number
                    question_text?: string
                    axis_type?: string
                    weight?: number
                    created_at?: string
                }
            }
        }
    }
}
