<template>
  <div class="min-h-[70vh] theme-page flex items-center justify-center px-4 py-20">
    <div class="theme-auth-card max-w-2xl w-full text-center hover-scale">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] theme-text-accent">404</p>
      <h1 class="mt-3 text-4xl font-black theme-text-primary">{{ t('notFound.title') }}</h1>
      <p class="mt-4 text-sm theme-text-muted">{{ t('notFound.description') }}</p>

      <div class="mt-8 flex items-center justify-center gap-3">
        <router-link
          to="/"
          class="inline-flex items-center justify-center rounded-xl theme-btn-primary px-5 py-3 text-sm font-bold"
        >
          {{ t('notFound.backHome') }}
        </router-link>
        <router-link
          to="/products"
          class="inline-flex items-center justify-center rounded-xl border theme-btn-secondary px-5 py-3 text-sm font-semibold"
        >
          {{ t('notFound.browseProducts') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'

const { t } = useI18n()
const appStore = useAppStore()

const brandSiteName = computed(() => {
  const text = String(appStore.config?.brand?.site_name || '').trim()
  return text !== '' ? text : '米米商城'
})

useHead({
  title: () => `${t('notFound.title')} | ${brandSiteName.value}`,
  meta: () => [
    { name: 'robots', content: 'noindex,follow' },
    { name: 'description', content: t('notFound.description') },
  ],
})
</script>