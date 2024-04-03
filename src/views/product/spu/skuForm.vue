<template>
  <el-form label-width="70px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="85px">
        <el-form-item v-for="item in  attrAttr " :key="item.id" :label="item.attrName">
          <el-select style="width: 240px" v-model="item.attrIdAndValueId">
            <el-option v-for="attrValue in  item.attrValueList " :value="`${item.id}:${attrValue.id}`" :key="attrValue.id"
              :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item :label="item.saleAttrName" v-for=" item  in  saleAttr " :key="item.id">
          <el-select v-model="item.saleIdAndValueId" style="width: 240px">
            <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for=" saleAttrValue  in  item.spuSaleAttrValueList "
              :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgAttr" ref="table">
        <el-table-column type="selection" width="80px" align="center">
        </el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName">
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="hander(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { reqAttr } from '@/apis/product/attr'
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/apis/product/spu'
import type { SkuData } from '@/apis/product/spu/type'
import { ElMessage } from 'element-plus';

const $emit = defineEmits(['changeScene'])

const attrAttr = ref<any>([])

const saleAttr = ref<any>([])

const imgAttr = ref<any>([])

const table = ref<any>()

const skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})

const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  const res = await reqAttr(c1Id, c2Id, spu.category3Id)
  const res1 = await reqSpuHasSaleAttr(spu.id)
  const res2 = await reqSpuImageList(spu.id)
  attrAttr.value = res.data
  saleAttr.value = res1.data
  imgAttr.value = res2.data
}

const hander = (row: any) => {
  imgAttr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

const save = async () => {
  skuParams.skuAttrValueList = attrAttr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev
  }, [])

  skuParams.skuSaleAttrValueList = saleAttr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId
      })
    }
    return prev
  }, [])

  const res = await reqAddSku(skuParams)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功'
    })
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败'
    })
  }
}

defineExpose({
  initSkuData
})
</script>
<style scoped lang='scss'></style>