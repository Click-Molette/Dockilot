<template lang="pug">
q-splitter.fit.q-custom-splitter(
  v-model="splitterModel"
  :horizontal='isSimple'
  :limits="!isSimple ? [30, 50] : [0, 100]"
  separator-style="width: 6px"
  background-color="primary"
  :style='{minHeight: !isSimple ? "inherit" : "initial"}'
)
  template(#before)
    q-card.full-height(:class='{"hidden": isSimple && targetId}' flat)
      q-card-section.q-pa-none
        slot(name="top-table")
      q-table.q-custom-sticky-last-column-table.full-height(
        @request="onRequest($event, total)"
        v-bind="$attrs"
        v-model:pagination="pagination"
        :loading="loading"
        :rows="rows"
        :columns="parsedColumns"
        :row-key="rowKey"
        :rows-per-page-options="rowsPerPageOptions"
        dense flat binary-state-sort
      )
        template(v-for="(_, name) in $slots" v-slot:[name]="slotData")
          slot(:name="name" v-bind="slotData")
        template(v-slot:body-cell-actions="props")
          q-td(:props="props")
            q-btn-group(flat rounded)
              slot(name="row-actions" v-bind="props")
  template(#separator)
    q-avatar(v-if='!isSimple' size="sm" color="primary" icon="mdi-unfold-more-vertical" class="text-white")
  template(#after)
    slot(name="after-content")
</template>

<script lang="ts">
import type { QTableProps } from 'quasar'

export default {
  name: 'Twopan',
  props: {
    simple: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    rows: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    rowsPerPageOptions: {
      type: Array as PropType<QTableProps['rowsPerPageOptions']>,
      default: () => [14, 16, 20, 50, 0],
    },
    columns: {
      type: Array as PropType<QTableProps['columns']>,
      default: () => [],
    },
    visibleColumns: {
      type: Array as PropType<QTableProps['visibleColumns']>,
      default: () => [],
    },
    targetId: {
      type: String,
      required: true,
    },
    rowClassHighlight: {
      type: String,
      default: 'q-custom-table-td-highlight',
    },
    rowClassHandler: {
      type: Function as PropType<(payload: { row: any, targetId: string, rowKey: string, rowClassHighlight: string }) => string>,
      default: ({ row, targetId, rowKey, rowClassHighlight }) => {
        if (`${row[rowKey]}` === targetId) {
          return rowClassHighlight
        }

        return ''
      },
    },
  },
  async setup(props) {
    const $q = useQuasar()
    const $route = useRoute()
    const { pagination, onRequest, initializePagination } = usePagination()

    await initializePagination(props.total)

    const isSimple = computed(() => {
      if ($q.platform.is.mobile) return true
      return props.simple
    })
    // const targetId = computed(() => $route.params.id)

    const splitterModel = ref(isSimple.value ? 100 : 40)

    return {
      isSimple,
      // targetId,

      splitterModel,

      pagination,
      onRequest,
    }
  },
  watch: {
    simple: {
      handler(v: boolean) {
        this.splitterModel = v ? 100 : 40
      },
    },
    targetId: {
      handler(t: string) {
        if (this.isSimple) {
          this.splitterModel = !t ? 100 : 0
        }
      },
    },
  },
  computed: {
    parsedColumns(): QTableProps['columns'] {
      const classes: string | ((row: any) => string) = (row) => {
        return this.rowClassHandler({
          row,
          targetId: this.targetId,
          rowKey: this.rowKey,
          rowClassHighlight: this.rowClassHighlight,
        }) as string
      }

      const columns: QTableProps['columns'] = this.columns?.map((column) => {
        return {
          ...column,
          classes,
        }
      })
      if (this.$slots.hasOwnProperty('row-actions')) {
        columns?.push({
          name: 'actions',
          label: 'Actions',
          field: 'actions',
          align: 'left',
        })
      }

      return columns
    },
  },
}
</script>
