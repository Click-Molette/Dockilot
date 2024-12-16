<template lang="pug">
q-dialog(ref="dialogRef" @hide="onDialogHideInternal")
  q-card.q-dialog-plugin
    q-toolbar(v-if="title")
      q-toolbar-title
        | Add Environment Variable
      q-btn(@click="onDialogHideInternal" icon="mdi-close" flat round dense)
    q-card-section
      .q-gutter-y-md.column
        q-input(
          v-model="form.key"
          :label="keyLabel"
          dense filled
        )
        q-input(
          v-model="form.value"
          :label="valueLabel"
          dense filled
        )
    q-card-actions(align="right")
      q-btn(v-if="onDialogCancelInternal" flat label="Cancel" @click="onDialogCancelInternal")
      q-btn(v-if="onDialogOKInternal" flat label="OK" @click="onDialogOKInternal")
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'

export default {
  name: 'PageStacksServiceDialogSelectorComponent',
  props: {
    title: {
      type: String,
      default: '',
    },
    keyLabel: {
      type: String,
      default: 'Key',
    },
    valueLabel: {
      type: String,
      default: 'Value',
    },
    defaultForm: {
      type: Object,
      default: () => ({}),
    },
  },
  setup({ defaultForm }) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      form: {
        key: defaultForm.key || '',
        value: defaultForm.value || '',
      },
    }
  },
  methods: {
    onDialogHideInternal() {
      return this.onDialogHide()
    },
    onDialogOKInternal() {
      return this.onDialogOK(this.form)
    },
    onDialogCancelInternal() {
      return this.onDialogCancel()
    },
  },
}
</script>
