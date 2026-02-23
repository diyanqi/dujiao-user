import { defineStore } from 'pinia'
import { ref } from 'vue'
import { configAPI } from '../api'
import { applyCustomScripts } from '../utils/customScripts'
import { useHead } from '@unhead/vue'

export const useAppStore = defineStore('app', () => {
    const locale = ref(localStorage.getItem('locale') || 'zh-CN')
    const config = ref<any>(null)
    const loading = ref(false)
    const seoVersion = ref(0)

    type SeoDefaults = { title: string; keywords: string; description: string; siteName: string }

    const hardcodedSeoDefaults: Record<'zh-CN' | 'zh-TW' | 'en-US', SeoDefaults> = {
        'zh-CN': {
            title: '米米小卖部 | 小初高到大学考研资料与软件账号自动发卡平台',
            keywords: '米米小卖部,自动发卡网,学习资料发卡平台,小学初中高中复习资料,大学考研备考资料,实用软件下载,账号购买,24小时自动发货,虚拟资源发卡,网课资料',
            description: '米米小卖部是专业的虚拟资源自动发卡平台，覆盖小学至考研全学段学习资料，并提供实用软件与账号服务。支持 24 小时自动发货，流程安全便捷。',
            siteName: '米米小卖部',
        },
        'zh-TW': {
            title: '米米小賣部 | 小初高到大學考研資料與軟體帳號自動發卡平台',
            keywords: '米米小賣部,自動發卡網,學習資料發卡平台,國小國中高中複習資料,大學考研備考資料,實用軟體下載,帳號購買,24小時自動發貨,虛擬資源發卡,網課資料',
            description: '米米小賣部是專業的虛擬資源自動發卡平台，覆蓋國小到考研全學段學習資料，並提供各類實用軟體與帳號服務。支援 24 小時自動發貨，流程安全便捷。',
            siteName: '米米小賣部',
        },
        'en-US': {
            title: 'Mimi Store | Study Materials, Software & Accounts Auto Delivery Platform',
            keywords: 'Mimi Store,digital delivery platform,study materials,primary middle high school resources,college exam prep,postgraduate exam prep,software downloads,account services,24/7 auto delivery',
            description: 'Mimi Store is a professional digital auto-delivery platform offering study materials from primary school to postgraduate exams, plus practical software and account services with secure 24/7 fulfillment.',
            siteName: 'Mimi Store',
        },
    }

    const getLocaleSeoDefaults = (): SeoDefaults => {
        const lang = locale.value as keyof typeof hardcodedSeoDefaults
        return hardcodedSeoDefaults[lang] ?? hardcodedSeoDefaults['zh-CN']
    }

    const getPreferredSiteUrl = () => {
        const siteUrl = config.value?.seo?.site_url || import.meta.env.VITE_SITE_URL || 'https://mmi.zone'
        return String(siteUrl).replace(/\/$/, '')
    }

    const getCanonicalUrl = () => {
        const siteUrl = getPreferredSiteUrl()
        if (typeof window === 'undefined') {
            return siteUrl
        }
        const current = new URL(window.location.href)
        return `${siteUrl}${current.pathname}${current.search}`
    }

    const getLocaleForOg = () => (locale.value === 'zh-CN' ? 'zh_CN' : locale.value.replace('-', '_'))

    // 设置语言
    const setLocale = (newLocale: string) => {
        locale.value = newLocale
        localStorage.setItem('locale', newLocale)
    }

    // 全局响应式 SEO 配置
    useHead({
        htmlAttrs: {
            lang: () => locale.value,
        },
        title: () => {
            const seo = config.value?.seo
            const lang = locale.value
            const defaults = getLocaleSeoDefaults()
            if (!seo) return defaults.title
            return seo.title && seo.title[lang] ? seo.title[lang] : defaults.title
        },
        meta: () => {
            seoVersion.value
            const seo = config.value?.seo
            const lang = locale.value
            const defaults = getLocaleSeoDefaults()
            const tags = []

            // 基础 SEO 标签
            tags.push({ key: 'keywords', name: 'keywords', content: seo?.keywords?.[lang] || defaults.keywords })
            tags.push({ key: 'description', name: 'description', content: seo?.description?.[lang] || defaults.description })
            tags.push({ key: 'robots', name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' })
            tags.push({ key: 'theme-color', name: 'theme-color', content: '#ffffff' })

            // Open Graph 标签
            tags.push({ key: 'og:type', property: 'og:type', content: 'website' })
            tags.push({ key: 'og:site_name', property: 'og:site_name', content: defaults.siteName })
            tags.push({ key: 'og:locale', property: 'og:locale', content: getLocaleForOg() })
            tags.push({ key: 'og:title', property: 'og:title', content: seo?.title?.[lang] || defaults.title })
            tags.push({ key: 'og:description', property: 'og:description', content: seo?.description?.[lang] || defaults.description })
            tags.push({ key: 'og:url', property: 'og:url', content: getCanonicalUrl() })
            // 注意：全局设置通常可以设置一个通用的 default_og_image
            if (seo?.og_image) {
                tags.push({ key: 'og:image', property: 'og:image', content: seo.og_image })
            }

            // Twitter Card 标签
            tags.push({ key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' })
            tags.push({ key: 'twitter:title', name: 'twitter:title', content: seo?.title?.[lang] || defaults.title })
            tags.push({ key: 'twitter:description', name: 'twitter:description', content: seo?.description?.[lang] || defaults.description })
            if (seo?.og_image) {
                tags.push({ key: 'twitter:image', name: 'twitter:image', content: seo.og_image })
            }

            return tags
        },
        link: () => {
            seoVersion.value
            return [{ key: 'canonical', rel: 'canonical', href: getCanonicalUrl() }]
        },
        script: () => {
            seoVersion.value
            const defaults = getLocaleSeoDefaults()
            const canonical = getCanonicalUrl()
            const name = defaults.siteName
            const description = config.value?.seo?.description?.[locale.value] || defaults.description
            const searchActionTarget = `${getPreferredSiteUrl()}/products?keyword={search_term_string}`

            const webSiteSchema = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name,
                url: getPreferredSiteUrl(),
                description,
                inLanguage: locale.value,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: searchActionTarget,
                    'query-input': 'required name=search_term_string',
                },
            }

            const organizationSchema = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name,
                url: getPreferredSiteUrl(),
                logo: `${getPreferredSiteUrl()}/dj.svg`,
            }

            return [
                {
                    key: 'ld-json-website',
                    type: 'application/ld+json',
                    textContent: JSON.stringify(webSiteSchema),
                },
                {
                    key: 'ld-json-organization',
                    type: 'application/ld+json',
                    textContent: JSON.stringify(organizationSchema),
                },
                {
                    key: 'ld-json-webpage',
                    type: 'application/ld+json',
                    textContent: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        url: canonical,
                        name: config.value?.seo?.title?.[locale.value] || defaults.title,
                        description,
                        inLanguage: locale.value,
                    }),
                },
            ]
        },
    })

    // 更新SEO信息 (向后兼容的方法)
    const applySEO = () => {
        seoVersion.value += 1
    }

    // 加载全局配置
    const loadConfig = async (force = false) => {
        if (config.value && !force) {
            applySEO()
            applyCustomScripts(config.value?.scripts)
            return
        }
        loading.value = true
        try {
            const response = await configAPI.get()
            config.value = response.data.data
            applySEO()
            applyCustomScripts(config.value?.scripts)
        } catch (error) {
            console.error('Failed to load config:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        locale,
        config,
        loading,
        setLocale,
        loadConfig,
        applySEO
    }
})
