export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface Attr {
  attrId: string | number,
  valueId: string | number,
  id?: string | number,
  valueName?: string,
}

export interface saleAttr {
  saleAttrId: string | number,
  saleAttrValueId: string | number,
  id?: string | number,
  saleAttrValueName?: string,
}

export interface SkuData {
  category3Id?: string | number,
  spuId?: string | number,
  tmId?: string | number,
  skuName?: string,
  price?: string | number,
  weight?: string | number,
  skuDesc?: string,
  skuAttrValueList?: Attr[],
  skuSaleAttrValueList?: saleAttr[],
  skuDefaultImg?: string,
  isSale?: number,
  id?: number,
}

export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[],
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
  }
}

export interface SkuInfoData extends ResponseData {
  data: SkuData
}