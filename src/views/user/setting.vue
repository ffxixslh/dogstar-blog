<template>
  <div>
    <h1>设置</h1>
    <div class="setting">
      <form class="profile">
        <h2>修改个人信息</h2>
        <dl class="setting-item">
          <dt>
            <label for="nickname">昵称</label>
          </dt>
          <dd>
            <input autocomplete="off" id="nickname" type="text" placeholder="" v-model="form.nickname" />
          </dd>
        </dl>
        <dl class="setting-item">
          <dt>
            <label for="password">密码</label>
          </dt>
          <dd>
            <input autocomplete="off" id="password" type="password" placeholder="" v-model="form.password" />
          </dd>
        </dl>
        <dl class="setting-item">
          <dt>
            <label for="email">邮箱</label>
          </dt>
          <dd>
            <input autocomplete="off" id="email" type="email" placeholder="" v-model="form.email" />
          </dd>
        </dl>
        <dl class="setting-item">
          <dt>
            <label for="biography">个人简介</label>
          </dt>
          <dd>
            <textarea name="bio" id="biography" cols="30" rows="3" maxlength="30" placeholder=""
              v-model="form.biography"></textarea>
          </dd>
        </dl>
        <dl class="setting-item">
          <button type="button" style="
              width: 5rem;
              height: 2.2rem;
              font-size: 1.2rem;
              color: #fff;
              border: #2da44e;
              border-radius: 0.5rem;
              background-color: #2da44e;
            " @click="updateProfile">
            📤提交
          </button>
        </dl>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        password: "",
        nickname: "",
        email: "",
        biography: "",
      },
    };
  },
  methods: {
    updateProfile() {
      console.log(this.form);
      this.$axios({
        method: "put",
        url: "/user/updateUser",
        headers: {
          token: this.token,
        },
        data: this.form,
      })
        .then((res) => {
          console.log(res.data);
          if (this.form.nickname != '') {
            this.$store.state.userInfo.nickname = this.form.nickname;
          }
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.$router.push("/self");
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "修改失败",
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.setting {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: start;
}

.profile {
  width: auto;
  height: auto;
  margin: 0.5rem 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border: var(--borderline) solid 0.1rem;
  border-radius: 0.5rem;
  background-color: #fff;
}

.setting-item {
  width: auto;
  height: fit-content;
  margin: 0.5rem;

  dt {
    height: auto;
    width: 100%;
    margin: 0.2rem 0;

    label {
      font-size: 1.2rem;
    }
  }

  dd {
    height: auto;
    width: 100%;

    input {
      height: 2rem;
      width: 20rem;
      border: 1px solid var(--lightcolor);
      border-radius: 0.5rem;
      padding: 0 0.5rem;
      background-color: #f6f8fa;
      transition: 0.1s;
    }

    textarea {
      height: 2.5rem;
      width: 20rem;
      border: 1px solid var(--lightcolor);
      border-radius: 0.5rem;
      padding: 0.5rem;
      resize: none;
      background-color: #f6f8fa;
      transition: 0.1s;
    }

    input:focus,
    textarea:focus {
      transition: 0.1s;
      outline: none;
      background-color: #fff;
      border: 1px solid #0969da;
      box-shadow: 0 0 0.1rem #0969da inset;
    }
  }
}
</style>
