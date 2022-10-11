<template>
  <div class="mainContainer">
    <div class="user-container">
      <user-panel :blogs="user.blogs" :files="user.files" :fans="user.fans" :following="user.following" />
    </div>
    <div class="blog-container">
      <h1>热门文章</h1>
      <div class="blog-list">
        <div v-if="isLoading">
          <skeleton-content-item></skeleton-content-item>
        </div>
        <div v-else>
          <div v-for="(blog, index) in blogs" :key="blog.id">
            <blog-content-item :userId="blog.user_id" :nickname="blog.nickname" :id="blog.id" :title="blog.title"
              :description="blog.description" :createTime="blogCreateTimes[index]" :transTags="blogTags[index]">
            </blog-content-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BlogContentItem from "../../components/blog/blog-content-item.vue";
import SkeletonContentItem from "../../components/blog/Skeleton-content-item.vue";
import UserPanel from "../../components/user/user-panel.vue";
import moment from "moment";

export default {
  name: "Home",
  data() {
    return {
      token: localStorage.getItem("token"),
      isLoading: true,
      blogs: [],
      blogCreateTimes: [],
      blogTags: [],
      user: {
        blogs: 0,
        files: 0,
        fans: 0,
        following: 0,
      },
    };
  },
  components: {
    BlogContentItem,
    SkeletonContentItem,
    UserPanel,
  },
  methods: {
    getBlogDetails() {
      const _this = this;
      this.$axios({
        method: "GET",
        url: "/blogs/getAllBlogs",
      })
        .then((res) => {
          this.blogs = res.data.data;
          this.blogs.forEach((blog) => {
            //  1.获取当前文章的创建时间，并将时间格式化
            let createTime = moment(blog.create_time).format("lll");
            //  2.获取当前文章的标签，并用map()将标签放入一个数组
            let getTags = [];
            blog.forms.map((tag) => {
              getTags.push(tag);
            });
            // 3.将创建时间和标签数组分别加入到对应数组
            _this.$data.blogCreateTimes.push(createTime);
            _this.$data.blogTags.push(getTags);
          });
        })
        .catch((err) => {
          console.log(err);
        });

    },
    getUserCount() {
      let userId = this.$store.getters.getUser.id;
      this.$axios({
        method: "GET",
        url: `/counter/${userId}`,
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          let data = res.data.data;
          this.user.blogs = data["num_blogs"];
          this.user.files = data["num_files"];
          this.user.fans = data["num_fans"];
          this.user.following = data["num_attends"];
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  },
  mounted() {
    if (this.$store.getters.getToken) {
      this.getUserCount();
    }
    this.getBlogDetails();
  },
};
</script>

<style lang="scss" scoped>
.mainContainer {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1 0 auto;
}

.user-container {
  position: sticky;
  top: 2rem;
  margin-top: 5rem;
  width: auto;
  height: auto;
  padding-right: 0.5rem;
}

.blog-container {
  width: auto;
  height: auto;
  min-width: 50rem;
  padding-left: 0.5rem;
}

.blog-list {
  width: auto;
  height: auto;
  min-height: 25rem;
  background-color: #fff;
  border: var(--borderline) solid 0.1rem;
  border-radius: 0.5rem;
}

@media screen and (max-width: 1200px) {
  .mainContainer {
    flex-direction: column;
  }

  .user-container {
    position: static;
    width: auto;
    height: auto;
    margin-top: 0;
    padding: 0.5rem 0;
  }

  .blog-container {
    width: auto;
    height: auto;
    min-width: 50rem;
    padding: 0.5rem 0;

    .blog-list {
      // min-width: 54rem;
      width: 100%;
      height: auto;
    }
  }

}
</style>
