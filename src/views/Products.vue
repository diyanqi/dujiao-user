<template>
  <div
    class="products-page min-h-screen theme-page pt-20 pb-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMCwgMjU1LCAyMDQsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')]">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="mb-12 mt-12 text-center relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-[var(--ui-accent)] blur-[100px] opacity-30"></div>
        <h1 class="text-4xl md:text-6xl font-black mb-4 tracking-widest uppercase theme-text-primary relative z-10" style="font-family: 'Orbitron', sans-serif; text-shadow: 4px 4px 0px var(--ui-accent);">{{ t('nav.products') }}</h1>
        <p
          class="theme-text-secondary max-w-2xl mx-auto text-lg border-b-2 border-[var(--ui-border)] pb-8 font-bold uppercase tracking-wider relative z-10">
          {{ t('products.subtitle') }}
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar - Categories -->
        <aside class="lg:w-64 flex-shrink-0">
          <div
            class="theme-panel border-2 border-[var(--ui-border)] p-6 sticky top-24 shadow-[6px_6px_0px_var(--ui-accent)]">
            <div class="mb-6">
              <label class="text-xs font-black uppercase tracking-widest text-[var(--ui-accent)] mb-2 block">
                {{ t('products.searchLabel') }}
              </label>
              <div class="mt-3 flex items-center gap-2">
                <input v-model="searchQuery" type="text"
                  class="min-w-0 flex-1 form-input border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] focus:border-[var(--ui-accent)] focus:ring-0 rounded-none font-mono"
                  :placeholder="t('products.searchPlaceholder')" />
                <button v-if="searchQuery" type="button" @click="clearSearch"
                  class="shrink-0 whitespace-nowrap px-3 py-2.5 border-2 border-[var(--ui-danger)] text-[var(--ui-danger)] hover:bg-[var(--ui-danger)] hover:text-[var(--ui-text-on-accent)] text-xs font-bold uppercase tracking-widest transition-colors">
                  {{ t('common.cancel') }}
                </button>
              </div>
            </div>
            <h2 class="text-lg font-black mb-6 theme-text-primary flex items-center gap-3 uppercase tracking-widest" style="font-family: 'Orbitron', sans-serif;">
              <span class="w-3 h-3 bg-[var(--ui-success)] animate-pulse"></span>
              {{ t('products.categories') }}
            </h2>
            <ul class="space-y-3">
              <li>
                <button @click="selectedCategory = null"
                  class="w-full text-left px-4 py-3 transition-all duration-300 border-2 font-bold uppercase tracking-wider"
                  :class="selectedCategory === null
                    ? 'border-[var(--ui-accent)] bg-[var(--ui-accent-soft)] text-[var(--ui-accent)] shadow-[4px_4px_0px_var(--ui-accent)] translate-x-1'
                    : 'border-[var(--ui-border)] text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]'">
                  {{ t('products.allCategories') }}
                </button>
              </li>
              <li v-for="category in categories" :key="category.id">
                <button @click="selectedCategory = category.id"
                  class="w-full text-left px-4 py-3 transition-all duration-300 border-2 font-bold uppercase tracking-wider"
                  :class="selectedCategory === category.id
                    ? 'border-[var(--ui-accent)] bg-[var(--ui-accent-soft)] text-[var(--ui-accent)] shadow-[4px_4px_0px_var(--ui-accent)] translate-x-1'
                    : 'border-[var(--ui-border)] text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]'">
                  {{ getLocalizedText(category.name) }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main Content - Products Grid -->
        <main class="flex-1">
          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="i in 6" :key="i"
              class="bg-[var(--ui-bg-soft)] border-2 border-[var(--ui-border)] h-[400px] animate-pulse">
            </div>
          </div>

          <!-- Products Grid -->
          <div v-else-if="products.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div v-for="product in products" :key="product.id"
                class="group relative theme-panel border-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
                :class="isSoldOut(product)
                  ? 'opacity-85 grayscale-[0.25] saturate-50 border-[var(--ui-danger)]'
                  : 'border-[var(--ui-border)] hover:border-[var(--ui-accent)] hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--ui-accent)]'"
                @click="goToProduct(product.slug)">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--ui-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
                <!-- Image Area -->
                <div class="h-56 overflow-hidden theme-surface-muted relative shrink-0 border-b-2 border-[var(--ui-border)] group-hover:border-[var(--ui-accent)] transition-colors">
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-[var(--ui-bg-elevated)] to-transparent opacity-60 z-10">
                  </div>
                  <img v-if="product.images && getFirstImageUrl(product.images)" :src="getFirstImageUrl(product.images)"
                    :alt="getLocalizedText(product.title)"
                    class="w-full h-full object-cover transform transition-transform duration-700 ease-out mix-blend-luminosity group-hover:mix-blend-normal"
                    :class="isSoldOut(product) ? 'grayscale brightness-75' : 'group-hover:scale-110'" />
                  <div v-else class="w-full h-full flex items-center justify-center theme-text-muted font-mono">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <div v-if="isSoldOut(product)" class="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm"></div>
                  <div v-if="isSoldOut(product)"
                    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 border-2 border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] px-4 py-2 text-sm font-black tracking-widest uppercase transform -rotate-12 shadow-[4px_4px_0px_var(--ui-danger)]">
                    {{ t('products.stockStatus.outOfStock') }}
                  </div>

                  <!-- Tags -->
                  <div v-if="!isSoldOut(product) && product.tags && product.tags.length > 0"
                    class="absolute top-4 right-4 z-20 flex flex-wrap gap-2 justify-end">
                    <span v-for="(tag, index) in product.tags.slice(0, 2)" :key="index"
                      class="border border-[var(--ui-accent)] bg-[var(--ui-bg-elevated)] text-[var(--ui-accent)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--ui-accent)]">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- Content Area -->
                <div class="p-6 relative z-20 flex flex-col flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwgMjU1LCAyMDQsIDAuMDUpIi8+Cjwvc3ZnPg==')]">
                  <div v-if="product.category?.name" class="text-[10px] text-[var(--ui-accent)] font-bold uppercase tracking-widest mb-2 font-mono">
                    {{ t('products.categoryLabel') }} // {{ getLocalizedText(product.category.name) }}
                  </div>
                  <h3
                    class="text-xl font-bold theme-text-primary mb-3 transition-colors line-clamp-2 uppercase tracking-wide" style="font-family: 'Space Grotesk', sans-serif;">
                    {{ getLocalizedText(product.title) }}
                  </h3>

                  <div class="mb-4 flex flex-wrap items-center gap-2">
                    <span
                      class="border border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="product.purchase_type === 'guest'
                        ? 'border-[var(--ui-warning)] text-[var(--ui-warning)]'
                        : 'border-[var(--ui-success)] text-[var(--ui-success)]'"
                    >
                      {{ getPurchaseTypeLabel(product.purchase_type) }}
                    </span>

                    <span
                      class="border border-[var(--ui-info)] bg-[var(--ui-info-soft)] text-[var(--ui-info)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="product.fulfillment_type === 'auto'
                        ? 'border-[var(--ui-info)] text-[var(--ui-info)]'
                        : 'border-[var(--ui-text-muted)] text-[var(--ui-text-muted)]'"
                    >
                      {{ getFulfillmentTypeLabel(product.fulfillment_type) }}
                    </span>

                    <span
                      class="border border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="getStockBadgeClass(product.stock_status)"
                    >
                      {{ getStockStatusLabel(product) }}
                    </span>
                  </div>

                  <p class="theme-text-secondary text-sm mb-6 line-clamp-2 font-medium border-l-2 border-[var(--ui-border)] pl-3">
                    {{ getLocalizedText(product.description) }}
                  </p>

                  <div
                    class="flex items-end justify-between border-t-2 border-[var(--ui-border)] pt-4 mt-auto">
                    <div class="flex flex-col">
                      <span class="text-[10px] theme-text-muted uppercase tracking-widest font-bold">{{ t('products.price', 'Price')
                      }}</span>
                      <span v-if="hasPromotionPrice(product)" class="text-2xl font-black text-[var(--ui-danger)] font-mono" style="text-shadow: 1px 1px 0px var(--ui-danger-soft);">
                        {{ formatPrice(getPromotionPriceAmount(product), siteCurrency) }}
                      </span>
                      <span v-else class="text-2xl font-black theme-text-primary font-mono" style="text-shadow: 1px 1px 0px var(--ui-accent-soft);">
                        {{ formatPrice(product.price_amount, siteCurrency) }}
                      </span>
                      <div v-if="hasPromotionPrice(product)" class="mt-1 flex flex-wrap items-center gap-2">
                        <span class="text-xs theme-text-muted opacity-80 line-through font-mono">{{ formatPrice(product.price_amount, siteCurrency) }}</span>
                        <span class="border border-[var(--ui-danger)] bg-[var(--ui-danger)] text-[var(--ui-text-on-accent)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          {{ t('products.promotionTag') }}
                        </span>
                      </div>
                    </div>

                    <span
                      class="text-xs uppercase font-black tracking-widest transition-colors flex items-center gap-2"
                      :class="isSoldOut(product)
                        ? 'text-[var(--ui-danger)]'
                        : 'text-[var(--ui-accent)] group-hover:text-[var(--ui-success)]'">
                      {{ t('common.viewDetails') }}
                      <svg class="w-5 h-5 transition-transform" :class="isSoldOut(product) ? '' : 'group-hover:translate-x-2'" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <nav
                class="flex items-center space-x-2 theme-panel-soft backdrop-blur-md p-2 rounded-2xl border">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                  class="w-10 h-10 flex items-center justify-center rounded-xl border theme-btn-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span class="px-4 py-2 font-mono theme-text-muted">
                  <span class="theme-text-primary font-bold">{{ currentPage }}</span>
                  <span class="mx-2 opacity-50">/</span>
                  <span>{{ totalPages }}</span>
                </span>

                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                  class="w-10 h-10 flex items-center justify-center rounded-xl border theme-btn-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else
            class="text-center py-20 border theme-panel-soft rounded-2xl backdrop-blur-sm">
            <svg class="w-20 h-20 mx-auto theme-text-muted mb-6" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="theme-text-muted text-lg">
              {{ t('products.empty') }}
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { productAPI, categoryAPI } from '../api'
import { getFirstImageUrl } from '../utils/image'
import { debounceAsync } from '../utils/debounce'
import { amountToCents } from '../utils/money'

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()

const loading = ref(true)
const products = ref<any[]>([])
const categories = ref<any[]>([])
const selectedCategory = ref<number | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const totalPages = ref(0)

const getLocalizedText = (jsonData: any) => {
  if (!jsonData) return ''
  const locale = appStore.locale
  return jsonData[locale] || jsonData['zh-CN'] || jsonData['en-US'] || ''
}

const siteCurrency = computed(() => {
  const raw = String(appStore.config?.currency || '').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(raw) ? raw : 'CNY'
})

const getPurchaseTypeLabel = (purchaseType: string) => {
  return purchaseType === 'guest' ? t('productPurchase.guest') : t('productPurchase.member')
}

const getFulfillmentTypeLabel = (fulfillmentType: string) => {
  return fulfillmentType === 'auto' ? t('products.fulfillmentType.auto') : t('products.fulfillmentType.manual')
}

const getStockBadgeClass = (status: string) => {
  switch (status) {
    case 'unlimited':
      return 'theme-badge-info'
    case 'low_stock':
      return 'theme-badge-warning'
    case 'out_of_stock':
      return 'theme-badge-danger'
    default:
      return 'theme-badge-success'
  }
}

const getStockStatusLabel = (product: any) => {
  const status = product?.stock_status || ''
  if (status === 'unlimited') return t('products.stockStatus.unlimited')
  if (status === 'out_of_stock') return t('products.stockStatus.outOfStock')
  if (status === 'low_stock') {
    const count = Number(product?.fulfillment_type === 'manual' ? product?.manual_stock_available : product?.auto_stock_available)
    if (Number.isFinite(count) && count > 0) {
      return t('products.stockStatus.lowStockCount', { count })
    }
    return t('products.stockStatus.lowStock')
  }
  return t('products.stockStatus.inStock')
}

const isSoldOut = (product: any) => Boolean(product?.is_sold_out || product?.stock_status === 'out_of_stock')

const formatPrice = (amount: any, currency: any) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  if (currency === null || currency === undefined || currency === '') {
    return String(amount)
  }
  return `${amount} ${currency}`
}

const parsePriceAmount = (amount: any) => {
  return amountToCents(amount)
}

const getPromotionPriceAmount = (product: any) => product?.promotion_price_amount

const hasPromotionPrice = (product: any) => {
  if (!product) return false
  const original = parsePriceAmount(product.price_amount)
  const promotion = parsePriceAmount(product.promotion_price_amount)
  if (original === null || promotion === null) return false
  return promotion >= 0 && promotion < original
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      page_size: pageSize.value,
    }
    if (selectedCategory.value) {
      params.category_id = selectedCategory.value
    }
    const keyword = searchQuery.value.trim()
    if (keyword) {
      params.search = keyword
    }
    const response = await productAPI.list(params)
    products.value = response.data.data || []
    if (response.data.pagination) {
      total.value = response.data.pagination.total || 0
      totalPages.value = response.data.pagination.total_page || 0
    }
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await categoryAPI.list()
    categories.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const debouncedLoadProducts = debounceAsync(loadProducts, 300)
const debouncedLoadCategories = debounceAsync(loadCategories, 250)

const goToProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  debouncedLoadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearSearch = () => {
  if (!searchQuery.value) return
  searchQuery.value = ''
  currentPage.value = 1
  debouncedLoadProducts()
}

watch(selectedCategory, () => {
  currentPage.value = 1
  debouncedLoadProducts()
})

watch(searchQuery, () => {
  currentPage.value = 1
  debouncedLoadProducts()
})

onMounted(async () => {
  await Promise.all([
    debouncedLoadCategories(),
    debouncedLoadProducts(),
  ])
})

onUnmounted(() => {
  debouncedLoadProducts.cancel()
  debouncedLoadCategories.cancel()
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
