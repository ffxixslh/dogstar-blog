<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px">
      <div class="toolbar">
      </div>
    </el-header>
    <el-main class="dataContainer">
      <el-scrollbar class="scrollPlace">
        <el-table :data="props.recvdata" stripe height="568" @row-click="getRow">
          <el-table-column prop="file_id" label="文件序号" width="80" />
          <el-table-column prop="name" label="文件标题" width="200" />
          <el-table-column prop="id" label="作者序号" width="80" />
          <el-table-column prop="author" label="上传者" width="100" />
          <el-table-column label="操作" width="160">
            <template v-slot="scope">
              <el-button type="primary" size="small" @click="downLoadFile(scope.row.file_id, scope.row.name)">下载</el-button>
              <el-button type="danger" size="small" @click="deleteFile(scope.row.file_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import axiosInstance from '../../utils/axios';
import store from '../../utils/store';
const props = defineProps({
  recvdata: {
    type: Array,
  },
});

const token = localStorage.getItem('token');

let fileId = ref<number>(0);

const getRow = (row: any) => {
  console.log("row: ", row);
  fileId.value = row.id;
};

const downLoadFile = (fileId: number, fileName: string) => {
  axiosInstance({
    method: "get",
    url: `/files/download`,
    headers: {
      token: token,
    },
    params: {
      file_id: fileId,
    },
    responseType: "blob",
  })
    .then((res: { data: BlobPart; }) => {
      console.log(res.data);
      let blob = new Blob([res.data], {
        type: "application/x-msdownload",
      });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      // 释放这个临时的对象url
      window.URL.revokeObjectURL(url);
    }).catch((err: any) => {
      console.log(err);
    });
};

const deleteFile = async (id: number) => {
  axiosInstance({
    method: "delete",
    url: `/files/deleteFile/${id}`,
    headers: {
      token: token,
    }
  })
    .then((res: any) => {
      console.log(res);
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      location.reload();
    })
    .catch((err: any) => {
      console.log(err);
      ElMessage({
        message: "删除失败",
        type: "error",
      });
    });
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
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
</style>