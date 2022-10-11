<template>
  <el-container>
    <el-header style="text-align: left; font-size: 12px">
      <div class="toolbar">
      </div>
    </el-header>
    <el-main class="dataContainer">
      <el-scrollbar class="scrollPlace">
        <el-table :data="props.recvdata" stripe height="568" @row-click="getRow">
          <el-table-column prop="id" label="文章序号" width="80" />
          <el-table-column prop="title" label="标题" width="200" />
          <el-table-column prop="user_id" label="作者序号" width="80" />
          <el-table-column prop="create_time" label="创建时间" width="200" />
          <el-table-column prop="update_time" label="更新时间" width="200" />
          <el-table-column prop="description" label="文章简述" width="200" />
          <el-table-column label="操作" width="160">
            <template v-slot="scope">
              <el-button type="primary" size="small" @click="previewBlog(scope.row)">预览</el-button>
              <el-button type="danger" size="small" @click="deleteBlog(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="previewPlce">
          <el-dialog v-model="dialogVisible" title="预览" width="60%" :before-close="handleClose">
            <article>
              <h1>{{ prvwBlog.blog.title }}</h1>
              <p style="margin: .2rem;">{{ prvwBlog.blog.description }}</p>
              <hr style="border-bottom: 1px solid;">
              <md-editor-v3 class="markdown-body" v-model="prvwBlog.blog.content" previewOnly theme="default" />
            </article>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { reactive, ref, defineComponent } from 'vue';
import { ElMessage } from "element-plus";
import axiosInstance from "../../utils/axios.js";

export default defineComponent({
props: {
  recvdata: {
    type: Array,
  },
},
setup(props) {
const token = localStorage.getItem('token');

let dialogVisible = ref<boolean>(false);
let prvwBlog = reactive<any>({
  blog: {
    title: "",
    description: "",
    content: "",
  }
});

const getRow = (row: any) => {
  console.log("row: ", row);
};

const deleteBlog = async (id: number) => {
  axiosInstance({
    method: "delete",
    url: `/blogs/${id}`,
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

const previewBlog = async (row: any) => {
  prvwBlog.blog = {
    title: row.title,
    description: row.description,
    content: row.content,
  };
  
  dialogVisible.value = true;

}

const handleClose = (done: () => void) => {
  done();
}
return {
reactive,
ref,
defineComponent,
ElMessage,
axiosInstance,
props,
token,
dialogVisible,
prvwBlog,
getRow,
deleteBlog,
previewBlog,
handleClose,
};
},
});
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
