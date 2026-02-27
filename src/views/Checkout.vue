<template>
  <div class="min-h-screen theme-page pt-24 pb-16">
    <div class="container mx-auto px-4">
      <div class="mb-8 border-b-4 border-[var(--ui-border)] pb-6">
        <h1 class="mb-2 text-4xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono flex items-center gap-4">
          <span class="w-4 h-10 bg-[var(--ui-accent)]"></span>
          {{ t('checkout.title') }}
        </h1>
        <p class="text-sm font-bold text-[var(--ui-text-muted)] uppercase tracking-widest font-mono">{{ t('checkout.subtitle') }}</p>
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
        <p class="mb-8 text-xl font-bold text-[var(--ui-text-muted)] uppercase tracking-widest font-mono">{{ t('checkout.empty') }}</p>
        <router-link
          to="/products"
          class="inline-block px-8 py-4 theme-btn-primary font-bold uppercase tracking-widest text-lg"
        >
          {{ t('checkout.emptyAction') }}
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="space-y-8 lg:col-span-2">
          <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]">
            <h2 class="mb-6 text-xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono border-b-2 border-[var(--ui-border)] pb-4">{{ t('checkout.itemsTitle') }}</h2>
            <div class="space-y-4">
              <div
                v-for="item in cartItems"
                :key="cartItemKey(item)"
                class="border-2 p-4 transition-all"
                :class="itemStockExceeded(item)
                  ? 'border-[var(--ui-warning)] bg-[var(--ui-warning-soft)]'
                  : 'border-[var(--ui-border)] bg-[var(--ui-bg-soft)]'"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <router-link
                      :to="`/products/${item.slug}`"
                      class="text-lg font-black text-[var(--ui-text-primary)] hover:text-[var(--ui-accent)] transition-colors uppercase tracking-wide"
                    >
                      {{ getLocalizedText(item.title) }}
                    </router-link>
                    <div class="mt-2 text-xs font-bold text-[var(--ui-text-muted)] font-mono">{{ t('checkout.quantityLabel') }}：<span class="text-[var(--ui-text-primary)]">{{ item.quantity }}</span></div>
                    <div v-if="itemSkuDisplay(item)" class="mt-1 text-xs font-bold text-[var(--ui-text-muted)] font-mono">{{ t('checkout.skuLabel') }}：<span class="text-[var(--ui-text-primary)]">{{ itemSkuDisplay(item) }}</span></div>
                    <div
                      v-if="itemStockHint(item)"
                      class="mt-1 text-xs font-bold font-mono"
                      :class="itemStockExceeded(item)
                        ? 'text-[var(--ui-warning)]'
                        : 'text-[var(--ui-text-muted)]'"
                    >
                      {{ itemStockHint(item) }}
                    </div>
                    <div class="mt-3 flex flex-wrap gap-3">
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
                  <div class="text-right">
                    <div class="text-xs font-bold uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('checkout.previewTotal') }}</div>
                    <div class="text-lg font-black text-[var(--ui-accent)] font-mono">{{ itemSubtotal(item) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="manualFormProducts.length"
            class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]"
          >
            <h2 class="mb-2 text-xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono border-b-2 border-[var(--ui-border)] pb-4">{{ t('checkout.manualFormTitle') }}</h2>
            <p class="mb-6 mt-4 text-sm font-bold text-[var(--ui-text-muted)] font-mono">{{ t('checkout.manualFormTip') }}</p>
            <div class="space-y-6">
              <div
                v-for="manualItem in manualFormProducts"
                :key="manualItem.itemKey"
                class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] p-6"
              >
                <h3 class="mb-4 text-lg font-black text-[var(--ui-text-primary)] uppercase tracking-wide">{{ manualItemTitle(manualItem) }}</h3>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div v-for="field in manualItem.fields" :key="`${manualItem.itemKey}-${field.key}`" class="space-y-2">
                    <label class="text-xs font-black text-[var(--ui-text-secondary)] uppercase tracking-widest font-mono">
                      {{ getManualFieldLabel(field) }}
                      <span v-if="field.required" class="ml-1 text-[var(--ui-danger)]">*</span>
                    </label>

                    <textarea
                      v-if="field.type === 'textarea'"
                      v-model="ensureManualFormRow(manualItem.itemKey)[field.key]"
                      rows="3"
                      class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
                      :placeholder="getManualFieldPlaceholder(field)"
                    />

                    <select
                      v-else-if="field.type === 'select'"
                      v-model="ensureManualFormRow(manualItem.itemKey)[field.key]"
                      class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
                    >
                      <option value="">{{ t('checkout.manualFormSelectPlaceholder') }}</option>
                      <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                    </select>

                    <div v-else-if="field.type === 'radio'" class="space-y-3 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] p-4">
                      <label v-for="option in field.options" :key="option" class="flex items-center gap-3 text-sm font-bold text-[var(--ui-text-primary)] font-mono cursor-pointer">
                        <input
                          v-model="ensureManualFormRow(manualItem.itemKey)[field.key]"
                          type="radio"
                          :name="`manual-radio-${manualItem.itemKey}-${field.key}`"
                          :value="option"
                          class="h-5 w-5 accent-[var(--ui-accent)]"
                        />
                        <span>{{ option }}</span>
                      </label>
                    </div>

                    <div v-else-if="field.type === 'checkbox'" class="space-y-3 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] p-4">
                      <label v-for="option in field.options" :key="option" class="flex items-center gap-3 text-sm font-bold text-[var(--ui-text-primary)] font-mono cursor-pointer">
                        <input
                          v-model="ensureManualFormRow(manualItem.itemKey)[field.key]"
                          type="checkbox"
                          :value="option"
                          class="h-5 w-5 accent-[var(--ui-accent)]"
                        />
                        <span>{{ option }}</span>
                      </label>
                    </div>

                    <input
                      v-else
                      v-model="ensureManualFormRow(manualItem.itemKey)[field.key]"
                      :type="field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'"
                      class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
                      :placeholder="getManualFieldPlaceholder(field)"
                    />

                    <p
                      v-if="submitAttempted && manualFieldError(manualItem.itemKey, field.key)"
                      class="text-xs font-bold text-[var(--ui-danger)] uppercase tracking-wider mt-1"
                    >
                      {{ manualFieldError(manualItem.itemKey, field.key) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]">
            <h2 class="mb-6 text-xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono border-b-2 border-[var(--ui-border)] pb-4">{{ t('checkout.couponTitle') }}</h2>
            <input
              v-model="couponCode"
              type="text"
              class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-6 py-4 text-lg font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors uppercase"
              :placeholder="t('checkout.couponPlaceholder')"
            />
          </div>

          <div
            v-if="!userAuthStore.isAuthenticated"
            class="space-y-6 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]"
          >
            <h2 class="text-xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono border-b-2 border-[var(--ui-border)] pb-4">{{ t('checkout.modeTitle') }}</h2>
            <div class="flex flex-wrap gap-4 mt-6">
              <button
                @click="checkoutMode = 'guest'"
                class="px-6 py-3 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-300"
                :class="checkoutMode === 'guest'
                  ? 'border-[var(--ui-accent)] bg-[var(--ui-accent)] text-[var(--ui-text-on-accent)] shadow-[4px_4px_0px_var(--ui-accent-soft)]'
                  : 'border-[var(--ui-border)] bg-transparent text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]'"
              >
                {{ t('checkout.guestPurchase') }}
              </button>
              <router-link
                to="/auth/login"
                class="px-6 py-3 font-bold uppercase tracking-widest text-sm border-2 border-[var(--ui-border)] bg-transparent text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-all duration-300"
              >
                {{ t('checkout.memberPurchase') }}
              </router-link>
            </div>

            <div v-if="checkoutMode === 'guest'" class="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
              <input
                v-model="guestEmail"
                type="email"
                class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
                :placeholder="t('checkout.guestEmailPlaceholder')"
              />
              <input
                v-model="guestPassword"
                type="password"
                class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
                :placeholder="t('checkout.guestPasswordPlaceholder')"
              />
            </div>

            <div v-if="checkoutMode === 'guest' && guestCaptchaEnabled" class="space-y-2 mt-6">
              <p class="text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('auth.common.captchaLabel') }}</p>
              <ImageCaptcha
                v-if="captchaProvider === 'image'"
                ref="guestImageCaptchaRef"
                v-model="guestCaptchaPayload"
                :disabled="submitting"
                @config-stale="handleGuestCaptchaConfigStale"
              />
              <TurnstileCaptcha
                v-else-if="captchaProvider === 'turnstile'"
                ref="guestTurnstileRef"
                v-model="guestTurnstileToken"
                :site-key="guestTurnstileSiteKey"
              />
            </div>

            <p v-if="checkoutMode === 'guest'" class="text-xs font-bold text-[var(--ui-text-muted)] font-mono mt-4">
              {{ t('checkout.guestTip') }}
            </p>
            <p v-if="checkoutMode === 'guest' && guestEmail && !guestEmailValid" class="text-xs font-bold text-[var(--ui-danger)] uppercase tracking-wider mt-2">
              {{ t('error.email_invalid') }}
            </p>
          </div>
        </div>

        <div class="h-fit border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 lg:sticky lg:top-24 shadow-[8px_8px_0px_var(--ui-accent)]">
          <h2 class="mb-6 text-xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono border-b-2 border-[var(--ui-border)] pb-4">{{ t('checkout.submitTitle') }}</h2>
          <div class="mb-6 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] p-4 text-xs font-bold text-[var(--ui-text-muted)] font-mono uppercase tracking-wider leading-relaxed">
            {{ t('checkout.submitHint') }}
          </div>

          <div class="mb-8 space-y-4 text-sm font-bold text-[var(--ui-text-muted)] font-mono">
            <div class="flex items-center justify-between">
              <span class="uppercase tracking-widest">{{ t('cart.itemsCount') }}</span>
              <span class="font-black text-[var(--ui-text-primary)] text-lg">{{ totalItems }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="uppercase tracking-widest">{{ t('checkout.previewOriginal') }}</span>
              <span class="font-black text-[var(--ui-text-primary)]">{{ formatPrice(previewOriginal, previewCurrency) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="uppercase tracking-widest">{{ t('checkout.previewCoupon') }}</span>
              <span class="font-black text-[var(--ui-success)]">{{ formatPrice(previewCoupon, previewCurrency) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="uppercase tracking-widest">{{ t('checkout.previewPromotion') }}</span>
              <span class="font-black text-[var(--ui-danger)]">{{ formatPrice(previewPromotion, previewCurrency) }}</span>
            </div>
            <div class="flex items-center justify-between border-t-2 border-[var(--ui-border)] pt-4 text-[var(--ui-text-primary)]">
              <span class="font-black uppercase tracking-widest">{{ t('checkout.previewTotal') }}</span>
              <span class="font-black text-2xl text-[var(--ui-accent)]">{{ formatPrice(previewTotal, previewCurrency) }}</span>
            </div>
          </div>

          <div v-if="previewLoading || couponRefreshing" class="mb-4 text-xs font-bold text-[var(--ui-accent)] uppercase tracking-widest animate-pulse">
            {{ previewStatusText }}
          </div>
          <div
            v-if="checkoutAlert"
            class="mb-6 border-2 px-4 py-3 text-sm font-bold uppercase tracking-wider"
            :class="checkoutAlert.level === 'error' ? 'border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] shadow-[4px_4px_0px_var(--ui-danger)]' : 'border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] shadow-[4px_4px_0px_var(--ui-warning)]'"
          >
            {{ checkoutAlert.message }}
          </div>

          <button
            @click="handleSubmit"
            :disabled="!canSubmit"
            class="block w-full text-center px-6 py-4 theme-btn-primary font-bold uppercase tracking-widest text-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ submitting ? t('checkout.submitting') : t('checkout.submitButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore, type CartItem } from '../stores/cart'
import { useAppStore } from '../stores/app'
import { useUserAuthStore } from '../stores/userAuth'
import { guestOrderAPI, userOrderAPI, type CaptchaPayload } from '../api'
import { debounceAsync } from '../utils/debounce'
import { pageAlertClass, type PageAlert } from '../utils/alerts'
import { amountToCents, centsToAmount, parseInteger } from '../utils/money'
import { buildSkuDisplayText, normalizeSkuId } from '../utils/sku'
import { refreshCartStockSnapshots } from '../utils/cartStock'
import ImageCaptcha from '../components/captcha/ImageCaptcha.vue'
import TurnstileCaptcha from '../components/captcha/TurnstileCaptcha.vue'

const router = useRouter()
const cartStore = useCartStore()
const appStore = useAppStore()
const userAuthStore = useUserAuthStore()
const { t } = useI18n()

const cartItems = computed(() => cartStore.items)
const totalItems = computed(() => cartStore.totalItems)
const couponCode = ref('')
const normalizedCouponCode = computed(() => couponCode.value.trim())
const submitting = ref(false)
const error = ref('')
const preview = ref<any>(null)
const previewLoading = ref(false)
const previewError = ref('')
const previewRequestId = ref(0)
const couponRefreshing = ref(false)
const syncingStock = ref(false)

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

const previewCurrency = computed(() => preview.value?.currency || totalCurrency.value)
const previewOriginal = computed(() => preview.value?.original_amount ?? totalAmount.value)
const previewCoupon = computed(() => preview.value?.discount_amount ?? '0')
const previewPromotion = computed(() => preview.value?.promotion_discount_amount ?? '0')
const previewTotal = computed(() => preview.value?.total_amount ?? totalAmount.value)

const checkoutMode = ref<'guest' | 'member'>('guest')
const guestEmail = ref('')
const guestPassword = ref('')
const guestCaptchaPayload = ref<CaptchaPayload>({})
const guestTurnstileToken = ref('')
const guestImageCaptchaRef = ref<InstanceType<typeof ImageCaptcha> | null>(null)
const guestTurnstileRef = ref<InstanceType<typeof TurnstileCaptcha> | null>(null)

interface ManualFormField {
  key: string
  type: string
  required: boolean
  label?: Record<string, string>
  placeholder?: Record<string, string>
  regex?: string
  min?: number
  max?: number
  max_len?: number
  options: string[]
}

interface ManualFormProduct {
  itemKey: string
  productId: number
  skuId: number
  skuCode: string
  skuSpecValues?: Record<string, any>
  title: any
  fields: ManualFormField[]
}

const manualFieldTypes = new Set(['text', 'textarea', 'phone', 'email', 'number', 'select', 'radio', 'checkbox'])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[0-9\-()\s]{6,20}$/
const findLastUnescapedSlash = (value: string) => {
  for (let index = value.length - 1; index > 0; index -= 1) {
    if (value[index] !== '/') {
      continue
    }
    let backslashes = 0
    for (let cursor = index - 1; cursor >= 0 && value[cursor] === '\\'; cursor -= 1) {
      backslashes += 1
    }
    if (backslashes % 2 === 0) {
      return index
    }
  }
  return -1
}

const compileManualRegex = (rawRegex?: string) => {
  const text = String(rawRegex || '').trim()
  if (!text) {
    return null
  }

  if (text.startsWith('/')) {
    const lastSlashIndex = findLastUnescapedSlash(text)
    if (lastSlashIndex > 0) {
      const pattern = text.slice(1, lastSlashIndex)
      const flags = text.slice(lastSlashIndex + 1)
      if (/^[gimsuy]*$/.test(flags)) {
        try {
          return new RegExp(pattern, flags)
        } catch {
          return null
        }
      }
    }
  }

  try {
    return new RegExp(text)
  } catch {
    return null
  }
}


const manualFormData = ref<Record<string, Record<string, any>>>({})
const submitAttempted = ref(false)

const normalizeManualFormSchema = (rawSchema: any): ManualFormField[] => {
  const rawFields = Array.isArray(rawSchema?.fields) ? rawSchema.fields : []
  return rawFields
    .map((rawField: any) => {
      const key = String(rawField?.key || '').trim()
      const type = String(rawField?.type || '').trim()
      if (!key || !manualFieldTypes.has(type)) {
        return null
      }
      const options = Array.isArray(rawField?.options)
        ? rawField.options.map((item: any) => String(item || '').trim()).filter(Boolean)
        : []
      const minValue = Number(rawField?.min)
      const maxValue = Number(rawField?.max)
      const maxLenValue = Number(rawField?.max_len)
      return {
        key,
        type,
        required: Boolean(rawField?.required),
        label: rawField?.label || undefined,
        placeholder: rawField?.placeholder || undefined,
        regex: String(rawField?.regex || '').trim() || undefined,
        min: Number.isFinite(minValue) ? minValue : undefined,
        max: Number.isFinite(maxValue) ? maxValue : undefined,
        max_len: Number.isFinite(maxLenValue) ? maxLenValue : undefined,
        options: Array.from(new Set(options)),
      } as ManualFormField
    })
    .filter(Boolean) as ManualFormField[]
}

const manualFormProducts = computed<ManualFormProduct[]>(() => cartItems.value
  .map((item) => {
    if (item.fulfillmentType !== 'manual') {
      return null
    }
    const fields = normalizeManualFormSchema(item.manualFormSchema)
    if (fields.length === 0) {
      return null
    }
    const skuId = normalizeSkuId(item.skuId)
    return {
      itemKey: `${item.productId}:${skuId}`,
      productId: item.productId,
      skuId,
      skuCode: String(item.skuCode || ''),
      skuSpecValues: item.skuSpecValues,
      title: item.title,
      fields,
    }
  })
  .filter(Boolean) as ManualFormProduct[])

watch(manualFormProducts, (products) => {
  const nextData: Record<string, Record<string, any>> = {}
  products.forEach((product) => {
    const key = product.itemKey
    const current = manualFormData.value[key] || {}
    const formValues: Record<string, any> = {}
    product.fields.forEach((field) => {
      const currentValue = current[field.key]
      if (field.type === 'checkbox') {
        formValues[field.key] = Array.isArray(currentValue)
          ? currentValue.map((item: any) => String(item)).filter(Boolean)
          : []
      } else {
        formValues[field.key] = currentValue == null ? '' : String(currentValue)
      }
    })
    nextData[key] = formValues
  })
  manualFormData.value = nextData
}, { immediate: true, deep: true })

const resolveLocalizedText = (jsonData?: Record<string, string>, fallback = '') => {
  if (!jsonData) return fallback
  const locale = appStore.locale
  return jsonData[locale] || jsonData['zh-CN'] || jsonData['en-US'] || fallback
}

const getManualFieldLabel = (field: ManualFormField) => {
  return resolveLocalizedText(field.label, field.key)
}

const getManualFieldPlaceholder = (field: ManualFormField) => {
  return resolveLocalizedText(field.placeholder, '')
}

const manualFieldErrorKey = (itemKey: string, fieldKey: string) => `${itemKey}:${fieldKey}`

const ensureManualFormRow = (itemKey: string) => {
  if (!manualFormData.value[itemKey]) {
    manualFormData.value[itemKey] = {}
  }
  return manualFormData.value[itemKey]
}

const manualFormValidation = computed(() => {
  const errors: Record<string, string> = {}
  let firstError = ''

  const setError = (itemKey: string, field: ManualFormField, message: string) => {
    const errorKey = manualFieldErrorKey(itemKey, field.key)
    if (!errors[errorKey]) {
      errors[errorKey] = message
      if (!firstError) {
        firstError = message
      }
    }
  }

  manualFormProducts.value.forEach((product) => {
    const values = manualFormData.value[product.itemKey] || {}
    product.fields.forEach((field) => {
      const fieldLabel = getManualFieldLabel(field)
      const rawValue = values[field.key]
      if (field.type === 'checkbox') {
        const list = Array.isArray(rawValue)
          ? rawValue.map((item: any) => String(item).trim()).filter(Boolean)
          : []
        if (field.required && list.length === 0) {
          setError(product.itemKey, field, t('checkout.manualFormFieldRequired', { name: fieldLabel }))
          return
        }
        if (list.length > 0 && field.options.length > 0 && list.some((item) => !field.options.includes(item))) {
          setError(product.itemKey, field, t('checkout.manualFormFieldOptionInvalid', { name: fieldLabel }))
        }
        return
      }

      const text = rawValue == null ? '' : String(rawValue).trim()
      if (field.required && !text) {
        setError(product.itemKey, field, t('checkout.manualFormFieldRequired', { name: fieldLabel }))
        return
      }
      if (!text) {
        return
      }

      if ((field.type === 'text' || field.type === 'textarea' || field.type === 'phone' || field.type === 'email') && field.max_len && text.length > field.max_len) {
        setError(product.itemKey, field, t('checkout.manualFormFieldMaxLength', { name: fieldLabel, max: field.max_len }))
        return
      }
      if ((field.type === 'phone' && !phonePattern.test(text)) || (field.type === 'email' && !emailPattern.test(text))) {
        setError(product.itemKey, field, t('checkout.manualFormFieldInvalid', { name: fieldLabel }))
        return
      }
      if (field.type === 'number') {
        const numberValue = Number(text)
        if (!Number.isFinite(numberValue)) {
          setError(product.itemKey, field, t('checkout.manualFormFieldNumberInvalid', { name: fieldLabel }))
          return
        }
        if ((field.min !== undefined && numberValue < field.min) || (field.max !== undefined && numberValue > field.max)) {
          setError(product.itemKey, field, t('checkout.manualFormFieldNumberRange', { name: fieldLabel }))
          return
        }
      }
      if ((field.type === 'select' || field.type === 'radio') && field.options.length > 0 && !field.options.includes(text)) {
        setError(product.itemKey, field, t('checkout.manualFormFieldOptionInvalid', { name: fieldLabel }))
        return
      }
      if (field.regex) {
        const regex = compileManualRegex(field.regex)
        if (!regex || !regex.test(text)) {
          setError(product.itemKey, field, t('checkout.manualFormFieldInvalid', { name: fieldLabel }))
        }
      }
    })
  })

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstError,
  }
})

const manualFieldError = (itemKey: string, fieldKey: string) => {
  return manualFormValidation.value.errors[manualFieldErrorKey(itemKey, fieldKey)] || ''
}

const buildManualFormDataPayload = () => {
  const payload: Record<string, any> = {}
  const productCounter: Record<string, number> = {}
  manualFormProducts.value.forEach((product) => {
    const values = manualFormData.value[product.itemKey] || {}
    const row: Record<string, any> = {}
    product.fields.forEach((field) => {
      const rawValue = values[field.key]
      if (field.type === 'checkbox') {
        const list = Array.isArray(rawValue)
          ? rawValue.map((item: any) => String(item).trim()).filter(Boolean)
          : []
        if (list.length > 0) {
          row[field.key] = list
        }
        return
      }
      const text = rawValue == null ? '' : String(rawValue).trim()
      if (text) {
        row[field.key] = text
      }
    })
    payload[product.itemKey] = row
    const productKey = String(product.productId)
    productCounter[productKey] = (productCounter[productKey] || 0) + 1
  })
  manualFormProducts.value.forEach((product) => {
    const productKey = String(product.productId)
    if (productCounter[productKey] === 1) {
      payload[productKey] = payload[product.itemKey]
    }
  })
  return payload
}

const manualFormFingerprint = computed(() => JSON.stringify(manualFormData.value))

const flowSteps = computed(() => ([
  { key: 'cart', label: t('cart.title'), active: false },
  { key: 'checkout', label: t('checkout.title'), active: true },
  { key: 'payment', label: t('payment.title'), active: false },
]))

const isGuestCheckout = computed(() => !userAuthStore.isAuthenticated && checkoutMode.value === 'guest')
const guestEmailValid = computed(() => {
  if (!isGuestCheckout.value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.value.trim())
})

const captchaConfig = computed(() => appStore.config?.captcha || null)
const captchaProvider = computed(() => String(captchaConfig.value?.provider || 'none'))
const guestCaptchaEnabled = computed(() => {
  if (!isGuestCheckout.value) return false
  return !!captchaConfig.value?.scenes?.guest_create_order && captchaProvider.value !== 'none'
})
const guestTurnstileSiteKey = computed(() => String(captchaConfig.value?.turnstile?.site_key || ''))

const getGuestCaptchaPayload = (): CaptchaPayload | undefined => {
  if (!guestCaptchaEnabled.value) return undefined
  if (captchaProvider.value === 'image') {
    return {
      captcha_id: guestCaptchaPayload.value.captcha_id || '',
      captcha_code: guestCaptchaPayload.value.captcha_code || '',
    }
  }
  if (captchaProvider.value === 'turnstile') {
    return {
      turnstile_token: guestTurnstileToken.value,
    }
  }
  return undefined
}

const handleGuestCaptchaConfigStale = async () => {
  await appStore.loadConfig(true)
  guestCaptchaPayload.value = {}
  guestTurnstileToken.value = ''
}

const canSubmit = computed(() => {
  if (syncingStock.value) return false
  if (submitting.value) return false
  if (cartItems.value.length === 0) return false
  if (!manualFormValidation.value.valid) return false
  if (cartItems.value.some((item) => itemStockExceeded(item))) return false
  if (userAuthStore.isAuthenticated) return true
  if (checkoutMode.value !== 'guest') return false
  if (!guestEmail.value.trim() || !guestPassword.value.trim() || !guestEmailValid.value) return false
  if (!guestCaptchaEnabled.value) return true
  if (captchaProvider.value === 'image') {
    return Boolean(guestCaptchaPayload.value.captcha_id && guestCaptchaPayload.value.captcha_code)
  }
  if (captchaProvider.value === 'turnstile') {
    return Boolean(guestTurnstileToken.value)
  }
  return false
})

const submitBlockedReason = computed(() => {
  if (syncingStock.value) return t('checkout.stockSyncing')
  if (cartItems.value.length === 0) return t('checkout.errors.emptyCart')
  if (!manualFormValidation.value.valid) {
    return manualFormValidation.value.firstError || t('checkout.errors.manualFormInvalid')
  }
  const stockBlockedItem = cartItems.value.find((item) => itemStockExceeded(item))
  if (stockBlockedItem) {
    return itemStockHint(stockBlockedItem) || t('cart.stockOut')
  }
  if (userAuthStore.isAuthenticated) return ''
  if (checkoutMode.value !== 'guest') return t('checkout.errors.loginOrGuest')
  if (!guestEmail.value.trim() || !guestPassword.value.trim()) return t('checkout.errors.missingGuest')
  if (!guestEmailValid.value) return t('error.email_invalid')
  if (guestCaptchaEnabled.value) {
    if (captchaProvider.value === 'image' && (!guestCaptchaPayload.value.captcha_id || !guestCaptchaPayload.value.captcha_code)) {
      return t('auth.common.captchaRequired')
    }
    if (captchaProvider.value === 'turnstile' && !guestTurnstileToken.value) {
      return t('auth.common.captchaRequired')
    }
  }
  return ''
})

const previewStatusText = computed(() => couponRefreshing.value
  ? t('checkout.couponRefreshing')
  : t('checkout.previewLoading'))

const checkoutAlert = computed<PageAlert | null>(() => {
  if (error.value) {
    return { level: 'error' as const, message: error.value }
  }
  if (previewError.value) {
    return { level: 'error' as const, message: previewError.value }
  }
  if (!canSubmit.value && submitBlockedReason.value) {
    return { level: 'warning' as const, message: submitBlockedReason.value }
  }
  return null
})

const buildItemsPayload = () => cartItems.value.map(item => ({
  product_id: item.productId,
  sku_id: normalizeSkuId(item.skuId) || undefined,
  quantity: item.quantity,
  fulfillment_type: item.fulfillmentType || undefined,
}))

const buildOrderPayload = () => ({
  coupon_code: normalizedCouponCode.value || undefined,
  items: buildItemsPayload(),
  manual_form_data: buildManualFormDataPayload(),
})

const syncCartStockSnapshots = async () => {
  if (syncingStock.value) return
  syncingStock.value = true
  try {
    await refreshCartStockSnapshots(cartStore)
  } finally {
    syncingStock.value = false
  }
}

const loadPreview = async () => {
  if (syncingStock.value) {
    preview.value = null
    previewError.value = ''
    couponRefreshing.value = false
    return
  }
  if (cartItems.value.length === 0) {
    preview.value = null
    previewError.value = ''
    couponRefreshing.value = false
    return
  }
  if (isGuestCheckout.value && (!guestEmail.value.trim() || !guestPassword.value.trim() || !guestEmailValid.value)) {
    preview.value = null
    previewError.value = ''
    couponRefreshing.value = false
    return
  }
  if (!manualFormValidation.value.valid) {
    preview.value = null
    previewError.value = ''
    couponRefreshing.value = false
    return
  }
  if (cartItems.value.some((item) => itemStockExceeded(item))) {
    preview.value = null
    previewError.value = ''
    couponRefreshing.value = false
    return
  }

  const requestId = ++previewRequestId.value
  previewLoading.value = true
  previewError.value = ''

  try {
    const payload: any = buildOrderPayload()

    let response
    if (userAuthStore.isAuthenticated) {
      response = await userOrderAPI.preview(payload)
    } else {
      response = await guestOrderAPI.preview({
        ...payload,
        email: guestEmail.value.trim(),
        order_password: guestPassword.value,
      })
    }

    if (requestId !== previewRequestId.value) return
    preview.value = response.data.data
  } catch (err: any) {
    if (requestId !== previewRequestId.value) return
    preview.value = null
    previewError.value = err.message || t('checkout.previewFailed')
  } finally {
    if (requestId === previewRequestId.value) {
      previewLoading.value = false
      couponRefreshing.value = false
    }
  }
}

const debouncedLoadPreview = debounceAsync(loadPreview, 300)

const loadPreviewNow = async () => {
  debouncedLoadPreview.cancel()
  await loadPreview()
}

const handleSubmit = async () => {
  submitAttempted.value = true
  error.value = ''
  previewError.value = ''
  await syncCartStockSnapshots()
  if (!canSubmit.value) {
    error.value = submitBlockedReason.value || t('checkout.errors.submitFailed')
    return
  }

  submitting.value = true
  try {
    await loadPreviewNow()
    if (previewError.value) {
      error.value = previewError.value
      return
    }

    if (userAuthStore.isAuthenticated) {
      const response = await userOrderAPI.create(buildOrderPayload())
      const orderNo = String(response.data.data?.order_no || '').trim()
      if (!orderNo) {
        throw new Error(t('checkout.errors.submitFailed'))
      }
      cartStore.clear()
      router.push(`/pay?order_no=${encodeURIComponent(orderNo)}`)
      return
    }

    const response = await guestOrderAPI.create({
      ...buildOrderPayload(),
      email: guestEmail.value.trim(),
      order_password: guestPassword.value,
      captcha_payload: getGuestCaptchaPayload(),
    })

    localStorage.setItem('guest_order_auth', JSON.stringify({
      email: guestEmail.value.trim(),
      order_password: guestPassword.value,
    }))

    const orderNo = String(response.data.data?.order_no || '').trim()
    if (!orderNo) {
      throw new Error(t('checkout.errors.submitFailed'))
    }
    cartStore.clear()
    router.push(`/pay?guest=1&order_no=${encodeURIComponent(orderNo)}`)
  } catch (err: any) {
    error.value = err.message || t('checkout.errors.submitFailed')
    if (guestCaptchaEnabled.value && captchaProvider.value === 'image') {
      guestImageCaptchaRef.value?.refresh()
    }
    if (guestCaptchaEnabled.value && captchaProvider.value === 'turnstile') {
      guestTurnstileRef.value?.reset()
      guestTurnstileToken.value = ''
    }
  } finally {
    submitting.value = false
  }
}

watch(
  () => [cartItems.value, manualFormFingerprint.value, normalizedCouponCode.value, checkoutMode.value, guestEmail.value, guestPassword.value, userAuthStore.isAuthenticated],
  () => {
    debouncedLoadPreview()
  },
  { deep: true }
)

watch(normalizedCouponCode, (value, previous) => {
  if (value === previous) return
  couponRefreshing.value = true
  error.value = ''
  previewError.value = ''
})

onMounted(async () => {
  if (!appStore.config) {
    await appStore.loadConfig()
  }
  await syncCartStockSnapshots()
  debouncedLoadPreview()
})

onUnmounted(() => {
  debouncedLoadPreview.cancel()
})

const getLocalizedText = (jsonData: any) => {
  if (!jsonData) return ''
  const locale = appStore.locale
  return jsonData[locale] || jsonData['zh-CN'] || jsonData['en-US'] || ''
}

const cartItemKey = (item: CartItem) => `${item.productId}:${normalizeSkuId(item.skuId)}`

const itemSkuDisplay = (item: CartItem) => buildSkuDisplayText({
  skuCode: item.skuCode,
  specValues: item.skuSpecValues,
  fallback: t('productDetail.skuFallback'),
  locale: appStore.locale,
})

const manualItemTitle = (manualItem: ManualFormProduct) => {
  const productTitle = getLocalizedText(manualItem.title)
  const skuText = buildSkuDisplayText({
    skuCode: manualItem.skuCode,
    specValues: manualItem.skuSpecValues,
    fallback: t('productDetail.skuFallback'),
    locale: appStore.locale,
  })
  if (!skuText) return productTitle
  return `${productTitle} (${skuText})`
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

const itemStockExceeded = (item: CartItem) => {
  const qty = parseInteger(item.quantity)
  if (qty === null) return true
  return qty > itemMaxQuantity(item)
}

const itemStockHint = (item: CartItem) => {
  const available = itemAvailableStock(item)
  if (available === null) return ''
  if (available <= 0) return t('cart.stockOut')
  if (itemStockExceeded(item)) return t('cart.stockExceeded', { count: available })
  return t('cart.stockRemaining', { count: available })
}
</script>
