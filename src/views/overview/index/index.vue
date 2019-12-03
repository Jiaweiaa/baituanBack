<template>
	<div class="labberConcessionsBox">
	</div>
</template>

<script>
  import SockJS from  'sockjs-client';
  import  Stomp from 'stompjs';
  export default {
    data(){
      return {
        stompClient:'',
        timer:'',
      }
    },
    methods:{
      initWebSocket() {
        this.connection();
        let that= this;
        // 断开重连机制,尝试发送消息,捕获异常发生时重连
        this.timer = setInterval(() => {
          try {
            that.stompClient.send("test");
          } catch (err) {
            console.log("断线了: " + err);
            that.connection();
          }
        }, 5000);
      },
      connection() {
        // 建立连接对象
        let socket = new SockJS('http://192.168.31.164:8003/trade/myUrl/ws?token=1234');
        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(socket);
        // 定义客户端的认证信息,按需求配置
        let headers = {
          Authorization:''
        }
        // 向服务器发起websocket连接
        this.stompClient.connect(headers,() => {
          this.stompClient.subscribe('/topic/public', (msg) => { // 订阅服务端提供的某个topic
            console.log('广播成功')
            console.log(msg);  // msg.body存放的是服务端发送给我们的信息
          },headers);
          this.stompClient.send("/app/chat.addUser",
            headers,
            JSON.stringify({sender: '',chatType: 'JOIN'}),
          )   //用户加入接口
        }, (err) => {
          // 连接发生错误时的处理函数
          console.log('失败')
          console.log(err);
        });

        this.stompClient.onopen = function(data) {
          // connectCount = 1;   // 重置重连次数
          // this.checkHeartBeat();  // 心跳检测
          console.log(data, 'open')
        }

        this.stompClient.onmessage = function(data) {
          // var data = JSON.parse(e.data);
          // handleMessage(data);
          console.log(data, 'message')
        };

        this.stompClient.onerror = function(data) {
          // var data = JSON.parse(e.data);
          // handleMessage(data);
          console.log(data, 'onerror')
        };


        this.stompClient.onclose = function(data) {
          console.log(data,'close')
          // 已经关闭的情况，不重连
          // if (isClose) {
          //   return;
          // }
					//
          // // 小于重连次数
          // if (connectCount < CONNECT_COUNT) {
          //   setTimeout(function() {
          //     new_conn();
          //   }, (Math.random() * 3 + 1 )* 1000);
          // } else {
          //   isClose = true;
          // }
        };
      },    //连接 后台
      disconnect() {
        if (this.stompClient) {
          this.stompClient.disconnect();
        }
      },  // 断开连接
    },
    mounted(){
      this.initWebSocket();
    },
    beforeDestroy: function () {
      // 页面离开时断开连接,清除定时器
      this.disconnect();
      clearInterval(this.timer);
    }
  }
</script>
