<template>
  <div class="home-page min-h-screen theme-page">
    <section class="relative z-10 border-b theme-border pt-24 pb-10 overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMCwgMjU1LCAyMDQsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="relative overflow-hidden border-2 border-[var(--ui-accent)] bg-[var(--ui-bg-elevated)] shadow-[8px_8px_0px_var(--ui-accent)] group">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--ui-accent)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--ui-success)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--ui-accent)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--ui-success)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <img v-if="!bannerLoading && heroImage" :src="heroImage" class="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-r from-[var(--ui-bg-elevated)] via-[var(--ui-bg-elevated)]/80 to-transparent"></div>

            <div v-if="bannerLoading" class="relative flex min-h-[420px] flex-col justify-between p-8 md:p-12">
            <div class="mb-4 flex items-center justify-end">
              <span class="theme-badge theme-badge-inverse text-xs font-medium">
                {{ t('common.loading') }}
              </span>
            </div>

            <div class="space-y-4">
              <div class="h-6 w-28 animate-pulse bg-[var(--ui-border)]"></div>
              <div class="h-10 max-w-4xl animate-pulse bg-[var(--ui-border)] md:h-14"></div>
              <div class="h-5 max-w-3xl animate-pulse bg-[var(--ui-border)]"></div>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-6">
              <div class="h-11 w-36 animate-pulse bg-[var(--ui-border)]"></div>
              <div class="h-11 w-28 animate-pulse bg-[var(--ui-border)]"></div>
            </div>
          </div>

          <div v-else class="relative flex min-h-[420px] flex-col justify-between p-8 md:p-12">
            <div v-if="bannerCount > 1" class="mb-4 flex items-center justify-end gap-2">
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center border-2 border-[var(--ui-accent)] bg-[var(--ui-bg-elevated)] text-[var(--ui-accent)] transition hover:bg-[var(--ui-accent)] hover:text-[var(--ui-text-on-accent)] shadow-[2px_2px_0px_var(--ui-accent)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                @click="handlePrevHeroBanner"
                aria-label="上一张 Banner"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center border-2 border-[var(--ui-accent)] bg-[var(--ui-bg-elevated)] text-[var(--ui-accent)] transition hover:bg-[var(--ui-accent)] hover:text-[var(--ui-text-on-accent)] shadow-[2px_2px_0px_var(--ui-accent)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                @click="handleNextHeroBanner"
                aria-label="下一张 Banner"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="space-y-4 relative">
              <div class="absolute -left-4 top-0 bottom-0 w-1 bg-[var(--ui-accent)]"></div>
              <span class="inline-flex items-center gap-2 px-3 py-1 border border-[var(--ui-success)] bg-[var(--ui-success-soft)] text-[var(--ui-success)] text-xs font-bold uppercase tracking-widest">
                <span class="h-2 w-2 bg-[var(--ui-success)] animate-pulse"></span>
                {{ heroBadge }}
              </span>
              <h1 class="max-w-4xl text-4xl font-black tracking-widest text-[var(--ui-text-primary)] md:text-[3.5rem] uppercase" style="font-family: 'Orbitron', sans-serif; text-shadow: 3px 3px 0px var(--ui-accent), -3px -3px 0px var(--ui-success);">
                {{ heroTitle }}
              </h1>
              <p class="max-w-3xl text-base leading-relaxed text-[var(--ui-text-secondary)] md:text-lg font-medium border-l-2 border-[var(--ui-border)] pl-4">
                {{ heroSubtitle }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-4 pt-8">
              <button
                type="button"
                @click="goToHeroLink"
                class="theme-btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm"
              >
                {{ heroPrimaryButtonText }}
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <router-link
                v-if="!hasHeroLink"
                to="/products"
                class="inline-flex items-center border-2 border-[var(--ui-text-primary)] px-8 py-4 text-sm font-bold text-[var(--ui-text-primary)] uppercase tracking-widest transition hover:bg-[var(--ui-text-primary)] hover:text-[var(--ui-bg-page)] shadow-[4px_4px_0px_var(--ui-text-primary)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
              >
                {{ t('home.featured.viewAll') }}
              </router-link>
            </div>

            <div v-if="bannerCount > 1" class="mt-8 flex items-center gap-3">
              <button
                v-for="(_, index) in banners"
                :key="`hero-dot-${index}`"
                type="button"
                class="h-3 transition-all border border-[var(--ui-accent)]"
                :class="index === currentBannerIndex ? 'w-12 bg-[var(--ui-accent)] shadow-[0_0_10px_var(--ui-accent)]' : 'w-3 bg-transparent hover:bg-[var(--ui-accent-soft)]'"
                @click="selectHeroBanner(index)"
                :aria-label="`切换到第 ${index + 1} 张 Banner`"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="featured" class="relative z-10 py-14">
      <div class="container mx-auto px-4">
        <div class="mb-8 flex items-end justify-between gap-4 border-b-2 border-[var(--ui-border)] pb-4">
          <div>
            <h2 class="theme-section-heading text-3xl md:text-4xl uppercase tracking-widest" style="font-family: 'Orbitron', sans-serif; text-shadow: 2px 2px 0px var(--ui-accent);">{{ t('home.featured.title') }}</h2>
            <p class="mt-2 text-sm theme-text-secondary font-bold uppercase tracking-wider">{{ t('home.featured.description') }}</p>
          </div>
          <router-link
                v-if="!hasHeroLink"
                to="/products"
            class="text-sm font-bold theme-link-muted uppercase tracking-widest border border-[var(--ui-text-muted)] px-4 py-2 hover:bg-[var(--ui-text-muted)] hover:text-[var(--ui-bg-page)] transition-colors"
          >
            {{ t('home.featured.viewAll') }}
          </router-link>
        </div>

        <div v-if="products.length > 0" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="product in products"
            :key="product.id"
            class="group cursor-pointer overflow-hidden border-2 theme-panel transition-all duration-300 flex h-full flex-col relative"
            :class="isSoldOut(product)
              ? 'opacity-85 grayscale-[0.25] saturate-50 border-[var(--ui-danger)]'
              : 'hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--ui-accent)] border-[var(--ui-border)] hover:border-[var(--ui-accent)]'"
            @click="goToProduct(product.slug)"
          >
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--ui-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
            <div class="relative h-56 overflow-hidden theme-surface-muted shrink-0 border-b-2 border-[var(--ui-border)] group-hover:border-[var(--ui-accent)] transition-colors">
              <img
                v-if="product.images && getFirstImageUrl(product.images)"
                :src="getFirstImageUrl(product.images)"
                :alt="getLocalizedText(product.title)"
                class="h-full w-full object-cover transition duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                :class="isSoldOut(product) ? 'grayscale brightness-75' : 'group-hover:scale-110'"
              />
              <div v-else class="flex h-full items-center justify-center text-sm text-gray-400 font-mono">{{ t('home.featured.empty') }}</div>

              <div class="absolute inset-0 bg-gradient-to-t from-[var(--ui-bg-elevated)] to-transparent opacity-60"></div>

              <div v-if="isSoldOut(product)" class="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm"></div>
              <div
                v-if="isSoldOut(product)"
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 border-2 border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] px-4 py-2 text-sm font-black tracking-widest uppercase transform -rotate-12 shadow-[4px_4px_0px_var(--ui-danger)]"
              >
                {{ t('products.stockStatus.outOfStock') }}
              </div>

              <div v-if="!isSoldOut(product) && product.tags && product.tags.length > 0" class="absolute right-3 top-3 flex max-w-[70%] flex-wrap justify-end gap-2 z-20">
                <span
                  v-for="(tag, index) in product.tags.slice(0, 2)"
                  :key="index"
                  class="border border-[var(--ui-accent)] bg-[var(--ui-bg-elevated)] text-[var(--ui-accent)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--ui-accent)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="space-y-3 p-6 flex-1 flex flex-col bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwgMjU1LCAyMDQsIDAuMDUpIi8+Cjwvc3ZnPg==')]">
              <h3 class="line-clamp-2 text-lg font-bold theme-text-primary uppercase tracking-wide" style="font-family: 'Space Grotesk', sans-serif;">{{ getLocalizedText(product.title) }}</h3>

              <div class="flex flex-wrap items-center gap-2 mt-auto pt-4">
                <span
                  class="theme-badge"
                  :class="product.purchase_type === 'guest'
                    ? 'theme-badge-warning'
                    : 'theme-badge-success'"
                >
                  <svg v-if="product.purchase_type === 'guest'" class="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
                    <circle cx="9.5" cy="7" r="3" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 8l2 2-2 2" />
                  </svg>
                  <svg v-else class="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11V8a5 5 0 0110 0v3" />
                  </svg>
                  {{ getPurchaseTypeLabel(product.purchase_type) }}
                </span>

                <span
                  class="theme-badge"
                  :class="product.fulfillment_type === 'auto'
                    ? 'theme-badge-info'
                    : 'theme-badge-neutral'"
                >
                  <svg v-if="product.fulfillment_type === 'auto'" class="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                  <svg v-else class="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3l3 3m-9.4 9.4l-4 1 1-4 9.9-9.9a2.1 2.1 0 013 3L8.3 18.7z" />
                  </svg>
                  {{ getFulfillmentTypeLabel(product.fulfillment_type) }}
                </span>

                <span
                  class="border border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                  :class="getStockBadgeClass(product.stock_status)"
                >
                  {{ getStockStatusLabel(product) }}
                </span>
              </div>

              <p class="line-clamp-2 text-sm theme-text-secondary font-medium border-l-2 border-[var(--ui-border)] pl-2">{{ getLocalizedText(product.description) }}</p>
              <div class="pt-2 mt-auto">
                <div class="flex flex-col">
                  <span class="text-[10px] theme-text-muted uppercase tracking-widest font-bold">{{ t('products.price') }}</span>
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
              </div>
            </div>
          </article>
        </div>
        <div v-else class="border-2 border-dashed border-[var(--ui-border)] py-16 text-center theme-text-muted font-mono uppercase tracking-widest bg-[var(--ui-bg-soft)]">
          {{ t('home.featured.empty') }}
        </div>
      </div>
    </section>

    <section class="relative z-10 border-t-2 border-[var(--ui-border)] py-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMCwgMjU1LCAyMDQsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')]">
      <div class="container mx-auto px-4">
        <div class="mb-8 flex items-end justify-between gap-4 border-b-2 border-[var(--ui-border)] pb-4">
          <div>
            <h2 class="theme-section-heading text-[1.7rem] uppercase tracking-widest" style="font-family: 'Orbitron', sans-serif; text-shadow: 2px 2px 0px var(--ui-success);">{{ t('home.latest.title') }}</h2>
            <p class="mt-1 text-sm theme-text-secondary font-bold uppercase tracking-wider">{{ t('home.latest.description') }}</p>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <router-link to="/blog" class="font-bold theme-link-muted uppercase tracking-widest hover:text-[var(--ui-accent)] transition-colors">{{ t('nav.blog') }}</router-link>
            <router-link to="/notice" class="font-bold theme-link-muted uppercase tracking-widest hover:text-[var(--ui-accent)] transition-colors">{{ t('nav.notice') }}</router-link>
          </div>
        </div>

        <div v-if="posts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article
            v-for="post in posts"
            :key="post.id"
            class="group cursor-pointer border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[6px_6px_0px_var(--ui-success)] hover:border-[var(--ui-success)] relative overflow-hidden"
            @click="goToPost(post.slug)"
          >
            <div class="absolute top-0 right-0 w-8 h-8 bg-[var(--ui-success)] transform rotate-45 translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform"></div>
            <div class="mb-3 text-xs font-mono text-[var(--ui-success)] font-bold tracking-widest">{{ formatDate(post.created_at) }}</div>
            <h3 class="line-clamp-2 text-lg font-bold uppercase tracking-wide" style="font-family: 'Space Grotesk', sans-serif;">{{ getLocalizedText(post.title) }}</h3>
            <p class="mt-3 line-clamp-2 text-sm theme-text-secondary font-medium border-l-2 border-[var(--ui-border)] pl-3">{{ getLocalizedText(post.summary) }}</p>
            <div class="mt-6 text-sm font-bold text-[var(--ui-success)] uppercase tracking-widest group-hover:translate-x-2 transition-transform flex items-center gap-2">
              {{ t('blog.readMore') }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </article>
        </div>
        <div v-else class="border-2 border-dashed border-[var(--ui-border)] py-12 text-center theme-text-muted font-mono uppercase tracking-widest bg-[var(--ui-bg-soft)]">
          {{ t('blog.empty') }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { bannerAPI, postAPI, productAPI } from '../api'
import { getFirstImageUrl, getImageUrl } from '../utils/image'
import { debounceAsync } from '../utils/debounce'
import { amountToCents } from '../utils/money'

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()

const products = ref<any[]>([])
const posts = ref<any[]>([])
const banners = ref<any[]>([])
const bannerLoading = ref(true)

const currentBannerIndex = ref(0)
let heroAutoPlayTimer: ReturnType<typeof setInterval> | null = null

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

const bannerCount = computed(() => banners.value.length)

const heroBanner = computed(() => {
  if (banners.value.length === 0) return null
  if (currentBannerIndex.value >= banners.value.length) return banners.value[0]
  return banners.value[currentBannerIndex.value]
})



const goToBanner = (index: number) => {
  if (banners.value.length === 0) return
  const total = banners.value.length
  currentBannerIndex.value = ((index % total) + total) % total
}

const nextHeroBanner = () => {
  goToBanner(currentBannerIndex.value + 1)
}

const prevHeroBanner = () => {
  goToBanner(currentBannerIndex.value - 1)
}

const stopHeroAutoPlay = () => {
  if (heroAutoPlayTimer) {
    clearInterval(heroAutoPlayTimer)
    heroAutoPlayTimer = null
  }
}

const startHeroAutoPlay = () => {
  stopHeroAutoPlay()
  if (banners.value.length <= 1) return
  heroAutoPlayTimer = setInterval(() => {
    nextHeroBanner()
  }, 5000)
}

const handleNextHeroBanner = () => {
  nextHeroBanner()
  startHeroAutoPlay()
}

const handlePrevHeroBanner = () => {
  prevHeroBanner()
  startHeroAutoPlay()
}

const selectHeroBanner = (index: number) => {
  goToBanner(index)
  startHeroAutoPlay()
}

const heroImage = computed(() => {
  const banner = heroBanner.value
  if (!banner) return ''
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  if (isMobile && banner.mobile_image) {
    return getImageUrl(banner.mobile_image)
  }
  return getImageUrl(banner.image || banner.mobile_image || '')
})

const heroBadge = computed(() => {
  if (!heroBanner.value) return t('home.hero.badge')
  return getLocalizedText(heroBanner.value.title) || t('home.hero.badge')
})

const heroTitle = computed(() => {
  if (!heroBanner.value) return t('home.hero.title')
  return getLocalizedText(heroBanner.value.title) || t('home.hero.title')
})

const heroSubtitle = computed(() => {
  if (!heroBanner.value) return t('home.hero.subtitle')
  return getLocalizedText(heroBanner.value.subtitle) || t('home.hero.subtitle')
})

const heroLink = computed(() => {
  const banner = heroBanner.value
  if (!banner || banner.link_type === 'none') return ''
  return banner.link_value || ''
})

const hasHeroLink = computed(() => heroLink.value.trim().length > 0)

const heroPrimaryButtonText = computed(() => {
  if (!hasHeroLink.value) return t('home.hero.cta')
  const linkType = String(heroBanner.value?.link_type || '').toLowerCase()
  if (linkType === 'external') {
    return t('common.learnMore')
  }
  return t('common.viewDetails')
})

const heroOpenInNewTab = computed(() => Boolean(heroBanner.value?.open_in_new_tab))

const goToHeroLink = () => {
  if (!heroLink.value) {
    router.push('/products')
    return
  }
  const isExternal = /^https?:\/\//i.test(heroLink.value)
  if (isExternal || heroOpenInNewTab.value) {
    window.open(heroLink.value, heroOpenInNewTab.value ? '_blank' : '_self')
    return
  }
  router.push(heroLink.value)
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

const getPromotionPriceAmount = (product: any) => product?.promotion_price_amount

const hasPromotionPrice = (product: any) => {
  if (!product) return false
  const original = parsePriceAmount(product.price_amount)
  const promotion = parsePriceAmount(product.promotion_price_amount)
  if (original === null || promotion === null) return false
  return promotion >= 0 && promotion < original
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const goToProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const goToPost = (slug: string) => {
  router.push(`/blog/${slug}`)
}

const loadFeaturedProducts = async () => {
  try {
    const response = await productAPI.list({ page: 1, page_size: 9 })
    products.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const loadLatestPosts = async () => {
  try {
    const response = await postAPI.list({ page: 1, page_size: 3 })
    posts.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
}

const loadHeroBanners = async () => {
  bannerLoading.value = true
  try {
    const response = await bannerAPI.list({ position: 'home_hero', limit: 5 })
    banners.value = response.data.data || []
    currentBannerIndex.value = 0
    startHeroAutoPlay()
  } catch (error) {
    banners.value = []
    currentBannerIndex.value = 0
    stopHeroAutoPlay()
    console.error('Failed to load banners:', error)
  } finally {
    bannerLoading.value = false
  }
}

const debouncedLoadFeaturedProducts = debounceAsync(loadFeaturedProducts, 250)
const debouncedLoadLatestPosts = debounceAsync(loadLatestPosts, 250)
const debouncedLoadHeroBanners = debounceAsync(loadHeroBanners, 250)

onMounted(async () => {
  await Promise.all([debouncedLoadHeroBanners(), debouncedLoadFeaturedProducts(), debouncedLoadLatestPosts()])
})

onUnmounted(() => {
  debouncedLoadFeaturedProducts.cancel()
  debouncedLoadLatestPosts.cancel()
  debouncedLoadHeroBanners.cancel()
  stopHeroAutoPlay()
})
</script>
