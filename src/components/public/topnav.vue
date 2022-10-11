<template>
  <div class="container">
    <div id="logoPlace">
      <h2 class="toplogo">DOGSTAR</h2>
    </div>
    <nav id="midNav">
      <router-link to="/"><span class="linkStyle homePage">首页</span></router-link>
      <router-link to="/tags"><span class="linkStyle tags">标签</span></router-link>
      <router-link to="/friends"><span class="linkStyle friendClrcle">圈子</span></router-link>
      <router-link to="/resource"><span class="linkStyle resourcePlatform">资源</span></router-link>
    </nav>
    <searchComponent @queryHandler="queryHandler($event)" />
    <SelfBoxComponent @logout="logout" />
    
  </div>
</template>
<script>
import searchComponent from './search-component.vue';
import SelfBoxComponent from './self-box-component.vue';

export default {
  name: "TopNav",
  data() {
    return {
      token: localStorage.getItem("token"),
      searchValues: "",
    };
  },
  components: {
    searchComponent,
    SelfBoxComponent,
  },
  methods: {
    logout() {
      const _this = this;
      console.log("logout");
      this.$axios({
        method: "get",
        url: "/user/logout",
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          _this.$store.commit("REMOVE_INFO");
          if (_this.$store.getters.getChatState) {
            _this.$store.commit("REMOVE_CHATSTATE");
            _this.$socket.close();
          }
          this.$message({ message: "退出登录成功", type: "success" });
          _this.$router.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    
    queryHandler(value) {
      this.searchValues = value;
      console.log("searchValues", this.searchValues);
      if (this.searchValues.length > 0) {
        this.$router.push({
          path: "/search",
          query: {
            value: this.searchValues,
          },
        });
      } else {
        this.$message({ message: "请输入搜索内容", type: "warning" });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border-bottom: var(--borderline) solid 0.2rem;
  flex: 1 1 auto;
}

li {
  list-style: none;
}

span {
  font-size: 1.2rem;
}

#logoPlace {
  width: 15%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.toplogo {
  width: auto;
  text-align: center;
  font-size: 1.5rem;
  font-family: Helvetica;
  font-style: italic;
  color: var(--lightcolor);
  -webkit-text-stroke: 1px var(--ntxtcolor);
  -webkit-background-clip: text;
  background-clip: text;
  user-select: none;
}

#midNav {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex: 0 1 auto;
}

.linkStyle {
  color: var(--ntxtcolor);
  font-size: 1.3rem;
  text-decoration: none;
}

</style>
