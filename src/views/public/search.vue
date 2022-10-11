<template>
  <div id="mainContainer">
    <h1>
      关于
      <span style="margin: 0 0.2rem; text-decoration: underline">{{
          route.query.value
      }}</span>
      的搜索结果
    </h1>
    <div class="usersPlace" v-show="token">
      <h2>用户</h2>
      <div class="queryUsers">
        <div class="usersBox" v-if="users.length > 0">
          <user-info-card v-for="(user, index) in users" :key="user.id" :id="user.id"
            :avatar="getUserAvatar(user.avatar)" :nickname="user.nickname" :email="user.email"
            :biography="user.biography" :isFollowed="isFollowings[index]" @setFollow="setFollow(user.id)"
            @setUnfollow="setUnfollow(user.id)" />
        </div>
        <div v-else>
          <h1>🤷‍♂️没有相关用户哦</h1>
        </div>
      </div>
    </div>
    <div class="blogsPlace">
      <h2>博客</h2>
      <div class="blogsContainer">
        <div class="blogsBox" v-if="blogs.length > 0">
          <blog-content-item v-for="blog in blogs" :key="blog.id" :id="blog.id" :title="blog.title"
            :description="blog.description" :createTime="formatTime(blog.create_time)" :userId="blog.user_id"
            :nickname="blog.nickname" :transTags="blog.tags" />
        </div>
        <div v-else>
          <h1>🤦没有相关博客哦</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, inject } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import axiosInstance from "../../utils/axios";
import store from "../../utils/store";
import UserInfoCard from "../../components/user/user-info-card.vue";
import BlogContentItem from "../../components/blog/blog-content-item.vue";
import moment from "moment";

let route = useRoute();
console.log("search", route.query.value);
const reload = inject("reload", window.location.reload);
const token = localStorage.getItem("token");

let users = reactive<any>([]);
let blogs = reactive<any>([]);
let isFollowings = reactive<any>([]);

setTimeout(() => {
  getBlogsInfo();
  if (token) {
    setTimeout(() => {
      getUsersInfo();
      queryFollow();
    }, 100);
  }
}, 100);

async function getUsersInfo() {
  let res = await axiosInstance({
    method: "get",
    url: "/user/searchUser",
    headers: {
      token: token,
    },
    params: {
      key: route.query.value,
    },
  });

  let data = res.data.data

  data.filter((user: any) => {
    if (user.id != store.getters.getUser.id) {
      users.push(user);
    }
  })

  console.log("users", users);

}

const getUserAvatar = (url: any) => {
  return axiosInstance.defaults.baseURL + url;
};

async function queryFollow() {
  isFollowings.length = 0;
  let userId = store.getters.getUser.id;
  let res = await axiosInstance({
    method: "GET",
    url: `/circle/attend/${userId}`,
    headers: {
      token: token,
    },
    params: {
      userId: store.getters.getUser.id,
    },
  });

  let data = res.data.data;

  let following = data.flatMap((item: any) => {
    return item.other_id
  });

  console.log("following", following);

  users.forEach((user: any) => {
    if (following.includes(user.id)) {
      isFollowings.push(true);
    } else {
      isFollowings.push(false);
    }
  });

  console.log("follows", isFollowings);
}

const setFollow = async (followId: number) => {
  console.log("setFollow", followId);
  axiosInstance({
    method: "post",
    url: "/circle/addAttend",
    headers: {
      token: token,
    },
    data: {
      id: store.getters.getUser.id,
      other_id: followId,
    },
  })
    .then((res: any) => {
      console.log("follow res", res);
      if (res.data.code === 200) {
        ElMessage({
          message: "关注成功",
          type: "success",
        });
        queryFollow();
        // reload();
      } else {
        ElMessage({
          message: "关注失败",
          type: "error",
        });
      }
    })
    .catch((err: any) => {
      console.log("follow err", err);
    });
};

const setUnfollow = (followId: number) => {
  console.log("setUnfollow", followId);
  axiosInstance({
    method: "DELETE",
    url: "/circle/deleteAttend",
    headers: {
      token: token,
    },
    data: {
      id: store.getters.getUser.id,
      other_id: followId,
    },
  })
    .then((res: any) => {
      console.log("setUnfollow", res);
      if (res.data.code === 200) {
        ElMessage({
          message: "取消关注成功",
          type: "success",
        });
        queryFollow();
        // reload();
      } else {
        ElMessage({
          message: "取消关注失败",
          type: "error",
        });
      }
    })
    .catch((err: any) => {
      console.log("setUnfollow err", err);
    });
};

async function getBlogsInfo() {
  let res = await axiosInstance({
    method: "get",
    url: "/blogs/searchBlog",
    params: {
      key: route.query.value,
    },
  });

  blogs.push(...res.data.data);

  // console.log("blogs", blogs);
}

const formatTime = (time: string | number | Date) => {
  return moment(new Date(time)).format("lll");
};
</script>

<style lang="scss" scoped>
#mainContainer {
  width: auto;
  height: 100%;

  .usersPlace {
    width: 100%;
    height: auto;

    .queryUsers {
      border: 0.1rem solid var(--borderline);
      border-radius: 0.5rem;
      background: #fff;
      margin-bottom: 1rem;

      .usersBox {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      }
    }
  }

  .blogsContainer {
    width: 100%;
    height: auto;
    border: 0.1rem solid var(--borderline);
    border-radius: 0.5rem;
    background: #fff;

    .blogsBox {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
