<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const feedbackPaths = computed(() => {
  const paths = page.value?.frontmatter?.feedback_paths
  if (!Array.isArray(paths)) return []
  return paths
    .map(item => {
      if (!item) return null
      const { label, href } = item as { label?: string; href?: string }
      if (!label || !href) return null
      return { label, href }
    })
    .filter(Boolean) as { label: string; href: string }[]
})

const shouldRender = computed(() => {
  const frontmatter = page.value?.frontmatter ?? {}
  if (frontmatter.skip_feedback === true) return false
  if (frontmatter.layout === 'home') return false
  return feedbackPaths.value.length > 0
})
</script>

<template>
  <div v-if="shouldRender" class="vp-feedback" role="region" aria-label="Page feedback exits">
    <div class="vp-feedback__title">
      If this page isn’t working for you, use one of these exits:
    </div>
    <div class="vp-feedback__row">
      <a
        v-for="path in feedbackPaths"
        :key="path.href"
        class="vp-button"
        :href="path.href"
        target="_blank"
        rel="noopener"
      >
        {{ path.label }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.vp-feedback {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  display: grid;
  gap: 0.4rem;
}

.vp-feedback__title {
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.85;
}

.vp-feedback__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.vp-button {
  font-size: 0.95rem;
  line-height: 1.4;
}
</style>
