<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import Feedback from './Feedback.vue'

const { Layout } = DefaultTheme
const { page } = useData()

const isPilotOrDraft = computed(() => {
  const filePath = page.value?.filePath || ''
  return filePath.includes('/drafts/') || page.value?.frontmatter?.status === 'pilot'
})

const pageTitle = computed(() => page.value?.frontmatter?.title ?? page.value?.title ?? '')

function goBack() {
  if (history.length > 1) {
    history.back()
  } else {
    window.location.href = withBase('/')
  }
}
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="nb-page-header">
        <button
          type="button"
          class="nb-back-button"
          aria-label="Go back to the previous page"
          @click="goBack"
        >
          ← Back
        </button>
        <span class="nb-spacer" />
        <div v-if="page.frontmatter.owner || page.frontmatter.status" class="nb-page-badges">
          <Badge v-if="page.frontmatter.owner" type="info">
            <strong>{{ page.frontmatter.owner }}</strong>
          </Badge>
          <Badge
            v-if="page.frontmatter.status"
            :type="page.frontmatter.status === 'pilot' ? 'warning' : 'tip'"
            class="nb-status-badge"
          >
            {{ page.frontmatter.status }}
          </Badge>
        </div>
      </div>
      <h1 v-if="pageTitle" class="nb-page-title">
        {{ pageTitle }}
      </h1>
      <div
        v-if="page.frontmatter.status === 'stale'"
        style="
          padding: 0.8rem;
          border: 1px solid var(--vp-c-divider);
          border-radius: 0.5rem;
          background: var(--vp-c-bg-soft);
          margin-bottom: 1rem;
        "
      >
        ⚠️ This page is due for review. Content may be outdated.
        <a
          href="https://github.com/lop-louis/northbook/issues?q=label%3Astale"
          target="_blank"
          rel="noopener"
        >
          See issue
        </a>
      </div>
      <div v-else-if="isPilotOrDraft" class="nb-draft-callout">
        🧪 This draft is still under testing and curation. Expect rough edges and help tighten it
        before sharing broadly.
      </div>
    </template>

    <!-- Optional: swap for Giscus if you want discussions -->
    <template #doc-after>
      <div class="vp-feedback">
        <Feedback />
      </div>
    </template>
  </Layout>
</template>
