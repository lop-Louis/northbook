<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import ctaMap from '../../../../ops/cta-map.json'

type CtaConfig = {
  text: string
  doc?: string
}

const CTA_MAP = ctaMap as Record<string, CtaConfig>

const { page } = useData()

function docPathToRoute(docPath?: string) {
  if (!docPath) return undefined
  let normalized = docPath.trim().replace(/\\/g, '/')
  normalized = normalized.replace(/^(\.\/)+/, '')
  if (normalized.startsWith('docs/')) normalized = normalized.slice(5)
  if (!normalized) return '/'

  let isIndex = normalized.endsWith('index.md')
  if (isIndex) {
    normalized = normalized.slice(0, -'index.md'.length)
  } else if (normalized.endsWith('.md')) {
    normalized = normalized.slice(0, -'.md'.length)
  }

  normalized = normalized.replace(/\/+$/, '')
  let route = `/${normalized}`.replace(/\/+/g, '/')
  if (route !== '/' && isIndex) {
    route = `${route}/`
  }

  return route || '/'
}

const ctas = computed(() => {
  const frontmatter = page.value.frontmatter || {}
  const labels = [frontmatter.cta_primary_label, frontmatter.cta_secondary_label].filter(
    Boolean
  ) as string[]

  return labels
    .map(label => label.trim())
    .filter(Boolean)
    .map(label => {
      const mapped = CTA_MAP[label]
      if (!mapped) {
        return { key: label, text: label }
      }

      const route = docPathToRoute(mapped.doc)
      return {
        key: label,
        text: mapped.text,
        link: route ? withBase(route) : undefined
      }
    })
})
</script>

<template>
  <div v-if="ctas.length" class="page-ctas" role="group" aria-label="Page actions">
    <component
      :is="cta.link ? 'a' : 'span'"
      v-for="(cta, index) in ctas"
      :key="cta.key"
      :href="cta.link"
      class="page-cta"
      :class="{
        'page-cta--secondary': index === 1,
        'page-cta--static': !cta.link
      }"
      :aria-disabled="!cta.link"
    >
      <span class="page-cta__text">{{ cta.text }}</span>
    </component>
  </div>
</template>

<style scoped>
.page-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.page-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--vp-button-brand-border);
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
  min-height: 2.25rem;
}

.page-cta:hover {
  background: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
  color: var(--vp-button-brand-hover-text);
}

.page-cta--secondary {
  background: transparent;
  color: var(--vp-button-alt-text);
  border-color: var(--vp-button-alt-border);
}

.page-cta--secondary:hover {
  background: transparent;
  color: var(--vp-button-alt-hover-text);
  border-color: var(--vp-button-alt-hover-border);
}

.page-cta--static {
  cursor: default;
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  pointer-events: none;
}

.page-cta__text {
  text-align: center;
}
</style>
