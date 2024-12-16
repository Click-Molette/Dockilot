<template lang="pug">
q-splitter.fit.q-custom-splitter.absolute(
  v-model="splitterModel"
  :horizontal='isSimple'
  :background-color="backgroundColor"
  :limits="!isSimple ? limits : [0, 100]"
  :separator-style="!isSimple ? 'width: 6px' : ''"
  :style='{minHeight: !isSimple ? "inherit" : "initial"}'
)
  template(#before)
    q-card.full-height.flex.column(:class='{ "hidden": isSimple && targetId }' style='min-height: inherit' flat)
      q-card-section.q-pa-none
        slot(name="top-table")
      q-table.q-custom-sticky-last-column-table.full-height(
        ref="table"
        @request="onRequest($event)"
        @update:pagination="onUpdatePagination($event)"
        v-bind="$attrs"
        v-model:pagination="pagination"
        :loading="loading"
        :rows="rows"
        :columns="parsedColumns"
        :row-key="rowKey"
        :rows-per-page-options="rowsPerPageOptions"
        :visible-colzumns='[]'
        :no-route-fullscreen-exit='true'
        dense flat binary-state-sort
      )
        template(v-slot:top="props")
          slot(name="before-top" v-bind="props")
          q-separator.q-ml-md.q-mr-sm(vertical)
          q-btn(icon='mdi-table-headers-eye' flat square dense)
            q-menu
              q-list
                q-item(@click='visibleColumns = columns.map(c => c.name)' clickable v-close-popup)
                  q-item-section
                    q-item-label All
                q-separator
                q-item(v-for='column in columns' :key='column.name' @click='visibleColumns = [column.name]' clickable v-close-popup)
                  q-item-section
                    q-item-label {{ column.label }}
          q-btn(v-if='!hideTwoPanSwitch' v-show='!isSimple || forceSimple' @click='forceSimple = !isSimple' :icon='isSimple ? "mdi-table-border" : "mdi-table-split-cell"' flat square dense)
          q-btn(@click='refresh' icon='mdi-refresh' flat square dense)
        template(v-for="(_, name) in $slots" v-slot:[name]="slotData")
          slot(:name="name" v-bind="slotData")
        template(v-slot:body-cell-actions="props")
          q-td(:props="props")
            q-btn-group(flat round)
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
    limits: {
      type: Array as PropType<number[]>,
      default: () => [30, 60],
    },
    backgroundColor: {
      type: String,
      default: 'primary',
    },
    simple: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hideTwoPanSwitch: {
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
    rowPixelHeight: {
      type: Number,
      default: 42,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    refresh: {
      type: Function,
      default: () => {},
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
      type: Function as PropType<(payload: { row: any; targetId: string; rowKey: string; rowClassHighlight: string }) => string>,
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
    const { pagination, onRequest, onUpdatePagination, initializePagination, updatePaginationData } = usePagination()

    const forceSimple = ref(null)
    const isSimple = computed(() => {
      if ($q.screen.lt.md) return true
      if (forceSimple.value !== null) return forceSimple.value

      return props.simple
    })

    const splitterModel = ref(40)
    if (isSimple.value) {
      splitterModel.value = 100
      if (props.targetId) {
        splitterModel.value = 0
      }
    }

    const visibleColumnsInternal = ref([] as QTableProps['visibleColumns'])

    return {
      isSimple,
      forceSimple,
      splitterModel,
      pagination,
      onRequest,
      onUpdatePagination,
      initializePagination,
      updatePaginationData,
      visibleColumnsInternal,
    }
  },
  watch: {
    isSimple: {
      handler(v: boolean) {
        if (this.targetId) {
          this.splitterModel = v ? 0 : 100
        } else {
          this.splitterModel = v ? 100 : 40
        }
      },
    },
    '$q.screen.lt.md': {
      handler(v: boolean) {
        if (this.targetId) {
          this.splitterModel = 0
        } else {
          this.splitterModel = 100
        }
        console.log('this.splitterModel', this.splitterModel)
      },
    },
    targetId: {
      handler(t: string) {
        if (this.isSimple) {
          // On simple mode, if targetId is set, we hide the left pane and show the right pane
          // Otherwise, we show the left pane and hide the right pane
          this.splitterModel = !t ? 100 : 0
        }
      },
    },
    total: {
      handler(total: number) {
        this.updatePaginationData({ total })
      },
      immediate: true,
    },
  },
  computed: {
    visibleColumnsSelected(): QTableProps['visibleColumns'] {
      if (!this.visibleColumns || this.visibleColumns.length === 0) {
        console.log(
          'this.visibleColumns',
          (this.columns || []).map((column) => column.name),
        )
        return (this.columns || []).map((column) => column.name)
      }

      console.log('this.visibleColumns', this.visibleColumns)

      return this.visibleColumns
    },
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

      console.log('this.$columns', columns)

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
  async mounted() {
    const table = <{ $el?: HTMLElement }>this.$refs.table
    const internalChildren = table?.$el?.querySelector('.q-table__middle tbody')
    const internalInnerHeight = internalChildren?.clientHeight || table?.$el?.offsetHeight || window.innerHeight

    await this.initializePagination({
      rowPixelHeight: this.rowPixelHeight,
      internalInnerHeight,
    })
  },
}
</script>
