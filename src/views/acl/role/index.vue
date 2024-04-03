<template>
  <div>
    <el-card style="height: 80px;">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索:">
          <el-input placeholder="请你输入搜索职位的关键字" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
      <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
      <el-table style="margin: 10px 0;" border :data="allRole">
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #="{ row }">
            <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">分配权限</el-button>
            <el-button type="info" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm @confirm="removeRole(row.id)" :title="`你确定要删除${row.roleName}?`" width="220px">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
        @size-change="sizeChange" />
    </el-card>
    <el-dialog v-model="dialogVisute" :title="RoleParams.id ? '更新职位' : '添加职位'">
      <el-form :model="RoleParams" :rules="rules" ref="form">
        <el-form-item label="职位名称:" prop="roleName">
          <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="dialogVisute = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮权限</h4>
      </template>
      <template #default>
        <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
          :default-checked-keys="selectArr" :props="defaultProps" />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion, reqRemoveRole } from '@/apis/acl/role'
import type { Records, RoleData, MenuList } from '@/apis/acl/role/type'
import { useLayOutSettingStore } from '@/store/modules/setting'
import { ElMessage } from 'element-plus';

const layOutSettingStore = useLayOutSettingStore()

const pageNo = ref<number>(1)

const pageSize = ref<number>(10)

const keyword = ref<string>('')

const total = ref<number>(0)

const allRole = ref<Records>([])

const dialogVisute = ref<boolean>(false)

const form = ref<any>()

const tree = ref<any>()

const drawer = ref<boolean>(false)

const menuArr = ref<MenuList>([])

const selectArr = ref<number[]>([])

const RoleParams = reactive<RoleData>({
  roleName: ''
})

const getHasRole = async (page = 1) => {
  pageNo.value = page
  const res = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (res.code == 200) {
    total.value = res.data.total
    allRole.value = res.data.records
  }
}

const sizeChange = () => {
  getHasRole()
}

const search = () => {
  getHasRole()
  keyword.value = ''
}

const reset = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}

const addRole = () => {
  dialogVisute.value = true
  Object.assign(RoleParams, {
    roleName: '',
    id: 0
  })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const updateRole = (row: RoleData) => {
  dialogVisute.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const validatorRoleName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称至少2位'))
  }
}

const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName
    }
  ]
}

const save = async () => {
  await form.value.validate()
  const res = await reqAddOrUpdateRole(RoleParams)
  if (res.code == 200) {
    dialogVisute.value = false
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功'
    })
    getHasRole(RoleParams.id ? pageNo.value : 1)
    // window.location.reload()
  } else {
    dialogVisute.value = false
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '更新失败' : '添加失败'
    })
  }
}

const defaultProps = {
  children: 'children',
  label: 'name',
}

const setPermisstion = async (row: RoleData) => {
  drawer.value = true
  Object.assign(RoleParams, row)
  const res = await reqAllMenuList((RoleParams.id as number))
  if (res.code == 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

const handler = async () => {
  const roleId = (RoleParams.id as number)
  const arr = tree.value.getCheckedKeys()
  const arr1 = tree.value.getHalfCheckedKeys()
  const permissionId = arr.concat(arr1)
  const res = await reqSetPermisstion(roleId, permissionId)
  if (res.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功'
    })
    window.location.reload()
  }
}

const removeRole = async (id: number) => {
  const res = await reqRemoveRole(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}


onMounted(() => {
  getHasRole()
})

</script>
<style scoped lang='scss'>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>