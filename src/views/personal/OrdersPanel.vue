<template>
  <div class="space-y-6">
    <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-2xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono">{{ t('orders.title') }}</h2>
          <p class="mt-2 text-sm font-bold text-[var(--ui-text-muted)] font-mono">{{ t('orders.subtitle') }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <span class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-4 py-2 text-xs font-black uppercase tracking-widest font-mono">
            {{ t('orders.pageInfo', { page: pagination.page, total: pagination.total_page }) }}
          </span>
          <router-link
            to="/products"
            class="inline-flex items-center border-2 border-[var(--ui-border)] bg-transparent px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors"
          >
            {{ t('orders.continueShopping') }}
          </router-link>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-6 shadow-[4px_4px_0px_var(--ui-accent)]">
        <div class="text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('orders.stats.totalMatched') }}</div>
        <div class="mt-3 text-3xl font-black text-[var(--ui-text-primary)] font-mono">{{ pagination.total }}</div>
      </div>
      <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-6 shadow-[4px_4px_0px_var(--ui-accent)]">
        <div class="text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('orders.stats.currentPage') }}</div>
        <div class="mt-3 text-3xl font-black text-[var(--ui-text-primary)] font-mono">{{ orders.length }}</div>
      </div>
      <div class="border-2 border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] p-6 shadow-[4px_4px_0px_var(--ui-warning)]">
        <div class="text-xs font-black uppercase tracking-widest text-[var(--ui-warning)] font-mono">{{ t('orders.stats.pendingPayment') }}</div>
        <div class="mt-3 text-3xl font-black text-[var(--ui-warning)] font-mono">{{ pendingPaymentCount }}</div>
      </div>
      <div class="border-2 border-[var(--ui-success)] bg-[var(--ui-success-soft)] p-6 shadow-[4px_4px_0px_var(--ui-success)]">
        <div class="text-xs font-black uppercase tracking-widest text-[var(--ui-success)] font-mono">{{ t('orders.stats.finished') }}</div>
        <div class="mt-3 text-3xl font-black text-[var(--ui-success)] font-mono">{{ finishedCount }}</div>
      </div>
    </div>

    <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-6 shadow-[8px_8px_0px_var(--ui-accent)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div class="w-full lg:max-w-sm">
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('orders.filters.keyword') }}</label>
          <input
            v-model.trim="filters.orderNo"
            type="text"
            :placeholder="t('orders.filters.orderNoPlaceholder')"
            class="h-12 w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
            @input="handleOrderNoInput"
            @keyup.enter="applyFilters"
          />
        </div>

        <div class="w-full lg:w-56">
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('orders.filters.status') }}</label>
          <select
            v-model="filters.status"
            class="h-12 w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
            @change="handleStatusChange"
          >
            <option v-for="item in statusOptions" :key="item.value || 'all'" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>

        <div class="flex w-full flex-wrap items-center gap-3 lg:w-auto">
          <button
            type="button"
            class="inline-flex h-12 items-center border-2 border-[var(--ui-accent)] bg-[var(--ui-accent)] px-6 text-sm font-black uppercase tracking-widest text-[var(--ui-text-on-accent)] hover:bg-transparent hover:text-[var(--ui-accent)] transition-colors"
            @click="applyFilters"
          >
            {{ t('orders.filters.search') }}
          </button>
          <button
            type="button"
            class="inline-flex h-12 items-center border-2 border-[var(--ui-border)] bg-transparent px-6 text-sm font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors"
            @click="resetFilters"
          >
            {{ t('orders.filters.reset') }}
          </button>
          <button
            type="button"
            class="inline-flex h-12 items-center border-2 border-[var(--ui-border)] bg-transparent px-6 text-sm font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors"
            @click="refreshCurrentPage"
          >
            {{ t('orders.filters.refresh') }}
          </button>
        </div>
      </div>

      <div v-if="hasActiveFilters" class="mt-4 text-xs font-bold text-[var(--ui-accent)] font-mono uppercase tracking-widest">
        {{ t('orders.filters.current', { orderNo: filters.orderNo || t('orders.filters.any'), status: currentStatusLabel }) }}
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-32 animate-pulse border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)]"
      ></div>
    </div>

    <div v-else-if="orders.length === 0" class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-16 text-center shadow-[8px_8px_0px_var(--ui-accent)]">
      <p class="mb-8 text-lg font-black text-[var(--ui-text-muted)] uppercase tracking-widest font-mono">{{ hasActiveFilters ? t('orders.emptyFiltered') : t('orders.empty') }}</p>
      <router-link
        to="/products"
        class="inline-flex items-center gap-2 border-2 border-[var(--ui-accent)] bg-[var(--ui-accent)] px-8 py-4 font-black uppercase tracking-widest text-[var(--ui-text-on-accent)] hover:bg-transparent hover:text-[var(--ui-accent)] transition-colors"
      >
        {{ t('orders.emptyAction') }}
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.order_no || order.id"
        class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-6 shadow-[8px_8px_0px_var(--ui-accent)] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_var(--ui-accent)]"
      >
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('orders.orderNo') }}：<span class="text-[var(--ui-text-primary)]">{{ order.order_no }}</span></div>
            <div class="mt-3 text-2xl font-black text-[var(--ui-accent)] font-mono">{{ formatMoney(order.total_amount, order.currency) }}</div>
            <div v-if="hasDiscount(order)" class="mt-3 flex flex-wrap gap-3 text-xs font-black font-mono">
              <span v-if="hasDiscountAmount(order.discount_amount)" class="border-2 border-[var(--ui-success)] bg-[var(--ui-success-soft)] text-[var(--ui-success)] px-3 py-1.5 uppercase tracking-widest">
                {{ t('orderDetail.couponDiscountLabel') }}：{{ formatMoney(order.discount_amount, order.currency) }}
              </span>
              <span v-if="hasDiscountAmount(order.promotion_discount_amount)" class="border-2 border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] px-3 py-1.5 uppercase tracking-widest">
                {{ t('orderDetail.promotionDiscountLabel') }}：{{ formatMoney(order.promotion_discount_amount, order.currency) }}
              </span>
            </div>
            <div class="mt-3 text-xs font-bold text-[var(--ui-text-muted)] font-mono">{{ formatDate(order.created_at) }}</div>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <span class="border-2 px-4 py-2 text-xs font-black uppercase tracking-widest" :class="statusClass(order.status)">
              {{ statusLabel(order.status) }}
            </span>
            <router-link
              :to="`/orders/${order.order_no}`"
              class="border-2 border-[var(--ui-border)] bg-transparent px-6 py-3 text-sm font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors"
            >
              {{ t('orders.viewDetails') }}
            </router-link>
            <router-link
              v-if="order.status === 'pending_payment'"
              :to="`/pay?order_no=${order.order_no}`"
              class="border-2 border-[var(--ui-accent)] bg-[var(--ui-accent)] px-6 py-3 text-sm font-black uppercase tracking-widest text-[var(--ui-text-on-accent)] hover:bg-transparent hover:text-[var(--ui-accent)] transition-colors"
            >
              {{ t('orders.payNow') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="pagination.total_page > 1" class="mt-12 flex flex-wrap items-center justify-center gap-4">
      <button
        :disabled="pagination.page <= 1"
        class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-6 py-3 text-sm font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--ui-border)] disabled:hover:text-[var(--ui-text-primary)]"
        @click="changePage(pagination.page - 1)"
      >
        {{ t('orders.prevPage') }}
      </button>
      <span class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-6 py-3 text-sm font-black uppercase tracking-widest font-mono">
        {{ t('orders.pageInfo', { page: pagination.page, total: pagination.total_page }) }}
      </span>
      <button
        :disabled="pagination.page >= pagination.total_page"
        class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-6 py-3 text-sm font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--ui-border)] disabled:hover:text-[var(--ui-text-primary)]"
        @click="changePage(pagination.page + 1)"
      >
        {{ t('orders.nextPage') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { userOrderAPI } from '../../api'
import { orderStatusClass, orderStatusLabel } from '../../utils/status'
import { debounceAsync } from '../../utils/debounce'
import { amountToCents } from '../../utils/money'

const { t } = useI18n()

const loading = ref(true)
const orders = ref<any[]>([])
const pagination = ref({
  page: 1,
  page_size: 20,
  total: 0,
  total_page: 1,
})

const filters = reactive({
  orderNo: '',
  status: '',
})

const statusOptions = computed(() => [
  { value: '', label: t('orders.filters.statusAll') },
  { value: 'pending_payment', label: t('order.status.pending_payment') },
  { value: 'paid', label: t('order.status.paid') },
  { value: 'fulfilling', label: t('order.status.fulfilling') },
  { value: 'partially_delivered', label: t('order.status.partially_delivered') },
  { value: 'delivered', label: t('order.status.delivered') },
  { value: 'completed', label: t('order.status.completed') },
  { value: 'expired', label: t('order.status.expired') },
  { value: 'canceled', label: t('order.status.canceled') },
])

const hasActiveFilters = computed(() => Boolean(filters.orderNo || filters.status))

const currentStatusLabel = computed(() => {
  const selected = statusOptions.value.find((item) => item.value === filters.status)
  return selected?.label || t('orders.filters.statusAll')
})

const pendingPaymentCount = computed(() => orders.value.filter((order) => order.status === 'pending_payment').length)

const finishedCount = computed(() =>
  orders.value.filter((order) => order.status === 'delivered' || order.status === 'completed').length,
)

const loadOrders = async (page = 1) => {
  loading.value = true
  try {
    const response = await userOrderAPI.list({
      page,
      page_size: pagination.value.page_size,
      status: filters.status || undefined,
      order_no: filters.orderNo || undefined,
    })
    orders.value = response.data.data || []
    pagination.value = response.data.pagination || pagination.value
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
}

const debouncedLoadOrders = debounceAsync(loadOrders, 300)

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.total_page) return
  debouncedLoadOrders(page)
}

const applyFilters = () => {
  loadOrders(1)
}

const handleOrderNoInput = () => {
  debouncedLoadOrders(1)
}

const handleStatusChange = () => {
  loadOrders(1)
}

const resetFilters = () => {
  filters.orderNo = ''
  filters.status = ''
  loadOrders(1)
}

const refreshCurrentPage = () => {
  loadOrders(pagination.value.page)
}

const statusLabel = (status: string) => orderStatusLabel(t, status)
const statusClass = (status: string) => orderStatusClass(status)

const formatMoney = (amount?: string, currency?: string) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  if (currency === null || currency === undefined || currency === '') return String(amount)
  return `${amount} ${currency}`
}

const hasDiscountAmount = (amount?: string) => {
  if (amount === null || amount === undefined || amount === '') return false
  const valueCents = amountToCents(amount)
  return valueCents !== null && valueCents > 0
}

const hasDiscount = (order: any) => {
  if (!order) return false
  return hasDiscountAmount(order.discount_amount) || hasDiscountAmount(order.promotion_discount_amount)
}

const formatDate = (raw?: string) => {
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleString()
}

onMounted(() => {
  debouncedLoadOrders(1)
})

onUnmounted(() => {
  debouncedLoadOrders.cancel()
})
</script>
