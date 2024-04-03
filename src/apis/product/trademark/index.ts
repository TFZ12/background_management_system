import request from "@/utils/request"
import { TradeMarkResponseData, TradeMarkChange } from "./type"

enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  UPDATEADDTRADEMARK_URL = '/admin/product/baseTrademark/update',
  DELETE_URL = '/admin/product/baseTrademark/remove/'
}

export const reqHasTrademark = (page: number, limit: number) => {
  return request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
}

export const reqAddOrUpdateTrademark = (data: TradeMarkChange) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEADDTRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETE_URL + id)