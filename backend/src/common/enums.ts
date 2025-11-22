export enum LoadStatus {
  READY = 'ready',
  MISSING = 'missing',
  SHIPPED = 'shipped',
}

export enum CoilStatus {
  WIP = 'WIP',
  RTS = 'RTS',
  SCRAP = 'scrap',
  ONHOLD = 'onhold',
  REWORK = 'rework',
}

export enum LocationType {
  STORAGE = 'storage',
  DOCK = 'dock',
  LINE = 'line',
  PACKAGING = 'packaging',
  SLITTER = 'slitter',
}
