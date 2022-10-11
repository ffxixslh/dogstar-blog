<template>
  <div id="loginFormContainer">
    <el-container class="formPlace">
      <el-header class="formHeader">
        <h1 class="toptitle">登录</h1>
      </el-header>
      <el-main class="formMain">
        <el-form
          class="loginForm"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          @submit.prevent
        >
          <el-form-item class="labelSpan" label="用户名" prop="username">
            <input class="inputBtn" v-model="ruleForm.username" />
          </el-form-item>
          <el-form-item class="labelSpan" label="密码" prop="password">
            <input
              class="inputBtn"
              type="password"
              v-model="ruleForm.password"
            />
          </el-form-item>
          <button
            class="submitBtn"
            type="primary"
            @click="submitForm('ruleForm')"
          >
            登录
          </button>
          <button class="submitBtn" @click="resetForm('ruleForm')">重置</button>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Login",
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
          this.$axios
            .post("/user/login", this.ruleForm)
            .then((res) => {
              const jwt = res.data.data.token;
              const userInfo = res.data.data;
              const timer = parseInt(res.data.data.valid) + Date.now();

              const BASE_URL = this.$axios.defaults.baseURL;
              userInfo.avatar = BASE_URL + userInfo.avatar
              
              // 把数据共享出去
              _this.$store.commit("SET_TOKEN", jwt);
              _this.$store.commit("SET_USERINFO", userInfo);
              _this.$store.commit("SET_REFRESH", timer);

              this.$message({
                message: "登录成功",
                type: "success",
              });
              _this.$router.push({
                name: 'Home',
                params: {
                  userInfo: JSON.stringify(userInfo)
                }
              });
            })
            .catch((err) => {
              console.error(err);
              this.$message({
                message: "登录失败，请检查输入是否正确",
                type: "error",
              });
            });
        } else {
          this.$message({
            message: "登录失败，请检查输入",
            type: "error",
          });
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

<style>
#loginFormContainer {
  font-family: Helvetica;
}

.formPlace {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.formHeader{
  background-color: var(--ntxtcolor) transparent;
  color: var(--borderline);
  text-align: center;
}

.formMain {
  width: 30rem;
  margin: 1rem auto;
  background-color: #fff;
  border: 0.1rem solid var(--borderline);
  border-radius: 0.5rem;
  text-align: center;
}

.loginForm {
  /* max-width: 500px; */
  margin: 0 auto;
  padding: 1rem;
}

.labelSpan {
  margin-bottom: 2rem;
}

.labelSpan .el-form-item__label {
  color: var(--ntitlecolor) !important;
  font-weight: bold;
  font-size: 1.5rem;
  margin: auto;
}

.labelSpan .el-form-item__error {
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
