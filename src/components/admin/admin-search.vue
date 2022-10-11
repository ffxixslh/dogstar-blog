<template>
  <div id="mainContainer">
    <el-header style="text-align: left; font-size: 12px">
      <div class="toolbar">
        <el-input v-model="search" placeholder="请输入搜索内容" @keyup.enter.native="handleSearch"
          style="width: 20rem; margin-right: 0.5rem;" />
        <el-button @click="handleSearch" type="primary">搜索</el-button>
      </div>
    </el-header>
    <div v-if="search != ''">
      <div class="usersPlace" style="margin: 0.5rem 0; text-align: left;">
        <h2 style="margin-left: .5rem;">用户</h2>
        <div class="usersBox" v-if="searchResult.users.length > 0">
          <el-main class="dataContainer">
            <el-scrollbar class="scrollPlace">
              <el-table :data="searchResult.users" stripe @row-click="getRow">
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
        </div>
        <div v-else>
          <h1 style="
          text-align: center;
          ">🤷‍♂️没有相关用户哦</h1>
        </div>
      </div>
      <hr style="margin: .2rem 0; ">
      <div class="blogsPlace" style="margin: 0.5rem 0; text-align: left;">
        <h2 style="margin-left: .5rem;">博客</h2>
        <div class="blogsBox" v-if="searchResult.blogs.length > 0">
          <el-main class="dataContainer">
            <el-scrollbar class="scrollPlace">
              <el-table :data="searchResult.blogs" stripe @row-click="getRow">
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
                    <hr style="border-bottom: .1rem solid gray;">
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
        </div>
        <div v-else>
          <h1 style="
          text-align: center;
          ">🤦没有相关博客哦</h1>
        </div>
      </div>
    </div>
    <div v-else>
      <h1 
      style="
        text-align: center;
        font-size: 2rem;
        user-select: none;
      ">
        🔎请输入搜索内容
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import axiosInstance from "../../utils/axios";

const token = localStorage.getItem("token");

let search = ref < any > ("");
let searchResult = reactive < any > ({
  users: [] as any[],
  blogs: [] as any[],
});


let dialogVisible = ref < boolean > (false);
let prvwBlog = reactive < any > ({
  blog: {
    title: "",
    description: "",
    content: "",
  }
});
let userId = ref < number > (0);

function handleSearch() {
  searchResult.blogs.length = 0;
  searchResult.users.length = 0;
  setTimeout(() => {
    getBlogsInfo();
    getUsersInfo();
  }, 100);
}

async function getUsersInfo() {
  let res = await axiosInstance({
    method: "get",
    url: "/user/searchUser",
    headers: {
      token: token,
    },
    params: {
      key: search.value,
    },
  });

  searchResult.users = res.data.data;
  console.log("users", searchResult.users);

}

async function getBlogsInfo() {
  let res = await axiosInstance({
    method: "get",
    url: "/blogs/searchBlog",
    params: {
      key: search.value,
    },
  });

  searchResult.blogs = res.data.data;

  console.log("blogs", searchResult.blogs);
}

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

watchEffect(() => {
  console.log(search.value);

})
</script>

                  <style lang="scss" scoped>
.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  // right: 20px;
}

.el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.dataContainer {
  padding: 0;
  margin: 0;
  height: fit-content;
}

.scrollPlace {
  height: auto;
  overflow: hidden;

  .el-scrollbar__wrap--hidden-default {
    height: 200px !important;
  }
}

#mainContainer {
  width: auto;
  height: auto;

  .usersPlace {
    width: 100%;
    height: auto;


    .usersBox {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }

  }

  .blogsContainer {
    width: 100%;
    height: auto;
    // border: 0.1rem solid var(--borderline);
    // border-radius: 0.5rem;
    background: #fff;

    .blogsBox {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
