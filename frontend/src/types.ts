export type BlockRange = {
    id: string
    missingBlocks: number
    percentMissing: number
    blockNumberLow: number
    blockNumberHigh: number
    blockTimestampLow: number
    blockTimestampHigh: number
  }

  export type SubgraphData = {
    blockRangeDaily: BlockRange[]
    blockRangeMonthly: BlockRange[]
  }