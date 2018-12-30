<template>
  <d2-container>
    <section style="margin-bottom: 10px; display: flex; flex-direction: row-reverse;">
      <el-button type="primary" icon="el-icon-edit-outline" @click="editPassword">提交修改</el-button>
    </section>
    <el-form ref="user" :rules="rules" :model="user" label-width="120px">
      <el-form-item label="用户名" prop="username" class="label-bold input-width-500">
        <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="原密码" prop="oldPassword" class="label-bold input-width-500">
        <el-input type="password" v-model="user.oldPassword" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password" class="label-bold input-width-500">
        <el-input type="password" v-model="user.password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword" class="label-bold input-width-500">
        <el-input type="password" v-model="user.confirmPassword" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    import { mapState } from 'vuex'
    import Cookies from 'js-cookie'
    export default {
        name: 'website-password-edit',
        data() {
            var checkPassword = (rule, value, callback) => {
                    if (this.user.password !== value) {
                        callback(new Error('两次输入的密码不一致'))
                    }else{
                        callback()
                    }
                };
            return {
                user: {
                    id: 0,
                    username: '',
                    password: '',
                    oldPassword: '',
                    confirmPassword: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    oldPassword: [
                        {required: true, message: '请输入原密码', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    confirmPassword: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: checkPassword, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapState('d2admin/user', [
                'info'
            ])
        },
        methods: {
            // 获取网站信息
            getUser(){
                console.log('before', this.info)
                this.user.username = this.info.name
            },
            // 修改密码
            editPassword(){
                this.$refs.user.validate((valid) => {
                    if (valid) {
                        api.EditPassword(this.user).then((response) => {
                            let data = response.data;
                            if(data.code === 200){
                                this.$message.success('修改成功！')
                                Cookies.remove('token')
                                Cookies.remove('userId')
                                this.$router.push({name: '/login'})
                            }
                        })
                    }
                })
            }
        },
        mounted: function(){
            this.getUser()
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
</style>