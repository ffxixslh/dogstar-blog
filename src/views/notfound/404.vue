<template>
  <div class="index">
    <div id="backBtn">
      <router-link to>
        <button type="button" @click="back">../</button>
      </router-link>
    </div>
    <span style="font-size: 10rem">😅</span>
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在</p>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
  methods: {
    back() {
      this.$router.back(-1);
    }
  }
};
</script>

<style scoped>
.index {
  position: relative;
  width: auto;
  height: 100vh;
  text-align: center;
  padding: 4rem;
}

#backBtn {
  font-family: monospace;
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>
