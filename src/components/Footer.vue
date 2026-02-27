<template>
  <footer
    class="relative theme-panel-strong theme-text-secondary border-t-4 border-[var(--ui-accent)] overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMjU1LCAwLCA4NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')]">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--ui-accent)] to-transparent opacity-50"></div>
    <div class="container mx-auto px-4 py-16 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <!-- Brand -->
        <div class="md:col-span-2 space-y-6">
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 border-2 border-[var(--ui-accent)] bg-[var(--ui-accent-soft)] flex items-center justify-center shadow-[2px_2px_0px_var(--ui-accent)] transform -rotate-6">
              <span class="text-[var(--ui-accent)] font-black text-lg" style="font-family: 'Orbitron', sans-serif;">{{ brandInitial }}</span>
            </div>
            <h3 class="theme-text-primary text-2xl font-black tracking-widest uppercase" style="font-family: 'Orbitron', sans-serif; text-shadow: 2px 2px 0px var(--ui-accent-soft);">{{ brandSiteName }}</h3>
          </div>
          <p class="text-sm leading-relaxed max-w-sm theme-text-muted font-medium border-l-2 border-[var(--ui-border)] pl-3">
            {{ t('footer.description') }}
          </p>
          <div class="flex space-x-4">
            <!-- Social Icons (Placeholder) -->
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 class="theme-text-primary font-black mb-6 tracking-widest uppercase text-lg" style="font-family: 'Orbitron', sans-serif;">{{ t('footer.quickLinks') }}</h4>
          <ul class="space-y-3 text-sm font-bold">
            <li v-for="item in quickLinks" :key="item.path">
              <router-link :to="item.path" class="theme-link-muted transition-colors flex items-center group uppercase tracking-wider hover:text-[var(--ui-accent)]">
                <span
                  class="w-2 h-2 bg-[var(--ui-border)] mr-3 transition-colors group-hover:bg-[var(--ui-accent)] transform rotate-45"></span>
                {{ t(item.label) }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="theme-text-primary font-black mb-6 tracking-widest uppercase text-lg" style="font-family: 'Orbitron', sans-serif;">{{ t('footer.contact') }}</h4>
          <div class="space-y-4">
            <a v-if="config?.contact?.telegram" :href="config.contact.telegram" target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider hover:text-[var(--ui-accent)] transition-all p-3 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] hover:border-[var(--ui-accent)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--ui-accent)]">
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              <span>Telegram</span>
            </a>
            <a v-if="config?.contact?.whatsapp" :href="config.contact.whatsapp" target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider hover:text-[var(--ui-success)] transition-all p-3 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] hover:border-[var(--ui-success)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--ui-success)]">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div
        class="border-t-2 border-[var(--ui-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs theme-text-muted font-mono uppercase tracking-widest">
        <div class="space-y-2 text-center md:text-left">
          <p>&copy; {{ currentYear }} <span class="text-[var(--ui-accent)] font-bold">{{ brandSiteName }}</span>. {{ t('footer.rights') }}</p>
          <p class="flex items-center justify-center gap-2 md:justify-start">
            <span>改编自开源项目 Dujiao-Next</span>
            <span class="text-[var(--ui-accent)]">|</span>
            <a
              href="https://github.com/dujiao-next"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 hover:text-[var(--ui-accent)] transition-colors"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.4 7.86 10.922.575.106.784-.25.784-.556 0-.273-.01-1-.016-1.962-3.197.694-3.872-1.54-3.872-1.54-.522-1.326-1.274-1.678-1.274-1.678-1.042-.713.079-.699.079-.699 1.152.081 1.758 1.183 1.758 1.183 1.024 1.755 2.688 1.248 3.343.954.104-.742.401-1.248.73-1.535-2.552-.29-5.236-1.276-5.236-5.678 0-1.254.448-2.28 1.182-3.084-.118-.29-.512-1.457.112-3.04 0 0 .964-.308 3.158 1.178a10.98 10.98 0 0 1 2.876-.387c.976.004 1.96.132 2.878.387 2.192-1.486 3.154-1.178 3.154-1.178.626 1.583.232 2.75.114 3.04.736.804 1.18 1.83 1.18 3.084 0 4.413-2.688 5.384-5.248 5.668.412.354.78 1.052.78 2.12 0 1.53-.014 2.764-.014 3.14 0 .31.206.668.79.554C20.212 21.396 23.5 17.083 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
              </svg>
              <span>GitHub</span>
            </a>
          </p>
        </div>
        <div class="flex space-x-6 font-bold">
          <router-link to="/privacy" class="hover:text-[var(--ui-accent)] transition-colors">{{ t('footer.privacy') || 'Privacy Policy' }}</router-link>
          <router-link to="/terms" class="hover:text-[var(--ui-accent)] transition-colors">{{ t('footer.terms') || 'Terms of Service' }}</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'

const { t } = useI18n()
const appStore = useAppStore()

const config = computed(() => appStore.config)

const brandSiteName = computed(() => {
  const siteName = config.value?.brand?.site_name
  return typeof siteName === 'string' && siteName.trim() ? siteName.trim() : '米米商城'
})

const brandInitial = computed(() => {
  return brandSiteName.value.charAt(0).toUpperCase()
})

const quickLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/products', label: 'nav.products' },
  { path: '/blog', label: 'nav.blog' },
  { path: '/about', label: 'nav.about' },
]

const currentYear = new Date().getFullYear()
</script>
