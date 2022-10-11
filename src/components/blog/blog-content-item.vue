<template>
  <div class="blog-content-item">
    <div id="blog-info">
      <router-link :to="{ name: 'BlogDetail', params: { blogId: id }, props: true }">
        <p class="blog-item--title">{{ title }}</p>
      </router-link>
    </div>
    <div id="blog-detail">
      <!-- 显示博客组件用户名 -->
      <!-- <div class="blog-item--author" type="button">
        <span style="margin-top: .5rem;">By{{ nickname }}</span>
        <router-link :to="{ name: 'UserBlogs', params: { userId: userId, userNickname: nickname } }">
          {{ nickname }}
        </router-link>
      </div> -->
      <p class="blog-item--desc">{{ description }}</p>
    </div>
    <div class="blog-addinfo">
      <TagsItem :finalTags="this.blogTags" />
      <time class="blog-item--date">{{ createTime }}</time>
    </div>
  </div>
</template>

<script>
import TagsItem from "../blog/blog-tags.vue";

export default {
  name: "BlogContentItem",
  data() {
    return {
      blogs: [],
      blogTags: this.transTags,
      blog: {
        id: this.id,
        title: this.title,
        description: this.description,
        createTime: this.createTime,
        user_id: this.userId,
        nickname: this.nickname,
      }
    };
  },
  props: {
    userId: Number,
    nickname: String,
    id: Number,
    title: String,
    description: String,
    createTime: String,
    transTags: Object,
  },
  methods: {
  },
  components: {
    TagsItem,
  },
};
</script>

<style lang="scss" scoped>
.blog-content-item {
  width: auto;
  height: auto;
  margin: 0 2rem 0.5rem;
  padding: 1.5rem 0.5rem 1rem;
  background-color: #fff;
  /* border-bottom: var(--lightcolor) 1px solid !important; */
  margin-bottom: 1.5rem;
  text-align: center;
}

.blog-item--title {
  max-width: fit-content;
  text-align: start;
  color: var(--ntitlecolor);
  font-size: 3rem;
}

.blog-item--author {
  color: var(--ntitlecolor);
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: .5rem;
}

.blog-item--desc {
  width: auto;
  min-height: 1.2rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  text-align: start;
  text-indent: .5rem;
  flex-grow: 1;
}

.blog-item--date {
  text-align: start;
  padding: 0.5rem 0 0 0.2rem;
}

#blog-detail {
  display: flex;
  flex-direction: row;
  margin: 0.5rem 0;
}

.imgContainer {
  width: 400px;
  height: 220px;
  border: var(--ntxtcolor) solid 2px;
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0 2px var(--ntxtcolor);
  margin: 0.5rem 1rem;
  overflow: hidden;
  flex-shrink: 0;
}

img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.blog-item--tags {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 1rem;
}

.blog-tag {
  padding: 0 0.5rem;
  color: var(--borderline);
}

.blog-addinfo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin-bottom: 0.5rem;
}
</style>
