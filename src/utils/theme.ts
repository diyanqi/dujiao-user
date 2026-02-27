import { ref, watch } from 'vue'

const TEA_THEME_KEY = 'mmi_theme'

type Theme = 'light' | 'dark'
type ThemeMode = Theme | 'system'

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getSavedThemeMode = (): ThemeMode | null => {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(TEA_THEME_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
        return raw
    }
    return null
}

const themeMode = ref<ThemeMode>(getSavedThemeMode() || 'system')
const resolvedTheme = ref<Theme>('light')

const resolveTheme = (mode: ThemeMode): Theme => {
    return mode === 'system' ? getSystemTheme() : mode
}

const applyTheme = (mode: ThemeMode) => {
    const newTheme = resolveTheme(mode)
    const root = document.documentElement
    if (newTheme === 'dark') {
        root.classList.add('dark')
    } else {
        root.classList.remove('dark')
    }
    resolvedTheme.value = newTheme
    localStorage.setItem(TEA_THEME_KEY, mode)
}

// Watch for changes and apply
watch(themeMode, (newVal) => {
    applyTheme(newVal)
}, { immediate: true })

if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
        if (themeMode.value === 'system') {
            applyTheme('system')
        }
    }
    mediaQuery.addEventListener('change', handleSystemThemeChange)
}

export const useTheme = () => {
    const setThemeMode = (mode: ThemeMode) => {
        themeMode.value = mode
    }

    const cycleThemeMode = () => {
        if (themeMode.value === 'system') {
            themeMode.value = 'light'
        } else if (themeMode.value === 'light') {
            themeMode.value = 'dark'
        } else {
            themeMode.value = 'system'
        }
    }

    return {
        themeMode,
        resolvedTheme,
        setThemeMode,
        cycleThemeMode
    }
}
