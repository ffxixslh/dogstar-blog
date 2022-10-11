<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px">
      <div class="toolbar">
        <el-button type="primary" size="large" @click="setNewTags">新建标签</el-button>
      </div>
    </el-header>
    <el-main class="dataContainer">
      <el-scrollbar class="scrollPlace">
        <el-table :data="props.recvdata" stripe height="568" @row-click="getRow">
          <el-table-column prop="id" label="标签序号" width="80" />
          <el-table-column prop="name" label="标签内容" width="200" />
          <el-table-column label="操作" width="160">
            <template v-slot="scope">
              <el-button type="danger" size="small" @click="deleteTag(scope.row.name)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import axiosInstance from '../../utils/axios';
import store from '../../utils/store';

const props = defineProps({
  recvdata: {
    type: Array,
  },
});

const token = localStorage.getItem('token');

const getRow = (row: any) => {
  console.log("row: ", row);
};

let tagValue = ref<string>("")

const setNewTags = () => {
  ElMessageBox.prompt('请输入标签内容', '新建标签', {
    inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,15}$/,
    inputErrorMessage: '标签内容只能为1-15位的中文、英文、数字',
    inputValue: tagValue.value,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      console.log("value: ", value);

      let data = [value]

      console.log("data: ", data);

      axiosInstance({
        method: 'post',
        url: '/types',
        headers: {
          token: token
        },
        data: data,
      })
        .then((res: any) => {
          console.log("res: ", res);
          ElMessage({
            message: "新建成功",
            type: "success",
          });
          location.reload();
        })
        .catch((err: any) => {
          console.log("err: ", err);
          ElMessage({
            message: "新建失败",
            type: "error",
          });
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}

const deleteTag = (name: string) => {
  console.log("name", name);
  let data = [name];

  axiosInstance({
    method: 'delete',
    url: '/types/',
    headers: {
      token: token
    },
    data: data,
  })
    .then((res: any) => {
      console.log("res: ", res);
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      location.reload();
    })
    .catch((err: any) => {
      console.log("err: ", err);
      ElMessage({
        message: "删除失败",
        type: "error",
      });
    })
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  left: 20px;
}

.el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.dataContainer {
  z-index: 1;
  width: auto;
  padding: 0;

  .scrollPlace {
    background-color: #eee;
  }
}

.previewPlce {
  z-index: 999;
}
</style>