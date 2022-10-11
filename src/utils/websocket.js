import store from "./store.js";
import axiosInstance from "./axios.js";
// const hostUrl = 'localhost:8080';
const hostUrl = '43.138.201.202:8080';

console.log("hostUrl", hostUrl);

export default class SocketService {
  // 单例
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务端连接的socket对象
  ws = null

  // 存储回调函数
  callBackMapping = {}

  // 标识是否连接成功
  connected = false

  // 记录重试的次数
  sendRetryCount = 0

  // 重新连接尝试的次数
  connectRetryCount = 0

  //  定义连接服务器的方法
  connect(id) {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket(`ws://${hostUrl}/chat/${id}`)

    // 连接成功的事件
    this.ws.onopen = () => {
      console.log('连接服务端成功了')
      this.connected = true
      // 重置重新连接的次数
      this.connectRetryCount = 0
    }
    // 1.连接服务端失败
    // 2.当连接成功之后, 服务器关闭的情况

    // ！！！因为重连导致信息重复接收

    // this.ws.onclose = () => {
    //   console.log('连接服务端失败')
    //   this.connected = false
    //   this.connectRetryCount++
    //   setTimeout(() => {
    //     this.connect()
    //   }, 500 * this.connectRetryCount)
    // }
    
    // 得到服务端发送过来的数据
    this.ws.onmessage = (res) => {
      // console.log('从服务端获取到了数据:', JSON.parse(res.data))
      const recvData = JSON.parse(res.data)
      if (recvData.system) {
        sessionStorage.setItem("users", recvData.message)
      } else {
        let str = recvData.message

        let chatData = sessionStorage.getItem(`from_${recvData.fromName}`)
        if (chatData != null) {
          str = chatData + ';' + str
        }

        let recvMsg = {
          from: recvData.fromName,
          msg: recvData.message,
          isOwn: false,
        }

        console.log("recv", recvMsg)
        // TODO 问题：存储信息触发两次，可能是服务器连接两次导致
        store.commit('SET_CHATDATA', recvMsg)
        sessionStorage.setItem(`from_${recvData.fromName}`, str);
      }

      if (this.callBackMapping) {
        const realData = recvData;
        this.callBackMapping.call(this, realData)
      }

    }
  }

  // 回调函数的注册
  registerCallBack(callBack) {
    this.callBackMapping = callBack
  }

  // 取消某一个回调函数
  unRegisterCallBack() {
    this.callBackMapping = null
  }

  // 发送数据的方法
  send(data) {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0

      let ownSendMsg = {
        to: data.toName,
        msg: data.message,
        isOwn: true,
      };

      // 存储自己发送的信息
      store.commit("SET_CHATDATA", ownSendMsg);
      sessionStorage.setItem(ownSendMsg.to, ownSendMsg.msg);

      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.ws.send(JSON.stringify(data))
      }, this.sendRetryCount * 500)
    }
  }

  // 关闭连接的方法
  close() {
    this.ws.close()
    console.log('关闭连接')
  }
}
