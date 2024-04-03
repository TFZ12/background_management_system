<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button @click="addAttr" type="primary" size="default" icon="Plus"
          :disabled="categoryStore.c3Id ? false : true">添加属性</el-button>
        <el-table border style="margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag style="margin: 5px;" v-for="item in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320px">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`你确定要删除${row.attrName}吗？`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请您输入属性名称" v-model="attrParama.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" type="primary" size="default" icon="Plus"
          :disabled="attrParama.attrName ? false : true">
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table border style="margin: 10px 0;" :data="attrParama.attrValueList">
          <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)" size="small"
                placeholder="请您输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, index }">
              <div v-if="false">{{ row }}</div>
              <el-button type="danger" size="small" icon="Delete" @click="attrParama.attrValueList.splice(index, 1)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save"
          :disabled="attrParama.attrValueList.length > 0 ? false : true">
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts' setup>
import { watch, ref, nextTick, onBeforeUnmount } from 'vue'
import { useCategoryStore } from '@/store/modules/category'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/apis/product/attr'
import type { Attr, AttrValue } from '@/apis/product/attr/type'
import { ElMessage } from 'element-plus';

const categoryStore = useCategoryStore()

const attrArr = ref<Attr[]>([])

const scene = ref<number>(0)

const inputArr = ref<any>([])

const attrParama = ref<Attr>({
  attrName: '',
  attrValueList: [
  ],
  categoryId: '',
  categoryLevel: 3,
}
)

const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const res = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
  }
}

const addAttr = () => {
  Object.assign(attrParama.value, {
    attrName: '',
    attrValueList: [
    ],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
  scene.value = 1
}

const updateAttr = (row: Attr) => {
  scene.value = 1
  Object.assign(attrParama.value, JSON.parse(JSON.stringify(row)))
}

const cancel = () => {
  scene.value = 0
}

const addAttrValue = () => {
  attrParama.value.attrValueList.push({
    valueName: '',
    flag: true
  })
  nextTick(() => {
    inputArr.value[attrParama.value.attrValueList.length - 1].focus()
  })

}

const save = async () => {
  const res = await reqAddOrUpdateAttr(attrParama.value)
  if (res.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParama.value.id ? '修改成功' : '添加成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParama.value.id ? '修改失败' : '添加失败'
    })
  }
}

const toLook = (row: AttrValue, $index: number) => {
  if (row.valueName.trim() == '') {
    attrParama.value.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }

  const repeat = attrParama.value.attrValueList.find((item) => {
    if (item != row) return item.valueName == row.valueName
  })

  if (repeat) {
    attrParama.value.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }

  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

const deleteAttr = async (attrId: number) => {
  const res = await reqRemoveAttr(attrId)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

onBeforeUnmount(() => {
  categoryStore.$reset()
})

watch(() => categoryStore.c3Id, async () => {
  attrArr.value = []
  if (categoryStore.c3Id) getAttr()
})

</script>
<style scoped lang='scss'></style>