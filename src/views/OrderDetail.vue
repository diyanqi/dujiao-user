<template>
  <div class="min-h-screen theme-page pt-24 pb-16">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex items-center justify-between border-b-2 border-[var(--ui-border)] pb-4">
        <div>
          <h1 class="text-3xl font-black font-mono uppercase tracking-widest text-[var(--ui-accent)] mb-2">{{ t('orderDetail.title') }}</h1>
          <p class="theme-text-muted text-sm font-mono">{{ t('orderDetail.subtitle') }}</p>
        </div>
        <router-link to="/me/orders"
          class="theme-link-muted text-sm font-mono uppercase tracking-wider">{{
            t('orderDetail.backList') }}</router-link>
      </div>

      <div v-if="loading"
        class="h-40 border-2 border-[var(--ui-border)] theme-surface-muted animate-pulse">
      </div>

      <div v-else-if="!order"
        class="theme-panel p-12 text-center">
        <p class="theme-text-muted font-mono">{{ t('orderDetail.notFound') }}</p>
      </div>

      <div v-else class="space-y-6">
        <div class="theme-panel p-6 shadow-[8px_8px_0px_var(--ui-accent)]">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div class="text-xs uppercase tracking-widest font-black font-mono theme-text-muted">{{ t('orders.orderNo') }}</div>
              <div class="text-sm font-black font-mono theme-text-primary mt-1">{{ order.order_no }}</div>
                <div class="text-xs font-mono theme-text-muted mt-2">{{ t('orderDetail.createdAtLabel') }}：{{ formatDate(order.created_at) }}</div>
            </div>
            <div class="flex flex-col items-start md:items-end gap-2">
              <div class="text-xs uppercase tracking-widest font-black font-mono theme-text-muted">{{ t('orderDetail.amountTotal') }}</div>
              <div class="text-lg font-black font-mono theme-text-primary">{{ formatMoney(order.total_amount,
                order.currency) }}</div>
            </div>
            <div class="flex items-center gap-3">
              <span class="theme-badge px-3 py-1 text-xs" :class="statusClass(order.status)">
                {{ statusLabel(order.status) }}
              </span>
              <router-link v-if="order.status === 'pending_payment'" :to="`/pay?order_no=${order.order_no}`"
                class="px-4 py-2 border-2 theme-btn-primary font-black text-sm uppercase tracking-widest">
                {{ t('orderDetail.payNow') }}
              </router-link>
              <button v-if="order.status === 'pending_payment'" @click="cancelOrder"
                class="px-4 py-2 border-2 theme-btn-danger text-sm font-black uppercase tracking-widest">
                {{ t('orderDetail.cancel') }}
              </button>
            </div>
          </div>
        </div>

        <div class="theme-panel p-6">
          <h2 class="text-lg font-black font-mono uppercase tracking-widest mb-4">{{ t('orderDetail.amountTitle') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.amountOriginal') }}</div>
              <div class="theme-text-primary font-mono font-black mt-1">{{ formatMoney(order.original_amount,
                order.currency) }}</div>
            </div>
            <div class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.amountDiscount') }}</div>
              <div class="theme-text-primary font-mono font-black mt-1">{{ formatMoney(order.discount_amount,
                order.currency) }}</div>
            </div>
            <div class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.amountTotal') }}</div>
              <div class="theme-text-primary font-mono font-black mt-1">{{ formatMoney(order.total_amount,
                order.currency) }}</div>
            </div>
            <div v-if="hasAmount(order.wallet_paid_amount)" class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.amountWalletPaid') }}</div>
              <div class="theme-text-primary font-mono font-black mt-1">{{ formatMoney(order.wallet_paid_amount,
                order.currency) }}</div>
            </div>
            <div v-if="hasAmount(order.online_paid_amount)" class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.amountOnlinePaid') }}</div>
              <div class="theme-text-primary font-mono font-black mt-1">{{ formatMoney(order.online_paid_amount,
                order.currency) }}</div>
            </div>
            <div v-if="hasAmount(order.refunded_amount)" class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.amountRefunded') }}</div>
              <div class="theme-text-primary font-mono font-black mt-1">{{ formatMoney(order.refunded_amount,
                order.currency) }}</div>
            </div>
          </div>
        </div>

        <div v-if="showTimeCard" class="theme-panel p-6">
          <h2 class="text-lg font-black font-mono uppercase tracking-widest mb-4">{{ t('orderDetail.timeTitle') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.createdAtLabel') }}</div>
              <div class="theme-text-primary mt-1 font-mono">{{ formatDate(order.created_at) }}</div>
            </div>
            <div v-if="order.paid_at" class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.paidAtLabel') }}</div>
              <div class="theme-text-primary mt-1 font-mono">{{ formatDate(order.paid_at) }}</div>
            </div>
            <div v-if="order.expires_at" class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.expiresAtLabel') }}</div>
              <div class="theme-text-primary mt-1 font-mono">{{ formatDate(order.expires_at) }}</div>
            </div>
            <div v-if="order.canceled_at" class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="text-xs font-black uppercase tracking-wider font-mono theme-text-muted">{{ t('orderDetail.canceledAtLabel') }}</div>
              <div class="theme-text-primary mt-1 font-mono">{{ formatDate(order.canceled_at) }}</div>
            </div>
          </div>
        </div>

        <div class="theme-panel p-6">
          <h2 class="text-lg font-black font-mono uppercase tracking-widest mb-4">{{ t('orderDetail.itemsTitle') }}</h2>
          <div v-if="order.items && order.items.length > 0" class="space-y-4">
            <div v-for="item in order.items" :key="item.id"
              class="flex items-center justify-between border-b-2 border-[var(--ui-border)] pb-3">
              <div>
                <div class="theme-text-primary font-black font-mono">{{ getLocalizedText(item.title) }}</div>
                <div class="text-xs theme-text-muted font-mono">{{ t('orderDetail.quantityLabel') }}：{{ item.quantity }}</div>
                <div v-if="orderItemSkuText(item)" class="text-xs theme-text-muted mt-1 font-mono">{{ t('orderDetail.itemSkuLabel') }}：{{ orderItemSkuText(item) }}</div>
                <div class="text-xs theme-text-muted mt-1 font-mono">
                  {{ t('orderDetail.itemFulfillmentLabel') }}：{{ fulfillmentTypeLabelText(item.fulfillment_type) }}
                </div>
                <div v-if="item.tags && item.tags.length" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="(tag, index) in item.tags" :key="index"
                    class="px-2 py-0.5 text-[11px] border-2 border-[var(--ui-border)] theme-surface-muted theme-text-muted font-mono uppercase tracking-wider">
                    {{ tag }}
                  </span>
                </div>
                <div v-if="manualSubmissionRows(item.manual_form_submission).length"
                  class="mt-3 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] p-3 text-xs theme-text-secondary font-mono">
                  <div class="mb-2 font-black uppercase tracking-wider">{{ t('orderDetail.manualSubmissionTitle') }}</div>
                  <div v-for="row in manualSubmissionRows(item.manual_form_submission)" :key="`${item.id}-${row.key}`" class="mb-1 last:mb-0">
                    <span class="theme-text-primary font-black">{{ row.key }}</span>：{{ row.value }}
                  </div>
                </div>
              </div>
              <div class="text-right text-sm theme-text-muted space-y-1 font-mono">
                <div>{{ t('orderDetail.unitPriceLabel') }}：{{ formatMoney(item.unit_price, order.currency) }}</div>
                <div>{{ t('orderDetail.totalPriceLabel') }}：{{ formatMoney(item.total_price, order.currency) }}</div>
                <div v-if="hasDiscountAmount(item.coupon_discount_amount)">
                  {{ t('orderDetail.couponDiscountLabel') }}：{{ formatMoney(item.coupon_discount_amount, order.currency)
                  }}
                </div>
                <div v-if="hasDiscountAmount(item.promotion_discount_amount)">
                  {{ t('orderDetail.promotionDiscountLabel') }}：{{ formatMoney(item.promotion_discount_amount,
                  order.currency) }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-sm theme-text-muted">{{ t('orderDetail.noItems') }}</div>
        </div>

        <div v-if="order.children && order.children.length > 0"
          class="theme-panel p-6">
          <h2 class="text-lg font-black font-mono uppercase tracking-widest mb-4">{{ t('orderDetail.childOrdersTitle') }}</h2>
          <div class="space-y-4">
            <div v-for="child in order.children" :key="child.id"
              class="theme-surface-soft border-2 border-[var(--ui-border)] p-4">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div class="text-sm theme-text-muted font-mono">{{ t('orderDetail.childOrderNo') }}：{{ child.order_no }}</div>
                  <div class="text-xs theme-text-muted mt-1 font-mono">{{ t('orderDetail.childOrderAmount') }}：{{
                    formatMoney(child.total_amount, child.currency || order.currency) }}</div>
                </div>
                <span class="theme-badge px-3 py-1 text-xs"
                  :class="statusClass(child.status)">
                  {{ statusLabel(child.status) }}
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-sm font-black font-mono uppercase tracking-wider theme-text-primary mb-3">{{ t('orderDetail.childItemsTitle')
                  }}</h3>
                <div v-if="child.items && child.items.length" class="space-y-3">
                  <div v-for="item in child.items" :key="item.id"
                    class="flex items-center justify-between border-b-2 border-[var(--ui-border)] pb-3 text-sm theme-text-muted">
                    <div>
                      <div class="theme-text-primary font-black font-mono">{{ getLocalizedText(item.title) }}</div>
                      <div class="text-xs theme-text-muted font-mono">{{ t('orderDetail.quantityLabel') }}：{{ item.quantity }}</div>
                      <div v-if="orderItemSkuText(item)" class="text-xs theme-text-muted mt-1 font-mono">{{ t('orderDetail.itemSkuLabel') }}：{{ orderItemSkuText(item) }}</div>
                      <div class="text-xs theme-text-muted mt-1 font-mono">
                        {{ t('orderDetail.itemFulfillmentLabel') }}：{{ fulfillmentTypeLabelText(item.fulfillment_type) }}
                      </div>
                      <div v-if="item.tags && item.tags.length" class="mt-2 flex flex-wrap gap-2">
                        <span v-for="(tag, index) in item.tags" :key="index"
                          class="px-2 py-0.5 text-[11px] border-2 border-[var(--ui-border)] theme-surface-muted theme-text-muted font-mono uppercase tracking-wider">
                          {{ tag }}
                        </span>
                      </div>
                      <div v-if="manualSubmissionRows(item.manual_form_submission).length"
                        class="mt-3 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] p-3 text-xs theme-text-secondary font-mono">
                        <div class="mb-2 font-black uppercase tracking-wider">{{ t('orderDetail.manualSubmissionTitle') }}</div>
                        <div v-for="row in manualSubmissionRows(item.manual_form_submission)" :key="`${item.id}-${row.key}`" class="mb-1 last:mb-0">
                          <span class="theme-text-primary font-black">{{ row.key }}</span>：{{ row.value }}
                        </div>
                      </div>
                    </div>
                    <div class="text-right text-sm theme-text-muted space-y-1 font-mono">
                      <div>{{ t('orderDetail.unitPriceLabel') }}：{{ formatMoney(item.unit_price, order.currency) }}
                      </div>
                      <div>{{ t('orderDetail.totalPriceLabel') }}：{{ formatMoney(item.total_price, order.currency) }}
                      </div>
                      <div v-if="hasDiscountAmount(item.coupon_discount_amount)">
                        {{ t('orderDetail.couponDiscountLabel') }}：{{ formatMoney(item.coupon_discount_amount,
                        order.currency) }}
                      </div>
                      <div v-if="hasDiscountAmount(item.promotion_discount_amount)">
                        {{ t('orderDetail.promotionDiscountLabel') }}：{{ formatMoney(item.promotion_discount_amount,
                        order.currency) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm theme-text-muted">{{ t('orderDetail.noItems') }}</div>
              </div>
              <div class="mt-4">
                <h3 class="text-sm font-black font-mono uppercase tracking-wider theme-text-primary mb-3">{{
                  t('orderDetail.childFulfillmentTitle') }}</h3>
                <div v-if="child.fulfillment">
                  <div class="text-sm theme-text-muted font-mono">{{ t('orderDetail.fulfillmentType') }}：{{
                    fulfillmentTypeLabelText(child.fulfillment.type) }}</div>
                  <div class="text-sm theme-text-muted font-mono">{{ t('orderDetail.fulfillmentStatus') }}：{{
                    fulfillmentStatusLabelText(child.fulfillment.status) }}</div>
                  <div v-if="fulfillmentDeliveryLines(child.fulfillment).length"
                    class="mt-3 theme-surface-soft border-2 border-[var(--ui-border)] p-4 text-sm theme-text-secondary space-y-1 font-mono">
                    <div v-for="(line, index) in fulfillmentDeliveryLines(child.fulfillment)" :key="`child-fulfillment-${child.id}-${index}`">{{ line }}</div>
                  </div>
                  <div v-else-if="child.fulfillment.payload"
                    class="mt-3 theme-surface-soft border-2 border-[var(--ui-border)] p-4 text-sm theme-text-secondary whitespace-pre-wrap font-mono">
                    {{ child.fulfillment.payload }}
                  </div>
                </div>
                <div v-else class="text-sm theme-text-muted">{{ t('orderDetail.childFulfillmentEmpty') }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="order.fulfillment"
          class="theme-panel p-6">
          <h2 class="text-lg font-black font-mono uppercase tracking-widest mb-4">{{ t('orderDetail.fulfillmentTitle') }}</h2>
          <div class="text-sm theme-text-muted font-mono">{{ t('orderDetail.fulfillmentType') }}：{{
            fulfillmentTypeLabelText(order.fulfillment.type) }}</div>
          <div class="text-sm theme-text-muted font-mono">{{ t('orderDetail.fulfillmentStatus') }}：{{
            fulfillmentStatusLabelText(order.fulfillment.status) }}</div>
          <div v-if="fulfillmentDeliveryLines(order.fulfillment).length"
            class="mt-4 theme-surface-soft border-2 border-[var(--ui-border)] p-4 text-sm theme-text-secondary space-y-1 font-mono">
            <div v-for="(line, index) in fulfillmentDeliveryLines(order.fulfillment)" :key="`fulfillment-${order.order_no || 'order'}-${index}`">{{ line }}</div>
          </div>
          <div v-else
            class="mt-4 theme-surface-soft border-2 border-[var(--ui-border)] p-4 text-sm theme-text-secondary whitespace-pre-wrap font-mono">
            {{ order.fulfillment.payload }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userOrderAPI } from '../api'
import { useAppStore } from '../stores/app'
import { useI18n } from 'vue-i18n'
import { orderStatusClass, orderStatusLabel } from '../utils/status'
import { fulfillmentStatusLabel, fulfillmentTypeLabel } from '../utils/fulfillment'
import { debounceAsync } from '../utils/debounce'
import { amountToCents } from '../utils/money'
import { buildSkuDisplayTextFromSnapshot } from '../utils/sku'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { t } = useI18n()

const loading = ref(true)
const order = ref<any>(null)

const showTimeCard = computed(() => {
  if (!order.value) return false
  return Boolean(order.value.paid_at || order.value.expires_at || order.value.canceled_at)
})

const loadOrder = async () => {
  loading.value = true
  try {
    const response = await userOrderAPI.detailByOrderNo(String(route.params.order_no || '').trim())
    order.value = response.data.data
  } catch (error) {
    order.value = null
  } finally {
    loading.value = false
  }
}

const debouncedLoadOrder = debounceAsync(loadOrder, 300)

const cancelOrder = async () => {
  if (!order.value) return
  const confirmCancel = confirm(t('orderDetail.cancelConfirm'))
  if (!confirmCancel) return
  try {
    await userOrderAPI.cancel(order.value.id)
    await debouncedLoadOrder()
  } catch (error) {
    alert(t('orderDetail.cancelFailed'))
  }
}

const statusLabel = (status: string) => orderStatusLabel(t, status)

const fulfillmentTypeLabelText = (type: string) => fulfillmentTypeLabel(t, type, 'orderDetail')

const fulfillmentStatusLabelText = (status: string) => fulfillmentStatusLabel(t, status, 'orderDetail')

const statusClass = (status: string) => orderStatusClass(status)

const formatDate = (raw?: string) => {
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleString()
}

const getLocalizedText = (jsonData: any) => {
  if (!jsonData) return ''
  const locale = appStore.locale
  return jsonData[locale] || jsonData['zh-CN'] || jsonData['en-US'] || ''
}

const formatMoney = (amount?: string, currency?: string) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  if (currency === null || currency === undefined || currency === '') {
    return String(amount)
  }
  return `${amount} ${currency}`
}

const hasDiscountAmount = (amount?: string) => {
  if (amount === null || amount === undefined || amount === '') return false
  const valueCents = amountToCents(amount)
  return valueCents !== null && valueCents > 0
}

const hasAmount = (amount?: string) => {
  if (amount === null || amount === undefined || amount === '') return false
  const valueCents = amountToCents(amount)
  return valueCents !== null && valueCents > 0
}

const formatManualValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(', ')
  }
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

const manualSubmissionRows = (submission: any) => {
  if (!submission || typeof submission !== 'object') return []
  return Object.entries(submission)
    .filter(([key]) => String(key).trim() !== '')
    .map(([key, value]) => ({
      key: String(key),
      value: formatManualValue(value),
    }))
}

const orderItemSkuText = (item: any) => {
  return buildSkuDisplayTextFromSnapshot(item?.sku_snapshot, {
    locale: appStore.locale,
    fallback: t('productDetail.skuFallback'),
  })
}

const fulfillmentDeliveryLines = (fulfillment: any) => {
  const deliveryData = fulfillment?.delivery_data || fulfillment?.logistics
  const lines: string[] = []
  if (deliveryData && typeof deliveryData === 'object') {
    const note = String(deliveryData.note || '').trim()
    if (note) {
      lines.push(note)
    }
    const entries = Array.isArray(deliveryData.entries) ? deliveryData.entries : []
    entries.forEach((entry: any) => {
      const key = String(entry?.key || '').trim()
      const value = String(entry?.value || '').trim()
      if (!key && !value) {
        return
      }
      if (!key) {
        lines.push(value)
      } else if (!value) {
        lines.push(key)
      } else {
        lines.push(`${key}: ${value}`)
      }
    })
  }
  return lines
}

onMounted(() => {
  if (!route.params.order_no) {
    router.push('/me/orders')
    return
  }
  debouncedLoadOrder()
})

onUnmounted(() => {
  debouncedLoadOrder.cancel()
})
</script>
