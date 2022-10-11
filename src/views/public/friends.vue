<template>
  <div style="padding-bottom: 4rem;">
    <h1>圈子</h1>
    <div class="userInfoCardPlace">
      <user-info-card
        v-for="user in users"
        :key="user.id"
        :id="user.id"
        :avatar="getUserAvatar(user.avatar)"
        :nickname="user.nickname"
        :email="user.email"
        :biography="user.biography"
        :isFollowed="user.isFollowed"
        @setFollow="setFollow(user.id)"
        @setUnfollow="setUnfollow(user.id)"
      />
    </div>
  </div>
</template>

<script>
import userInfoCard from "../../components/user/user-info-card.vue";
export default {
  name: "Friends",
  data() {
    return {
      token: localStorage.getItem('token'),
      user: {
        id: 0,
        avatar: "",
        nickname: "",
        email: "",
        biography: "",
        isFollowed: false,
      },
      users: [],
      following: [],
    };
  },
  inject: ["reload"],
  components: {
    userInfoCard,
  },
  methods: {
    getUsersInfo() {
      let userId = this.$store.getters.getUser.id;
      const _this = this;
      this.$axios({
        method: "GET",
        url: `/user`,
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          let usersData = res.data.data;
          usersData.forEach((user) => {
            let { id, avatar, nickname, email, biography } = user;
            if (user.id !== +userId) {
              _this.users.push({
                id,
                avatar,
                nickname,
                email,
                biography,
              });
            }
          });
          _this.queryFollow();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserAvatar(url) {
      return this.$axios.defaults.baseURL + url;
    },
    setFollow(followId) {
      const _this = this;
      this.$axios({
        method: "POST",
        url: `/circle/addAttend`,
        headers: {
          token: this.token,
        },
        data: {
          id: this.$store.getters.getUser.id,
          other_id: followId,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: "关注成功",
            type: "success",
          });
          _this.reload();
        } else {
          this.$message({
            message: "关注失败",
            type: "error",
          });
        }
      });
    },
    setUnfollow(followId) {
      const _this = this;
      this.$axios({
        method: "DELETE",
        url: `/circle/deleteAttend`,
        headers: {
          token: this.token,
        },
        data: {
          id: this.$store.getters.getUser.id,
          other_id: followId,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: "取消关注成功",
            type: "success",
          });
          _this.reload();
        } else {
          this.$message({
            message: "取消关注失败",
            type: "error",
          });
        }
      });
    },
    queryFollow() {
      const _this = this;
      let userId = this.$store.getters.getUser.id;
      this.$axios({
        method: "GET",
        url: `/circle/attend/${userId}`,
        headers: {
          token: this.token,
        },
      }).then((res) => {
        let data = res.data.data;
        console.log('data', data);
        let followNums = data.map((item) => item.other_id);
        _this.users.forEach((user) => {
          if (followNums.includes(user.id)) {
            user.isFollowed = true;
          }
        });
        console.log('followNums', followNums);
      });
    },
  },
  mounted() {
    this.getUsersInfo();
    // this.queryFollow();
  },
};
</script>
<style lang="scss" scoped>
.userInfoCardPlace {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}
</style>
