import { ThrottleDevice } from './throttle-device'

export interface ContainerUpdateOptions {
  CpuShares: number
  Memory: number
  CgroupParent: string
  BlkioWeight: number
  BlkioWeightDevice: { Path: string, Weight: number }[]
  BlkioDeviceReadBps: ThrottleDevice[]
  BlkioDeviceWriteBps: ThrottleDevice[]
  BlkioDeviceReadIOps: ThrottleDevice[]
  BlkioDeviceWriteIOps: ThrottleDevice[]
  CpuPeriod: number
  CpuQuota: number
  CpuRealtimePeriod: number
  CpuRealtimeRuntime: number
  CpusetCpus: string
  CpusetMems: string
  Devices: {
    PathOnHost: string
    PathInContainer: string
    CgroupPermissions: string
  }[]
  DeviceCgroupRules: string[]
  DiskQuota: number
  KernelMemory: number
  MemoryReservation: number
  MemorySwap: number
  MemorySwappiness: number
  NanoCpus: number
  OomKillDisable: boolean
  Init: boolean | null
  PidsLimit: number
  Ulimits: {
    Name: string
    Soft: number
    Hard: number
  }[]
  CpuCount: number
  CpuPercent: number
  IOMaximumIOps: number
  IOMaximumBandwidth: number
  RestartPolicy: {
    Name: string
    MaximumRetryCount?: number
  }
}
