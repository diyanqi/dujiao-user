<template>
  <div class="min-h-screen theme-page pt-24 pb-16">
    <div class="container mx-auto px-4">
      <div class="mb-8 border-b-4 border-[var(--ui-border)] pb-6">
        <h1 class="mb-2 text-4xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono flex items-center gap-4">
          <span class="w-4 h-10 bg-[var(--ui-accent)]"></span>
          {{ t('cart.title') }}
        </h1>
        <p class="text-sm font-bold text-[var(--ui-text-muted)] uppercase tracking-widest font-mono">{{ t('cart.subtitle') }}</p>
      </div>

      <div class="mb-8 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4 shadow-[8px_8px_0px_var(--ui-accent)]">
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="step in flowSteps"
            :key="step.key"
            class="text-center py-3 font-bold uppercase tracking-widest font-mono text-sm border-2 transition-all duration-300"
            :class="step.active
              ? 'border-[var(--ui-accent)] bg-[var(--ui-accent)] text-[var(--ui-text-on-accent)] shadow-[4px_4px_0px_var(--ui-accent-soft)]'
              : 'border-[var(--ui-border)] bg-transparent text-[var(--ui-text-muted)]'"
          >
            {{ step.label }}
          </div>
        </div>
      </div>

      <div
        v-if="cartItems.length === 0"
        class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-16 text-center shadow-[8px_8px_0px_var(--ui-accent)]"
      >
        <p class="mb-8 text-xl font-bold text-[var(--ui-text-muted)] uppercase tracking-widest font-mono">{{ t('cart.empty') }}</p>
        <router-link
          to="/products"
          class="inline-block px-8 py-4 theme-btn-primary font-bold uppercase tracking-widest text-lg"
        >
          {{ t('cart.emptyAction') }}
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <article
            v-for="item in cartItems"
            :key="cartItemKey(item)"
            class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-6 shadow-[8px_8px_0px_var(--ui-accent)] transition-transform hover-scale"
          >
            <div class="flex gap-6">
              <div
                class="h-32 w-32 flex-shrink-0 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)]"
              >
                <img v-if="item.image" :src="item.image" class="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                <div v-else class="flex h-full w-full items-center justify-center text-[var(--ui-text-muted)]">
                  <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div class="flex-1">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <router-link
                      :to="`/products/${item.slug}`"
                      class="text-xl font-black text-[var(--ui-text-primary)] hover:text-[var(--ui-accent)] transition-colors uppercase tracking-wide"
                    >
                      {{ getLocalizedText(item.title) }}
                    </router-link>
                    <p class="mt-2 text-sm font-bold text-[var(--ui-text-muted)] font-mono">{{ t('cart.priceLabel') }}：<span class="text-[var(--ui-accent)]">{{ formatPrice(item.priceAmount, totalCurrency) }}</span></p>
                    <p v-if="itemSkuDisplay(item)" class="mt-1 text-xs font-bold text-[var(--ui-text-muted)] font-mono">{{ t('cart.skuLabel') }}：<span class="text-[var(--ui-text-primary)]">{{ itemSkuDisplay(item) }}</span></p>
                    <p v-if="itemStockHint(item)" class="mt-1 text-xs font-bold text-[var(--ui-warning)] font-mono">{{ itemStockHint(item) }}</p>
                    <div class="mt-4 flex flex-wrap gap-3">
                      <span
                        class="border border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-2 py-1 text-[10px] font-black uppercase tracking-widest"
                        :class="item.purchaseType === 'guest'
                          ? 'border-[var(--ui-warning)] text-[var(--ui-warning)]'
                          : 'border-[var(--ui-success)] text-[var(--ui-success)]'"
                      >
                        {{ item.purchaseType === 'guest' ? t('productPurchase.guest') : t('productPurchase.member') }}
                      </span>
                      <span
                        class="border border-[var(--ui-info)] bg-[var(--ui-info-soft)] text-[var(--ui-info)] px-2 py-1 text-[10px] font-black uppercase tracking-widest"
                        :class="item.fulfillmentType === 'auto'
                          ? 'border-[var(--ui-info)] text-[var(--ui-info)]'
                          : 'border-[var(--ui-text-muted)] text-[var(--ui-text-muted)]'"
                      >
                        {{ item.fulfillmentType === 'auto' ? t('products.fulfillmentType.auto') : t('products.fulfillmentType.manual') }}
                      </span>
                    </div>
                  </div>
                  <button
                    @click="cartStore.removeItem(item.productId, item.skuId)"
                    class="text-sm font-bold text-[var(--ui-text-muted)] hover:text-[var(--ui-danger)] transition-colors uppercase tracking-widest font-mono border-b-2 border-transparent hover:border-[var(--ui-danger)] pb-1"
                  >
                    {{ t('cart.remove') }}
                  </button>
                </div>

                <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[var(--ui-border)] pt-4">
                  <div class="flex items-center gap-3">
                    <button
                      @click="updateQty(item, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="h-10 w-10 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] text-[var(--ui-text-primary)] font-black hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--ui-border)] disabled:hover:text-[var(--ui-text-primary)]"
                    >
                      -
                    </button>
                    <span class="min-w-[40px] text-center text-lg font-black font-mono text-[var(--ui-text-primary)]">{{ item.quantity }}</span>
                    <button
                      @click="updateQty(item, item.quantity + 1)"
                      :disabled="item.quantity >= itemMaxQuantity(item)"
                      class="h-10 w-10 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] text-[var(--ui-text-primary)] font-black hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--ui-border)] disabled:hover:text-[var(--ui-text-primary)]"
                    >
                      +
                    </button>
                  </div>

                  <div class="text-right">
                    <p class="text-xs font-bold uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('checkout.previewTotal') }}</p>
                    <p class="text-xl font-black text-[var(--ui-accent)] font-mono">{{ itemSubtotal(item) }}</p>
                  </div>
                </div>
                <p v-if="quantityWarning(item)" class="mt-4 border-2 border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] px-4 py-3 text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_var(--ui-warning)]">
                  {{ quantityWarning(item) }}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div class="h-fit border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 lg:sticky lg:top-24 shadow-[8px_8px_0px_var(--ui-accent)]">
          <h2 class="mb-6 text-xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono border-b-2 border-[var(--ui-border)] pb-4">{{ t('cart.summaryTitle') }}</h2>
          <div class="space-y-4 text-sm font-bold text-[var(--ui-text-muted)] font-mono">
            <div class="flex items-center justify-between">
              <span class="uppercase tracking-widest">{{ t('cart.itemsCount') }}</span>
              <span class="font-black text-[var(--ui-text-primary)] text-lg">{{ totalItems }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="uppercase tracking-widest">{{ t('cart.totalLabel') }}</span>
              <span class="font-black text-2xl text-[var(--ui-accent)]">{{ formatPrice(totalAmount, totalCurrency) }}</span>
            </div>
            <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] p-4 text-xs uppercase tracking-wider leading-relaxed">
              {{ t('cart.disclaimer') }}
            </div>
          </div>

          <div class="mt-8 space-y-4">
            <router-link
              to="/checkout"
              class="block w-full text-center px-6 py-4 theme-btn-primary font-bold uppercase tracking-widest text-lg"
            >
              {{ t('cart.checkout') }}
            </router-link>
            <router-link
              to="/products"
              class="block w-full text-center px-6 py-4 border-2 border-[var(--ui-border)] bg-transparent text-[var(--ui-text-primary)] font-bold uppercase tracking-widest text-lg hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors"
            >
              {{ t('cart.emptyAction') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore, type CartItem } from '../stores/cart'
import { useAppStore } from '../stores/app'
import { amountToCents, centsToAmount, parseInteger } from '../utils/money'
import { buildSkuDisplayText, normalizeSkuId } from '../utils/sku'
import { refreshCartStockSnapshots } from '../utils/cartStock'

const cartStore = useCartStore()
const appStore = useAppStore()
const { t } = useI18n()

const cartItems = computed(() => cartStore.items)
const totalItems = computed(() => cartStore.totalItems)
const quantityWarnings = ref<Record<string, string>>({})
const totalAmount = computed(() => {
  const totalCents = cartItems.value.reduce((sum, item) => {
    const amountCents = amountToCents(item.priceAmount)
    const qty = parseInteger(item.quantity)
    if (amountCents === null || qty === null) return sum
    return sum + amountCents * qty
  }, 0)
  return centsToAmount(totalCents)
})
const siteCurrency = computed(() => {
  const raw = String(appStore.config?.currency || '').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(raw) ? raw : ''
})
const totalCurrency = computed(() => {
  if (siteCurrency.value) {
    return siteCurrency.value
  }
  return 'CNY'
})

const flowSteps = computed(() => ([
  { key: 'cart', label: t('cart.title'), active: true },
  { key: 'checkout', label: t('checkout.title'), active: false },
  { key: 'payment', label: t('payment.title'), active: false },
]))

const getLocalizedText = (jsonData: any) => {
  if (!jsonData) return ''
  const locale = appStore.locale
  return jsonData[locale] || jsonData['zh-CN'] || jsonData['en-US'] || ''
}

const formatPrice = (amount: any, currency: any) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  if (currency === null || currency === undefined || currency === '') {
    return String(amount)
  }
  return `${amount} ${currency}`
}

const itemSubtotal = (item: CartItem) => {
  const amountCents = amountToCents(item.priceAmount)
  const qty = parseInteger(item.quantity)
  if (amountCents === null || qty === null) {
    return formatPrice('-', totalCurrency.value)
  }
  return formatPrice(centsToAmount(amountCents * qty), totalCurrency.value)
}

const updateQty = (item: CartItem, qty: number) => {
  const key = cartItemKey(item)
  quantityWarnings.value[key] = ''
  const max = itemMaxQuantity(item)
  if (qty > max) {
    if (max <= 0) {
      quantityWarnings.value[key] = t('cart.stockOut')
    } else {
      quantityWarnings.value[key] = t('cart.stockExceeded', { count: max })
    }
    return
  }
  cartStore.updateQuantity(item.productId, qty, item.skuId)
}

const cartItemKey = (item: CartItem) => `${item.productId}:${normalizeSkuId(item.skuId)}`

const itemSkuDisplay = (item: CartItem) => buildSkuDisplayText({
  skuCode: item.skuCode,
  specValues: item.skuSpecValues,
  fallback: t('productDetail.skuFallback'),
  locale: appStore.locale,
})

const normalizeStockNumber = (value: unknown) => {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return 0
  return Math.max(Math.floor(numberValue), 0)
}

const hasItemStockSnapshot = (item: CartItem) => Boolean(String(item.skuStockSnapshotAt || '').trim())

const shouldEnforceItemStock = (item: CartItem) => {
  if (item.fulfillmentType !== 'manual') return false
  if (!hasItemStockSnapshot(item)) return false
  if (item.skuStockEnforced === true) return true
  const code = String(item.skuCode || '').trim().toUpperCase()
  const total = normalizeStockNumber(item.skuManualStockTotal)
  if (total > 0) return true
  return Boolean(code && code !== 'DEFAULT')
}

const itemAvailableStock = (item: CartItem) => {
  if (!shouldEnforceItemStock(item)) return null
  const total = normalizeStockNumber(item.skuManualStockTotal)
  const locked = normalizeStockNumber(item.skuManualStockLocked)
  const sold = normalizeStockNumber(item.skuManualStockSold)
  return Math.max(total - locked - sold, 0)
}

const itemMaxQuantity = (item: CartItem) => {
  const available = itemAvailableStock(item)
  if (available === null) return 99
  return Math.max(Math.min(available, 99), 0)
}

const itemStockHint = (item: CartItem) => {
  const available = itemAvailableStock(item)
  if (available === null) return ''
  if (available <= 0) return t('cart.stockOut')
  return t('cart.stockRemaining', { count: available })
}

const quantityWarning = (item: CartItem) => quantityWarnings.value[cartItemKey(item)] || ''

onMounted(() => {
  void refreshCartStockSnapshots(cartStore)
})
</script>
