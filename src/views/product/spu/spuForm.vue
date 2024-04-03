<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 220px;" v-model="SpuParams.tmId">
        <el-option v-for="item in AllTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入SPU描述" v-model="SpuParams.description">
      </el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handerUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select style="width: 220px;" v-model="saleAttrIdAndValueName"
        :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '暂无数据'">
        <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"
          :label="item.name"></el-option>
      </el-select>
      <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px;"
        type="primary" size="default" icon="Plus">
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0;" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row }">
            <el-tag @close="row.spuSaleAttrValueList.splice(index)" style="margin: 0 5px;"
              v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable>
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input autofocus="true" @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true"
              placeholder="请你输入属性值" size="small" style="width: 100px;"></el-input>
            <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <div v-if="false">{{ row }}</div>
            <el-button type="danger" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default" @click="save">
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang='ts' setup>
import { ref, computed } from 'vue'
import type { SaleAttrValue, SpuData, TradeMark, SpuImg, SaleAttr, HasSaleAttr } from '@/apis/product/spu/type'
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/apis/product/spu';
import { ElMessage } from 'element-plus';

const $emit = defineEmits(['changeScene'])

const AllTradeMark = ref<TradeMark[]>([])

const imgList = ref<SpuImg[]>([])

const saleAttr = ref<SaleAttr[]>([])

const allSaleAttr = ref<HasSaleAttr[]>([])

const dialogVisible = ref<boolean>(false)

const dialogImageUrl = ref<string>('')

const saleAttrIdAndValueName = ref<string>('')

const SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
  createTime: '',
  updateTime: '',
})

const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  const res = await reqAllTradeMark()
  const res1 = await reqSpuImageList((spu.id as number))
  const res2 = await reqSpuHasSaleAttr((spu.id as number))
  const res3 = await reqAllSaleAttr()
  AllTradeMark.value = res.data
  imgList.value = res1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  saleAttr.value = res2.data
  allSaleAttr.value = res3.data
}

const handlePictureCardPreview = (file: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}

const handleRemove = () => {
  console.log(123);
}

const handerUpload = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传务必小于3M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF'
    })
    return false
  }
}

const unSelectSaleAttr = computed(() => {
  const unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value = ''
}

const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}

const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: (saleAttrValue as string)
  }

  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }

  const repeat = row.spuSaleAttrValueList.find(item => item.saleAttrValueName == saleAttrValue)

  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复'
    })
    return
  }


  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

const save = async () => {
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url
    }
  })
  SpuParams.value.spuSaleAttrList = saleAttr.value
  const res = await reqAddOrUpdateSpu(SpuParams.value)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
    $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
  }
}

const initAddSpu = async (c3Id: number | string) => {
  Object.assign(SpuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
    createTime: '',
    updateTime: '',
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  SpuParams.value.category3Id = c3Id
  const res = await reqAllTradeMark()
  const res1 = await reqAllSaleAttr()
  AllTradeMark.value = res.data
  allSaleAttr.value = res1.data
}

defineExpose({
  initHasSpuData,
  initAddSpu
})

</script>

<style scoped lang='scss'></style>