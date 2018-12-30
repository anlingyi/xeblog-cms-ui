<template>
  <d2-container>
    <section style="margin-bottom: 10px; display: flex; flex-direction: row-reverse;">
      <el-button type="primary" icon="el-icon-edit-outline" @click="editWebsiteInfo">提交修改</el-button>
    </section>
    <el-form ref="websiteInfo" :rules="rules" :model="websiteInfo" label-width="120px">
      <el-form-item label="网站标题" prop="title" class="label-bold input-width-500">
        <el-input v-model="websiteInfo.title" placeholder="请输入网站标题"></el-input>
      </el-form-item>
      <el-form-item label="网站副标题" prop="subtitle" class="label-bold input-width-500">
        <el-input v-model="websiteInfo.subtitle" placeholder="请输入网站副标题"></el-input>
      </el-form-item>
      <el-form-item label="网站版权信息" prop="copyright" class="label-bold input-width-500">
        <el-input type="textarea" style="width: 500px;" rows="7" v-model="websiteInfo.copyright" placeholder="请输入网站版权信息"></el-input>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    export default {
        name: 'website-info-edit',
        data() {
            return {
                websiteInfo: {
                    id: 0,
                    title: '',
                    subtitle: '',
                    copyright: '',
                    createTime: '',
                    updateTime: ''
                },
                rules: {
                    title: [
                        {required: true, message: '请输入网站标题', trigger: 'blur'},
                    ],
                    subtitle: [
                        {required: true, message: '请输入网站副标题', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            // 获取网站信息
            getWebsiteInfo(){
                api.GetWebsiteInfo().then((response) => {
                    this.websiteInfo = response.data.data
                })
            },
            // 修改网站信息
            editWebsiteInfo(){
                this.$refs.websiteInfo.validate((valid) => {
                    if (valid) {
                        api.EditWebsiteInfo(this.websiteInfo).then((response) => {
                            let data = response.data;
                            if(data.code === 200){
                                this.$message.success('修改成功！')
                                this.getWebsiteInfo()
                            }
                        })
                    }
                })
            }
        },
        mounted: function(){
            this.getWebsiteInfo()
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