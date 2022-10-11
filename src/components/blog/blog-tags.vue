<template>
  <div id="tagContainer">
    <ul class="tags">
      <li v-for="(tag, index) in this.tags" :key="tag.type">
        <router-link class="tag" :to="{ name: 'TagDetail', params: { tagId: tag.type.id, tagName: tag.type.name } }">
          {{ tag.type.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "TagsItem",
  data() {
    return {
      tags: this.finalTags,
    };
  },
  props: {
    finalTags: Array,
  },
  methods: {
  },
  mounted() {
  },
  watch: {
    finalTags(val) {
      this.tags = val;
    }
  }
};
</script>
<style lang="scss" scoped>
#tagContainer {
  width: auto;
  height: 1.5rem;
  display: flex;
  justify-content: flex-start;
}

.tags {
  display: flex;
  width: auto;
  padding: 0;
  list-style: none;
}

.tags .tag {
  color: var(--ntxtcolor);
  display: inline-block;
  margin: 0 0.25rem;
  padding: 0.5rem 0.75rem;
  background-color: #ddd;
  border-radius: 1rem;
  font-size: 0.75rem;
}
</style>
