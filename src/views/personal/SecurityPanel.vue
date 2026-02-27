<template>
  <div class="space-y-6">
    <!-- Email Security Card -->
    <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-accent)]">
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b-2 border-[var(--ui-border)] pb-4">
        <div>
          <h2 class="text-2xl font-black text-[var(--ui-accent)] uppercase tracking-widest font-mono">{{ t('personalCenter.security.title') }}</h2>
          <p class="mt-2 text-sm font-bold text-[var(--ui-text-muted)] font-mono">
            {{ requiresOldEmailCode ? t('personalCenter.security.subtitle') : t('personalCenter.security.subtitleBindOnly') }}
          </p>
        </div>
        <span class="border-2 border-[var(--ui-accent)] bg-[var(--ui-accent-soft)] text-[var(--ui-accent)] px-4 py-2 text-xs font-black uppercase tracking-widest">
          {{ t('personalCenter.tabs.security') }}
        </span>
      </div>

      <div v-if="securityAlert" class="mb-6 border-2 px-4 py-3 text-sm font-black uppercase tracking-wider" :class="securityAlert.level === 'error' ? 'border-[var(--ui-danger)] bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] shadow-[4px_4px_0px_var(--ui-danger)]' : 'border-[var(--ui-success)] bg-[var(--ui-success-soft)] text-[var(--ui-success)] shadow-[4px_4px_0px_var(--ui-success)]'">
        {{ securityAlert.message }}
      </div>

      <!-- Telegram Binding -->
      <div class="mb-8 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-base font-black text-[var(--ui-text-primary)] uppercase tracking-widest font-mono">{{ t('personalCenter.security.telegramTitle') }}</h3>
            <p class="mt-1 text-xs font-bold text-[var(--ui-text-muted)] font-mono">
              {{ telegramEnabled ? t('personalCenter.security.telegramSubtitle') : t('personalCenter.security.telegramDisabledTip') }}
            </p>
          </div>
          <span class="border-2 px-3 py-1 text-xs font-black uppercase tracking-widest font-mono" :class="telegramBound ? 'border-[var(--ui-success)] bg-[var(--ui-success-soft)] text-[var(--ui-success)]' : 'border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)]'">
            {{ telegramBound ? t('personalCenter.security.telegramBound') : t('personalCenter.security.telegramUnbound') }}
          </span>
        </div>

        <div v-if="userProfileStore.loadingTelegramBinding" class="mt-4 border-2 border-dashed border-[var(--ui-border)] px-4 py-4 text-sm font-mono text-[var(--ui-text-muted)]">
          {{ t('personalCenter.security.telegramLoading') }}
        </div>

        <div v-else-if="telegramBound" class="mt-4 space-y-4 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-4">
          <div class="flex items-center gap-3">
            <img
              v-if="userProfileStore.telegramBinding?.avatar_url"
              :src="userProfileStore.telegramBinding?.avatar_url"
              alt="Telegram Avatar"
              class="h-11 w-11 border-2 border-[var(--ui-accent)] object-cover"
            />
            <div>
              <p class="text-sm font-black text-[var(--ui-text-primary)] font-mono">{{ telegramDisplayName }}</p>
              <p class="text-xs font-bold text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.telegramBindID', { id: userProfileStore.telegramBinding?.provider_user_id || '-' }) }}</p>
            </div>
          </div>
          <p class="text-xs font-mono text-[var(--ui-text-muted)]">
            {{ t('personalCenter.security.telegramBindTime', { time: formatDate(userProfileStore.telegramBinding?.auth_at) || '-' }) }}
          </p>
          <button
            type="button"
            class="inline-flex items-center justify-center border-2 border-[var(--ui-danger)] px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--ui-danger)] hover:bg-[var(--ui-danger-soft)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="userProfileStore.unbindingTelegram || !canUnbindTelegram"
            @click="handleUnbindTelegram"
          >
            {{ userProfileStore.unbindingTelegram ? t('personalCenter.security.telegramUnbinding') : t('personalCenter.security.telegramUnbind') }}
          </button>
          <p v-if="!canUnbindTelegram" class="text-xs font-mono text-[var(--ui-text-muted)]">
            {{ t('personalCenter.security.telegramUnbindDisabledTip') }}
          </p>
        </div>

        <div v-else class="mt-4 space-y-3">
          <p class="text-xs font-mono text-[var(--ui-text-muted)]">
            {{ telegramEnabled ? t('personalCenter.security.telegramUnboundTip') : t('personalCenter.security.telegramDisabledTip') }}
          </p>
          <div v-if="telegramEnabled" ref="telegramWidgetRef" class="flex justify-start"></div>
        </div>
      </div>

      <!-- Email Change Form -->
      <form class="space-y-6" @submit.prevent="handleChangeEmail">
        <div>
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.currentEmailLabel') }}</label>
          <input
            :value="currentEmailDisplay"
            disabled
            class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-soft)] px-4 py-3 text-sm font-mono text-[var(--ui-text-muted)] cursor-not-allowed"
          />
          <p v-if="!requiresOldEmailCode" class="mt-2 text-xs font-mono text-[var(--ui-text-muted)]">
            {{ t('personalCenter.security.bindOnlyTip') }}
          </p>
        </div>

        <div>
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.newEmailLabel') }}</label>
          <input
            v-model="securityForm.newEmail"
            type="email"
            :placeholder="t('personalCenter.security.newEmailPlaceholder')"
            class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
          />
        </div>

        <div class="grid grid-cols-1 gap-4" :class="requiresOldEmailCode ? 'lg:grid-cols-2' : ''">
          <div v-if="requiresOldEmailCode">
            <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.oldCodeLabel') }}</label>
            <div class="flex flex-col gap-2 sm:flex-row">
              <input
                v-model="securityForm.oldCode"
                :placeholder="t('personalCenter.security.codePlaceholder')"
                class="min-w-0 flex-1 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
              />
              <button
                type="button"
                @click="handleSendOldCode"
                :disabled="userProfileStore.sendingCode || oldCodeCooldown > 0"
                class="whitespace-nowrap border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3 text-xs font-black uppercase tracking-widest hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ oldCodeCooldown > 0 ? t('personalCenter.security.countdown', { seconds: oldCodeCooldown }) : t('personalCenter.security.sendOldCode') }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.newCodeLabel') }}</label>
            <div class="flex flex-col gap-2 sm:flex-row">
              <input
                v-model="securityForm.newCode"
                :placeholder="t('personalCenter.security.codePlaceholder')"
                class="min-w-0 flex-1 border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-accent)] focus:outline-none transition-colors"
              />
              <button
                type="button"
                @click="handleSendNewCode"
                :disabled="userProfileStore.sendingCode || newCodeCooldown > 0"
                class="whitespace-nowrap border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] px-4 py-3 text-xs font-black uppercase tracking-widest hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ newCodeCooldown > 0 ? t('personalCenter.security.countdown', { seconds: newCodeCooldown }) : t('personalCenter.security.sendNewCode') }}
              </button>
            </div>
          </div>
        </div>

        <div class="border-t-2 border-[var(--ui-border)] pt-5">
          <button
            type="submit"
            :disabled="userProfileStore.changingEmail"
            class="inline-flex items-center justify-center border-2 border-[var(--ui-accent)] bg-[var(--ui-accent)] px-8 py-3 text-sm font-black uppercase tracking-widest text-[var(--ui-text-on-accent)] hover:bg-transparent hover:text-[var(--ui-accent)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{
              userProfileStore.changingEmail
                ? t('personalCenter.security.submitting')
                : (requiresOldEmailCode ? t('personalCenter.security.submit') : t('personalCenter.security.bindSubmit'))
            }}
          </button>
        </div>
      </form>
    </div>

    <!-- Login Logs Card -->
    <div class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-border)]">
      <div class="mb-6 flex items-center justify-between border-b-2 border-[var(--ui-border)] pb-4">
        <h3 class="text-lg font-black text-[var(--ui-text-primary)] uppercase tracking-widest font-mono">{{ t('personalCenter.security.loginLogsTitle') }}</h3>
        <span class="text-xs font-mono font-bold text-[var(--ui-text-muted)]">{{ t('personalCenter.security.loginLogsTip') }}</span>
      </div>
      <div v-if="userProfileStore.loadingLoginLogs" class="border-2 border-[var(--ui-border)] px-4 py-6 text-center text-sm font-mono text-[var(--ui-text-muted)]">
        {{ t('personalCenter.security.loginLogsLoading') }}
      </div>
      <div v-else-if="userProfileStore.recentLoginLogs.length === 0" class="border-2 border-dashed border-[var(--ui-border)] px-4 py-6 text-center text-sm font-mono text-[var(--ui-text-muted)]">
        {{ t('personalCenter.security.loginLogsEmpty') }}
      </div>
      <div v-else class="overflow-x-auto border-2 border-[var(--ui-border)]">
        <table class="min-w-full divide-y-2 divide-[var(--ui-border)] text-left text-sm">
          <thead class="bg-[var(--ui-bg-soft)]">
            <tr>
              <th class="px-4 py-3 text-xs font-black uppercase tracking-widest font-mono text-[var(--ui-text-muted)]">{{ t('personalCenter.security.loginLogsTime') }}</th>
              <th class="px-4 py-3 text-xs font-black uppercase tracking-widest font-mono text-[var(--ui-text-muted)]">{{ t('personalCenter.security.loginLogsStatus') }}</th>
              <th class="px-4 py-3 text-xs font-black uppercase tracking-widest font-mono text-[var(--ui-text-muted)]">{{ t('personalCenter.security.loginLogsIp') }}</th>
              <th class="px-4 py-3 text-xs font-black uppercase tracking-widest font-mono text-[var(--ui-text-muted)]">{{ t('personalCenter.security.loginLogsReason') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y-2 divide-[var(--ui-border)]">
            <tr v-for="item in userProfileStore.recentLoginLogs" :key="item.id" class="hover:bg-[var(--ui-bg-soft)] transition-colors">
              <td class="px-4 py-3 text-xs font-mono text-[var(--ui-text-secondary)]">{{ formatDate(item.created_at) }}</td>
              <td class="px-4 py-3">
                <span class="border-2 px-2 py-0.5 text-xs font-black uppercase tracking-widest font-mono" :class="loginStatusClass(item.status)">
                  {{ loginStatusLabel(item.status) }}
                </span>
              </td>
              <td class="px-4 py-3 font-mono text-xs text-[var(--ui-text-secondary)]">{{ item.client_ip || '-' }}</td>
              <td class="px-4 py-3 text-xs font-mono text-[var(--ui-text-muted)]">{{ loginReasonLabel(item.fail_reason) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Password Card -->
    <div v-if="canManagePassword" class="border-2 border-[var(--ui-border)] bg-[var(--ui-bg-elevated)] p-8 shadow-[8px_8px_0px_var(--ui-danger)]">
      <div class="mb-6 border-b-2 border-[var(--ui-border)] pb-4">
        <h3 class="text-lg font-black text-[var(--ui-danger)] uppercase tracking-widest font-mono">
          {{ requiresOldPassword ? t('personalCenter.security.passwordTitle') : t('personalCenter.security.setPasswordTitle') }}
        </h3>
        <p class="mt-2 text-sm font-bold text-[var(--ui-text-muted)] font-mono">
          {{ requiresOldPassword ? t('personalCenter.security.passwordSubtitle') : t('personalCenter.security.setPasswordSubtitle') }}
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleChangePassword">
        <div v-if="requiresOldPassword">
          <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.currentPasswordLabel') }}</label>
          <input
            v-model="passwordForm.oldPassword"
            type="password"
            :placeholder="t('personalCenter.security.passwordPlaceholder')"
            class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-danger)] focus:outline-none transition-colors"
          />
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.newPasswordLabel') }}</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              :placeholder="t('personalCenter.security.passwordPlaceholder')"
              class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-danger)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label class="mb-2 block text-xs font-black uppercase tracking-widest text-[var(--ui-text-muted)] font-mono">{{ t('personalCenter.security.confirmPasswordLabel') }}</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              :placeholder="t('personalCenter.security.passwordPlaceholder')"
              class="w-full border-2 border-[var(--ui-border)] bg-[var(--ui-bg-page)] px-4 py-3 text-sm font-mono focus:border-[var(--ui-danger)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div class="border-t-2 border-[var(--ui-border)] pt-5">
          <button
            type="submit"
            :disabled="userProfileStore.changingPassword"
            class="inline-flex items-center justify-center border-2 border-[var(--ui-danger)] bg-[var(--ui-danger)] px-8 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-transparent hover:text-[var(--ui-danger)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{
              userProfileStore.changingPassword
                ? (requiresOldPassword ? t('personalCenter.security.changePasswordSubmitting') : t('personalCenter.security.setPasswordSubmitting'))
                : (requiresOldPassword ? t('personalCenter.security.changePassword') : t('personalCenter.security.setPassword'))
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { type PageAlert } from '../../utils/alerts'
import type { TelegramAuthPayload } from '../../api'
import { useAppStore } from '../../stores/app'
import { useUserProfileStore } from '../../stores/userProfile'
import { useUserAuthStore } from '../../stores/userAuth'

const { t } = useI18n()
const appStore = useAppStore()
const userProfileStore = useUserProfileStore()
const userAuthStore = useUserAuthStore()

const securityForm = reactive({
  newEmail: '',
  oldCode: '',
  newCode: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const securityAlert = ref<PageAlert | null>(null)
const oldCodeCooldown = ref(0)
const newCodeCooldown = ref(0)
const telegramWidgetRef = ref<HTMLDivElement | null>(null)
let cooldownTimer: number | null = null
const telegramCallbackName = '__mmiSecurityTelegramBind'

const telegramConfig = computed(() => appStore.config?.telegram_auth || null)
const telegramBotUsername = computed(() => String(telegramConfig.value?.bot_username || '').trim())
const telegramEnabled = computed(() => !!telegramConfig.value?.enabled && telegramBotUsername.value !== '')
const telegramBound = computed(() => !!userProfileStore.telegramBinding?.bound)
const emailChangeMode = computed(() => userProfileStore.profile?.email_change_mode || 'change_with_old_and_new')
const requiresOldEmailCode = computed(() => emailChangeMode.value !== 'bind_only')
const canManagePassword = computed(() => requiresOldEmailCode.value)
const passwordChangeMode = computed(() => userProfileStore.profile?.password_change_mode || 'change_with_old')
const requiresOldPassword = computed(() => passwordChangeMode.value !== 'set_without_old')
const canUnbindTelegram = computed(() => requiresOldEmailCode.value)
const currentEmailDisplay = computed(() => {
  if (!requiresOldEmailCode.value) {
    return t('personalCenter.security.bindOnlyEmailDisplay')
  }
  return userProfileStore.profile?.email || ''
})
const telegramDisplayName = computed(() => {
  if (userProfileStore.telegramBinding?.username) {
    return `@${userProfileStore.telegramBinding.username}`
  }
  return t('personalCenter.security.telegramDisplayFallback')
})

const startCooldown = (kind: 'old' | 'new') => {
  if (kind === 'old') {
    oldCodeCooldown.value = 60
  } else {
    newCodeCooldown.value = 60
  }
  if (cooldownTimer !== null) return
  cooldownTimer = window.setInterval(() => {
    if (oldCodeCooldown.value > 0) {
      oldCodeCooldown.value -= 1
    }
    if (newCodeCooldown.value > 0) {
      newCodeCooldown.value -= 1
    }
    if (oldCodeCooldown.value === 0 && newCodeCooldown.value === 0 && cooldownTimer !== null) {
      window.clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

const handleSendOldCode = async () => {
  securityAlert.value = null
  if (!requiresOldEmailCode.value) {
    securityAlert.value = {
      level: 'warning',
      message: t('personalCenter.security.bindOnlyOldCodeDisabled'),
    }
    return
  }
  const ok = await userProfileStore.sendChangeEmailCode({ kind: 'old' })
  if (!ok) {
    securityAlert.value = {
      level: 'error',
      message: userProfileStore.securityError || t('personalCenter.security.sendCodeFailed'),
    }
    return
  }
  startCooldown('old')
  securityAlert.value = {
    level: 'success',
    message: t('personalCenter.security.sendOldCodeSuccess'),
  }
}

const handleSendNewCode = async () => {
  securityAlert.value = null
  const newEmail = securityForm.newEmail.trim()
  if (!newEmail) {
    securityAlert.value = {
      level: 'warning',
      message: t('personalCenter.security.newEmailRequired'),
    }
    return
  }
  const ok = await userProfileStore.sendChangeEmailCode({ kind: 'new', new_email: newEmail })
  if (!ok) {
    securityAlert.value = {
      level: 'error',
      message: userProfileStore.securityError || t('personalCenter.security.sendCodeFailed'),
    }
    return
  }
  startCooldown('new')
  securityAlert.value = {
    level: 'success',
    message: t('personalCenter.security.sendNewCodeSuccess'),
  }
}

const handleChangeEmail = async () => {
  securityAlert.value = null
  const requiresOldCode = requiresOldEmailCode.value
  const oldCode = securityForm.oldCode.trim()
  const payload = {
    new_email: securityForm.newEmail.trim(),
    new_code: securityForm.newCode.trim(),
    ...(requiresOldCode ? { old_code: oldCode } : {}),
  }
  if (!payload.new_email || !payload.new_code || (requiresOldCode && !oldCode)) {
    securityAlert.value = {
      level: 'warning',
      message: requiresOldCode
        ? t('personalCenter.security.changeEmailRequired')
        : t('personalCenter.security.bindEmailRequired'),
    }
    return
  }

  const ok = await userProfileStore.changeEmail(payload)
  if (!ok) {
    securityAlert.value = {
      level: 'error',
      message: userProfileStore.securityError || t('personalCenter.security.changeEmailFailed'),
    }
    return
  }

  securityForm.newEmail = ''
  securityForm.oldCode = ''
  securityForm.newCode = ''
  oldCodeCooldown.value = 0
  newCodeCooldown.value = 0
  securityAlert.value = {
    level: 'success',
    message: requiresOldCode
      ? t('personalCenter.security.changeEmailSuccess')
      : t('personalCenter.security.bindEmailSuccess'),
  }
}

const handleChangePassword = async () => {
  securityAlert.value = null
  const oldPassword = passwordForm.oldPassword.trim()
  const newPassword = passwordForm.newPassword.trim()
  const confirmPassword = passwordForm.confirmPassword.trim()
  const needOldPassword = requiresOldPassword.value

  if (!newPassword || !confirmPassword || (needOldPassword && !oldPassword)) {
    securityAlert.value = {
      level: 'warning',
      message: needOldPassword
        ? t('personalCenter.security.changePasswordRequired')
        : t('personalCenter.security.setPasswordRequired'),
    }
    return
  }

  if (newPassword !== confirmPassword) {
    securityAlert.value = {
      level: 'warning',
      message: t('personalCenter.security.passwordMismatch'),
    }
    return
  }

  const payload = {
    ...(needOldPassword ? { old_password: oldPassword } : {}),
    new_password: newPassword,
  }
  const ok = await userProfileStore.changePassword(payload)

  if (!ok) {
    securityAlert.value = {
      level: 'error',
      message: userProfileStore.securityError || t('personalCenter.security.changePasswordFailed'),
    }
    return
  }

  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  securityAlert.value = {
    level: 'success',
    message: needOldPassword
      ? t('personalCenter.security.changePasswordSuccess')
      : t('personalCenter.security.setPasswordSuccess'),
  }

  userAuthStore.logout('/auth/login?reason=password_changed')
}

const buildTelegramPayload = (raw: any): TelegramAuthPayload | null => {
  const id = Number(raw?.id)
  const authDate = Number(raw?.auth_date)
  const hash = String(raw?.hash || '').trim()
  if (!Number.isFinite(id) || id <= 0 || !Number.isFinite(authDate) || authDate <= 0 || hash === '') {
    return null
  }
  return {
    id,
    first_name: String(raw?.first_name || '').trim(),
    last_name: String(raw?.last_name || '').trim(),
    username: String(raw?.username || '').trim(),
    photo_url: String(raw?.photo_url || '').trim(),
    auth_date: authDate,
    hash,
  }
}

const clearTelegramWidget = () => {
  if (telegramWidgetRef.value) {
    telegramWidgetRef.value.innerHTML = ''
  }
}

const renderTelegramWidget = () => {
  if (!telegramEnabled.value || telegramBound.value || !telegramWidgetRef.value) {
    clearTelegramWidget()
    return
  }
  clearTelegramWidget()
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', telegramBotUsername.value)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-userpic', 'false')
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-onauth', `${telegramCallbackName}(user)`)
  script.onerror = () => {
    securityAlert.value = {
      level: 'error',
      message: t('personalCenter.security.telegramWidgetLoadFailed'),
    }
  }
  telegramWidgetRef.value.appendChild(script)
}

const handleTelegramBind = async (raw: any) => {
  securityAlert.value = null
  const payload = buildTelegramPayload(raw)
  if (!payload) {
    securityAlert.value = {
      level: 'warning',
      message: t('personalCenter.security.telegramInvalidPayload'),
    }
    return
  }
  const ok = await userProfileStore.bindTelegram(payload)
  if (!ok) {
    securityAlert.value = {
      level: 'error',
      message: userProfileStore.securityError || t('personalCenter.security.telegramBindFailed'),
    }
    return
  }
  securityAlert.value = {
    level: 'success',
    message: t('personalCenter.security.telegramBindSuccess'),
  }
  renderTelegramWidget()
}

const handleUnbindTelegram = async () => {
  securityAlert.value = null
  const ok = await userProfileStore.unbindTelegram()
  if (!ok) {
    securityAlert.value = {
      level: 'error',
      message: userProfileStore.securityError || t('personalCenter.security.telegramUnbindFailed'),
    }
    return
  }
  securityAlert.value = {
    level: 'success',
    message: t('personalCenter.security.telegramUnbindSuccess'),
  }
  renderTelegramWidget()
}

const loginStatusLabel = (status?: string) => {
  const normalized = (status || '').trim() || 'failed'
  return t(`personalCenter.security.loginLogsStatusMap.${normalized}`)
}

const loginStatusClass = (status?: string) => {
  if ((status || '').trim() === 'success') {
    return 'theme-badge-success'
  }
  return 'theme-badge-danger'
}

const loginReasonLabel = (reason?: string) => {
  const normalized = (reason || '').trim()
  if (!normalized) return '-'
  const key = `personalCenter.security.loginLogsReasonMap.${normalized}`
  const translated = t(key)
  return translated === key ? normalized : translated
}

const formatDate = (raw?: string | null) => {
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleString()
}

onMounted(async () => {
  await Promise.all([
    appStore.loadConfig(),
    userProfileStore.loadRecentLoginLogs(10),
    userProfileStore.loadTelegramBinding(),
  ])
  const win = window as Window & Record<string, any>
  win[telegramCallbackName] = handleTelegramBind
  renderTelegramWidget()
})

onUnmounted(() => {
  const win = window as Window & Record<string, any>
  delete win[telegramCallbackName]
  clearTelegramWidget()
  if (cooldownTimer !== null) {
    window.clearInterval(cooldownTimer)
    cooldownTimer = null
  }
})

watch([telegramEnabled, telegramBotUsername, telegramBound], () => {
  renderTelegramWidget()
})
</script>
