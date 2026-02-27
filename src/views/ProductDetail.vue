<template>
  <div
    class="product-detail-page min-h-screen theme-page pt-24 pb-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMCwgMjU1LCAyMDQsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')]">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse space-y-8">
        <div class="h-8 bg-[var(--ui-bg-soft)] border-2 border-[var(--ui-border)] w-1/3"></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="h-[500px] bg-[var(--ui-bg-soft)] border-2 border-[var(--ui-border)]"></div>
          <div class="space-y-6">
            <div class="h-10 bg-[var(--ui-bg-soft)] border-2 border-[var(--ui-border)] w-3/4"></div>
            <div class="h-6 bg-[var(--ui-bg-soft)] border-2 border-[var(--ui-border)] w-1/2"></div>
            <div class="h-32 bg-[var(--ui-bg-soft)] border-2 border-[var(--ui-border)]"></div>
          </div>
        </div>
      </div>

      <!-- Product Content -->
      <div v-else-if="product">
        <!-- Breadcrumb -->
        <nav class="mb-8 flex items-center space-x-3 text-xs font-black uppercase tracking-widest font-mono">
          <router-link to="/" class="text-[var(--ui-text-muted)] hover:text-[var(--ui-accent)] transition-colors">{{ t('nav.home')
          }}</router-link>
          <span class="text-[var(--ui-accent)]">//</span>
          <router-link to="/products" class="text-[var(--ui-text-muted)] hover:text-[var(--ui-accent)] transition-colors">{{
            t('nav.products') }}</router-link>
          <span class="text-[var(--ui-accent)]">//</span>
          <span class="text-[var(--ui-text-primary)] truncate max-w-[200px]">{{ getLocalizedText(product.title)
          }}</span>
        </nav>

        <!-- Main Info Card -->
        <div
          class="theme-panel border-2 border-[var(--ui-border)] mb-8 shadow-[8px_8px_0px_var(--ui-accent)] relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--ui-accent)] to-transparent opacity-50"></div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <!-- Product Images (Left) -->
            <div class="p-8 bg-[var(--ui-bg-soft)] border-r-2 border-[var(--ui-border)] relative overflow-hidden">
              <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwgMjU1LCAyMDQsIDAuMDUpIi8+Cjwvc3ZnPg==')]"></div>
              <div class="mb-6 relative group z-10">
                <img v-if="currentImage" :src="currentImage" :alt="getLocalizedText(product.title)"
                  class="w-full h-[400px] lg:h-[500px] object-cover border-2 border-[var(--ui-border)] shadow-[4px_4px_0px_var(--ui-border)] mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
                <div v-else
                  class="w-full h-[400px] lg:h-[500px] bg-[var(--ui-bg-elevated)] border-2 border-[var(--ui-border)] flex items-center justify-center shadow-[4px_4px_0px_var(--ui-border)]">
                  <svg class="w-24 h-24 text-[var(--ui-text-muted)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <!-- Thumbnail Gallery -->
              <div v-if="images.length > 1" class="grid grid-cols-5 gap-4 relative z-10">
                <div v-for="(image, index) in images" :key="index" @click="currentImage = image"
                  class="cursor-pointer overflow-hidden border-2 transition-all duration-300 aspect-w-1 aspect-h-1 hover-scale"
                  :class="currentImage === image ? 'border-[var(--ui-accent)] shadow-[2px_2px_0px_var(--ui-accent)] opacity-100' : 'border-[var(--ui-border)] opacity-60 hover:opacity-100 hover:border-[var(--ui-accent)]'">
                  <img :src="image" :alt="`Image ${index + 1}`" class="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal" />
                </div>
              </div>
            </div>

            <!-- Product Info (Right) -->
            <div class="p-8 lg:p-12 flex flex-col justify-center bg-[var(--ui-bg-elevated)]">
              <div class="mb-6">
                <div v-if="categoryName" class="mb-4 text-[10px] font-black uppercase tracking-widest text-[var(--ui-accent)] font-mono">
                  {{ t('productDetail.categoryLabel') }} // {{ categoryName }}
                </div>

                <div v-if="product.tags && product.tags.length > 0" class="mb-6 flex flex-wrap gap-3">
                  <span
                    v-for="(tag, index) in product.tags"
                    :key="index"
                    class="border border-[var(--ui-accent)] bg-[var(--ui-bg-elevated)] text-[var(--ui-accent)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--ui-accent)]"
                  >
                    {{ tag }}
                  </span>
                </div>

                <h1 class="mb-6 text-4xl font-black leading-tight theme-text-primary md:text-5xl uppercase tracking-wide" style="font-family: 'Space Grotesk', sans-serif;">
                  {{ getLocalizedText(product.title) }}
                </h1>

                <div class="mb-8 flex flex-wrap items-center gap-3">
                  <span
                    class="border border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center"
                    :class="product.purchase_type === 'guest'
                      ? 'border-[var(--ui-warning)] text-[var(--ui-warning)]'
                      : 'border-[var(--ui-success)] text-[var(--ui-success)]'"
                  >
                    <svg v-if="product.purchase_type === 'guest'" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
                      <circle cx="9.5" cy="7" r="3" stroke-width="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 8l2 2-2 2" />
                    </svg>
                    <svg v-else class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke-width="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11V8a5 5 0 0110 0v3" />
                    </svg>
                    {{ getPurchaseTypeLabel(product.purchase_type) }}
                  </span>

                  <span
                    class="border border-[var(--ui-info)] bg-[var(--ui-info-soft)] text-[var(--ui-info)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center"
                    :class="product.fulfillment_type === 'auto'
                      ? 'border-[var(--ui-info)] text-[var(--ui-info)]'
                      : 'border-[var(--ui-text-muted)] text-[var(--ui-text-muted)]'"
                  >
                    <svg v-if="product.fulfillment_type === 'auto'" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                    </svg>
                    <svg v-else class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3l3 3m-9.4 9.4l-4 1 1-4 9.9-9.9a2.1 2.1 0 013 3L8.3 18.7z" />
                    </svg>
                    {{ getFulfillmentTypeLabel(product.fulfillment_type) }}
                  </span>

                  <span
                    class="border border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                    :class="getStockBadgeClass(product.stock_status)"
                  >
                    {{ getStockStatusLabel(product) }}
                  </span>
                </div>

                <div class="mb-8 border-b-2 border-[var(--ui-border)] pb-8">
                  <div class="mb-3 flex flex-wrap items-center gap-3">
                    <span class="text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('products.price') }}</span>
                    <span v-if="!selectedSku && hasPromotionPrice(product)" class="border border-[var(--ui-danger)] bg-[var(--ui-danger)] text-[var(--ui-text-on-accent)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                      {{ t('products.promotionTag') }}
                    </span>
                  </div>
                  <div v-if="selectedSku" class="flex items-end gap-4">
                    <span
                      class="text-6xl font-black font-mono text-[var(--ui-accent)]" style="text-shadow: 2px 2px 0px var(--ui-accent-soft);">
                      {{ formatPrice(selectedSku.price_amount, siteCurrency) }}
                    </span>
                  </div>
                  <div v-else-if="hasPromotionPrice(product)" class="space-y-2">
                    <div class="flex flex-wrap items-end gap-4">
                      <span class="text-6xl font-black font-mono text-[var(--ui-danger)]" style="text-shadow: 2px 2px 0px var(--ui-danger-soft);">
                        {{ formatPrice(getPromotionPriceAmount(product), siteCurrency) }}
                      </span>
                      <span class="text-xl font-bold theme-text-muted opacity-80 line-through font-mono">
                        {{ formatPrice(product.price_amount, siteCurrency) }}
                      </span>
                    </div>
                    <p class="text-sm font-bold text-[var(--ui-danger)] uppercase tracking-wider">
                      {{ t('products.saveAmount') }} {{ formatPrice(getPromotionSaveAmount(product), siteCurrency) }}
                    </p>
                  </div>
                  <div v-else class="flex items-end gap-4">
                    <span
                      class="text-6xl font-black font-mono text-[var(--ui-accent)]" style="text-shadow: 2px 2px 0px var(--ui-accent-soft);">
                      {{ formatPrice(product.price_amount, siteCurrency) }}
                    </span>
                  </div>
                </div>

                <div v-if="activeSkus.length" class="mb-8">
                  <h2 class="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ui-accent)] font-mono">
                    {{ t('productDetail.skuTitle') }}
                  </h2>
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      v-for="sku in activeSkus"
                      :key="sku.id"
                      type="button"
                      class="flex flex-col items-start border-2 px-4 py-3 text-sm transition-all duration-300 hover-scale"
                      :class="[
                        normalizeSkuId(sku.id) === selectedSkuId ? 'border-[var(--ui-accent)] bg-[var(--ui-accent-soft)] text-[var(--ui-accent)] shadow-[4px_4px_0px_var(--ui-accent)] translate-x-1' : 'border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]',
                        isSkuPurchasable(sku) ? '' : 'cursor-not-allowed opacity-50 border-dashed',
                      ]"
                      :disabled="!isSkuPurchasable(sku)"
                      @click="selectedSkuId = normalizeSkuId(sku.id)"
                    >
                      <span class="font-bold leading-tight uppercase tracking-wide">{{ skuDisplayText(sku) }}</span>
                      <span
                        class="mt-2 border px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                        :class="skuStockBadgeClass(sku)"
                      >
                        {{ skuStockText(sku) }}
                      </span>
                    </button>
                  </div>
                  <p v-if="requiresSKUSelection" class="mt-3 text-xs font-bold text-[var(--ui-warning)] uppercase tracking-wider animate-pulse">
                    {{ t('productDetail.skuRequired') }}
                  </p>
                </div>

                <div class="mb-8">
                  <h2 class="mb-4 text-sm font-black uppercase tracking-widest text-[var(--ui-accent)] font-mono">
                    {{ t('productDetail.description') }}
                  </h2>
                  <p class="text-lg leading-relaxed theme-text-secondary font-medium border-l-4 border-[var(--ui-accent)] pl-4 bg-[var(--ui-bg-soft)] p-4">
                    {{ getLocalizedText(product.description) }}
                  </p>
                </div>
              </div>

              <!-- Purchase Actions -->
              <div class="mt-auto space-y-6">
                <p v-if="cannotPurchaseReason" class="border-2 border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] px-4 py-3 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0px_var(--ui-danger)]">
                  {{ cannotPurchaseReason }}
                </p>
                <p v-if="purchaseWarning" class="border-2 border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-4 py-3 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0px_var(--ui-warning)]">
                  {{ purchaseWarning }}
                </p>

                <div class="space-y-4">
                  <button v-if="requiresLogin" @click="goLogin"
                    class="w-full px-6 py-4 theme-btn-primary font-bold uppercase tracking-widest text-lg">
                    {{ t('productDetail.loginToBuy') }}
                  </button>
                  <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button @click="addToCart" :disabled="!canPurchase"
                      class="px-6 py-4 border-2 border-[var(--ui-accent)] bg-transparent text-[var(--ui-accent)] font-bold uppercase tracking-widest text-lg hover:bg-[var(--ui-accent)] hover:text-[var(--ui-text-on-accent)] transition-all duration-300 shadow-[4px_4px_0px_var(--ui-accent)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_var(--ui-accent)] disabled:hover:bg-transparent disabled:hover:text-[var(--ui-accent)]">
                      {{ t('productDetail.addToCart') }}
                    </button>
                    <button @click="buyNow" :disabled="!canPurchase"
                      class="px-6 py-4 theme-btn-primary font-bold uppercase tracking-widest text-lg disabled:cursor-not-allowed disabled:opacity-50">
                      {{ t('productDetail.buyNow') }}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Details Content Card -->
        <div v-if="product.content"
          class="theme-panel border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] mb-12 p-8 lg:p-12 relative shadow-[8px_8px_0px_var(--ui-accent)]">
          <h2
            class="text-2xl font-black mb-8 text-[var(--ui-accent)] flex items-center gap-4 border-b-4 border-[var(--ui-border)] pb-6 uppercase tracking-widest font-mono">
            <span class="w-4 h-8 bg-[var(--ui-accent)]"></span>
            {{ t('productDetail.details') }}
          </h2>
          <div v-html="processHtmlForDisplay(getLocalizedText(product.content))"
            class="prose prose-gray dark:prose-invert prose-lg max-w-none theme-prose font-mono">
          </div>
        </div>

        <!-- Back Button -->
        <div class="mb-12 text-center">
          <router-link to="/products"
            class="inline-flex items-center space-x-3 text-[var(--ui-text-muted)] hover:text-[var(--ui-accent)] transition-colors font-bold uppercase tracking-widest font-mono hover-scale">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{{ t('productDetail.backToProducts') }}</span>
          </router-link>
        </div>
      </div>

      <!-- Error State -->
      <div v-else
        class="text-center py-24 theme-panel border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] shadow-[8px_8px_0px_var(--ui-accent)]">
        <svg class="w-24 h-24 mx-auto text-[var(--ui-text-muted)] mb-8" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-[var(--ui-text-muted)] text-2xl mb-8 font-bold uppercase tracking-widest font-mono">
          {{ t('productDetail.notFound') }}
        </p>
        <router-link to="/products"
          class="inline-block theme-btn-primary px-8 py-4 font-bold uppercase tracking-widest text-lg">
          {{ t('productDetail.backToProducts') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { productAPI } from '../api'
import { getImageUrl } from '../utils/image'
import { processHtmlForDisplay } from '../utils/content'
import { useCartStore } from '../stores/cart'
import { useUserAuthStore } from '../stores/userAuth'
import { debounceAsync } from '../utils/debounce'
import { useHead } from '@unhead/vue'
import { amountToCents, centsToAmount } from '../utils/money'
import { buildSkuDisplayText, normalizeSkuId } from '../utils/sku'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const cartStore = useCartStore()
const userAuthStore = useUserAuthStore()

const loading = ref(true)
const product = ref<any>(null)
const currentImage = ref<string>('')
const selectedSkuId = ref(0)
const purchaseWarning = ref('')

const activeSkus = computed(() => {
  const rows = Array.isArray(product.value?.skus) ? product.value.skus : []
  return rows.filter((sku: any) => Boolean(sku?.is_active))
})

const selectedSku = computed(() => {
  if (selectedSkuId.value <= 0) return null
  return activeSkus.value.find((sku: any) => normalizeSkuId(sku?.id) === selectedSkuId.value) || null
})

const normalizeStockNumber = (value: unknown) => {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return 0
  return Math.max(Math.floor(numberValue), 0)
}

const isDefaultSkuCode = (sku: any) => {
  const code = String(sku?.sku_code || '').trim().toUpperCase()
  return !code || code === 'DEFAULT'
}

const shouldEnforceSkuStock = (sku: any) => {
  if (!sku) return false
  if (product.value?.fulfillment_type !== 'manual') return false
  const total = normalizeStockNumber(sku?.manual_stock_total)
  if (total > 0) return true
  if (!isDefaultSkuCode(sku)) return true
  return activeSkus.value.length > 1
}

const skuAvailableStock = (sku: any) => {
  if (!shouldEnforceSkuStock(sku)) return null
  const total = normalizeStockNumber(sku?.manual_stock_total)
  const locked = normalizeStockNumber(sku?.manual_stock_locked)
  const sold = normalizeStockNumber(sku?.manual_stock_sold)
  return Math.max(total - locked - sold, 0)
}

const isSkuPurchasable = (sku: any) => {
  const available = skuAvailableStock(sku)
  if (available === null) return true
  return available > 0
}

const skuStockText = (sku: any) => {
  const available = skuAvailableStock(sku)
  if (available === null) return t('productDetail.skuStockUnlimited')
  if (available <= 0) return t('productDetail.skuStockOut')
  return t('productDetail.skuStockRemaining', { count: available })
}

const skuStockBadgeClass = (sku: any) => {
  const available = skuAvailableStock(sku)
  if (available === null) return 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
  if (available <= 0) return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
  if (available <= 5) return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
  return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
}

const purchaseType = computed(() => product.value?.purchase_type || 'member')
const requiresLogin = computed(() => purchaseType.value === 'member' && !userAuthStore.isAuthenticated)
const requiresSKUSelection = computed(() => activeSkus.value.length > 1 && !selectedSku.value)
const canPurchase = computed(() => {
  if (!product.value) return false
  if (activeSkus.value.length === 0) return false
  if (product.value.is_sold_out) return false
  if (requiresSKUSelection.value) return false
  if (product.value.stock_status === 'out_of_stock') return false
  if (product.value.fulfillment_type !== 'manual') return true
  if (!selectedSku.value) return true
  return isSkuPurchasable(selectedSku.value)
})
const cannotPurchaseReason = computed(() => {
  if (!product.value) return ''
  if (requiresLogin.value) return ''
  if (requiresSKUSelection.value) return t('productDetail.skuRequired')
  if (canPurchase.value) return ''
  return t('productDetail.stockUnavailable')
})
const categoryName = computed(() => {
  const category = product.value?.category?.name
  return category ? getLocalizedText(category) : ''
})

const images = computed(() => {
  if (!product.value?.images) return []
  // 处理不同的数据格式
  let imageArray: string[] = []
  if (Array.isArray(product.value.images)) {
    imageArray = product.value.images
  } else if (product.value.images.images && Array.isArray(product.value.images.images)) {
    imageArray = product.value.images.images
  }
  // 将所有图片路径转换为完整 URL
  return imageArray.map(img => getImageUrl(img))
})

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

const getStockStatusLabel = (payload: any) => {
  const status = payload?.stock_status || ''
  if (status === 'unlimited') return t('products.stockStatus.unlimited')
  if (status === 'out_of_stock') return t('products.stockStatus.outOfStock')
  if (status === 'low_stock') {
    const count = Number(payload?.fulfillment_type === 'manual' ? payload?.manual_stock_available : payload?.auto_stock_available)
    if (Number.isFinite(count) && count > 0) {
      return t('products.stockStatus.lowStockCount', { count })
    }
    return t('products.stockStatus.lowStock')
  }
  return t('products.stockStatus.inStock')
}

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

const getPromotionPriceAmount = (payload: any) => payload?.promotion_price_amount

const hasPromotionPrice = (payload: any) => {
  if (!payload) return false
  const original = parsePriceAmount(payload.price_amount)
  const promotion = parsePriceAmount(payload.promotion_price_amount)
  if (original === null || promotion === null) return false
  return promotion >= 0 && promotion < original
}

const getPromotionSaveAmount = (payload: any) => {
  const original = parsePriceAmount(payload?.price_amount)
  const promotion = parsePriceAmount(payload?.promotion_price_amount)
  if (original === null || promotion === null || promotion >= original) {
    return '0.00'
  }
  return centsToAmount(original - promotion)
}

const skuDisplayText = (sku: any) => {
  return buildSkuDisplayText({
    skuCode: sku?.sku_code,
    specValues: sku?.spec_values,
    fallback: t('productDetail.skuFallback'),
    locale: appStore.locale,
  })
}

const syncSelectedSku = () => {
  const rows = activeSkus.value
  if (rows.length === 0) {
    selectedSkuId.value = 0
    return
  }
  if (rows.length === 1) {
    selectedSkuId.value = normalizeSkuId(rows[0]?.id)
    return
  }
  if (rows.some((sku: any) => normalizeSkuId(sku?.id) === selectedSkuId.value)) {
    return
  }
  const firstAvailable = rows.find((sku: any) => isSkuPurchasable(sku))
  if (firstAvailable) {
    selectedSkuId.value = normalizeSkuId(firstAvailable?.id)
    return
  }
  selectedSkuId.value = normalizeSkuId(rows[0]?.id)
}

const selectedCartQuantity = () => {
  if (!product.value || !selectedSku.value) return 0
  const productId = Number(product.value.id || 0)
  const skuId = normalizeSkuId(selectedSku.value?.id)
  if (productId <= 0 || skuId <= 0) return 0
  const matched = cartStore.items.find((item) => item.productId === productId && normalizeSkuId(item.skuId) === skuId)
  return Number(matched?.quantity || 0)
}

const addToCart = () => {
  if (!product.value) return
  if (!canPurchase.value) return
  purchaseWarning.value = ''
  if (requiresLogin.value) {
    router.push(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  const sku = selectedSku.value
  const available = skuAvailableStock(sku)
  if (available !== null) {
    const nextQuantity = selectedCartQuantity() + 1
    if (nextQuantity > available) {
      purchaseWarning.value = available > 0
        ? t('productDetail.addCartStockExceeded', { count: available })
        : t('productDetail.stockUnavailable')
      return
    }
  }
  cartStore.addItem({
    productId: product.value.id,
    skuId: normalizeSkuId(sku?.id),
    skuCode: String(sku?.sku_code || ''),
    skuSpecValues: (sku?.spec_values && typeof sku.spec_values === 'object') ? sku.spec_values : undefined,
    skuManualStockTotal: normalizeStockNumber(sku?.manual_stock_total),
    skuManualStockLocked: normalizeStockNumber(sku?.manual_stock_locked),
    skuManualStockSold: normalizeStockNumber(sku?.manual_stock_sold),
    skuStockEnforced: shouldEnforceSkuStock(sku),
    slug: product.value.slug,
    title: product.value.title,
    priceAmount: String(sku?.price_amount || product.value.price_amount || '0.00'),
    image: images.value[0],
    purchaseType: product.value.purchase_type,
    fulfillmentType: product.value.fulfillment_type,
    manualFormSchema: product.value.manual_form_schema || {},
    quantity: 1,
  })
}

const buyNow = () => {
  purchaseWarning.value = ''
  if (!canPurchase.value) return
  addToCart()
  if (purchaseWarning.value) return
  router.push('/checkout')
}

const goLogin = () => {
  router.push(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
}

const loadProduct = async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string
    const response = await productAPI.detail(slug)
    product.value = response.data.data || null
    if (images.value.length > 0) {
      currentImage.value = images.value[0] || ''
    }
    syncSelectedSku()
  } catch (error) {
    console.error('Failed to load product:', error)
    product.value = null
    selectedSkuId.value = 0
  } finally {
    loading.value = false
  }
}

const debouncedLoadProduct = debounceAsync(loadProduct, 300)

useHead({
  title: () => product.value ? getLocalizedText(product.value.title) : undefined,
  meta: () => {
    if (!product.value) return []
    const seoMeta = product.value.seo_meta || {}
    const tags = []

    // Standard SEO Tags
    if (seoMeta.keywords) tags.push({ name: 'keywords', content: seoMeta.keywords })
    if (seoMeta.description) tags.push({ name: 'description', content: seoMeta.description })

    // Open Graph Tags
    tags.push({ property: 'og:type', content: 'website' })
    if (product.value.title) {
      tags.push({ property: 'og:title', content: getLocalizedText(product.value.title) })
    }
    if (seoMeta.description) {
      tags.push({ property: 'og:description', content: seoMeta.description })
    }
    if (images.value && images.value.length > 0) {
      tags.push({ property: 'og:image', content: images.value[0] })
    }
    tags.push({ property: 'og:url', content: window.location.href })

    // Twitter Card Tags
    tags.push({ name: 'twitter:card', content: 'summary_large_image' })
    if (product.value.title) {
      tags.push({ name: 'twitter:title', content: getLocalizedText(product.value.title) })
    }
    if (seoMeta.description) {
      tags.push({ name: 'twitter:description', content: seoMeta.description })
    }
    if (images.value && images.value.length > 0) {
      tags.push({ name: 'twitter:image', content: images.value[0] })
    }

    return tags
  }
})

onMounted(() => {
  debouncedLoadProduct()
})

watch(
  () => selectedSkuId.value,
  () => {
    purchaseWarning.value = ''
  }
)

onUnmounted(() => {
  debouncedLoadProduct.cancel()
})
</script>
