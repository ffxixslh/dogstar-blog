<template>
  <div id="editContainer">
    <router-link to>
      <button id="backBtn" type="button" @click.prevent="back">
        🛴返回
      </button>
    </router-link>
    <button id="topBtn" type="button" @click="toTop" v-show="showBtn">
      🚀
    </button>
    <h1 style="text-align: center">编辑</h1>
    <el-container class="contentPlace">
      <el-main class="mainPlace">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top"
          class="ruleForm">
          <el-form-item class="labelPlace" label="标题" prop="title">
            <input class="inputPlace" v-model="ruleForm.title" />
          </el-form-item>
          <el-form-item class="labelPlace" label="简述" prop="description">
            <textarea rows="2" minlength="5" maxlength="100" class="inputPlace descplace"
              v-model="ruleForm.description"></textarea>
          </el-form-item>

          <el-form-item class="labelPlace" label="内容" prop="content">
            <md-editor v-model="ruleForm.content" :theme="theme" :onUploadImg="onUploadImg" />
          </el-form-item>

          <el-form-item class="labelPlace" label="标签" prop="tags">
            <div class="stag" v-for="(tag, index) in types" :key="tag.id">
              <input type="checkbox" :id="tag.id" :name="tag.name" :value="tag.id" v-model="selectTags"
                @click="isSelected" />
              <label :for="tag.id">{{ tag.name }}</label>
            </div>
          </el-form-item>
          <!-- <p>{{ selectTags }}</p> -->

          <el-form-item>
            <button class="submitBtn" type="button" @click="submitForm('ruleForm')">
              发布
            </button>
            <button class="submitBtn" type="button" @click="resetForm('ruleForm')">
              清空
            </button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";

export default {
  name: "BlogEdit",
  components: {
    MdEditor,
  },
  data() {
    return {
      token: localStorage.getItem('token'),
      theme: "github",
      value: "",
      ruleForm: {
        id: "",
        title: "",
        description: "",
        content: "",
        forms: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            min: 3,
            max: 25,
            message: "长度在 3 到 25 个字符",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入描述",
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符",
            trigger: "blur",
          },
        ],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      types: [],
      selectTags: [],
      showBtn: false,
      isSaved: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isSaved = true;
          const _this = this;
          const blogId = _this.$route.params.blogId;

          // 将选择好的标签传递给forms
          this.setForms();

          this.$axios({
            method: "POST",
            url: "/blogs/edit",
            headers: {
              token: this.token,
            },
            data: _this.ruleForm,
          })
            .then((res) => {
              const resData = res.data;
              const resCode = resData.code;
              console.log(resData);

              /*  返回的 res 有两种情况：带 id 和不带 id
                    1.返回{id: 'xx'}，即修改成功
                    2.返回不含 id 的数据，即新增成功
              */

              if (!Boolean(resData.hasOwnProperty("data"))) {
                const jumpId = blogId;
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.$router.push({
                  path: `/blogs/${jumpId}`,
                });
              } else {
                const returnId = resData.data.id;
                this.$message({
                  message: "发布成功",
                  type: "success",
                });
                this.$router.push({
                  path: `/blogs/${returnId}`,
                });
              }
            })
            .catch((err) => {
              console.log("BlogEditErr:\n" + err);
            });
        } else {
          this.$message({
            message: "修改失败",
            type: "error",
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获得这篇文章内容
    getTargetBlog() {
      const blogId = this.$route.params.blogId;
      const _this = this;
      console.log("TargetBlogID:" + blogId);
      if (blogId) {
        this.$axios({
          method: "GET",
          url: `/blogs/getBlogById/${blogId}`,
          headers: {
            token: this.token,
          },
          data: {
            data: blogId,
          },
        }).then((res) => {
          const blog = res.data.data;
          let { id, title, description, content } = blog;
          _this.ruleForm.id = id;
          _this.ruleForm.title = title;
          _this.ruleForm.description = description;
          _this.ruleForm.content = content;
        });
      }
    },
    // 获得标签
    getTags() {
      const _this = this;
      this.$axios({
        method: "GET",
        url: `/types`,
        headers: {
          token: this.token,
        },
      }).then((res) => {
        const tags = res.data.data;
        _this.types = tags;
      });
    },
    setForms() {
      const _this = this;
      let newForms = [];
      this.selectTags.map((tag) => {
        newForms.push({ type_id: tag });
      });
      _this.$data.ruleForm.forms = newForms;
    },
    async onUploadImg(files, callback) {
      const response = await Promise.all(
        files.map((file) => {
          return new Promise((rev, rej) => {
            const form = new FormData();
            form.append("file", file);

            this.$axios({
              method: "POST",
              url: "/Img/imgs",
              data: form,
            })
              .then((res) => rev(res))
              .catch((error) => rej(error));
          });
        })
      );

      callback(response.map((item) => item.data.data));
    },
    handleScroll() {
      let that = this;
      let scrollTop =
        window.screenY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (scrollTop > 500) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    },
    toTop() {
      var timer = setInterval(function () {
        let osTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let ispeed = Math.floor(-osTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + ispeed;
        this.isTop = true;
        if (osTop === 0) {
          clearInterval(timer);
        }
      }, 30);
    },
    back() {
      this.$router.go(-1);
    },
  },
  computed: {},
  mounted() {
    this.getTargetBlog();
    this.getTags();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  // beforeRouteLeave(to, from, next) {
  //   // 导航离开该组件的对应路由时调用
  //   console.log("BlogEditLeave");
  //   if (this.isSaved) {
  //     next();
  //   } else {
  //     this.$confirm("确定离开吗？", "提示", {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //     })
  //       .then(() => {
  //         next();
  //       })
  //       .catch(() => {
  //         this.$message({
  //           message: "已取消",
  //           type: "info",
  //         });
  //         next(false);
  //       });
  //   }
  // },
};
</script>

<style lang="scss" >
* {
  margin: 0;
  padding: 0;
}

#backBtn,
#topBtn {
  font-size: 1.5rem;
  padding: 0.2rem;
  border-radius: 0.5rem;
}

#backBtn {
  position: absolute;
  top: 1rem;
  left: 0rem;
  background-color: wheat;
  transition: all 0.3s;
}

#editContainer {
  position: relative;
  width: auto;
  height: auto;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.contentPlace {
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mainPlace {
  background-color: #fff;
  max-width: 1000px;
  height: 100%;
  border: 0.2rem solid var(--borderline);
  border-radius: 0.5rem;
}

.ruleForm {
  width: auto;
  height: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.labelPlace {
  width: 100%;
  height: auto;
  margin: 1rem;
}

.labelPlace .el-form-item__label {
  color: var(--ntitlecolor);
  font-weight: bold;
  font-size: 1.5rem;
  margin: auto;
}

.labelPlace .el-form-item__error {
  margin-top: 0.2rem;
  font-size: 1.2rem;
}

.inputPlace {
  width: 100%;
  height: auto;
  border: 2px solid var(--borderline);
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-family: Helvetica;
  font-size: 1.3rem;
}

.descplace {
  height: 4rem;
}

.submitBtn {
  width: 4rem;
  height: 2rem;
  background-color: var(--lightcolor);
  color: var(--ntitlecolor);
  border: 2px solid var(--borderline);
  border-radius: 0.5rem;
  padding: 0.1rem 0.5rem;
  margin: 0.5rem;
  cursor: pointer;
  font-weight: bold;
}

.md {
  border: 2px solid var(--borderline);
  border-radius: 0.5rem;
  text-align: start !important;
  flex-grow: 0;
}

.contentLabel {
  text-align: left;
  color: var(--ntitlecolor) !important;
  font-weight: bold;
  font-size: 1.5rem;
  margin: auto;
}

textarea {
  padding: 1rem 0.5rem;
  resize: none;
}

.stag label {
  display: inline-block;
  margin: 0 0.25rem;
  padding: 0rem 0.75rem;
  background-color: var(--lightcolor);
  /* color: var(--ntxtcolor); */
  border-radius: 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: 0.1s ease-in-out;
}

input[type="checkbox"] {
  visibility: hidden;
  display: none;
}

input[type="checkbox"]:checked+label {
  background-color: var(--ntxtcolor);
  color: var(--lightcolor);
  transition: 0.1s ease-in-out;
}
</style>
