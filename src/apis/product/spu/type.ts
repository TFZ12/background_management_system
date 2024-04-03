export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface Time {
  createTime?: string | null,
  updateTime?: string | null,
}

export interface SpuData extends Time {
  id?: number,
  spuName: string,
  tmId: number | string,
  description: string,
  category3Id: string | number,
  spuSaleAttrList: null | SaleAttr[],
  spuImageList: null | SpuImg[],
  spuPosterList?: null
}

export type Records = SpuData[]

export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records,
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

export interface Time {
  createTime?: string | null,
  updateTime?: string | null,
}

export interface TradeMark extends Time {
  id: number,
  tmName: string,
  logoUrl: string,
}

export interface AllTradeMark extends ResponseData {
  data: TradeMark[]
}

export interface SpuImg extends Time {
  id?: number,
  spuId?: string | number,
  imgName?: string,
  imgUrl?: string,
  name?: string,
  url?: string
}

export interface SpuHasImg extends ResponseData {
  data: SpuImg[],
}

export interface SaleAttrValue extends Time {
  id?: number,
  spuId?: string | number,
  baseSaleAttrId: number | string,
  saleAttrValueName: string,
  saleAttrName?: string,
  isChecked?: null
}

export type SpuSaleAttrValueList = SaleAttrValue[]

export interface SaleAttr extends Time {
  id?: number,
  spuId?: number,
  baseSaleAttrId: number | string,
  saleAttrName: string,
  spuSaleAttrValueList: SpuSaleAttrValueList,
  flag?: boolean,
  saleAttrValue?: string
}

export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

export interface HasSaleAttr extends Time {
  id: number,
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[],
}

export interface Attr {
  attrId: string | number,
  valueId: string | number
}

export interface saleAttr {
  saleAttrId: string | number,
  saleAttrValueId: string | number
}

export interface SkuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuAttrValueList?: Attr[],
  skuSaleAttrValueList?: saleAttr[],
  skuDefaultImg: string,
}

export interface SkuInfoData extends ResponseData {
  data: SkuData[]
} 