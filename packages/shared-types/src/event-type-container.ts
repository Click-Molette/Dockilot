export interface EventTypeContainerActorAttributes {
  image?: string
  name?: string

  'com.docker.compose.config-hash'?: string
  'com.docker.compose.container-number'?: string
  'com.docker.compose.depends_on'?: string
  'com.docker.compose.image'?: string
  'com.docker.compose.oneoff'?: string
  'com.docker.compose.project'?: string
  'com.docker.compose.project.config_files'?: string
  'com.docker.compose.project.working_dir'?: string
  'com.docker.compose.service'?: string
  'com.docker.compose.version'?: string

  'org.opencontainers.image.authors'?: string
  'org.opencontainers.image.base.name'?: string
  'org.opencontainers.image.description'?: string
  'org.opencontainers.image.documentation'?: string
  'org.opencontainers.image.licenses'?: string
  'org.opencontainers.image.ref.name'?: string
  'org.opencontainers.image.source'?: string
  'org.opencontainers.image.title'?: string
  'org.opencontainers.image.url'?: string
  'org.opencontainers.image.vendor'?: string
  'org.opencontainers.image.version'?: string
}

export interface EventTypeContainer {
  id: string
  ID: string
  Type: string
  from: string
  Action: string

  scope: string
  status: string
  time: number
  timeNano: number

  Actor: {
    Attributes: EventTypeContainerActorAttributes
  }
}
