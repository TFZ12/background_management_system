export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface Time {
  createTime?: string | null,
  updateTime?: string | null,
}

export interface CategoryObj extends Time {
  id: number | string,
  name: string,
  category1Id?: number,
  category2Id?: number
}

export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

export interface AttrValue extends Time {
  id?: number,
  valueName: string,
  attrId?: number,
  flag?: boolean
}

export type AttrValueList = AttrValue[]

export interface Attr extends Time {
  id?: number,
  attrName: string,
  categoryId: string | number,
  categoryLevel: number,
  attrValueList: AttrValue[]
}

export type AttrList = Attr[]

export interface AttrResponseData extends ResponseData {
  data: AttrList
}

