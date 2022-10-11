<template>
  <div>
    <h1>消息</h1>
    <div class="chatPlace">
      <div class="chatList">
        <div style="width: 100%; height: fit-content; overflow: hidden">
          <h3 style="
              margin: 0.2rem 0;
              padding-bottom: 0.2rem;
              line-height: normal;
              text-align: center;
              color: #0a0a0a;
              border-bottom: 0.1rem solid #0a0a0a;
            ">
            👥互相关注
          </h3>
        </div>
        <ul class="userList">
          <li v-for="(user, index) in this.names" :key="index" @click="showChat(user.other_id, user.name, index)"
            :class="{ activity: curIdx == index }">
            <button type="button" style="width: 100%; height: 100%; border: none; color: #0a0a0a">
              {{ user.name }}
            </button>
          </li>
        </ul>
      </div>
      <div class="chatContainer">
        <div class="chat-top">
          <span>{{ this.toUserName }}</span>
        </div>
        <div class="msgContainer">
          <ul class="msgPlace">
            <li :class="{ ownMsg: item.isOwn }" v-for="(item, index) in this.chatMsgs" :key="index">
              <span>{{ item.msg }}</span>
            </li>
          </ul>
        </div>
        <div class="chat-bottom">
          <button type="button" @click="sendData">发送</button>
          <textarea type="text" v-model.lazy="sendMsg" placeholder="请输入消息"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      // host: "43.138.201.202:8080/chat",
      token: localStorage.getItem("token"),
      userId: this.$store.getters.getUser.id,
      curIdx: -1,
      toUserName: "",
      toName: "",
      sendMsg: "",
      names: [],
      socketServe: null,
      chatMsgs: [],
    };
  },
  methods: {
    getUsers() {
      this.$axios({
        method: "get",
        url: `/circle/friends/${this.userId}`,
        headers: {
          token: this.token,
        },
      })
        .then((res) => {
          let users = res.data.data;
          this.names = users;
        })
        .catch((err) => {
          console.log(err);
        });

      this.chatMsgs = this.$store.getters.getChatMsgs;
    },
    showChat(id, name, index) {
      this.curIdx = index;
      this.toName = id;
      this.toUserName = name;
      this.chatMsgs = [];

      let temp = this.$store.getters.getChatData;
      temp.forEach((item) => {
        if (item.to == this.toName)
          this.chatMsgs.push(item);
        else if (item.from == this.toName) {
          this.chatMsgs.push(item);
        }
      });
      console.log("temp", temp);
    },
    sendData() {
      if (this.toName == "") {
        this.$message({
          message: "请选择聊天对象",
          type: "warning",
        });
      } else if (this.sendMsg == "") {
        this.$message({
          message: "请输入消息",
          type: "warning",
        });
      } else {
        let sendData = {
          toName: this.toName,
          message: this.sendMsg,
        };

        // 从sessionStorage中获取发给对方的信息
        let chatData = sessionStorage.getItem(this.toName);
        if (chatData != null) {
          this.sendMsg = chatData + ";" + this.sendMsg;
        }

        // 存入发送的信息

        this.$socket.send(sendData);
        this.showChat(this.toName, this.toUserName);
        this.sendMsg = "";
      }
    },
    upgrateView(ret) {
      // console.log("客户端接收到的数据:", ret);
      if (ret.fromName == this.toName) {
        this.showChat(ret.fromName, this.toUserName);
      }
    },
  },
  watch: {
    sendMsg(val) {
      this.sendMsg = val;      
    },
  },
  created() {    
    this.$socket.connect(this.userId);
    this.$store.commit("SET_CHATSTATE", true);
    // 注册接收到数据的回调函数
    this.$socket.registerCallBack(this.upgrateView);
  },
  mounted() {
    setTimeout(() => {
      this.getUsers();
    }, 100);
  },
  beforeUnmount() {
    // 销毁某一个回调函数
    this.$socket.registerCallBack();
    this.$socket.close();
    this.$store.commit("REMOVE_CHATSTATE", false);
  },
};
</script>

<style lang="scss" scoped>
.activity {
  border-radius: 0.5rem;
  background: #c8c8c8 !important;
}

.ownMsg {
  text-align: right;

  span {
    background-color: #03e940 !important;
  }
}

.chatPlace {
  width: auto;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: start;
  border: var(--borderline) solid 0.1rem;
  border-radius: 0.5rem;
  background-color: #fff;
  padding: 1rem;

  .chatList {
    min-width: 15rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border: var(--borderline) solid 0.1rem;
    border-radius: 0.5rem;
    background-color: #efefef;
    margin-right: 0.5rem;

    .userList {
      width: 100%;
      height: 100%;
      transition: all 0.1s;

      li {
        text-align: center;
        font-size: 2rem;
        margin: 0.5rem;
        border-radius: 0.5rem;
        transition: all 0.1s;

        &:hover {
          background-color: #e0e0e0;
          border-radius: .5rem;
          color: #fff;
        }
      }
    }
  }

  .chatContainer {
    position: relative;
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border: var(--borderline) solid 0.1rem;
    border-radius: 0.5rem;
    background-color: #efefef;
    overflow: hidden;
    margin-left: 0.5rem;

    .chat-top {
      width: 100%;
      // height: 20%;
      height: 4.5rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      border-bottom: 0.1rem solid gray;

      span {
        margin: 0.5rem 1rem;
        font-size: 3rem;
        font-weight: bold;
      }
    }

    .msgContainer {
      width: 100%;
      height: 65%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      background-color: #fff;
      flex-grow: 1;

      .msgPlace {
        width: 100%;
        max-height: 72%;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 0.5rem;
        }

        &::-webkit-scrollbar-thumb {
          width: 0.5rem;
          background-color: var(--lightcolor);
          border-radius: 0.5rem;
        }

        li {
          margin: 0.5rem 0;
          padding: 0.5rem;

          span {
            background-color: #cccccc;
            color: #fff;
            padding: 0.5rem;
            // border: var(--lightcolor) solid .1rem;
            border-radius: 0.5rem;
          }
        }
      }
    }

    .chat-bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 25%;
      border-top: 1px solid gray;
      background-color: #f6f8fa;

      button {
        width: 4rem;
        height: 2rem;
        font-size: 1.2rem;
        font-weight: bold;
        border: none;
        border-radius: 0.5rem;
        background-color: #03e940;
        color: #fff;
      }

      textarea {
        bottom: 0;
        outline: none;
        resize: none;
        box-sizing: border-box;
        width: 100%;
        height: 10rem;
        margin: 0;
        padding: 0.5rem;
        background-color: transparent;
        border: none;
        border-radius: 0.5rem;
      }
    }
  }
}
</style>
