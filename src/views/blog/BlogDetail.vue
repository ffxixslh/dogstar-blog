<template>
  <div id="detailContainer">
    <router-link to>
      <button id="backBtn" type="button" @click="$router.back(-1)">
        🛴返回
      </button>
    </router-link>
    <button id="topBtn" type="button" @click="toTop" v-show="showBtn">
      🚀
    </button>
    <div class="blogContainer">
      <p class="title">{{ blog.title }}</p>
      <p class="desc">{{ blog.description }}</p>
      <div style="
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        ">
        <p class="desc">
          By
          <router-link :to="{ name: 'UserBlogs', params: { userId: blog.user_id, userNickname: blog.nickname } }">
            <button class="author" type="button">
              {{ blog.nickname }}
            </button>
          </router-link>
        </p>
        <p class="time">{{ formatTime }}</p>
      </div>
      <hr class="divider" />
      <div v-if="ownBlog" class="linkPlace">
        <router-link class="userAction" :to="{ name: 'BlogEdit', params: { blogId: blog.id } }">
          <span>📝编辑</span>
        </router-link>
        <button @click="deleteBlogHandler">
          <span class="userAction">🔥删除</span>
        </button>
      </div>
      <md-editor id="markdown-body" v-model="blog.content" previewOnly preview-theme="github"></md-editor>
      <tags-item :finalTags="blog.forms" />
      <hr class="divider" />
      <details>
        <summary>
          <span>💬更多评论({{ comments.length }})</span>
        </summary>
        <comment-container v-for="(item, index) in comments" :key="item.userid" :comment="item"
          :createtime="commentCreateTimes[index]" :ownComment="ownComments[index]"
          @updateCommentHandler="updateCommentHandler" @deleteCommentHandler="deleteCommentHandler" />
      </details>
      <!-- <hr class="divider" /> -->
      <div class="commentPlace">
        <textarea class="comment-input" v-model="comment.content" placeholder="评论内容" rows="3"></textarea>
        <button class="submitCommentBtn" type="submit" @click="submitCommentHandler">
          <span class="userAction">🧾提交评论</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CommentContainer from "../../components/blog/blog-comments.vue";
import TagsItem from "../../components/blog/blog-tags.vue";
import moment from "moment";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import "github-markdown-css/github-markdown.css";

export default {
  name: "BlogDetail",
  components: {
    CommentContainer,
    TagsItem,
    MdEditor,
  },
  inject: ["reload"],
  data() {
    return {
      token: localStorage.getItem("token"),
      blog: {
        id: 0,
        title: "",
        content: "",
        description: "",
        forms: [],
        nickname: "",
        user_id: 0,
      },
      comment: {
        avatar: "",
        content: "",
        createtime: "",
        nickname: "",
        id: "",
      },
      comments: [],
      commentCreateTimes: [],
      ownBlog: false,
      ownComments: [],
      showBtn: false,
    };
  },
  methods: {
    async getBlogDetail() {
      const blogId = this.$route.params.blogId;
      const _this = this;
      this.$axios({
        method: "GET",
        url: `/blogs/getBlogById/${blogId}`,
      })
        .then((res) => {
          _this.blog = res.data.data;

          let blogComments = res.data.data.comments;
          const thisBlogComments = [];
          for (let bc in blogComments) {
            let thisBlogid = blogComments[bc]["id"];
            let thisBlogCreateTime = blogComments[bc]["create_time"];
            // 判断是否是本篇博客的评论
            if (thisBlogid == blogId) {
              let commentTime = moment(new Date(thisBlogCreateTime)).format(
                "llll"
              );
              let commentUserId = blogComments[bc]["user_id"];
              let commentTimes = _this.$data.commentCreateTimes;

              if (_this.token != null) {
                _this.$data.ownComments.push(
                  commentUserId == this.$store.getters.getUser.id
                );
              }
              commentTimes.push(commentTime);
              thisBlogComments.push(blogComments[bc]);
            }
          }
          _this.comments = thisBlogComments;

          if (this.$store.state.token) {
            //_this.$store.getters.getUser.id 的类型是 string，转10进制后比较
            if (_this.blog.user_id === parseInt(_this.$store.getters.getUser.id, 10)) {
              _this.ownBlog = true
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteBlogHandler() {
      const blogId = this.$route.params.blogId;
      const _this = this;
      this.$axios({
        method: "DELETE",
        url: `/blogs/${blogId}`,
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            _this.reload();
            this.$router.push("/");
          } else {
            this.$message({
              message: "删除失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitCommentHandler() {
      const blogId = this.$route.params.blogId;
      const _this = this;
      this.$axios({
        method: "POST",
        url: `/comments`,
        headers: {
          token: this.token,
        },
        data: {
          id: blogId,
          content: this.comment.content,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "评论成功",
              type: "success",
            });
            _this.$data.comments.push(_this.comment);
            this.reload();
          } else {
            this.$message({
              message: "评论失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "评论失败",
            type: "error",
          });
        });
    },
    deleteCommentHandler() {
      const _this = this;
      const blogid = this.$route.params.blogId;
      this.$axios({
        method: "DELETE",
        url: `/comments`,
        headers: {
          token: this.token,
        },
        data: {
          id: blogid,
        },
      })
        .then((res) => {
          this.$data.comments.pop(this.comment);
          this.$message.success("删除成功");
          this.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateCommentHandler(content) {
      const blogid = this.$route.params.blogId;
      this.$axios({
        method: "PUT",
        url: `/comments`,
        headers: {
          token: this.token,
        },
        data: {
          id: blogid,
          content: content,
        },
      })
        .then((res) => {
          this.$message.success("更新成功");
          this.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleScroll() {
      let that = this;
      let scrollTop =
        window.screenY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (scrollTop > 500) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    },
    toTop() {
      var timer = setInterval(function () {
        let osTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let ispeed = Math.floor(-osTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + ispeed;
        this.isTop = true;
        if (osTop === 0) {
          clearInterval(timer);
        }
      }, 30);
    },
  },
  computed: {
    isCurrentUser() {
      return this.$store.getters.getUser.id === this.blog.user_id;
    },
    formatTime() {
      return moment(new Date(this.blog.create_time)).format("lll");
    },
  },
  mounted() {
    this.getBlogDetail();
    window.addEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style lang="scss" scoped>
#backBtn,
#topBtn {
  font-size: 1.5rem;
  padding: 0.2rem;
  border-radius: 0.5rem;
}

#backBtn {
  position: absolute;
  top: 1rem;
  left: 0rem;
  background-color: wheat;
  transition: all 0.3s;
}

#topBtn {
  position: fixed;
  right: 2rem;
  bottom: 6rem;
  background-color: #d8d8d8;
}

#detailContainer {
  position: relative;
  width: auto;
  height: auto;
  padding: 2rem;
}

.blogContainer {
  width: 1000px;
  height: auto;
  background-color: #fff;
  border: var(--borderline) 0.2rem solid;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem auto;
}

#markdown-body {
  box-sizing: border-box;
  width: auto;
  min-height: 20rem;
  margin: 0 0 2rem 0;
  padding: 0.5rem 2rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 1.5rem;
}

#markdown-body pre {
  background-color: rgba(40, 44, 52, 1);
}

#markdown-body img {
  background-color: transparent;
}

.title {
  color: var(--ntitlecolor);
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0.5rem;
  padding: 0;
}

.author {
  color: var(--ntxtcolor);
  font-size: 1.8rem;
  font-weight: bold;
}

.time {
  color: var(--lightcolor);
  font-size: 1.2rem;
}

.desc {
  width: auto;
  height: auto;
  min-height: 1.5rem;
  font-size: 1.2rem;
  margin: 0.5rem 1.5rem;
  padding: 0;
}

.linkPlace {
  margin: 0.75rem 1rem;
}

.userAction {
  width: 6rem;
  height: 2rem;
  color: var(--borderline);
  font-size: 1.2rem;
  margin: 0.5rem;
}

.userAction:hover {
  margin-top: 0.1rem;
  border-bottom: var(--ntxtcolor) 0.1rem solid;
}

.divider {
  height: 0.1rem;
  margin: 0.5rem 0;
  border: none;
  background-color: var(--lightcolor);
}

details {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 0.5em 0.5em 0 0.5em;
  // transition: all 0.2s ease-in-out;
}

summary {
  width: fit-content;
  height: 1.5rem;
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  justify-content: center;
  text-align: start;
  font-weight: bold;
  margin: -0.5em -0.5em 0;
  padding: 0.5em;
  // transition: 0.2s ease-in-out;
  user-select: none;
}

summary>span {
  width: fit-content;
  height: fit-content;
  cursor: pointer;
}

summary>span:hover {
  margin-top: 0.1rem;
  border-bottom: var(--ntxtcolor) 0.1rem solid;
}

details[open] {
  padding: 0.5em;
  // transition: 0.2s ease-in-out;
}

details[open] summary {
  margin-bottom: 0.5em;
}

details>summary::-webkit-details-marker {
  display: none;
}

.commentPlace {
  width: auto;
  height: auto;
  margin: 0 auto;
  padding: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
}

.comment-input {
  width: 61.8%;
  height: auto;
  margin: 0.5rem;
  padding: 0.75rem;
  resize: none;
  border: var(--borderline) 0;
  border: var(--lightcolor) 0.1rem solid;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  font-family: Helvetica;
}

.submitCommentBtn {
  width: auto;
  height: 2rem;
  /* color: var(--borderline); */
  font-size: 1.1rem;
  margin: 0.5rem 0;
}
</style>
