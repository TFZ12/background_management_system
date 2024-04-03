<template>
  <div>
    <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button @click="addPermisstion(row)" type="primary" size="small" :disabled="row.level == 4 ? true : false">{{
            row.level == 3 ? '添加功能' :
            '添加菜单' }}</el-button>
          <el-button @click="updatePermisstion(row)" type="primary" size="small"
            :disabled="row.level == 1 ? true : false">编辑</el-button>
          <el-popconfirm @confirm="removeMenu(row.id)" :title="`你确定要删除${row.name}?`" width="260px">
            <template #reference>
              <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单的名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input placeholder="请你输入权限的数据" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, reactive } from 'vue'
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/apis/acl/menu'
import type { PermisstionList, Permisstion, MenuParams } from '@/apis/acl/menu/type'
import { ElMessage } from 'element-plus';

const PermisstionArr = ref<PermisstionList>([])

const dialogVisible = ref<boolean>(false)

const menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

const getHasPermisstion = async () => {
  const res = await reqAllPermisstion()
  if (res.code == 200) {
    PermisstionArr.value = res.data
  }
}

const addPermisstion = (row: Permisstion) => {
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.pid + 1
}

const updatePermisstion = (row: Permisstion) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}

const save = async () => {
  const res: any = await reqAddOrUpdateMenu(menuData)
  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功'
    })
    getHasPermisstion()
  }
}

const removeMenu = async (id: number) => {
  const res = await reqRemoveMenu(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasPermisstion()
  }
}

onMounted(() => {
  getHasPermisstion()
})
</script>
<style scoped lang='scss'></style>