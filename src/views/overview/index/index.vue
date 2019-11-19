<template>
	<div class="labberConcessionsBox">
	</div>
</template>

<script>
  export default {
    name: 'overview',
    data() {
      return {
	      // websocket
        websocket: '',
        // websocket 心跳
        Interval: null,
        heartCheck :{
          reset: function(){
            clearInterval(this.Interval);
          },
          start: function(socket){
            clearInterval(this.Interval);
            this.Interval = setInterval(function() {
              console.log(socket)
              if (socket) {
                socket.send(JSON.stringify({"action":"heartbeat"})) // TODO 断线重连.
              }
            }, 5000);
          }
    },
      }
    },
	  created() {
      this.websorketDemo();
	  },
    methods: {
      websorketDemo() {
        //服务器地址
        var wsServer = 'ws://192.168.31.185:8003/trade/socketServer';
        //创建WebSocket对象
	      this.websocket = new WebSocket(wsServer);
        /*
          查看websocket当前状态
          CONNECTING：值为0，表示正在连接；
					OPEN：值为1，表示连接成功，可以通信了；
					CLOSING：值为2，表示连接正在关闭；
					CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
        */
        console.log(this.websocket.readyState, this.websocket);

        this.websocket.onopen = () => {
          this.heartCheck.start(this.websocket);
        }
        this.websocket.onclose = function (evt) {
					//已经关闭连接
          console.log(evt, '已经关闭连接')
        };
        this.websocket.onmessage = function (evt) {
					//收到服务器消息，使用evt.data提取
          console.log(evt.data, '收到服务器消息')
        };
        this.websocket.onerror = function (evt) {
					//产生异常
          this.heartCheck.start(this.websocket);
        };
      }
    }
  }
</script>

<style lang="sass">
	.labberConcessionsBox
		overflow: hidden
		margin: 20px 20px 0
</style>
