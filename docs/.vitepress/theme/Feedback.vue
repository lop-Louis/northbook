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

function iconFor(href: string) {
  if (typeof href !== 'string') return 'book'
  return href.includes('github.com') ? 'github' : 'book'
}

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
        <svg
          v-if="iconFor(path.href) === 'github'"
          class="vp-button__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-3.162 19.491c.5.094.686-.217.686-.483 0-.237-.01-1.023-.014-1.855-2.79.606-3.379-1.194-3.379-1.194-.455-1.156-1.11-1.465-1.11-1.465-.907-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.228-.253-4.57-1.115-4.57-4.961 0-1.095.39-1.99 1.029-2.69-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.503.338 1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.69 0 3.857-2.346 4.705-4.58 4.953.36.31.679.917.679 1.85 0 1.334-.012 2.41-.012 2.737 0 .268.184.58.69.482A10 10 0 0 0 12 2Z"
          />
        </svg>
        <svg v-else class="vp-button__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6 2.75A2.75 2.75 0 0 0 3.25 5.5v13A2.75 2.75 0 0 0 6 21.25h12a.75.75 0 0 0 .75-.75V5.5A2.75 2.75 0 0 0 16 2.75H6Zm12 4H6a1.25 1.25 0 0 1 0-2.5h10A1.25 1.25 0 0 1 17.25 5v12.75H6A1.25 1.25 0 0 1 4.75 16.5V5.5A1.25 1.25 0 0 1 6 4.25Zm-6 5.5a.75.75 0 0 1-.75.75H8.5a.75.75 0 0 1 0-1.5h2.75a.75.75 0 0 1 .75.75ZM9.25 9a.75.75 0 0 1 .75-.75h1.75a.75.75 0 0 1 0 1.5H10a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
          />
        </svg>
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.vp-button:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.vp-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.vp-button__icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.4rem;
  flex-shrink: 0;
}
</style>
