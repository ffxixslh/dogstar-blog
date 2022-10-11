<template>
  <div id="formContainer">
    <el-container>
      <el-header>
        <h1 class="toptitle">注册</h1>
      </el-header>
      <el-main class="logupContainer">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm" @submit.prevent>
          <el-form-item class="labelSpan" label="用户名" prop="username">
            <input class="inputBtn" v-model="ruleForm.username" />
          </el-form-item>
          <el-form-item class="labelSpan" label="密码" prop="password">
            <input class="inputBtn" type="password" v-model="ruleForm.password" />
          </el-form-item>
          <button class="submitBtn" type="primary" @click="submitForm('ruleForm')">
            创建
          </button>
          <button class="submitBtn" @click="resetForm('ruleForm')">重置</button>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: "Logup",
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this;
          this.$axios({
            method: "POST",
            url: "/user/register",
            data: this.ruleForm,
          })
            .then((res) => {
              if (res.data.code === 200) {
                console.log(res.data);

                this.$message({
                  message: "注册成功",
                  type: "success",
                });
                _this.$router.push("/login");
              }
            })
            .catch((err) => {
              let that = _this;
              ElMessageBox.confirm('用户已存在,是否登录？', '注册', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              })
                .then((action) => {
                  ElMessage({
                    type: 'info',
                    message: `跳转中...`,
                  })
                  setTimeout(() => {
                    that.$router.push("/login");
                  }, 1000);
                })
                .catch(() => {
                  ElMessage({
                    type: 'info',
                    message: `取消操作`,
                  })
                  that.$router.push("/");
                })
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style >
#formContainer {
  font-family: Helvetica;
  background-color: #fffdf4;
  box-shadow:
    0 0 4rem #fff7f78d inset,
    0 0 3rem #ffffff8d;
  ;
}

el-container {
  width: 100%;
  height: auto;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-header,
.el-footer {
  background-color: var(--ntxtcolor) transparent;
  color: var(--borderline);
  text-align: center;
}

.logupContainer {
  width: 30rem;
  margin: 1rem auto;
  background-color: #fff;
  border: 0.1rem solid var(--borderline);
  border-radius: 0.5rem;
  text-align: center;
}

.ruleForm {
  /* max-width: 500px; */
  margin: 0 auto;
  padding: 1rem;
}

.labelSpan {
  margin-bottom: 2rem;
}

.labelSpan>.el-form-item__label {
  color: var(--ntitlecolor) !important;
  font-weight: bold;
  font-size: 1.5rem;
  margin: auto;
}

.labelSpan>.el-form-item__error {
  margin-top: 0.2rem;
  font-size: 1.2rem;
}

.inputBtn {
  width: 18rem;
  height: 2rem;
  border: 2px solid var(--borderline);
  border-radius: 0.5rem;
  padding: 0.1rem 0.5rem;
  font-family: Helvetica;
  font-size: 1.3rem;
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
</style>
