<template lang="pug">
.col-3
  q-card.bg-primary.q-mb-md(flat)
    q-img(src="/img/New_Store_Huntress.webp")
      .absolute-bottom.full-width
        q-toolbar
          q-toolbar-title La Chasseuse
  q-card.bg-primary(flat)
    .row
      .col(v-for="i in 3")
        q-btn.fit(flat)
          q-avatar(size="128px")
            q-img(src="/img/IconPerks_hexHuntressLullaby.webp")
</template>
