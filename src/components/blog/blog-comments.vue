<template>
  <div id="commentContainer">
    <div id="commentatorInfo">
      <div class="l-box">
        <el-avatar :src="avatar" :size="80" />
      </div>
    </div>
    <div class="r-box">
      <div class="rt-box">
        <div class="nicknamePlace">
          {{ comment.nickname == null ? "匿名用户" : comment.nickname }}
        </div>
        <div class="createtimePlace">{{ createtime }}</div>
        <div v-if="this.ownComment" class="rtr-box">
          <button class="actionBtn" @click="updateComment">🌌UPDATE</button>
          <button class="actionBtn" @click="deleteComment">❌DELETE</button>
        </div>
        <div v-else></div>
      </div>
      <div class="rb-box">
        <div class="updateCommentPlace" v-if="isEditingComment">
          <textarea class="editCommentPlace" v-model="comment.content">{{
            comment.content
          }}</textarea>
          <div class="commentAction">
            <button @click="submitComment">🆗提交</button>
            <button @click="cancelComment">🔙取消</button>
          </div>
        </div>
        <div v-else class="commentPlace">{{ comment.content }}</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "CommentContainer",
  data() {
    return {
      isEditingComment: false,
    };
  },
  props: {
    comment: {
      avatar: String,
      blogid: Number,
      nickname: String,
      userid: Number,
      content: String,
    },
    createtime: String,
    ownComment: Boolean,
  },
  methods: {
    updateComment() {
      this.isEditingComment = true;
    },
    submitComment() {
      this.$emit("updateCommentHandler", this.comment.content);
    },
    cancelComment() {
      this.isEditingComment = false;
    },
    deleteComment() {
      this.$emit("deleteCommentHandler", this.comment);
    },
  },
  computed: {
    hasLogin() {
      if (this.$store.state.token) {
        if (sessionStorage.getItem("userInfo")) {
          return true;
        }
      } else {
        return false;
      }
    },
    avatar() {
      return this.$axios.defaults.baseURL + this.comment.avatar;
    },
  },
};
</script>
<style lang="scss" scoped>
#commentContainer {
  width: auto;
  height: auto;
  margin: 1rem 1rem;
  padding: 1rem 1rem;
  /* border-bottom: var(--lightcolor) solid 1px; */
  /* border-radius: 0.5rem; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#commentatorInfo {
  width: auto;
  height: fit-content;
  line-height: 4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0.5em 0;
  padding: 0 0.5rem 1rem;
}

.r-box {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
}

.rt-box {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.nicknamePlace {
  width: auto;
  height: 2rem;
  line-height: 1.2rem;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0.5rem 0;
  padding: 0 0.5rem 0 0;
}

.createtimePlace {
  width: 45%;
  height: auto;
  color: #aaa;
  font-size: 0.9rem;
  flex-shrink: 1;
}

.rb-box {
  position: relative;
  width: auto;
  min-height: 5rem;
  background-color: #eee;
  border: #fff solid 0.1rem !important;
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  /* padding: 0.5rem; */
  flex-shrink: 0;
}

.rtr-box {
  min-width: fit-content;
  height: 1.25rem;
  margin-left: auto;
}

.actionBtn {
  width: fit-content;
  height: fit-content;
  font-size: 0.9rem;
  background: none;
  color: var(--ntxtcolor);
  border: none;
  padding: 0 0.25rem;
  margin: 0 0.25rem;
}

.actionBtn:hover {
  border-bottom: var(--ntxtcolor) solid 0.1rem;
}

.updateCommentPlace {
  position: relative;
  width: auto;
  height: auto;
  line-height: 1.2rem;
  padding: 0.4rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.commentPlace {
  padding: 0.5rem;
}

.editCommentPlace {
  width: 100%;
  height: 100%;
  margin: 0 0 0.5rem 0;
  /* padding: 0.1rem; */
  border: none;
  border-radius: 0.2rem;
  resize: none;
  background-color: #fff;
}

.commentAction {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0.5rem 0 0;
}

.commentAction > button {
  width: fit-content;
  height: 1.2rem;
  margin: 0 1rem 0 0;
}

.commentAction > button:hover {
  border-bottom: var(--ntxtcolor) solid 0.1rem;
}
</style>
