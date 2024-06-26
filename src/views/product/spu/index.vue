<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px;">
      <div v-show="scene == 0">
        <el-button @click="addSpu" type="primary" icon="Plus" size="default"
          :disabled="categoryStore.c3Id ? false : true">
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0px;" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <div v-if="false">{{ $index }}</div>
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)">
              </el-button>
              <el-button type="warning" size="small" icon="Edit" title="修改SKU" @click="updateSpu(row)">
              </el-button>
              <el-button type="info" size="small" icon="View" title="查看SKU" @click="findSku(row)">
              </el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" title="删除SKU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :small="false" :disabled="false" :background="true" layout="prev, pager, next, jumper,->,sizes,total"
          :total="total" @current-change="getHasSpu" @size-change="getHasSpu(1)" />
      </div>
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useCategoryStore } from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSku } from '@/apis/product/spu'
import { Records } from '@/apis/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import type { SpuData, SkuData } from '@/apis/product/spu/type'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()

const scene = ref<number>(0)

const pageNo = ref<number>(1)

const pageSize = ref<number>(3)

const total = ref<number>(0)

const records = ref<Records>([])

const spu = ref<any>()

const sku = ref<any>()

const skuArr = ref<SkuData[]>([])

const show = ref<boolean>(false)

const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  const res = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (res.code == 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}

const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
  }

}

const updateSpu = (row: SpuData) => {
  scene.value = 1
  spu.value.initHasSpuData(row)
}

const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

const findSku = async (row: SpuData) => {
  const res = await reqSkuList((row.id as number))
  if (res.code == 200) {
    skuArr.value = res.data
    show.value = true
  }
}

const deleteSpu = async (row: SpuData) => {
  const res = await reqRemoveSku((row.id as number))
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
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

watch(() => categoryStore.c3Id, () => {
  if (!categoryStore.c3Id) return
  getHasSpu()
})

</script>


<style scoped lang='scss'></style>