<template>
  <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)] hover-scale">
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b-2 border-[var(--ui-border)] pb-4">
      <div>
        <h2 class="text-2xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono">{{ t('personalCenter.profile.title') }}</h2>
        <p class="mt-2 text-sm font-bold text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.profile.subtitle') }}</p>
      </div>
      <span class="border-2 border-[var(--ui-accent)] bg-[var(--ui-accent-soft)] text-[var(--ui-accent)] px-4 py-2 text-xs font-black uppercase tracking-widest">
        {{ t('personalCenter.tabs.profile') }}
      </span>
    </div>

    <div v-if="profileAlert" class="mb-6 border-2 px-4 py-3 text-sm font-black uppercase tracking-wider" :class="profileAlert.level === 'error' ? 'border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] shadow-[4px_4px_0px_var(--ui-danger)]' : 'border-[var(--ui-success)] bg-[var(--ui-success-soft)] text-[var(--ui-success)] shadow-[4px_4px_0px_var(--ui-success)]'">
      {{ profileAlert.message }}
    </div>

    <form class="space-y-8" @submit.prevent="handleSaveProfile">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.profile.emailLabel') }}</label>
          <input
            :value="userProfileStore.profile?.email || ''"
            disabled
            class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-4 py-3 text-sm font-mono text-[var(--ui-text-muted)] cursor-not-allowed"
          />
        </div>

        <div>
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.profile.nicknameLabel') }}</label>
          <input
            v-model="profileForm.nickname"
            :placeholder="t('personalCenter.profile.nicknamePlaceholder')"
            class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.profile.localeLabel') }}</label>
          <select
            v-model="profileForm.locale"
            class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
          >
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col gap-4 border-t-2 border-[var(--ui-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs font-bold text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.profile.subtitle') }}</p>
        <button
          type="submit"
          :disabled="userProfileStore.savingProfile"
          class="inline-flex items-center justify-center border-2 border-[var(--ui-accent)] bg-[var(--ui-accent)] px-8 py-3 text-sm font-black uppercase tracking-widest text-[var(--ui-text-on-accent)] hover:bg-transparent hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ userProfileStore.savingProfile ? t('personalCenter.profile.saving') : t('personalCenter.profile.save') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { type PageAlert } from '../../utils/alerts'
import { useUserProfileStore } from '../../stores/userProfile'

const { t } = useI18n()
const userProfileStore = useUserProfileStore()

const profileForm = reactive({
  nickname: '',
  locale: 'zh-CN',
})

const profileAlert = ref<PageAlert | null>(null)

const handleSaveProfile = async () => {
  profileAlert.value = null
  const payload = {
    nickname: profileForm.nickname.trim(),
    locale: profileForm.locale,
  }
  const ok = await userProfileStore.saveProfile(payload)
  if (!ok) {
    profileAlert.value = {
      level: 'error',
      message: userProfileStore.profileError || t('personalCenter.common.saveFailed'),
    }
    return
  }
  profileAlert.value = {
    level: 'success',
    message: t('personalCenter.profile.saveSuccess'),
  }
}

watch(
  () => userProfileStore.profile,
  (profile) => {
    if (!profile) return
    profileForm.nickname = profile.nickname || ''
    profileForm.locale = profile.locale || 'zh-CN'
  },
  { immediate: true }
)
</script>
