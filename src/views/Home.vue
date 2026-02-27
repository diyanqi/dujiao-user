<template>
  <div class="home-page min-h-screen theme-page overflow-x-hidden">
    <section class="relative overflow-hidden border-b border-[var(--ui-border)]">
      <div class="absolute inset-0 pointer-events-none">
        <div class="cyber-grid absolute inset-0 opacity-40"></div>
        <div class="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[var(--ui-accent)]/20 blur-3xl animate-float-a"></div>
        <div class="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-[var(--ui-info)]/20 blur-3xl animate-float-b"></div>
        <div class="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[var(--ui-warning)]/20 blur-3xl animate-float-c"></div>
      </div>

      <div class="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
        <div class="grid gap-8 lg:grid-cols-12 items-stretch">
          <div class="lg:col-span-7 flex flex-col justify-center">
            <div class="inline-flex items-center gap-2 w-fit px-3 py-1.5 border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]/70 backdrop-blur-md mb-5">
              <span class="h-2 w-2 rounded-full bg-[var(--ui-success)] animate-pulse"></span>
              <span class="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--ui-text-secondary)]">{{ heroBadge || t('home.hero.welcome') }}</span>
            </div>

            <h1 class="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.04] mb-5 text-[var(--ui-text-primary)] animate-title-in">
              <span class="block cyber-text">{{ heroTitle }}</span>
            </h1>

            <p class="text-[15px] sm:text-lg text-[var(--ui-text-secondary)] max-w-2xl mb-8 animate-fade-up delay-150">
              {{ heroSubtitle || t('home.hero.subtitle') }}
            </p>

            <div class="flex flex-wrap items-center gap-3 animate-fade-up delay-300">
              <button
                @click="goToHeroLink"
                class="px-6 py-3 border border-[var(--ui-accent)] bg-[var(--ui-accent)] text-[var(--ui-text-on-accent)] font-bold uppercase tracking-[0.08em] hover:translate-y-[-2px] hover:shadow-[0_0_24px_var(--ui-accent-soft)] transition"
              >
                {{ heroPrimaryButtonText || t('common.explore') }}
              </button>
              <router-link
                to="/products"
                class="px-6 py-3 border border-[var(--ui-border-strong)] text-[var(--ui-text-primary)] font-bold uppercase tracking-[0.08em] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition"
              >
                {{ t('common.viewAll') }}
              </router-link>
            </div>

            <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl animate-fade-up delay-450">
              <div class="cyber-stat">
                <p class="cyber-stat-label">{{ t('home.stats.activeUsers') }}</p>
                <p class="cyber-stat-value">12K+</p>
              </div>
              <div class="cyber-stat">
                <p class="cyber-stat-label">{{ t('home.stats.premiumProducts') }}</p>
                <p class="cyber-stat-value">300+</p>
              </div>
              <div class="cyber-stat">
                <p class="cyber-stat-label">{{ t('home.stats.uptime') }}</p>
                <p class="cyber-stat-value">99.9%</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 animate-fade-up delay-500">
            <div class="cyber-panel p-4 md:p-5 h-full">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm md:text-base font-bold uppercase tracking-[0.14em] text-[var(--ui-text-primary)]">{{ t('home.featured.title') }}</h2>
                <span class="text-[11px] text-[var(--ui-text-muted)] uppercase tracking-[0.14em]">Live</span>
              </div>

              <div v-if="loading" class="space-y-3">
                <div v-for="i in 3" :key="i" class="h-24 border border-[var(--ui-border)] bg-[var(--ui-bg-soft)] animate-pulse"></div>
              </div>

              <div v-else-if="heroProducts.length" class="space-y-3">
                <article
                  v-for="product in heroProducts"
                  :key="product.id"
                  class="group grid grid-cols-[84px_1fr_auto] gap-3 p-2.5 border border-[var(--ui-border)] bg-[var(--ui-bg-elevated)]/85 hover:border-[var(--ui-accent)] cursor-pointer transition"
                  @click="goToProduct(product.slug)"
                >
                  <div class="h-20 w-[84px] bg-[var(--ui-bg-soft)] overflow-hidden">
                    <img
                      v-if="product.images && getFirstImageUrl(product.images)"
                      :src="getFirstImageUrl(product.images)"
                      :alt="getLocalizedText(product.title)"
                      class="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-[var(--ui-text-muted)] uppercase tracking-widest mb-1 truncate">{{ getLocalizedText(product.category?.name) || t('products.uncategorized') }}</p>
                    <h3 class="text-sm font-bold text-[var(--ui-text-primary)] line-clamp-2">{{ getLocalizedText(product.title) }}</h3>
                  </div>
                  <div class="text-right self-center">
                    <p class="text-sm font-black text-[var(--ui-accent)]">{{ formatMoney(getDisplayPriceCents(product), product.currency) }}</p>
                    <p class="text-[10px] text-[var(--ui-text-muted)] uppercase mt-1">{{ t('products.buy') }}</p>
                  </div>
                </article>
              </div>

              <div v-else class="py-8 text-center text-sm text-[var(--ui-text-muted)] border border-dashed border-[var(--ui-border)]">
                {{ t('home.featured.empty') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70">
        <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--ui-text-muted)]">{{ t('home.hero.scrollToProducts') }}</span>
        <div class="w-px h-8 bg-gradient-to-b from-[var(--ui-accent)] to-transparent"></div>
      </div>
    </section>

    <div class="border-y border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] py-3 overflow-hidden">
      <div class="marquee-row">
        <div class="marquee-track">
          <template v-for="i in 2" :key="i">
            <div v-for="j in 8" :key="`${i}-${j}`" class="inline-flex items-center gap-3 mx-6">
              <span class="text-lg md:text-xl font-black tracking-tight text-[var(--ui-text-muted)]/80" style="font-family: 'Orbitron', sans-serif;">
                {{ appStore.config?.brand?.site_name || 'MMI.ZONE' }}
              </span>
              <span class="h-1.5 w-1.5 bg-[var(--ui-accent)]"></span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <section class="py-14 md:py-20 relative">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h2 class="text-3xl md:text-5xl font-black text-[var(--ui-text-primary)] tracking-tight">{{ t('home.featured.title') }}</h2>
            <p class="mt-2 text-sm md:text-base text-[var(--ui-text-secondary)]">{{ t('home.featured.description') }}</p>
          </div>
          <router-link
            to="/products"
            class="text-xs md:text-sm font-bold uppercase tracking-[0.14em] border-b border-[var(--ui-text-primary)] text-[var(--ui-text-primary)] hover:text-[var(--ui-accent)] hover:border-[var(--ui-accent)] transition"
          >
            {{ t('home.featured.viewAll') }}
          </router-link>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
          <div class="lg:col-span-7 lg:row-span-2 border border-[var(--ui-border)] bg-[var(--ui-bg-soft)] animate-pulse"></div>
          <div v-for="i in 4" :key="i" class="lg:col-span-5 border border-[var(--ui-border)] bg-[var(--ui-bg-soft)] animate-pulse"></div>
        </div>

        <div v-else-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
          <article
            class="lg:col-span-7 lg:row-span-2 cyber-product-card"
            @click="goToProduct(products[0].slug)"
          >
            <img
              v-if="products[0].images && getFirstImageUrl(products[0].images)"
              :src="getFirstImageUrl(products[0].images)"
              :alt="getLocalizedText(products[0].title)"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
            <div class="absolute left-4 right-4 bottom-4 z-10 flex items-end justify-between gap-3">
              <div class="min-w-0">
                <span class="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-black mb-2">{{ t('home.featured.highlight') }}</span>
                <h3 class="text-xl md:text-3xl font-black text-white line-clamp-2">{{ getLocalizedText(products[0].title) }}</h3>
              </div>
              <div class="text-right shrink-0">
                <p class="text-lg md:text-2xl font-black text-[var(--ui-accent)]">{{ formatMoney(getDisplayPriceCents(products[0]), products[0].currency) }}</p>
                <p class="text-[10px] uppercase tracking-widest text-white/80">{{ t('products.buy') }}</p>
              </div>
            </div>
          </article>

          <article
            v-for="product in sideProducts"
            :key="product.id"
            class="lg:col-span-5 cyber-product-card-sm"
            @click="goToProduct(product.slug)"
          >
            <div class="grid grid-cols-[100px_1fr] h-full">
              <div class="bg-[var(--ui-bg-soft)] overflow-hidden">
                <img
                  v-if="product.images && getFirstImageUrl(product.images)"
                  :src="getFirstImageUrl(product.images)"
                  :alt="getLocalizedText(product.title)"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="p-3 md:p-4 flex flex-col justify-between min-w-0 bg-[var(--ui-bg-elevated)]">
                <div>
                  <p class="text-[10px] uppercase tracking-widest text-[var(--ui-text-muted)] mb-1">{{ getLocalizedText(product.category?.name) || t('products.uncategorized') }}</p>
                  <h3 class="text-sm md:text-base font-bold text-[var(--ui-text-primary)] line-clamp-2">{{ getLocalizedText(product.title) }}</h3>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-sm md:text-base font-black text-[var(--ui-accent)]">{{ formatMoney(getDisplayPriceCents(product), product.currency) }}</p>
                  <span class="text-[10px] uppercase tracking-widest text-[var(--ui-text-muted)]">{{ t('products.fulfillmentType.auto') }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="border border-dashed border-[var(--ui-border)] py-14 text-center text-[var(--ui-text-muted)]">
          {{ t('home.featured.empty') }}
        </div>
      </div>
    </section>

    <section class="pb-16 md:pb-20">
      <div class="container mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div class="cyber-feature-card">
            <h3>{{ t('home.features.instant.title') }}</h3>
            <p>{{ t('home.features.instant.desc') }}</p>
          </div>
          <div class="cyber-feature-card">
            <h3>{{ t('home.features.secure.title') }}</h3>
            <p>{{ t('home.features.secure.desc') }}</p>
          </div>
          <div class="cyber-feature-card">
            <h3>{{ t('home.features.support.title') }}</h3>
            <p>{{ t('home.features.support.desc') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { bannerAPI, productAPI } from '../api'
import { useAppStore } from '../stores/app'

const { t, locale } = useI18n()
const router = useRouter()
const appStore = useAppStore()

const loading = ref(true)
const products = ref<any[]>([])
const banners = ref<any[]>([])

const heroBanner = computed(() => banners.value[0] || null)
const heroTitle = computed(() => heroBanner.value?.title || t('home.hero.title'))
const heroSubtitle = computed(() => heroBanner.value?.subtitle || t('home.hero.subtitle'))
const heroBadge = computed(() => heroBanner.value?.badge_text || '')
const heroPrimaryButtonText = computed(() => heroBanner.value?.primary_button_text)

const heroProducts = computed(() => products.value.slice(0, 3))
const sideProducts = computed(() => products.value.slice(1, 5))

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
  if (raw.includes('.')) return Math.round(num * 100)
  if (Number.isInteger(num)) return num
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

const formatMoney = (amountCents: number, currency = 'CNY') => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format((Number.isFinite(amountCents) ? amountCents : 0) / 100)
}

const goToProduct = (slug: string) => {
  router.push(`/products/${slug}`)
}

const goToHeroLink = () => {
  if (heroBanner.value?.link_url) {
    window.location.href = heroBanner.value.link_url
  } else {
    router.push('/products')
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const [productsRes, bannersRes] = await Promise.all([
      productAPI.list({ page: 1, page_size: 8 }),
      bannerAPI.list({ position: 'home_hero', limit: 1 }),
    ])
    products.value = productsRes.data.data || []
    banners.value = bannersRes.data.data || []
  } catch (error) {
    console.error('Data load failed', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.cyber-grid {
  background-image:
    linear-gradient(to right, var(--ui-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ui-border) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(circle at center, black 35%, transparent 100%);
}

.cyber-panel {
  border: 1px solid var(--ui-border-strong);
  background:
    linear-gradient(135deg, color-mix(in oklab, var(--ui-bg-elevated) 88%, transparent), color-mix(in oklab, var(--ui-bg-soft) 84%, transparent));
  box-shadow: 0 0 0 1px color-mix(in oklab, var(--ui-accent) 22%, transparent), 0 10px 40px color-mix(in oklab, var(--ui-accent) 14%, transparent);
}

.cyber-text {
  text-shadow:
    0 0 14px color-mix(in oklab, var(--ui-accent) 55%, transparent),
    0 0 28px color-mix(in oklab, var(--ui-info) 35%, transparent);
}

.cyber-stat {
  border: 1px solid var(--ui-border);
  background: color-mix(in oklab, var(--ui-bg-elevated) 82%, transparent);
  padding: 10px 12px;
}

.cyber-stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ui-text-muted);
}

.cyber-stat-value {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 900;
  color: var(--ui-accent);
}

.marquee-row {
  width: 100%;
  overflow: hidden;
}

.marquee-track {
  width: max-content;
  display: flex;
  align-items: center;
  animation: marqueeMove 24s linear infinite;
}

.cyber-product-card,
.cyber-product-card-sm {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--ui-border-strong);
  cursor: pointer;
  transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
}

.cyber-product-card:hover,
.cyber-product-card-sm:hover {
  border-color: var(--ui-accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px color-mix(in oklab, var(--ui-accent) 18%, transparent);
}

.cyber-feature-card {
  border: 1px solid var(--ui-border);
  background: color-mix(in oklab, var(--ui-bg-elevated) 88%, transparent);
  padding: 18px;
}

.cyber-feature-card h3 {
  font-size: 15px;
  font-weight: 800;
  color: var(--ui-text-primary);
  margin-bottom: 8px;
}

.cyber-feature-card p {
  font-size: 14px;
  color: var(--ui-text-secondary);
}

.animate-title-in {
  animation: titleIn .9s cubic-bezier(.2, .8, .2, 1) both;
}

.animate-fade-up {
  animation: fadeUp .75s ease-out both;
}

.delay-150 { animation-delay: .15s; }
.delay-300 { animation-delay: .30s; }
.delay-450 { animation-delay: .45s; }
.delay-500 { animation-delay: .50s; }

.animate-float-a { animation: floatA 8s ease-in-out infinite; }
.animate-float-b { animation: floatB 10s ease-in-out infinite; }
.animate-float-c { animation: floatC 9s ease-in-out infinite; }

@keyframes titleIn {
  from { opacity: 0; transform: translateY(16px) scale(.98); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes floatA {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(18px, -12px); }
}

@keyframes floatB {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-14px, 12px); }
}

@keyframes floatC {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(0, -16px); }
}

@keyframes marqueeMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
