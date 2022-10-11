<template>
  <div style="padding-bottom: 4rem;">
    <h1>
      与
      <span style="margin: 0 0.2rem; text-decoration: underline">
        {{ tagName }}
      </span>
      标签相关的文章
    </h1>
    <div class="blogsContiner">
      <blog-content-item class="blogView" v-for="(blog, index) in blogs" :key="blog.id" :userId="blog.user_id"
        :nickname="blog.nickname" :id="blog.id" :title="blog.title" :description="blog.description"
        :createTime="formatTime(blog.create_time)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import BlogContentItem from "../../components/blog/blog-content-item.vue";
import axiosInstance from "../../utils/axios";

let route = useRoute()
let tagName = route.params.tagName
let tagId = route.params.tagId

let blogs = reactive<any>([])
getTagBlogs()

async function getTagBlogs() {
  let res = await axiosInstance({
    method: "get",
    url: `/blogs/getBlogByType/${tagId}`,
  })
  blogs.push(...res.data.data)
}

let formatTime = (time: string) => {
  return moment(time).format("lll")
}


console.log("blogs", blogs)

onMounted(() => {
  console.log("params", route.params)
})

</script>

<style lang="scss" scoped>
.blogsContiner {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  border: .1rem solid var(--borderline);
  border-radius: .5rem;
  background: #fff;

  .blogView {
    width: auto;
  }
}
</style>
