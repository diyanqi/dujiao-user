<template>
  <div class="relative min-h-screen overflow-hidden theme-page pt-24 pb-16">
    <div class="container relative z-10 mx-auto px-4">
      <header class="mb-8 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-[var(--ui-accent)] font-mono">
              {{ t('personalCenter.title') }}
            </p>
            <h1 class="mt-3 text-4xl font-black text-[var(--ui-text-primary)] uppercase tracking-widest">{{ userProfileStore.displayName }}</h1>
            <p class="mt-2 text-sm font-bold text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.subtitle') }}</p>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto">
            <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-4 py-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.tabs.overview') }}</p>
              <p class="mt-2 text-sm font-black text-[var(--ui-text-primary)] uppercase tracking-wider">{{ currentSectionLabel }}</p>
            </div>
            <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-4 py-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.tabs.orders') }}</p>
              <p class="mt-2 text-sm font-black text-[var(--ui-text-primary)] uppercase tracking-wider">
                {{ userProfileStore.loadingOrders ? '-' : userProfileStore.recentOrders.length }}
              </p>
            </div>
            <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-4 py-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.overview.accountLabel') }}</p>
              <span class="mt-2 inline-block border-2 px-2 py-1 text-[10px] font-black uppercase tracking-widest" :class="emailVerifiedClass">
                {{ emailVerifiedLabel }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside class="lg:col-span-3">
          <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4 shadow-[8px_8px_0px_var(--ui-accent)] lg:sticky lg:top-24">
            <div class="hidden flex-col gap-3 lg:flex">
              <button
                v-for="item in sectionItems"
                :key="item.key"
                type="button"
                @click="switchSection(item.key)"
                class="group w-full border-2 px-4 py-3 text-left text-sm font-black uppercase tracking-widest font-mono transition-all duration-300"
                :class="currentSection === item.key
                  ? 'border-[var(--ui-accent)] bg-[var(--ui-accent)] text-[var(--ui-text-on-accent)] shadow-[4px_4px_0px_var(--ui-accent-soft)] translate-x-1'
                  : 'border-[var(--ui-border)] bg-transparent text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]'"
              >
                <span class="flex items-center justify-between gap-3">
                  <span class="flex items-center gap-3">
                    <component :is="item.icon" class="h-5 w-5" />
                    <span>{{ t(item.label) }}</span>
                  </span>
                  <span
                    class="h-2 w-2 transition-colors"
                    :class="currentSection === item.key ? 'bg-[var(--ui-text-on-accent)]' : 'bg-[var(--ui-border)] group-hover:bg-[var(--ui-accent)]'"
                  ></span>
                </span>
              </button>
            </div>

            <div class="lg:hidden">
              <div class="flex gap-3 overflow-x-auto pb-2">
                <button
                  v-for="item in sectionItems"
                  :key="item.key"
                  type="button"
                  @click="switchSection(item.key)"
                  class="shrink-0 border-2 px-4 py-3 text-xs font-black uppercase tracking-widest font-mono transition-all duration-300"
                  :class="currentSection === item.key
                    ? 'border-[var(--ui-accent)] bg-[var(--ui-accent)] text-[var(--ui-text-on-accent)] shadow-[4px_4px_0px_var(--ui-accent-soft)]'
                    : 'border-[var(--ui-border)] bg-transparent text-[var(--ui-text-primary)]'"
                >
                  <span class="flex items-center gap-2">
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ t(item.label) }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section class="space-y-8 lg:col-span-9">
          <div
            v-if="globalAlert"
            class="border-2 px-4 py-3 text-sm font-black uppercase tracking-wider"
            :class="globalAlert.level === 'error' ? 'border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] shadow-[4px_4px_0px_var(--ui-danger)]' : 'border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] shadow-[4px_4px_0px_var(--ui-warning)]'"
          >
            {{ globalAlert.message }}
          </div>

          <template v-if="currentSection === 'overview'">
            <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]">
              <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-6">
                  <div class="flex h-16 w-16 items-center justify-center border-2 border-[var(--ui-accent)] bg-[var(--ui-accent-soft)] text-2xl font-black text-[var(--ui-accent)] shadow-[4px_4px_0px_var(--ui-accent)]">
                    {{ displayInitial }}
                  </div>
                  <div>
                    <p class="text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.overview.accountLabel') }}</p>
                    <h2 class="mt-1 text-2xl font-black text-[var(--ui-text-primary)] uppercase tracking-widest">{{ userProfileStore.displayName }}</h2>
                    <p class="mt-1 text-sm font-bold text-[var(--ui-text-muted)] font-mono">{{ userProfileStore.profile?.email || '-' }}</p>
                  </div>
                </div>
                <span class="border-2 px-3 py-1.5 text-xs font-black uppercase tracking-widest" :class="emailVerifiedClass">
                  {{ emailVerifiedLabel }}
                </span>
              </div>
            </div>

            <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]">
              <div class="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--ui-border)] pb-4">
                <h3 class="text-xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono">{{ t('personalCenter.overview.recentOrdersTitle') }}</h3>
                <router-link
                  to="/me/orders"
                  class="inline-flex items-center border-2 border-[var(--ui-border)] bg-transparent px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors"
                >
                  {{ t('personalCenter.overview.viewAllOrders') }}
                </router-link>
              </div>

              <div v-if="userProfileStore.loadingOrders" class="space-y-4">
                <div
                  v-for="idx in 3"
                  :key="idx"
                  class="h-20 animate-pulse border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)]"
                ></div>
              </div>

              <div v-else-if="userProfileStore.recentOrders.length === 0" class="border-2 border-dashed border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-6 py-8 text-center text-sm font-bold text-[var(--ui-text-muted)] uppercase tracking-widest font-mono">
                {{ t('personalCenter.overview.emptyOrders') }}
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="order in userProfileStore.recentOrders"
                  :key="order.order_no || order.id"
                  class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-6 py-4 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--ui-accent)] hover:border-[var(--ui-accent)]"
                >
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div class="text-xs font-bold text-[var(--ui-text-muted)] font-mono uppercase tracking-widest">{{ t('orders.orderNo') }}：<span class="text-[var(--ui-text-primary)]">{{ order.order_no }}</span></div>
                      <div class="mt-2 text-lg font-black text-[var(--ui-accent)] font-mono">
                        {{ formatMoney(order.total_amount, order.currency) }}
                      </div>
                      <div class="mt-1 text-xs font-bold text-[var(--ui-text-muted)] font-mono">{{ formatDate(order.created_at) }}</div>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                      <span class="border-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest" :class="statusClass(order.status)">
                        {{ statusLabel(order.status) }}
                      </span>
                      <router-link
                        :to="`/orders/${order.order_no}`"
                        class="border-2 border-[var(--ui-border)] bg-transparent px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors"
                      >
                        {{ t('orders.viewDetails') }}
                      </router-link>
                      <router-link
                        v-if="order.status === 'pending_payment'"
                        :to="`/pay?order_no=${order.order_no}`"
                        class="border-2 border-[var(--ui-accent)] bg-[var(--ui-accent)] px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--ui-text-on-accent)] hover:bg-transparent hover:text-[var(--ui-accent)] transition-colors"
                      >
                        {{ t('orders.payNow') }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <ProfilePanel v-else-if="currentSection === 'profile'" />
          <SecurityPanel v-else-if="currentSection === 'security'" />
          <OrdersPanel v-else-if="currentSection === 'orders'" />
          <WalletPanel v-else-if="currentSection === 'wallet'" />
          <OrdersPanel v-else />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { HomeIcon, ShoppingBagIcon, WalletIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { orderStatusClass, orderStatusLabel } from '../utils/status'
import { pageAlertClass, type PageAlert } from '../utils/alerts'
import { useUserProfileStore } from '../stores/userProfile'
import ProfilePanel from './personal/ProfilePanel.vue'
import SecurityPanel from './personal/SecurityPanel.vue'
import OrdersPanel from './personal/OrdersPanel.vue'
import WalletPanel from './personal/WalletPanel.vue'

type PersonalSection = 'overview' | 'profile' | 'security' | 'orders' | 'wallet'

const props = withDefaults(defineProps<{ section?: PersonalSection }>(), {
  section: 'overview',
})

const router = useRouter()
const { t } = useI18n()
const userProfileStore = useUserProfileStore()

const sectionItems: Array<{ key: PersonalSection; label: string; icon: Component }> = [
  { key: 'overview', label: 'personalCenter.tabs.overview', icon: HomeIcon },
  { key: 'orders', label: 'personalCenter.tabs.orders', icon: ShoppingBagIcon },
  { key: 'wallet', label: 'personalCenter.tabs.wallet', icon: WalletIcon },
  { key: 'security', label: 'personalCenter.tabs.security', icon: ShieldCheckIcon },
  { key: 'profile', label: 'personalCenter.tabs.profile', icon: UserCircleIcon },
]

const sectionRouteMap: Record<PersonalSection, string> = {
  overview: '/me',
  profile: '/me/profile',
  security: '/me/security',
  orders: '/me/orders',
  wallet: '/me/wallet',
}

const currentSection = computed<PersonalSection>(() => props.section)
const globalAlert = ref<PageAlert | null>(null)

const currentSectionLabel = computed(() => {
  const current = sectionItems.find((item) => item.key === currentSection.value)
  return current ? t(current.label) : t('personalCenter.title')
})

const displayInitial = computed(() => {
  const name = userProfileStore.displayName || ''
  const normalized = name.trim()
  if (!normalized) return 'U'
  return normalized.slice(0, 1).toUpperCase()
})

const switchSection = (section: PersonalSection) => {
  router.push(sectionRouteMap[section])
}

const statusLabel = (status?: string) => orderStatusLabel(t, status)
const statusClass = (status?: string) => orderStatusClass(status)

const formatMoney = (amount?: string, currency?: string) => {
  if (!amount) return '-'
  if (!currency) return amount
  return `${amount} ${currency}`
}

const formatDate = (raw?: string) => {
  if (!raw) return '-'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleString()
}

const emailVerifiedLabel = computed(() => {
  if (userProfileStore.profile?.email_verified_at) {
    return t('personalCenter.overview.emailVerified')
  }
  return t('personalCenter.overview.emailUnverified')
})

const emailVerifiedClass = computed(() => {
  if (userProfileStore.profile?.email_verified_at) {
    return 'theme-badge-success'
  }
  return 'theme-badge-warning'
})

const initialize = async () => {
  globalAlert.value = null
  const [profileOk] = await Promise.all([
    userProfileStore.loadProfile(),
    userProfileStore.loadRecentOrders(5),
  ])
  if (!profileOk) {
    globalAlert.value = {
      level: 'error',
      message: userProfileStore.profileError || t('personalCenter.common.loadFailed'),
    }
  }
}

onMounted(() => {
  initialize()
})
</script>
