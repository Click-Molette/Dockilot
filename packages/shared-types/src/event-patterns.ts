export namespace EventPatterns {
  export const CONTAINER_SEARCH = 'docker.containers.search'
  export const CONTAINER_READ = 'docker.containers.read'

  export const CONTAINER_CREATE = 'docker.containers.create'
  export const CONTAINER_UPDATE = 'docker.containers.update'
  export const CONTAINER_DELETE = 'docker.containers.delete'

  export const CONTAINER_START = 'docker.containers.start'
  export const CONTAINER_RESTART = 'docker.containers.restart'
  export const CONTAINER_STOP = 'docker.containers.stop'
  export const CONTAINER_STOP_ALL = 'docker.containers.stop-all'

  export const CONTAINER_PAUSE = 'docker.containers.pause'
  export const CONTAINER_UNPAUSE = 'docker.containers.unpause'

  export const CONTAINER_PRUNE = 'docker.containers.prune'
  export const CONTAINER_STATS = 'docker.containers.stats'


  export const IMAGES_SEARCH = 'docker.images.search'
  export const IMAGES_LIST = 'docker.images.list'
  export const IMAGES_PRUNE = 'docker.images.prune'
  export const IMAGES_PULL = 'docker.images.pull'
  export const IMAGES_PULL_STREAM = 'docker.images.pull-stream'
  export const IMAGES_INSPECT = 'docker.images.inspect'
  export const IMAGES_HISTORY = 'docker.images.history'
  export const IMAGES_REMOVE = 'docker.images.remove'

  export const STACKS_SEARCH = 'docker.stacks.search'
  export const STACKS_READ = 'docker.stacks.read'
  export const STACKS_PULL = 'docker.stacks.pull'
  export const STACKS_DOWN = 'docker.stacks.down'
  export const STACKS_UP = 'docker.stacks.up'
}
