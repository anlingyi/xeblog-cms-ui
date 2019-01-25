<template>
  <d2-container>
    <section style="margin-bottom: 10px; display: flex; flex-direction: row-reverse;">
      <el-button type="primary" icon="el-icon-edit-outline" @click="editUserInfo">提交修改</el-button>
    </section>
    <el-form ref="userInfo" :model="userInfo" label-width="120px">
      <el-form-item label="昵称" prop="name" class="label-bold input-width-500">
        <el-input v-model="userInfo.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="个性签名" prop="signature" class="label-bold input-width-500">
        <el-input v-model="userInfo.signature" placeholder="请输入个性签名"></el-input>
      </el-form-item>
      <el-form-item label="github" prop="githubUrl" class="label-bold input-width-500">
        <el-input v-model="userInfo.githubUrl" placeholder="请输入github地址"></el-input>
      </el-form-item>
      <el-form-item label="头像" class="label-bold input-width-500">
        <el-upload
                class="avatar-uploader"
                action="test"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :auto-upload="true"
                :http-request="upload">
          <img v-if="imageUrl != '' && imageUrl != null" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    export default {
        name: 'website-blogger-edit',
        data() {
            return {
                userInfo: {
                    id: 0,
                    name: '',
                    signature: '',
                    githubUrl: '',
                    avatar: '',
                    createTime: '',
                    updateTime: ''
                },
                imageUrl: ''
            }
        },
        methods: {
            // 获取用户信息
            getUserInfo(){
                api.GetUserInfo().then((response) => {
                    let data = response.data.data;
                    this.userInfo = data
                    if(data.avatar != null && data.avatar != ''){
                        this.imageUrl = data.avatar;
                    }
                })
            },
            // 修改用户信息
            editUserInfo(){
                api.EditUserInfo(this.userInfo).then((response) => {
                    let data = response.data;
                    if(data.code === 200){
                        this.$message.success('修改成功！')
                        this.getUserInfo()
                    }
                })
            },
            beforeUpload(file) {
                const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif'
                    || file.type === 'image/jpeg';
                const isLt20M = file.size / 1024 / 1024 < 20;

                if (!isJPG) {
                    this.$message.error('上传的图片格式不正确!');
                }
                if (!isLt20M) {
                    this.$message.error('上传的图片大小不能超过 20MB!');
                }

                return isJPG && isLt20M;
            },
            upload(param){
                let formData = new FormData()
                formData.append("file", param.file)

                api.Upload(formData).then((response) => {
                    let data = response.data.data;
                    if(data.file != null && data.file != '' && data.file != undefined){
                        this.userInfo.avatar = data.file
                        this.imageUrl = data.file
                    }
                })
            }
        },
        mounted: function(){
            this.getUserInfo()
        }
    }
</script>

<style>
  .label-bold label{
    font-weight: bold;
  }
  .input-width-500 input{
    width: 500px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>