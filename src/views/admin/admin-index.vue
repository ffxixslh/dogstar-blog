<template>
  <div style="padding-bottom: 4rem">
    <h1>管理员界面</h1>
    <el-container class="mainContainer">
      <el-aside width="250px" class="asideBox">
        <el-scrollbar class="scrollPlace">
          <el-menu :default-openeds="['-1']">
            <el-menu-item index="1-1" @click="currentTabComponent('mngBlogs')">
              <el-icon>
                <Message />
              </el-icon>
              <span>博客管理</span>
            </el-menu-item>
            <el-menu-item index="2-1" @click="currentTabComponent('mngTags')">
              <el-icon>
                <Menu />
              </el-icon>
              <span>标签管理</span>
            </el-menu-item>
            <el-menu-item index="3-1" @click="currentTabComponent('mngResources')">
              <el-icon>
                <Files />
              </el-icon>
              <span>资源管理</span>
            </el-menu-item>
            <el-menu-item index="4-1" @click="currentTabComponent('mngUsers')">
              <el-icon>
                <User />
              </el-icon><span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="5-1" @click="currentTabComponent('mngSearch')">
              <el-icon>
                <Search />
              </el-icon><span>模糊查询</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main class="mainBox">
        <div v-if="searchState === false">
          <h1 style="
              color: var(--lightcolor);
              text-align: center;
              font-size: 5rem;
              font-style: italic;
              -webkit-text-stroke: 0.1rem var(--ntxtcolor);
              user-select: none;
            ">
            DogStar
          </h1>
        </div>
        <div v-else>
          <keep-alive>
            <component :is="componentName" :recvdata="tableData.values">
            </component>
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { debounce } from "../../utils/loadsh.js";
import { ref, reactive, defineAsyncComponent } from "vue";
import axiosInstance from "../../utils/axios.js";

export default {
  components: {
    mngBlogs: defineAsyncComponent(
      () => import("../../components/admin/admin-blogs.vue")
    ),
    mngTags: defineAsyncComponent(
      () => import("../../components/admin/admin-tags.vue")
    ),
    mngResources: defineAsyncComponent(
      () => import("../../components/admin/admin-resources.vue")
    ),
    mngUsers: defineAsyncComponent(
      () => import("../../components/admin/admin-users.vue")
    ),
    mngSearch: defineAsyncComponent(
      () => import("../../components/admin/admin-search.vue")
    )
  },
  setup() {
    const token = localStorage.getItem("token");

    let searchState = ref(false);

    const tableData = reactive({
      values: [] as any[],
    });
    const componentName = ref<string>("");

    const currentTabComponent = (cpnName: string) => {
      tableData.values = [];
      componentName.value = cpnName;

      switch (cpnName) {
        case "mngBlogs":
          searchState.value = true;
          const getBlogs = debounce(async () => {
            let res = await axiosInstance.get("/blogs/getAllBlogs");
            tableData.values = res.data.data;
            // searchState.value = false;
          }, 500);

          getBlogs();
          break;

        case "mngTags":
          searchState.value = true;
          const getTags = debounce(async () => {
            let res = await axiosInstance.get("/types", {
              headers: {
                token: token,
              },
            });
            tableData.values = res.data.data;
            // searchState.value = false;
          }, 500);

          getTags();
          break;

        case "mngResources":
          searchState.value = true;
          let getResources = debounce(async () => {
            let res = await axiosInstance.get("/files/getAllFile");
            tableData.values = res.data.data;
            // searchState.value = false;
          }, 500);

          getResources();
          break;

        case "mngUsers":
          searchState.value = true;
          let getUsers = debounce(async () => {
            let res = await axiosInstance.get("/user", {
              headers: {
                token: token,
              },
            });
            tableData.values = res.data.data;
            // searchState.value = false;
          }, 500);

          getUsers();
          break;

        case "mngSearch":
          console.log("mngSearch");
          searchState.value = true;
          let getSearch = debounce(async () => {
            let res = await axiosInstance.get("/user/toAdmin", {
              headers: {
                token: token,
              },
            });
            tableData.values = res.data;
            // searchState.value = false;
          }, 500);
          getSearch();

          break;

        default:
          console.log("default");
          break;
      }
    };

    return {
      searchState,
      tableData,
      componentName,
      currentTabComponent,
    };
  },
};
</script>

<style lang="scss" scoped>
.mainContainer {
  width: auto;
  min-height: 34rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  border: 0.1rem solid var(--borderline);
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  transition: all 0.3s ease-in-out;

  .asideBox {
    flex-grow: 0;
    color: var(--el-text-color-primary);
    border-right: 1px solid var(--borderline);

    .scrollPlace {
      width: auto;
      height: fit-content;
      background: transparent;



      .el-menu {
        background: var(--el-color-primary-light-9);
        color: var(--el-text-color-primary);

        .el-menu-item-group {
          .el-menu-item-group__title {
            background-color: transparent;
          }

          .el-menu-item {
            color: var(--el-text-color-primary);

            &:hover,
            &.is-active {
              background-color: var(--el-color-primary-light-7);
            }
          }
        }
      }
    }
  }

  .mainBox {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    padding: 0;
    transition: all 0.3s ease-in-out;
  }
}
</style>
