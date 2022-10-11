<template>
  <div>
    <h1>标签</h1>
    <div id="tagContainer">
      <ul class="tags">
        <li v-for="(tag, index) in tags" :key="tag.id">
          <router-link class="tag" :to="{ name: 'TagDetail', params: { tagId: tag.id, tagName: tag.name } }">
            {{ tag.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import axiosInstance from "../../utils/axios";
import TagsItem from "../../components/blog/blog-tags.vue";

const token = localStorage.getItem('token');

let tags = reactive<any>([])
getAllTags()

console.log("tags", tags)

async function getAllTags() {
  let res = await axiosInstance({
    method: "get",
    url: "/types",
    headers: {
      token: token,
    }
  })

  tags.push(...res.data.data)
}


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