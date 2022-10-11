<template>
  <div style="padding-bottom: 4rem">
    <h1>个人主页</h1>
    <div class="userInfoPlace">
      <div id="infoMask">
        <img :src="getImageUrl('illu')" alt="" />
      </div>
      <div class="userAvtarPlace">
        <el-avatar :src="user.avatar" :size="288" />
        <div v-if="isOwnCenter">
          <button type="button" class="avaMask" @click="updateAvatar">
            <span>修改头像</span>
          </button>
          <modal-component ref="dialog" v-show="show" :imgUrl="user.avatar" />
        </div>
      </div>
      <div class="userInfo-r">
        <p class="userNamePlace">{{ user.name }}</p>
        <input type="text" class="userSignaturePlace" maxlength="30" :placeholder="user.biography"
          v-model="form.biography" @keyup.enter.native="changeBio" />
      </div>
    </div>
    <div id="btmPlace" style="display: flex; justify-content: flex-start">
      <div class="btm-l">
        <div class="articlePlace">
          <h2>文章({{ this.user.articles }})</h2>
          <div class="blogsPlace">
            <div v-if="this.blogs.length == 0" style="
                width: 100%;
                height: 100%;
                display: flex;
                  justify-content: center;
                  align-items: center;
              ">
              <h1 style="text-align: center">🍃这里空空如也</h1>
            </div>
            <div class="blog-list" v-else>
              <div v-for="(blog, index) in blogs" :key="blog.id">
                <blog-content-item :id="blog.id" :title="blog.title" :description="blog.description"
                  :createTime="blogCreateTimes[index]" :transTags="blogTags[index]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btm-r">
        <div class="sourcePlace">
          <h2>资源({{ this.getFiles.length }})</h2>
          <div class="filePlace">
            <div v-if="this.getFiles.length == 0" style="
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              ">
              <h1 style="text-align: center">🍃这里空空如也</h1>
            </div>
            <div v-else class="sfileList">
              <div class="sfile" v-for="file in getFiles" :key="file.file_id">
                <div id="fakeImg">
                  <span id="fakeView">{{ getFileType(file.name) }}</span>
                </div>
                <h3 style="
                    width: 15rem;
                    height: 1.5rem;
                    line-height: 1.5rem;
                    margin: 0.5rem;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  ">
                  {{ getFileName(file.name) }}
                </h3>
                <div style="width: 100%; display: flex; justify-content: center">
                  <button type="button" @click="downloadFile(file.file_id, file.name)" style="margin: 0.5rem">
                    <span style="
                        padding: 0.2rem;
                        border: 2px solid #fff;
                        border-radius: 0.5rem;
                        background-color: salmon;
                        color: #fff;
                      ">下载</span>
                  </button>
                  <button type="button" @click="deleteOwnResource(file.file_id)" style="margin: 0.5rem"
                    v-if="isOwnCenter">
                    <span style="
                        padding: 0.2rem;
                        border: 2px solid #fff;
                        border-radius: 0.5rem;
                        background-color: red;
                        color: #fff;
                      ">删除</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ModalComponent from "../../components/user/modal-component.vue";
import UserInfoCard from "../../components/user/user-info-card.vue";
import BlogContentItem from "../../components/blog/blog-content-item.vue";
import moment from "moment";
import { ElMessage } from "element-plus";

export default {
  name: "Selfcenter",
  data() {
    return {
      token: localStorage.getItem("token"),
      blogs: [],
      blogCreateTimes: [],
      blogTags: [],
      user: {
        id: 0,
        avatar: "",
        name: "",
        biography: "",
        articles: 0,
        classes: 0,
      },
      form: {
        password: "",
        nickname: "",
        email: "",
        biography: "",
      },
      fileList: [],
      title: "弹窗标题",
      show: false,
      getFiles: [], // 获取到的文件列表
    };
  },
  inject: ["reload"],
  components: {
    UserInfoCard,
    BlogContentItem,
    ModalComponent,
  },
  methods: {
    getUserInfo() {
      console.log("params", this.$route.params)
      if (this.$route.params.toUserId != undefined) {
        this.user.id = this.$route.params.toUserId
      } else {
        this.user.id = this.$store.getters.getUser.id
      }

      this.$axios({
        method: "GET",
        url: `/user/getUser/${this.user.id}`,
      }).then((res) => {
        const { avatar, nickname, biography } = res.data.data;
        this.user.avatar = this.$axios.defaults.baseURL + avatar;
        this.user.name = nickname;
        this.user.biography = biography;
      });
    },
    getOwnBlogs() {
      const _this = this;
      this.$axios({
        method: "GET",
        url: `/blogs/user/${this.user.id}`,
      })
        .then((res) => {
          const atcnum = res.data.data.length;
          this.user.articles = atcnum;
          this.blogs = res.data.data;
          this.blogs.forEach((blog) => {
            //  1.获取当前文章的创建时间，并将时间格式化
            let createTime = moment(blog.create_time).format("lll");
            //  2.获取当前文章的标签，并用map()将标签放入一个数组
            let getTags = [];
            blog.forms.map((tag) => {
              getTags.push(tag);
            });
            // 3.将创建时间和标签数组分别加入到对应数组
            _this.$data.blogCreateTimes.push(createTime);
            _this.$data.blogTags.push(getTags);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    queryOwnResources() {
      this.$axios({
        method: "GET",
        url: `/files/getFileById/${this.user.id}`,
      })
        .then((res) => {
          this.getFiles = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downloadFile(fileId, fileName) {
      console.log("download");
      this.$axios({
        method: "GET",
        url: "/files/download",
        headers: {
          token: this.token,
        },
        params: {
          file_id: fileId,
        },
        responseType: "blob",
      })
        .then((res) => {
          console.log("downloading");
          console.log(res.data);
          let blob = new Blob([res.data], {
            type: "application/x-msdownload",
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = fileName.substring(fileName.lastIndexOf("-") + 1, fileName.length);
          a.click();
          // 释放这个临时的对象url
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => {
          console.log("downloadErr:", err);
        });
    },
    deleteOwnResource(fileid) {
      let fileId = fileid;
      this.$axios({
        method: "delete",
        url: `/files/deleteFile/${fileid}`,
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          ElMessage.success("删除成功");
          this.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFileName(fileId) {
      let fileName = fileId;
      return fileName.substring(fileId.lastIndexOf("-") + 1, fileId.length);
    },
    // 获取文件类型
    getFileType(ftitle) {
      let fileTitle = ftitle;
      return fileTitle.substring(fileTitle.lastIndexOf("."), fileTitle.length);
    },
    updateAvatar() {
      this.show = true;
      this.$refs.dialog.openUpload();
    },
    changeBio() {
      console.log(this.user.biography);
      this.$axios({
        method: "PUT",
        url: "/user/updateUser",
        headers: {
          token: this.token,
        },
        data: this.form,
      })
        .then((res) => {
          console.log(res.data);
          ElMessage.success("修改成功");
          console.log(this.$store.getters.getUser);
          this.$store.state.userInfo.biography = this.form.biography;
          console.log("1", this.$store.getters.getUser);
          // window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("修改失败");
        });
    },
    getImageUrl(name) {
      return new URL(`../../assets/imgs/${name}.jpeg`, import.meta.url).href
    }
  },
  computed: {
    isOwnCenter() {
      if (this.$route.params.toUserId) {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this.getUserInfo();
    this.getOwnBlogs();
    this.queryOwnResources();
  },
};
</script>

<style lang="scss" scoped>
.btm-l {
  width: 52.5%;

  .articlePlace {
    margin: 1rem 0.5rem 0 0;

    .blogsPlace {
      display: flex;
      flex-direction: row;
      background-color: #fff;
      border: var(--borderline) solid 0.1rem;
      border-radius: 0.5rem;

      .blog-list {
        width: 100%;
        height: auto;
        min-height: 25rem;
      }
    }
  }
}


.userInfoPlace {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  width: auto;
  height: fit-content;
  min-height: 30rem;
  background-color: #fff;
  border: var(--borderline) solid 0.1rem;
  border-radius: 0.5rem;
  /* padding: 2rem; */

  #infoMask {
    z-index: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    overflow: hidden;

    & img {
      border-radius: 0.4rem;
      z-index: -1;
      width: 100%;
      height: 100%;
      object-fit: cover;
      -webkit-user-drag: none;
    }
  }


  .userAvtarPlace {
    position: relative;
    /* z-index: 1; */
    display: inline-block;
    width: 18rem;
    height: 18rem;
    border-radius: 50%;
    border: 0.1rem solid var(--lightcolor);
    background-color: #fff;
    margin: 1rem 2rem;
    /* float: left; */

    .avaMask {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      color: #fff;
      width: 18rem;
      height: 18rem;
      line-height: 18rem;
      font-size: 2rem;
      text-align: center;
      transition: all 0.2s;
      overflow: hidden;

      &>span {
        display: none;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.2s;

      }

      &:hover>span {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 2rem;
      }
    }
  }

  .userInfo-r {
    width: 100%;
    z-index: 1;
    /* user-select: none; */
    margin: 2rem 0;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .userNamePlace {
      width: auto;
      height: auto;
      margin: 6rem 1rem 1rem 0.5rem;
      font-size: 5rem;
      font-weight: bold;
      -webkit-text-stroke: var(--borderline) 2px;
      color: #fff;
    }

    .userSignaturePlace {
      width: 90%;
      height: 2.5rem;
      margin: 1rem 1rem;
      padding: 0 0.5rem;
      line-height: 2.5rem;
      font-size: 2rem;
      background-color: transparent;
      -webkit-text-stroke: var(--borderline) 1px;
      color: #fff;
      caret-color: #666;
      outline: none;
      border: none;
      transition: all 0.2s;
      flex-grow: 1;

      &::-webkit-input-placeholder {
        color: #fff;
      }

      &:hover,
      &:focus {
        border-radius: 0.5rem;
        transition: all 0.2s;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.35);
      }

      &:focus {
        box-shadow: 0 0 0.2rem #000000 inset;
        background-color: rgba(248, 248, 248, 0.9);
      }
    }
  }
}

.btm-r {
  width: max-content;
  flex-grow: 1;

  .sourcePlace {
    width: auto;
    height: auto;
    margin: 1rem 0 0 0.5rem;
    flex-grow: 1;

    .filePlace {
      height: auto;
      background-color: #fff;
      padding: 1rem;
      border: 0.1rem solid var(--borderline);
      border-radius: 0.5rem;
    }

    .sfileList {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      grid-gap: 0.5rem;
      justify-items: center;


      .sfile {
        width: 16rem;
        height: 16rem;
        /* background-color: #fffdf4; */
        margin: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        border: 0.1rem solid var(--lightcolor);
        border-radius: 5px;

        #fakeImg {
          width: 8rem;
          height: 8rem;
          border: var(--borderline) 0.1rem solid;
          border-radius: 5px;
          margin: 0 auto;
          background-color: #eee;
          display: flex;
          justify-content: center;
          align-items: center;

          #fakeView {
            font-family: Helvetica;
            font-size: 2.5rem;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
