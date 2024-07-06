<template lang="pug">
.col-9.flex.relative.column
  .row.q-col-gutter-md.q-mb-md
    div
      q-card.bg-secondary.full-height.content-center(flat)
        q-btn.full-height(color="white" icon="mdi-reply" flat)
    .col
      q-card.bg-primary.q-pa-md(flat)
        div Anna
    div
      q-card.bg-primary.q-pa-sm.full-height.content-center(flat)
        //- q-icon.q-mr-sm(name="mdi-radar" size="sm")
        span Grand
    div
      q-card.bg-primary.q-pa-sm.full-height.content-center(flat)
        q-icon.q-mr-sm(name="mdi-radar" size="sm")
        span 20m
    div
      q-card.bg-primary.q-pa-sm.full-height.content-center(flat)
        q-icon.q-mr-sm(name="mdi-run-fast" size="sm")
        span 4.4 m/s
    div
      q-card.bg-primary.q-pa-sm.full-height.content-center(flat)
        q-icon(name="mdi-gender-female" size="md")
    div
      q-card.bg-warning.full-height.content-center(flat)
        q-btn.full-height(color="white" flat) Voir en plus +
  .col.q-mb-md
    .row.full-height
      .col-3
        q-card.bg-primary.full-height.q-mr-md(flat)
          div
            q-img.fit(src="/img/IconPowers_huntingHatchets.webp" fit="contain")
          q-toolbar.absolute-bottom.text-center
            q-toolbar-title Hunting Hatchets
      .col
        q-card.bg-primary.full-height(flat)
          q-card-section.q-pa-md.text-center
            .text-h6 A propos
          q-card-section.q-pa-md
            div Une tueuse à distance capable de lancer des <b>Hachettes de chasse</b> sur les survivants pour les blesser de loin.<br><br>Ses compétences personnelles <b>Prédation</b>, <b>Instinct territorial</b> et <b>Sort : Berceuse de la Chasseuse</b> lui permettent de mettre les survivants sous pression au moyen d'une meilleure lecture de carte et de compétences de poursuite améliorées.
  q-card.bg-primary(flat)
    q-carousel.bg-transparent(
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="warning"
      infinite
      padding
      arrows
      height="200px"
      class="rounded-borders"
    )
      q-carousel-slide(:name="1" class="column no-wrap")
        .row.fit.justify-start.items-center.q-gutter-xs.q-col-gutter.no-wrap
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
      q-carousel-slide(:name="2" class="column no-wrap")
        .row.fit.justify-start.items-center.q-gutter-xs.q-col-gutter.no-wrap
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
      q-carousel-slide(:name="3" class="column no-wrap")
        .row.fit.justify-start.items-center.q-gutter-xs.q-col-gutter.no-wrap
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
          q-img.rounded-borders.col.full-height(src="/img/IconPerks_beastOfPrey.webp")
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const slide = ref(1)
</script>
