<template>
  <div>
    <el-card style="height: 80px;">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input placeholder="请你输入搜索的名字" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
      <el-button type="primary" @click="addUser" icon="Plus">添加用户</el-button>
      <el-popconfirm title="你确定要批量删除？" width="220px" @confirm="deleteSelectUser">
        <template #reference>
          <el-button type="danger" :disabled="selectIdArr.length ? false : true">批量删除</el-button>
        </template>
      </el-popconfirm>
      <el-table style="margin: 10px 0;" border :data="userArr" @selection-change="selectChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="#" align="center" type="index" show-overflow-tooltip></el-table-column>
        <el-table-column label="ID" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row }">
            <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button type="info" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}?`" width="220px" @confirm="deleteUser(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
        :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasUser"
        @size-change="handler" />
    </el-card>
    <el-drawer v-model="drawer" direction="rtl">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请你输入用户姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请你输入用户昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请你输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <el-drawer v-model="drawer1" direction="rtl">
      <template #header>
        <h4>分配角色(职位)</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
              @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in allRole" :key="item.id" :label="item">
                {{ item.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/apis/acl/user'
import type { Records, User, AllRole, SetRoleData } from '@/apis/acl/user/type'
import { ElMessage } from 'element-plus'
import { useLayOutSettingStore } from '@/store/modules/setting'

const layOutSettingStore = useLayOutSettingStore()

const pageNo = ref<number>(1)

const pageSize = ref<number>(5)

const total = ref<number>(0)

const userArr = ref<Records>([])

const drawer = ref<boolean>(false)

const drawer1 = ref<boolean>(false)

const formRef = ref<any>()

const checkAll = ref<boolean>(false)

const isIndeterminate = ref<boolean>(true)

const allRole = ref<AllRole>([])

const userRole = ref<AllRole>([])

const selectIdArr = ref<User[]>([])

const keyword = ref<string>('')

const userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})

const getHasUser = async (page = 1) => {
  pageNo.value = page
  const res = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (res.code == 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
}

const handler = () => {
  getHasUser()
}

const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    username: '',
    password: '',
    name: '',
    id: 0
  })
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

const save = async () => {
  await formRef.value.validate()
  const res = await reqAddOrUpdateUser(userParams)
  if (res.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败'
    })
  }
}

const cancel = () => {
  drawer.value = false
}

const validatorUserName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名字至少5位'))
  }
}

const validatorName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称至少5位'))
  }
}

const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码至少6位'))
  }
}

const rules = {
  username: [{
    required: true,
    trigger: 'blur',
    validator: validatorUserName
  }],
  name: [{
    required: true,
    trigger: 'blur',
    validator: validatorName
  }],
  password: [{
    required: true,
    trigger: 'blur',
    validator: validatorPassword
  }],
}

const setRole = async (row: User) => {
  Object.assign(userParams, row)
  const res = await reqAllRole((userParams.id as number))
  if (res.code == 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
    drawer1.value = true
  }
}

const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

const confirmClick = async () => {
  const data: SetRoleData = {
    userId: (userParams.id as number),
    roleIdList: userRole.value.map(item => (item.id as number)),
  }
  const res = await reqSetUserRole(data)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配职务成功'
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  }
}

const deleteUser = async (id: number) => {
  const res = await reqRemoveUser(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

const selectChange = (value: any) => {
  selectIdArr.value = value
}

const deleteSelectUser = async () => {
  const idList: any = selectIdArr.value.map(item => item.id)
  const res = await reqSelectUser(idList)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

const search = () => {
  getHasUser()
  keyword.value = ''
}

const reset = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}

onMounted(() => {
  getHasUser()
})

</script>
<style scoped lang='scss'>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>