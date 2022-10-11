<template>
  <TopNav class="viewNav" />
  <router-view class="viewPage" v-if="isRouteAlive" :key="$route.fullPath"></router-view>
</template>

<script>
  import TopNav from './components/public/topnav.vue'

  export default {
    name: 'App',
    components: {
      TopNav
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouteAlive: true,
      }
    },
    methods: {
      reload() {
        this.isRouteAlive = false
        this.$nextTick(function() {
          this.isRouteAlive = true
        })
      }
    },
  }

</script>
<style>
.viewNav {
  position: sticky;
}

.viewPage {
  height: 100%;
  margin: 1rem 4rem;
}
</style>