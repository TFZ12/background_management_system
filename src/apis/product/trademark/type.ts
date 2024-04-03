export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface TradeMarkChange {
  id?: number,
  tmName: string,
  logoUrl: string
}

export interface TradeMark extends TradeMarkChange {
  createTime?: string,
  updateTime?: string,
}

export type Records = TradeMark[]

export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    orders?: string[],
    optimizeCountSql?: boolean,
    hitCount?: boolean,
    countId?: null,
    maxLimit?: null,
    searchCount: boolean,
    pages: number
  }
}
