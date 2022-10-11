<template>
  <div class="blog-user-panel">
    <div class="blog-avatar">
      <el-avatar v-if="userAvtar" :src="userAvtar" :size="120" />
      <div
        v-else
        style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background-color: rgb(100, 217, 214);
        "
      >
        🥳
      </div>
    </div>
    <div class="blog-info">
      <h3 class="blog-info--nickname">{{ userName }}</h3>
      <div v-if="hasLogin">
        <div class="blog-info--state">
          <!-- 悬浮卡片 -->
          <div class="hover_wrapper">
            <div class="blog-info--item">
              <div class="showList">
                <div v-if="this.ownFollows.length > 0">
                  <h3 style="text-align: left; padding: 0.25rem">✨关注</h3>
                  <div class="followList">
                    <span
                      v-for="follow in ownFollows"
                      :key="follow.other_id"
                      class="followStyle"
                    >
                      <router-link
                        :to="{
                          name: 'UserCenter',
                          params: { toUserId: follow.other_id },
                        }"
                      >
                        {{ follow.name }}
                      </router-link>
                    </span>
                  </div>
                </div>
                <div v-else>
                  <h3 style="text-align: left; padding: 0.25rem">
                    🤷‍♀️没有关注的用户
                  </h3>
                </div>
              </div>
              <span class="blog-state--count">{{ following }}</span>
              <span class="blog-state--name">关注</span>
            </div>
          </div>
          <div class="hover_wrapper">
            <div class="blog-info--item">
              <div class="showList">
                <div v-if="this.ownFans.length > 0">
                  <h3 style="text-align: left; padding: 0.25rem">👯‍♂️粉丝</h3>
                  <div class="fanList">
                    <span
                      v-for="fan in ownFans"
                      :key="fan.other_id"
                      class="followStyle"
                    >
                      <router-link
                        :to="{
                          name: 'UserCenter',
                          params: { toUserId: fan.other_id },
                        }"
                      >
                        {{ fan.name }}
                      </router-link>
                    </span>
                  </div>
                </div>
                <div v-else>
                  <h3 style="text-align: left; padding: 0.25rem">🤷‍♀️没有粉丝</h3>
                </div>
              </div>
              <span class="blog-state--count">{{ fans }}</span>
              <span class="blog-state--name">粉丝</span>
            </div>
          </div>

          <div class="blog-info--item">
            <span class="blog-state--count">{{ blogs }}</span>
            <span class="blog-state--name">博客</span>
          </div>
          <div class="blog-info--item">
            <span class="blog-state--count">{{ files }}</span>
            <span class="blog-state--name">文件</span>
          </div>
        </div>
        <div class="blog-info--biography">{{ biography }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserPanel",
  data() {
    return {
      token: localStorage.getItem("token"),
      ownFollows: [],
      ownFans: [],
      biography: "这个人很懒，什么都没有留下",
      showHover: false,
    };
  },
  props: {
    blogs: Number,
    files: Number,
    fans: Number,
    following: Number,
  },
  methods: {
    getBio() {
      if (this.$store.state.token) {
        this.$axios
          .get(`user/getUser/${this.$store.getters.getUser.id}`)
          .then((res) => {
            this.biography = res.data.data.biography;
          });
      }
    },
    getOwnFollows() {
      const _this = this;
      const userId = this.$store.getters.getUser.id;
      this.$axios({
        method: "GET",
        url: `/circle/attend/${userId}`,
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          _this.ownFollows = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOwnFans() {
      const _this = this;
      const userId = this.$store.getters.getUser.id;
      this.$axios({
        method: "GET",
        url: `/circle/fans/${userId}`,
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          _this.ownFans = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    hasLogin() {
      if (this.$store.state.token) {
        return true;
      } else {
        return false;
      }
    },
    userName() {
      if (this.hasLogin) {
        return this.$store.getters.getUser.nickname;
      } else {
        return "登录更有趣";
      }
    },
    userAvtar() {
      if (this.hasLogin) {
        return this.$store.getters.getUser.avatar;
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.getBio();
    if (this.$store.state.token) {
      this.getOwnFollows();
      this.getOwnFans();
    }
  },
};
</script>

<style lang="scss" scoped>
.blog-user-panel {
  width: auto;
  min-width: 15rem;
  height: 18rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  border-radius: 0.5rem;
  background: #fff;
  border: var(--borderline) solid 0.1rem;
}

.blog-info {
  padding-top: 24px;
}

.blog-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border: var(--ntxtcolor) solid 2px;
  border-radius: 100%;
  z-index: 9;
  background-color: #fff;
  overflow: hidden;
  user-select: none;
}

.blog-info--nickname {
  font-size: 24px;
  padding: 0 0 0.5rem;
}

.blog-info--state {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;

  .hover_wrapper {
    width: auto;
    height: auto;

    .showList {
      position: absolute;
      width: 12rem;
      height: auto;
      top: calc(-50%);
      left: -12rem;
      background-color: #eee;
      border: 0.1rem solid var(--borderline);
      border-radius: 0.5rem;
      opacity: 0;
      visibility: hidden;
      transition: 0.2s ease-in-out;
      transition-delay: 0.3s;

      .followList,
      .fanList {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        border-top: 1px solid var(--borderline);
      }

      .followStyle {
        font-size: 1.5rem;
        color: var(--borderline);
        margin: 0.2rem;
      }
    }

    .blog-info--item:hover .showList {
      opacity: 1;
      visibility: visible;
      transition: 0.2s ease-in-out;
    }
  }
}

.blog-info--item {
  margin: 0.5rem;
}

.blog-info--item span {
  display: block;
}

.blog-state--count {
  color: var(--borderline);
  font-weight: 700;
}

.blog-state--name {
  position: relative;
  color: var(--ntxtcolor);
  padding-top: 4px;
}

.blog-info--biography {
  width: auto;
  height: auto;
  color: var(--ntxtcolor);
  font-size: 1.5rem;
  text-align: center;
}
</style>
