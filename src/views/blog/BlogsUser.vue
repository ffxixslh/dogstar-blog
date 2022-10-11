<template>
  <div class="mcontaner">
    <h1>关于
      <span style="margin: 0 0.2rem; text-decoration: underline">
        {{ $route.params.userNickname }}
      </span>
      的所有文章
    </h1>
    <div class="block">
      <el-timeline>
        <el-timeline-item placement="top" v-for="blog in blogs" :key="blog.id">
          <h3 style="color: var(--lightcolor);">{{ formatCreateTime(blog.create_time) }}</h3>
          <el-card>
            <h2>
              <router-link :to="{ name: 'BlogDetail', params: { blogId: blog.id } }">
                {{ blog.title }}
              </router-link>
            </h2>
            <p>{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Blogs",
  components: {},
  data() {
    return {
      blogs: [],
    };
  },
  methods: {
    queryAuthorBlogs() {
      const _this = this;
      let userid = this.$route.params.userId;
      console.log(this.$route.params.userNickname);
      this.$axios({
        method: "GET",
        url: `/blogs/user/${userid}`
      })
        .then((res) => {
          _this.blogs = res.data.data;
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatCreateTime(time) {
      return moment(time).format("lllll");
    },
  },
  computed: {
  },
  mounted() {
    this.queryAuthorBlogs();
  },
};
</script>

<style scoped>
.mpage {
  margin: 0 auto;
  text-align: center;
}
</style>
