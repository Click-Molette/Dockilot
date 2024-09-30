<template>
  <div class="flex row">
    <div class="col-12">
      <div class="flex">
        <q-card class="q-pa-sm q-mx-sm">
          {{ debugStats.cpu_stats?.online_cpus }}
        </q-card>
        <q-card class="q-pa-sm q-mx-sm">
          {{ (debugStats.memory_stats?.usage / debugStats.memory_stats?.limit) * 100 }}
        </q-card>
      </div>
    </div>
    <div class="col-6">
      <Line id="cpu-chart" :options="chartOptions" :data="cpuChart" ref="cpuRef" />
    </div>
    <div class="col-6">
      <Line id="memory-chart" :options="chartOptions" :data="memoryChart" ref="memoryRef" />
    </div>
    <div class="col-6">
      <Line id="blkio-chart" :options="chartOptions" :data="blkioChart" ref="blkioRef" />
    </div>
    <div class="col-6">
      <Line id="network-chart" :options="chartOptions" :data="networkChart" ref="networkRef" />
    </div>
    <!--<pre class="col-12" v-html="JSON.stringify(debugStats, null, 2)"></pre>-->
  </div>
</template>

<script>
import { ref } from 'vue'
import { useEventSource } from '@vueuse/core'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineController, PointElement, LineElement, Filler } from 'chart.js'

ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend, Filler);

const route = useRoute()

export default {
  components: { Line },
  data() {
    return {
      chartOptions: {
        scales: {
          y: {
            beginAtZero: true,
            // max: 100,
          }
        },
        responsive: true,
        maintainAspectRatio: true,
      },
    }
  },
  setup() {
    const linePoints = ref(4)

    const cpuRef = ref(null)
    const memoryRef = ref(null)
    const blkioRef = ref(null)
    const networkRef = ref(null)

    const debugStats = ref({})

    const cpuChart = new ref({
      labels: [new Date().toLocaleTimeString()],
      datasets: [{
        label: 'Utilisation du CPU',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      }],
    })
    const memoryChart = new ref({
      labels: [new Date().toLocaleTimeString()],
      datasets: [{
        label: 'Utilisation de la mémoire',
        data: [],
        backgroundColor: 'rgba(10, 192, 120, 0.2)',
        borderColor: 'rgba(10, 192, 120, 1)',
        borderWidth: 1,
        fill: true,
      }, {
        label: 'Mémoire totale',
        data: [],
        backgroundColor: 'rgba(10, 0, 120, 0.2)',
        borderColor: 'rgba(10, 0, 120, 1)',
        borderWidth: 1,
        fill: true,
      }],
    })
    const blkioChart = new ref({
      labels: [new Date().toLocaleTimeString()],
      datasets: [{
        label: 'Blkio rx',
        data: [],
        backgroundColor: 'rgba(150, 192, 192, 0.2)',
        borderColor: 'rgba(150, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      }, {
        label: 'Blkio tx',
        data: [],
        backgroundColor: 'rgba(150, 192, 192, 0.2)',
        borderColor: 'rgba(150, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      }],
    })
    const networkChart = new ref({
      labels: [new Date().toLocaleTimeString()],
      datasets: [{
        label: 'Network Rx',
        data: [],
        backgroundColor: 'rgba(150, 192, 192, 0.2)',
        borderColor: 'rgba(150, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      }, {
        label: 'Network Tx',
        data: [],
        backgroundColor: 'rgba(150, 192, 192, 0.2)',
        borderColor: 'rgba(150, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      }],
    })

    const { data: eventSourceData, close } = useEventSource(`http://localhost:4000/docker/containers/${route.params.id}/stats-stream`, [], {
      autoReconnect: true,
    })

    const updateChartData = (stats) => {
      debugStats.value = stats
      const cpuUsage = (stats.cpu_stats.cpu_usage.total_usage / stats.cpu_stats.system_cpu_usage) * 100 / stats.cpu_stats.online_cpus;
      const blkioStats = stats.blkio_stats.io_service_bytes_recursive;
      const networkRx = stats.networks.eth0.rx_bytes;
      const networkTx = stats.networks.eth0.tx_bytes;

      const dateLabel = new Date(stats.read).toLocaleTimeString()

      cpuRef.value.chart.data.labels = [
        ...cpuRef.value?.chart?.data?.labels.slice(-linePoints.value) || [0],
        dateLabel,
      ]
      cpuRef.value.chart.data.datasets[0].data = [
        ...cpuRef.value?.chart?.data?.datasets[0].data.slice(-linePoints.value) || [0],
        cpuUsage.toFixed(2),
      ]
      cpuRef.value?.chart?.update()

      memoryRef.value.chart.data.labels = [
        ...memoryRef.value?.chart?.data?.labels.slice(-linePoints.value) || [0],
        dateLabel,
      ]
      memoryRef.value.chart.data.datasets[0].data = [
        ...memoryRef.value?.chart?.data?.datasets[0].data.slice(-linePoints.value) || [0],
        stats.memory_stats.usage / 1024 / 1024,
      ]
      memoryRef.value.chart.data.datasets[1].data = [
        ...memoryRef.value?.chart?.data?.datasets[1].data.slice(-linePoints.value) || [0],
        stats.memory_stats.limit / 1024 / 1024,
      ]
      memoryRef.value?.chart?.update()

      if (blkioStats) {
        blkioRef.value.chart.data.labels = [
          ...blkioRef.value?.chart?.data?.labels.slice(-linePoints.value) || [0],
          dateLabel,
        ]
        blkioRef.value.chart.data.datasets[0].data = [
          ...blkioRef.value?.chart?.data?.datasets[0].data.slice(-linePoints.value) || [0],
          blkioStats[0].value,
        ]
        blkioRef.value.chart.data.datasets[1].data = [
          ...blkioRef.value?.chart?.data?.datasets[1].data.slice(-linePoints.value) || [0],
          blkioStats[1].value,
        ]
        blkioRef.value?.chart?.update()
      }

      networkRef.value.chart.data.labels = [
        ...networkRef.value?.chart?.data?.labels.slice(-linePoints.value) || [0],
        dateLabel,
      ]
      networkRef.value.chart.data.datasets[0].data = [
        ...networkRef.value?.chart?.data?.datasets[0].data.slice(-linePoints.value) || [0],
        networkRx,
      ]
      networkRef.value.chart.data.datasets[1].data = [
        ...networkRef.value?.chart?.data?.datasets[1].data.slice(-linePoints.value) || [0],
        networkTx,
      ]
      networkRef.value?.chart?.update()
    }

    watch(eventSourceData, (data) => {
      if (data && cpuRef.value && memoryRef.value && networkRef.value && cpuRef.value.chart && memoryRef.value.chart && networkRef.value.chart) {
        if (cpuRef.value.chart.data && memoryRef.value.chart.data && networkRef.value.chart.data) {
          const stats = JSON.parse(data)
          updateChartData(stats)
        }
      }
    })

    onBeforeUnmount(() => {
      if (close) close()
    })

    return {
      linePoints,
      cpuRef,
      memoryRef,
      blkioRef,
      networkRef,
      cpuChart,
      memoryChart,
      blkioChart,
      networkChart,
      debugStats,
    }
  },
}
</script>
