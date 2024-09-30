<template lang="pug">
q-layout(view="lHh Lpr fff")
  q-page-container
    q-page.window-height.window-width.row.justify-center.items-center(
      :style-fn="getStyle"
    )
      .q-pa-md.flex.flex-center.full-height
        q-card(style="max-width: 400px;")
          q-card-section.q-pa-md.text-center
            q-icon(name="mdi-alert-circle" color="negative" size="52px")
            div(class="text-h5 q-my-md") Oups ! Un problème est survenu.
            div(class="text-subtitle1 q-my-md") {{ error.statusCode }} - {{ error.message }}
            div(class="q-my-md") Ne vous inquiétez pas, nous allons vous remettre sur le bon chemin.

          q-card-actions(align="around")
            q-btn(flat label="Retour à l'accueil" @click="$router.push('/')")
            q-btn(flat label="Retour a la page précédente" @click="$router.go(-1)")
            q-btn(flat label="Essayer à nouveau" @click="reloadPage")
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'
import type { PropType } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    default: null,
  },
})

const router = useRouter();

const getStyle = () => {
  return {
    backgroundImage: `url('https://www.lescinskas.lt/assets/img/posts/2019/docker.png'), linear-gradient(#5274C5, #9A4A9F)`,
    backgroundSize: 'cover',
  }
}

function reloadPage() {
  location.reload();
}
</script>
