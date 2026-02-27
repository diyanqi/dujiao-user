<template>
  <div class="products-page min-h-screen pt-24 pb-12 theme-page">
    <div class="container mx-auto px-6">
      
      <!-- Header & Filters -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-6xl font-black text-[var(--ui-text-primary)] uppercase tracking-tighter mb-8 animate-fade-in-up">
          {{ t('products.title') }}
        </h1>
        
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in-up delay-200">
           <!-- Categories Tabs -->
           <div class="flex flex-wrap gap-2">
              <button 
                @click="currentCategory = null"
                :class="[
                  'px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all border',
                  currentCategory === null 
                    ? 'bg-[var(--ui-text-primary)] text-[var(--ui-bg-page)] border-[var(--ui-text-primary)]' 
                    : 'bg-transparent text-[var(--ui-text-secondary)] border-[var(--ui-border)] hover:border-[var(--ui-text-primary)]'
                ]"
              >
                {{ t('products.all') }}
              </button>
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="currentCategory = cat.id"
                :class="[
                  'px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all border',
                  currentCategory === cat.id
                    ? 'bg-[var(--ui-text-primary)] text-[var(--ui-bg-page)] border-[var(--ui-text-primary)]' 
                    : 'bg-transparent text-[var(--ui-text-secondary)] border-[var(--ui-border)] hover:border-[var(--ui-text-primary)]'
                ]"
              >
                {{ getLocalizedText(cat.name) }}
              </button>
           </div>
           
           <!-- Search -->
           <div class="relative w-full lg:w-72 group">
              <input 
                v-model="searchQuery" 
                type="text" 
                :placeholder="t('products.searchPlaceholder')" 
                class="w-full bg-[var(--ui-bg-elevated)] border border-[var(--ui-border)] rounded-full py-3 px-5 pr-12 text-sm font-medium focus:outline-none focus:border-[var(--ui-text-primary)] transition-colors"
                @keyup.enter="handleSearch"
              />
              <button 
                @click="handleSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ui-text-muted)] group-hover:text-[var(--ui-text-primary)] transition-colors"
              >
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
           </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="h-[360px] bg-[var(--ui-bg-elevated)] rounded-none animate-pulse border border-[var(--ui-border)]"></div>
      </div>

      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <article 
          v-for="product in products" 
          :key="product.id"
          class="group relative bg-[var(--ui-bg-elevated)] border border-[var(--ui-border)] overflow-hidden cursor-pointer hover:border-[var(--ui-accent)] hover:shadow-lg transition-all duration-300 flex flex-col h-[420px]"
          @click="goToProduct(product.slug)"
        >
          <!-- Image Area -->
          <div class="relative h-[240px] overflow-hidden bg-[var(--ui-bg-soft)]">
            <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                 <span v-if="product.stock_control && product.stock_count <= 0" class="px-2 py-1 bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {{ t('products.stockStatus.outOfStock') }}
                </span>
                <span v-else-if="product.type === 'automated'" class="px-2 py-1 bg-[var(--ui-bg-page)]/80 backdrop-blur text-[var(--ui-text-primary)] text-[10px] font-bold uppercase tracking-wider border border-[var(--ui-border)] w-max">
                  {{ t('products.fulfillmentType.auto') }}
                </span>
            </div>

            <img
              v-if="product.images && getFirstImageUrl(product.images)"
              :src="getFirstImageUrl(product.images)"
              :alt="getLocalizedText(product.title)"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-[var(--ui-bg-soft)] text-[var(--ui-text-muted)]" v-else>
               <svg class="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
          </div>
          
          <!-- Content Area -->
          <div class="p-5 flex-1 flex flex-col justify-between bg-[var(--ui-bg-elevated)] relative z-20">
             <div>
                <div class="text-[10px] font-bold text-[var(--ui-text-muted)] uppercase tracking-widest mb-2 group-hover:text-[var(--ui-accent)] transition-colors">
                  {{ getLocalizedText(product.category?.name) || t('products.uncategorized') }}
                </div>
                <h3 class="text-lg font-bold text-[var(--ui-text-primary)] leading-tight line-clamp-2">
                  {{ getLocalizedText(product.title) }}
                </h3>
             </div>
             
             <div class="mt-4 pt-4 border-t border-[var(--ui-border)] flex items-center justify-between">
                <div>
                   <span class="block text-xl font-bold text-[var(--ui-text-primary)]">
                  {{ formatMoney(getDisplayPriceCents(product), product.currency) }}
                   </span>
                 <span v-if="hasOriginalPrice(product)" class="text-xs text-[var(--ui-text-muted)] line-through">
                   {{ formatMoney(getOriginalPriceCents(product), product.currency) }}
                   </span>
                </div>
                <button class="w-10 h-10 rounded-full bg-[var(--ui-bg-soft)] flex items-center justify-center text-[var(--ui-text-primary)] group-hover:bg-[var(--ui-accent)] group-hover:text-white transition-all">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
             </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="py-24 text-center">
         <div class="w-24 h-24 mx-auto bg-[var(--ui-bg-soft)] rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-[var(--ui-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
         </div>
         <h3 class="text-xl font-bold text-[var(--ui-text-primary)] mb-2">{{ t('products.noProducts') }}</h3>
         <button @click="resetFilters" class="text-[var(--ui-accent)] hover:underline">{{ t('products.resetFilters') }}</button>
      </div>
      
      <!-- Pagination -->
       <div v-if="totalPages > 1" class="mt-16 flex justify-center gap-2">
          <button 
            @click="page = Math.max(1, page - 1)"
            :disabled="page === 1"
            class="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--ui-border)] disabled:opacity-30 hover:bg-[var(--ui-bg-soft)] transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <button 
             v-for="p in totalPages" 
             :key="p"
             @click="page = p"
             :class="[
               'w-10 h-10 flex items-center justify-center rounded-full border text-sm font-bold transition-colors',
               page === p 
                 ? 'bg-[var(--ui-text-primary)] text-[var(--ui-bg-page)] border-[var(--ui-text-primary)]' 
                 : 'border-[var(--ui-border)] hover:bg-[var(--ui-bg-soft)]'
             ]"
          >
            {{ p }}
          </button>
          
          <button 
            @click="page = Math.min(totalPages, page + 1)"
            :disabled="page === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--ui-border)] disabled:opacity-30 hover:bg-[var(--ui-bg-soft)] transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
       </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { productAPI, categoryAPI } from '../api'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const products = ref<any[]>([])
const categories = ref<any[]>([])
const currentCategory = ref<number | null>(null)
const searchQuery = ref('')
const page = ref(1)
const pageSize = 12
const totalPages = ref(1)

// Initialize from URL params
if (route.query.category) {
  currentCategory.value = Number(route.query.category)
}
if (route.query.q) {
  searchQuery.value = route.query.q as string
}

const getLocalizedText = (obj: any): string => {
  if (!obj) return ''
  if (typeof obj === 'string') {
    const raw = obj.trim()
    if (raw.startsWith('{') && raw.endsWith('}')) {
      try {
        const parsed = JSON.parse(raw)
        const lang = locale.value
        return parsed?.[lang] || parsed?.['zh-CN'] || parsed?.['en-US'] || ''
      } catch {
        return obj
      }
    }
    return obj
  }
  const lang = locale.value
  return obj[lang] || obj['zh-CN'] || obj['en-US'] || ''
}

const getFirstImageUrl = (imageUrls: string[] | string): string => {
  if (Array.isArray(imageUrls)) {
    return imageUrls[0] ?? ''
  }
  return imageUrls || ''
}

const parseAmountToCents = (value: any): number | null => {
  if (value === null || value === undefined || value === '') return null
  const raw = String(value).trim()
  if (!raw) return null
  const num = Number(raw)
  if (!Number.isFinite(num)) return null
  if (raw.includes('.')) {
    return Math.round(num * 100)
  }
  if (Number.isInteger(num)) {
    return num
  }
  return Math.round(num * 100)
}

const getSkuMinPriceCents = (product: any): number | null => {
  const skus = Array.isArray(product?.skus) ? product.skus : []
  const cents = skus
    .map((sku: any) => parseAmountToCents(sku?.price_amount))
    .filter((value: number | null): value is number => value !== null && value > 0)
  if (cents.length === 0) return null
  return Math.min(...cents)
}

const getDisplayPriceCents = (product: any): number => {
  const promotion = parseAmountToCents(product?.promotion_price_amount)
  const base = parseAmountToCents(product?.price_amount)
  const skuMin = getSkuMinPriceCents(product)

  if (promotion !== null && promotion > 0) return promotion
  if (base !== null && base > 0) return base
  if (skuMin !== null && skuMin > 0) return skuMin
  if (base !== null) return base
  if (promotion !== null) return promotion
  return 0
}

const getOriginalPriceCents = (product: any): number => {
  const original = parseAmountToCents(product?.original_price)
  if (original !== null) return original
  const base = parseAmountToCents(product?.price_amount)
  if (base !== null) return base
  return getDisplayPriceCents(product)
}

const hasOriginalPrice = (product: any): boolean => {
  const original = getOriginalPriceCents(product)
  const display = getDisplayPriceCents(product)
  return original > display
}

const formatMoney = (amountCents: number, currency = 'CNY') => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format((Number.isFinite(amountCents) ? amountCents : 0) / 100)
}

const goToProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const resetFilters = () => {
    currentCategory.value = null
    searchQuery.value = ''
    page.value = 1
}

const handleSearch = () => {
    page.value = 1
    fetchProducts()
}

const fetchCategories = async () => {
  try {
    const res = await categoryAPI.list()
    categories.value = res.data.data
  } catch (error) {
    console.error('Failed to load categories', error)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const params: any = {
      page: page.value,
      page_size: pageSize
    }
    
    if (currentCategory.value) {
      params.category_id = currentCategory.value
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const res = await productAPI.list(params)
    products.value = res.data.data
    
    if (res.data.pagination) {
       totalPages.value = res.data.pagination.total_page || 1
    }
  } catch (error) {
    console.error('Failed to load products', error)
  } finally {
    loading.value = false
  }
}

watch([currentCategory, page], () => {
  fetchProducts()
  // Update URL
  const query: any = {}
  if (currentCategory.value) query.category = currentCategory.value
  if (searchQuery.value) query.q = searchQuery.value
  if (page.value > 1) query.page = page.value
  router.replace({ query })
})

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.delay-200 { animation-delay: 200ms; }
</style>
