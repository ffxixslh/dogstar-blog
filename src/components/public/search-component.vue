<template>
  <div id="searchPlace">
    <div id="searchBox">
      <div class="searchOverlay">
        <input type="search" name="search" placeholder="Search...." class="searchInput" v-model="value"
          @keyup.enter.native="queryHandler" autoComplete="on" />
      </div>
      <button type="button" @click.prevent="queryHandler" id="queryBtn">
        <span class="btnIcon">🔍</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
  data() {
    return {
      token: localStorage.getItem("token"),
      value: "",
    };
  },
  emits: ["queryHandler"],
  methods: {
    queryHandler() {
      this.$emit("queryHandler", this.value);
      console.log(this.value);
    },
  },
  watch: {
    searchValues: function (val) {
      this.value = val;
    }
  },
  computed: {
    showValues() {
      if (this.value) {
        console.log(this.value);
      } else {
        ElMessage.warning("请输入搜索内容");
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#searchPlace {
  width: 28%;
  max-width: 28rem;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 1 1 auto;
}

#searchBox {
  position: relative;
  width: 100%;
  height: auto;
}

.searchOverlay {
  width: auto;
  display: flex;
  flex: 0 1 auto;
}

#searchBox .searchInput {
  width: 100%;
  height: 3rem;
  /* z-index: 1; */
  font-size: 1.5rem;
  outline: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: var(--ntxtcolor) solid 3px;
}

#searchPlace #queryBtn {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0.5rem;
  bottom: 0;
  width: 2rem;
  height: 2rem;
  background-color: var(--lightcolor);
  border: var(--ntxtcolor) solid 2px;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>