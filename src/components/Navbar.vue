<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-[var(--ui-bg-page)] border-b-4 border-[var(--ui-border)] transition-all duration-300 shadow-[0_4px_0px_var(--ui-border)]">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="theme-wordmark group relative" :title="brandSiteName">
        <span class="theme-wordmark-text">{{ brandSiteName }}</span>
      </router-link>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-4">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
          class="theme-nav-link text-sm relative group overflow-hidden font-bold uppercase tracking-widest font-mono hover-scale"
          active-class="theme-nav-link-active">
          <span class="relative z-10">{{ t(item.label) }}</span>
        </router-link>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-2 md:space-x-4">
        <router-link to="/cart"
          class="theme-nav-link relative gap-2 px-3 py-2 font-bold uppercase tracking-widest font-mono hover-scale">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 2.6a1 1 0 00.9 1.4H19M7 13l.4 2M10 21a1 1 0 100-2 1 1 0 000 2zm8 1a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <span class="hidden sm:inline text-sm">{{ t('navbar.cart') }}</span>
          <span v-if="cartCount > 0"
            class="absolute -top-2 -right-2 bg-[var(--ui-accent)] text-[var(--ui-text-on-accent)] text-[10px] font-black px-2 py-0.5 border-2 border-[var(--ui-border)] shadow-[2px_2px_0px_var(--ui-border)]">
            {{ cartCount }}
          </span>
        </router-link>

        <router-link v-if="!userAuthStore.isAuthenticated" to="/guest/orders"
          class="hidden md:inline-flex theme-nav-link font-bold uppercase tracking-widest font-mono text-sm hover-scale">
          {{ t('navbar.guestOrders') }}
        </router-link>
        <router-link v-if="!userAuthStore.isAuthenticated" to="/auth/login"
          class="hidden md:inline-flex theme-nav-link font-bold uppercase tracking-widest font-mono text-sm hover-scale">
          {{ t('navbar.login') }}
        </router-link>
        <router-link v-if="userAuthStore.isAuthenticated" to="/me"
          class="hidden md:inline-flex theme-nav-link font-bold uppercase tracking-widest font-mono text-sm hover-scale">
          {{ t('navbar.personalCenter') }}
        </router-link>
        <button v-if="userAuthStore.isAuthenticated" @click="userAuthStore.logout()"
          class="hidden md:inline-flex px-4 py-2 border-2 border-[var(--ui-danger)] text-[var(--ui-danger)] hover:bg-[var(--ui-danger)] hover:text-[var(--ui-text-on-accent)] transition-all font-bold uppercase tracking-widest font-mono text-sm shadow-[4px_4px_0px_var(--ui-danger)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover-scale">
          {{ t('navbar.logout') }}
        </button>
        <!-- Theme Switcher -->
        <button @click="cycleThemeMode"
          class="theme-nav-link p-2 gap-2 hover-scale"
          :title="`${t('navbar.selectTheme')}：${currentThemeLabel}`">
          <ComputerDesktopIcon v-if="themeMode === 'system'" class="w-5 h-5" />
          <SunIcon v-else-if="themeMode === 'light'" class="w-5 h-5" />
          <MoonIcon v-else class="w-5 h-5" />
          <span class="hidden lg:inline text-xs font-mono">{{ currentThemeShort }}</span>
        </button>

        <!-- Language Switcher -->
        <div class="relative group/lang lang-switcher">
          <button @click="toggleLangMenu"
            class="theme-nav-link space-x-2 font-bold uppercase tracking-widest font-mono hover-scale">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="hidden md:inline text-sm">{{ currentLocale }}</span>
          </button>

          <!-- Dropdown -->
          <div v-if="showLangMenu"
            class="absolute right-0 mt-4 w-48 bg-[var(--ui-bg-elevated)] border-4 border-[var(--ui-border)] shadow-[8px_8px_0px_var(--ui-accent)] py-2 z-50">
            <div class="px-4 pb-2 mb-2 border-b-2 border-[var(--ui-border)]">
              <span class="text-xs text-[var(--ui-text-muted)] font-bold uppercase tracking-widest font-mono">{{ t('navbar.selectLanguage') }}</span>
            </div>
            <button v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang.code)"
              class="w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-widest font-mono text-[var(--ui-text-secondary)] hover:bg-[var(--ui-accent)] hover:text-[var(--ui-text-on-accent)] transition-colors flex items-center justify-between group/item"
              :class="{ 'text-[var(--ui-accent)]': appStore.locale === lang.code }">
              {{ lang.name }}
              <span v-if="appStore.locale === lang.code"
                class="w-2 h-2 bg-current"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu"
          class="md:hidden theme-nav-link p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0">
      <div v-if="showMobileMenu"
        class="md:hidden border-t theme-border theme-panel-strong backdrop-blur-xl absolute left-0 right-0">
        <div class="container mx-auto px-4 py-4 space-y-1">
          <router-link v-for="item in menuItems" :key="item.path" :to="item.path" @click="showMobileMenu = false"
            class="w-full justify-start theme-nav-link text-sm"
            active-class="theme-nav-link-active">
            {{ t(item.label) }}
          </router-link>
          <router-link v-if="!userAuthStore.isAuthenticated" to="/guest/orders" @click="showMobileMenu = false"
            class="w-full justify-start theme-nav-link text-sm"
            active-class="theme-nav-link-active">
            {{ t('navbar.guestOrders') }}
          </router-link>
          <router-link v-if="!userAuthStore.isAuthenticated" to="/auth/login" @click="showMobileMenu = false"
            class="w-full justify-start theme-nav-link text-sm"
            active-class="theme-nav-link-active">
            {{ t('navbar.login') }}
          </router-link>
          <router-link v-if="userAuthStore.isAuthenticated" to="/me" @click="showMobileMenu = false"
            class="w-full justify-start theme-nav-link text-sm"
            active-class="theme-nav-link-active">
            {{ t('navbar.personalCenter') }}
          </router-link>
          <button v-if="userAuthStore.isAuthenticated" @click="userAuthStore.logout(); showMobileMenu = false"
            class="w-full text-left px-4 py-3 rounded-lg text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium border border-transparent hover:border-red-200 dark:hover:border-red-500/20">
            {{ t('navbar.logout') }}
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { useCartStore } from '../stores/cart'
import { useUserAuthStore } from '../stores/userAuth'
import { useTheme } from '../utils/theme'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const appStore = useAppStore()
const cartStore = useCartStore()
const userAuthStore = useUserAuthStore()
const { themeMode, cycleThemeMode } = useTheme()

const showMobileMenu = ref(false)
const showLangMenu = ref(false)

const menuItems = [
  { path: '/', label: 'nav.home' },
  { path: '/products', label: 'nav.products' },
  { path: '/blog', label: 'nav.blog' },
  { path: '/notice', label: 'nav.notice' },
  { path: '/about', label: 'nav.about' },
]

const languages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en-US', name: 'English' },
]

const currentLocale = computed(() => {
  const lang = languages.find(l => l.code === appStore.locale)
  if (!lang) return 'CN'
  return lang.code === 'en-US' ? 'EN' : (lang.code === 'zh-CN' ? '简' : '繁')
})

const currentThemeLabel = computed(() => {
  if (themeMode.value === 'system') return t('navbar.themeSystem')
  if (themeMode.value === 'dark') return t('navbar.themeDark')
  return t('navbar.themeLight')
})

const currentThemeShort = computed(() => {
  if (themeMode.value === 'system') return 'SYS'
  if (themeMode.value === 'dark') return 'DARK'
  return 'LIGHT'
})

const cartCount = computed(() => cartStore.totalItems)

const brandSiteName = computed(() => {
  const text = String(appStore.config?.brand?.site_name || '').trim()
  return text !== '' ? text : '米米商城'
})


const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) showLangMenu.value = false
}

const toggleLangMenu = () => {
  showLangMenu.value = !showLangMenu.value
}

const changeLanguage = (langCode: string) => {
  appStore.setLocale(langCode)
  locale.value = langCode
  showLangMenu.value = false
}

// Click outside to close menus
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.lang-switcher')) {
    showLangMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
