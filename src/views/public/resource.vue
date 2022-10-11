<template>
  <div style="padding-bottom: 4rem;">
    <h1>资源中心</h1>
    <div class="queryAll">
      <h2>所有文件({{ getFiles.length }})</h2>
      <div class="sfileList">
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
          <span style="color: var(--borderline); font-size: .9rem; margin: .5rem 1rem ;">上传者：{{ file.author }}</span>
          <button type="button" @click="downloadFile(file.file_id, file.name)" style="margin: 0.5rem">
            <span style="
                padding: 0.2rem;
                border: 2px solid #fff;
                border-radius: 0.5rem;
                background-color: salmon;
                color: #fff;
                text-align: center;
              ">下载</span>
          </button>
        </div>
      </div>
    </div>
    <div class="uploadPlace">
      <h2>上传</h2>
      <div class="uploadArea"
        style="width: 100%; height: auto; border: .1rem solid var(--borderline); border-radius: .5rem; background-color: #fff; padding: .5rem;">
        <el-upload drag :limit="limitNum" :auto-upload="false" :action="UploadUrl()" :before-upload="beforeUploadFile"
          :on-change="fileChange" :on-exceed="exceedFile" :on-success="handleSuccess" :on-error="handleError"
          :file-list="fileList">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" style="margin: .5rem; font-size: 1rem;">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip" style="color: orange">
              仅限单文件上传，大小不能超过100M
            </div>
          </template>
        </el-upload>
        <el-button size="default" type="primary" @click="uploadFile">立即上传</el-button>
        <el-button size="default">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      limitNum: 1, // 上传文件时，同时允许上传的最大数
      fileList: [], // 文件列表
      getFiles: [], // 获取到的文件列表
    };
  },
  props: {
    fileid: Number,
  },
  inject: ["reload"],
  methods: {
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(
        `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length
        } 个`
      );
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      console.log(file.raw);
      this.fileList.push(file.raw);
      console.log(this.fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log("before upload");
      console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;

      if (size > 100) {
        this.$message.warning("文件大小不得超过100M");
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error("文件上传失败");
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return "";
    },
    uploadFile() {
      if (this.fileList.length === 0) {
        this.$message.warning("请上传文件");
      } else {
        let form = new FormData();
        form.append("file", this.fileList[0].raw);
        console.log("form:", form);
        this.$axios({
          method: "post",
          url: "/files/upload",
          headers: {
            token: this.token,
          },
          data: form,
        })
          .then((res) => {
            console.log(res);
            this.handleSuccess();
            this.reload();
          })
          .catch((err) => {
            console.log("submit err:", err);
            if (err.code == 400 && err.msg == "文件重复") {
              ElMessageBox.confirm("文件已存在，是否覆盖？",
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                })
                .then(() => {
                  console.log("overwrite");
                  this.overwriteFile();
                  ElMessage.success("文件覆盖成功");
                })
                .catch(() => {
                  console.log("cancel");
                  this.notOverWriteFile()
                  ElMessage.info("取消上传");
                });
            } else {
              this.handleError();
            }
          });
      }
    },
    overwriteFile() {
      let form = new FormData();
      form.append("file", this.fileList[0].raw);
      console.log("form:", form);
      console.log("111", this.fileList);
      this.$axios({
        method: "PUT",
        url: "/files/OverWrite",
        headers: {
          token: this.token,
        },
        data: form,
      })
        .then((res) => {
          console.log(res);
          this.reload();
        })
        .catch((err) => {
          console.log("overwrite err:", err);
          // this.handleError();
        });
    },
    notOverWriteFile() {
      this.$axios({
        method: "PUT",
        url: "/files/NotOverWrite",
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("not err:", err);
        });
    },
    //查询所有文件
    queryAllFile() {
      this.$axios({
        method: "GET",
        url: "/files/getAllFile",
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          this.getFiles = res.data.data;
        })
        .catch((err) => {
          console.log("queryErr:", err);
        });
    },
    // 下载文件
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
          console.log(res);
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
    // 获取文件名称
    getFileName(fileId) {
      return fileId.substring(fileId.lastIndexOf("-") + 1, fileId.length);
    },
    // 获取文件类型
    getFileType(ftitle) {
      return ftitle.substring(ftitle.lastIndexOf("."), ftitle.length);
    },
  },
  computed: {},
  mounted() {
    this.queryAllFile();
  },
};
</script>

<style lang="scss" scoped>
.uploadPlace,
.queryAll {
  margin: 1rem 0;
}

.uploadPlace {
  width: 100%;
  height: auto;
}

.el-upload {
  width: 100%
}

.el-upload-dragger {
  height: 20rem;
  margin: 1rem;
}

.sfileList {
  width: 100%;
  height: 100%;
  padding: .5rem;
  background-color: #fff;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  grid-gap: .5rem;
  justify-items: center;
  border: .1rem solid var(--borderline);
  border-radius: .5rem;
}

.sfile {
  width: 16rem;
  height: 16rem;
  margin: .5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border: 0.1rem solid var(--lightcolor);
  border-radius: 5px;
}

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
}

#fakeView {
  font-family: Helvetica;
  font-size: 2.5rem;
  font-weight: bold;
}
</style>
