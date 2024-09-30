<template lang="pug">
q-drawer.q-py-md.q-pl-md(
  v-model="drawer"
  side="left" :mini="true" :breakpoint="0" :mini-width="72"
  :style="{background: $q.dark.isActive ? 'var(--q-dark-page) !important' : ''}"
  persistent
)
  q-card.full-height.bg-transparent(flat)
    .row.no-wrap.column.full-height
      q-card.bg-primary.q-mb-md(flat)
        q-toolbar.q-px-none
          q-btn.rounded-borders(icon="mdi-docker" color="white" flat stretch)
      q-card.bg-primary.full-height.overflow-y-auto.flex.column(flat style='flex-flow: column;')
        q-list(dark)
          q-item.rounded-borders(v-for="item in list" clickable v-ripple :to="item.to" :key="item.name" active-class="text-orange")
            q-item-section(avatar)
              q-icon(:name="item.icon || 'mdi-square-rounded'")
            q-tooltip.text-body2(anchor="center left" self="center right") {{ item.name }}
        q-space
        q-separator.mobile-only
        q-list(dark)
          q-item.rounded-borders(v-for="item in list2" clickable v-ripple :to="item.to" :key="item.name" active-class="text-orange")
            q-item-section(avatar)
              q-icon(:name="item.icon || 'mdi-square-rounded'")
            q-tooltip.text-body2(anchor="center left" self="center right") {{ item.name }}
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'

const drawer = inject('drawer')

const list = ref([
  {
    name: 'Tableau de bord',
    icon: 'mdi-view-dashboard',
    to: '/',
  },
  {
    name: 'Stacks',
    icon: 'mdi-layers-outline',
    to: '/stacks',
  },
  {
    name: 'Containers',
    icon: 'mdi-cube',
    to: '/containers',
  },
  {
    name: 'Images',
    icon: 'mdi-image-text',
    to: '/images',
  },
  {
    name: 'Networks',
    icon: 'mdi-lan-connect',
    to: '/networks',
  },
  {
    name: 'Volumes',
    icon: 'mdi-database-outline',
    to: '/volumes',
  },
])

const list2 = ref([
  {
    name: 'Settings',
    icon: 'mdi-cog',
    to: '/settings',
  },
])
</script>
