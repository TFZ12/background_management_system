<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" v-has="`btn.Trademark.add`" size="default" icon="Plus"
        @click="addTrademark">添加品牌</el-button>
      <el-table :data="trademarkArr" style="margin: 10px 0;" border>
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl.substring(0, 7) == 'http://' ? `${row.logoUrl}` : `http://${row.logoUrl}`"
              style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button type="primary" icon="Edit" size="small" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="230px" icon="Delete" icon-color="#e05a55"
              @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="danger" icon="Delete" size="small" v-has="`btn.Trademark.remove`"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="getHasTrademark" v-model:current-page="pageNo" v-model:page-size="limit"
        @size-change="getHasTrademark(1)" :page-sizes="[3, 5, 7, 9]" :background="true" :pager-count="9"
        layout="prev,pager,next,jumper,->,sizes,total" :total="total" />
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/apis/product/trademark'
import type { Records, TradeMarkResponseData, TradeMarkChange, TradeMark } from '@/apis/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

const pageNo = ref<number>(1)
const limit = ref<number>(3)

const total = ref<number>(0)
const trademarkArr = ref<Records>([])

const dialogFormVisible = ref<boolean>(false)

const formRef = ref()

const trademarkParams = ref<TradeMarkChange>({
  tmName: '',
  logoUrl: ''
})

const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  const res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (res.code == 200) {
    total.value = res.data.total
    trademarkArr.value = res.data.records
  }
}

// const sizeChange = () => {
//   getHasTrademark()
// }

const addTrademark = () => {
  dialogFormVisible.value = true
  trademarkParams.value.logoUrl = ''
  trademarkParams.value.tmName = ''
  trademarkParams.value.id = 0
  // formRef.value?.clearValidate('logoUrl')
  // formRef.value?.clearValidate('tmName')
  nextTick(() => {
    formRef.value.clearValidate('logoUrl')
    formRef.value.clearValidate('tmName')
  })

}

const updateTrademark = (row: TradeMark) => {
  nextTick(() => {
    formRef.value.clearValidate('logoUrl')
    formRef.value.clearValidate('tmName')
  })
  dialogFormVisible.value = true
  // trademarkParams.value.logoUrl = row.logoUrl.substring(0, 7) == 'http://' ? `${row.logoUrl}` : `http://${row.logoUrl}`
  // trademarkParams.value.tmName = row.tmName
  // trademarkParams.value.id = row.id
  Object.assign(trademarkParams.value, row)
}

const removeTrademark = async (id: number) => {
  const res = await reqDeleteTrademark(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功'
    })
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败'
    })
  }
}

const cancel = () => {
  dialogFormVisible.value = false
}

const confirm = async () => {
  await formRef.value.validate()
  const res = await reqAddOrUpdateTrademark(trademarkParams.value)
  if (res.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.value.id ? '修改品牌成功' : '添加品牌成功'
    })
    getHasTrademark(trademarkParams.value.id ? pageNo.value : 1)
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.value.id ? '修改品牌失败' : '添加品牌失败'
    })
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type === 'image/png' || rawFile.type === 'image/jpeg' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M'
      })
      return false
    }

  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPEG|GIF'
    })
    return false
  }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, _uploadFile) => {
  trademarkParams.value.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}

const validatorTmName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称大于等于两位'))
  }
}

const validatorlogoUrl = (_rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('Logo图片请上传'))
  }
}

const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorlogoUrl }
  ]
}

onMounted(() => {
  getHasTrademark()
})

</script>
<style scoped lang='scss'>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>