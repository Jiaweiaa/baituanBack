<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container"></div>
    <el-upload
      style="display:none;"
      ref="upload"
      :action="imgSrcBasic + '/opc/auth/uploadFile'"
      :beforeUpload="beforeUpload"
      :show-file-list="false"
      :on-success="handleChange"
      list-type="picture"
    >
      <el-button id="upload" ref="uploadBtn" size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import editorImage from "./components/editorImage";
import "../../../static/tinymce4.7.5/langs/zh_CN";

const plugins = [
  `advlist anchor autolink autosave code codesample colorpicker colorpicker
  contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime
  legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace
  spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount`
];
const toolbar = [
  `bold italic underline strikethrough alignleft aligncenter image
  alignright outdent indent  blockquote undo redo removeformat`,
  `hr bullist numlist link mybutton charmap	 preview anchor pagebreak
    fullscreen insertdatetime media table forecolor backcolor fontsizeselect fontselect`
];
export default {
  name: "tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      default: "file edit insert view format table"
    },
    height: {
      type: Number,
      required: false,
      default: 360
    },
    width: {
      required: false,
      default: 720
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || "vue-tinymce-" + +new Date(),
      myValue: "",
      // 图片源
      imgSrcBasic: ""
    };
  },
  watch: {
    value(val) {
      console.log(val);
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val)
        );
      }
    }
  },
  mounted() {
    this.imgSrcBasic = process.env.BASE_API;
    this.initTinymce();
    this.myValue = this.value;
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  methods: {
    // 上传限制
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message({
          showClose: true,
          message: "只能上传jpeg,gif,png,bmp,pdf等类型的图片文件",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          showClose: true,
          message: "图片大小不超过2M",
          type: "warning"
        });
      }
      if ((isJPG || isBMP || isGIF || isPNG) && isLt2M) {
        this.typeBok = true;
      } else {
        this.typeBok = false;
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },
    // 上传成功提示
    handleChange(response, file) {
      if (response.code == 200) {
        this.$notify({
          title: response.message,
          type: "success"
        });
        window.tinymce
          .get(this.tinymceId)
          .insertContent(
            `<img class="wscnph" src="https://static.ibaituan.cn/${
              response.result
            }" >`
          );
      }
    },
    clear() {
      this.myValue = "";
      console.log(this.myValue);
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        width: this.width,
        height: this.height,
        language: "zh_CN",
        body_class: "panel-body ",
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
        setup: editor => {
          // 定义按钮，
          editor.addButton("mybutton", {
            // 按钮，名
            text: "",
            // 是否显示图标
            image: "https://dwz.cn/kk7dPhpk",
            tooltip: "插入图片",
            //onclick事件
            onclick: () => {
              // console.log(this.$refs.uploadBtn.handleClick());
              // this.$refs.upload.submit()
              document.querySelector("#upload").click();
              // 这里点击后会插入一句话
              //   window.tinymce
              //     .get(this.tinymceId)
              //     .insertContent(`<img class="wscnph" src="https://dwz.cn/kk7dPhpk" >`);
            }
          });
        },

        menubar: false,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        }
      });
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      arr.forEach(v => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    }
  },
  destroyed() {
    this.destroyTinymce();
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
}

.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 10px;
  top: 2px;
  /*z-index: 2005;*/
}

.editor-upload-btn {
  display: inline-block;
}
</style>
