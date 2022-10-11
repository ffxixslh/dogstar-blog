<template>
  <div div id="selfPlace">
    <router-link to="/blogs/add">
      <div id="writePen" class="bgmask selfItem" title="点击创建文章">
        <i class="btnIcon">📄</i>
      </div>
    </router-link>
    <div id="selfBar" class="bgmask selfItem" @click.stop="">
      <div id="avatarBox">
        <router-link to="/self">
          <div v-if="hasLogin" class="avatarIn">
            <el-avatar :src="userAvtar" :size="50" shape="square" />
          </div>
          <div v-else class="avatarIn">
            <i class="btnIcon">😀</i>
          </div>
        </router-link>
      </div>
      <div id="menuPlace">
        <ul id="selfMenu">
          <li>
            <span>{{ userName }}</span>
          </li>
          <div id="logState" v-if="hasLogin">
            <li>
              <router-link to="/self/setting">
                <i class="btnIcon">🔧</i>
                <span class="menuSpan">设置</span>
              </router-link>
            </li>
            <li>
              <button type="button" class="quitBtn" @click.prevent="logout">
                <i class="btnIcon">🛸</i>
                <span class="menuSpan">退出</span>
              </button>
            </li>
          </div>
          <div v-else>
            <li>
              <router-link to="/login">
                <i class="btnIcon">🚀</i>
                <span class="menuSpan">登录</span>
              </router-link>
            </li>
          </div>
        </ul>
      </div>
    </div>
    <div v-if="hasLogin" class="statusStyle">
      <div id="logOut" class="logStyle">
        <button type="button" class="quitBtn" @click.prevent="logout">
          <span class="linkStyle">退出</span>
        </button>
      </div>
      <router-link to="/chat">
        <div id="chatRoom" class="bgmask btnStyle">
          <span class="linkStyle">消息</span>
        </div>
      </router-link>
    </div>
    <div v-else class="statusStyle">
      <router-link to="/login">
        <div id="logIn" class="logStyle">
          <span class="linkStyle">登录</span>
        </div>
      </router-link>
      <router-link to="/logup">
        <div id="logUp" class="bgmask btnStyle">
          <span class="linkStyle">注册</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelfBoxComponent",
  methods: {
    logout() {
      this.$emit("logout");
    }
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
        return "你好，" + this.$store.state.userInfo.nickname;
      } else {
        return "登录更有趣";
      }
    },
    userAvtar() {
      if (this.hasLogin) {
        return this.$store.state.userInfo.avatar;
      } else {
        return "";
      }
    },

  },
}
</script>

<style lang="scss" scoped>
#selfPlace {
  width: 23%;
  min-width: 19rem;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex: 1 0 4rem !important;
}

.selfItem {
  width: 3rem !important;
  height: 3rem !important;
  margin: 0 0.5rem;
}

#writePen {
  border: var(--redcolor) solid 3px;
  border-radius: 50%;
  background-color: rgb(255, 107, 127);
}

#selfBar {
  z-index: 9;
  position: relative;
  border: var(--yellowcolor) solid 3px;
  border-radius: 0.3rem;
  background-color: rgb(252, 236, 91);
  /* margin: 0 1rem; */
}

.avatarBox {
  position: relative;
}

.avatarIn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  user-select: none;
}

#menuPlace {
  z-index: 9;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 4rem;
  right: -2.5rem;
  width: 8rem;
  height: auto;
  transition: 0.2s ease-in-out;
  transition-delay: 0.5s;
}

#selfMenu {
  display: flex;
  flex-direction: column;
  background-color: #eeeeee;
  border: var(--ntxtcolor) solid 3px;
  border-radius: 4px;
  text-align: center;
  font-family: Helvetica;
}

#selfMenu li {
  margin: 0.5rem 0;
}

#logState {
  border-top: 1px solid #bbb;
}

#selfBar:hover>#menuPlace {
  z-index: 9;
  opacity: 1;
  visibility: visible;
  transition: 0.2s ease-in-out;
  /* transition-delay: .5s; */
}

.statusStyle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.logStyle {
  margin-right: 0.5rem;
}

.btnStyle {
  width: 5rem;
  height: 2.5rem;
  color: var(--lightcolor);
  background-color: #67fd5c;
  border: var(--greencolor) solid 3px;
  border-radius: 4px;
  margin: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bgmask {
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btnIcon {
  font-size: large;
  font-style: normal !important;
}

.menuSpan {
  color: var(--borderline);
  font-size: 1.2rem;
}

.quitBtn {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.linkStyle {
  color: var(--ntxtcolor);
  font-size: 1.3rem;
  text-decoration: none;
}
</style>