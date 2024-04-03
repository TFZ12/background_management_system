import request from "@/utils/request"
import type { userResponseData, User, AllRoleResponseData } from "./type"

enum API {
  ALLUSER_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  DELETEUSER_URL = '/admin/acl/user/remove/',
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}

export const reqUserInfo = (page: number, limit: number, username: string) => request.get<any, userResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)

export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

export const reqAllRole = (adminId: number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL + adminId)

export const reqSetUserRole = (data: any) => request.post<any, any>(API.SETROLE_URL, data)

export const reqRemoveUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId)

export const reqSelectUser = (idList: number[]) => request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })