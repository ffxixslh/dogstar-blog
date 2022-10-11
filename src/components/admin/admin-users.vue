<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px">
      <div class="toolbar">
      </div>
    </el-header>
    <el-main class="dataContainer">
      <el-scrollbar class="scrollPlace">
        <el-table :data="props.recvdata" stripe height="568" @row-click="getRow">
          <el-table-column prop="id" label="用户序号" width="80" />
          <el-table-column prop="username" label="用户名" width="100" />
          <el-table-column prop="email" label="邮箱" width="120" />
          <el-table-column prop="nickname" label="昵称" width="120" />
          <el-table-column label="操作" width="80">
            <template v-slot="scope">
              <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import axiosInstance from '../../utils/axios';
const props = defineProps({
  recvdata: {
    type: Array,
  },
});

const token = localStorage.getItem('token');

let userId = ref<number>(0);

const getRow = (row: any) => {
  console.log("row: ", row);
  userId.value = row.id;
};

const deleteUser = async (id: number) => {
  console.log("user_id", id)
  axiosInstance({
    method: "delete",
    url: `/user/deleteUser/${id}`,
    headers: {
      token: token,
    },
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