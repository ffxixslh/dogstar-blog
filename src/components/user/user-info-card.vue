<template>
  <div class="user-card-item">
    <div class="user-card">
      <div class="user-card-avatar">
        <router-link :to="{ name: 'UserCenter', params: { toUserId: id } }">
          <img :src="avatar" alt="">
        </router-link>
      </div>
      <div class="user-card-info">
        <div class="user-card-info-name">
          <span style="font-size: 2.5rem;">{{ nickname }}</span>
        </div>
        <div class="user-card-info-state">
          <div class="user-card-info-item">
            <span class="user-card-info-email">邮箱:{{ email }}</span>
          </div>
          <div class="user-card-info-item">
            <span class="user-card-info-name">简介:</span>
            <span class="user-card-info-count">{{ biography }}</span>
          </div>
        </div>
      </div>
      <button v-if="!isFollowed" class="followBtn" type="button" @click="setFollow">关注</button>
      <button v-else class="followBtn" type="button" @click="setUnfollow">取消关注</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfoCard',
  data() {
    return {
      user: {
        id: 0,
        avatar: '',
        nickname: '',
        email: '',
        biography: '',
      },
      users: [],
    }
  },
  inject: ['reload'],
  props: {
    id: Number,
    avatar: String,
    nickname: String,
    email: String,
    biography: String,
    isFollowed: Boolean,
  },
  methods: {
    setFollow() {
      this.$emit('setFollow')
    },
    setUnfollow() {
      this.$emit('setUnfollow')
    },
    test() {
      console.log(this.id)
    }
  },
  mounted() {
    // this.user.id = this.id
    // this.user.avatar = this.avatar
    // this.user.nickname = this.nickname
  },
}

</script>

<style lang="scss" scoped>
.user-card-item {
  display: inline-block;
  margin: .5rem;

  .user-card {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-shadow: 0 0 .1rem #989898;
    background-color: #f6f6f6;
    border-radius: .5rem;
    overflow: hidden;
    position: relative;

    .user-card-avatar img {
      width: 9rem;
      height: 9rem;
      display: block;
      // vertical-align: baseline;
    }

    .user-card-info {
      padding: .5rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      flex-grow: 1;

      .user-card-info-state {
        color: var(--ntxtcolor);
      }
    }

    .followBtn {
      position: absolute;
      right: 1rem;
      top: 1rem;
    }
  }
}
</style>