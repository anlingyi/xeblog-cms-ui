<template>
  <d2-container>
    <section style="margin-bottom: 10px; display: flex; flex-direction: row-reverse;">
      <el-button type="primary" icon="el-icon-edit-outline" @click="updateSitemapConfig">提交修改</el-button>
    </section>
    <el-form ref="sitemap" :rules="rules" :model="sitemap" label-width="120px">
      <el-form-item label="访问域名：" prop="domain" class="label-bold input-width-500">
        <el-input v-model="sitemap.domain" placeholder="请输入访问域名"></el-input>
      </el-form-item>
      <el-form-item label="文件输出路径：" prop="outPath" class="label-bold input-width-500">
        <el-input v-model="sitemap.outPath" placeholder="请输入文件输出路径"></el-input>
      </el-form-item>
      <el-form-item label="最近生成时间：" prop="lastUpdate" class="label-bold input-width-500">
        {{ sitemap.lastUpdate }}
        <el-button type="primary" plain @click="generateSitemap">生成站点地图</el-button>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    export default {
        name: 'sitemap-config-edit',
        data() {
            return {
                sitemap: {
                    id: 0,
                    domain: '',
                    outPath: '',
                    lastUpdate: ''
                },
                rules: {
                    domain: [
                        {required: true, message: '请输入访问域名', trigger: 'blur'},
                    ],
                    outPath: [
                        {required: true, message: '请输入文件输出路径', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            // 获取站点地图配置信息
            getSitemapConfig(){
                api.GetSitemapConfig().then((response) => {
                    let data = response.data.data;
                    if (data) {
                      this.sitemap = response.data.data
                    }
                })
            },
            // 修改站点地图配置信息
            updateSitemapConfig(){
                this.$refs.sitemap.validate((valid) => {
                    if (valid) {
                        api.UpdateSitemapConfig(this.sitemap).then((response) => {
                            let data = response.data;
                            if(data.code === 200){
                                this.$message.success('修改成功！')
                                this.getSitemapConfig()
                            }
                        })
                    }
                })
            },
            // 生成站点地图
            generateSitemap(){
              api.SitemapGenerate().then((response) => {
                let data = response.data;
                if (data.code === 200) {
                  this.$message.success('站点地图生成成功！')
                }
              })
            }
        },
        mounted: function(){
            this.getSitemapConfig()
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