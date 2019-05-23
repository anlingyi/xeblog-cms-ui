<template>
  <d2-container>
    <el-form ref="article" :rules="rules" :model="article" label-width="80px">
      <el-collapse accordion>
        <el-collapse-item name="1">
          <template slot="title">
            文章基础信息 <i class="fa fa-edit"></i>
          </template>
          <div style="float:left;">
            <el-form-item label="文章标题" prop="title" class="label-bold input-width-500">
              <el-input v-model="article.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="文章作者" prop="author" class="label-bold input-width-500">
              <el-input v-model="article.author" placeholder="请输入文章作者"></el-input>
            </el-form-item>
            <el-form-item label="文章类目" prop="categoryId" class="label-bold input-width-500">
              <el-select v-model="article.categoryId" placeholder="请选择文章类目">
                <el-option v-for="item in categoryList" :value="item.id" :label="item.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="文章标签" class="label-bold input-width-500">
              <el-input v-model="article.tag" placeholder="标签"/>
            </el-form-item>
            <el-form-item label="文章封面" class="label-bold input-width-500">
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
            <el-form-item label="置顶" class="label-bold input-width-500">
              <el-switch
                      v-model="article.isTop"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="1"
                      :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="私有" class="label-bold input-width-500">
              <el-switch
                      v-model="article.isPrivate"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="1"
                      :inactive-value="0">
              </el-switch>
            </el-form-item>
          </div>
          <div style="float: right;">
            <label style="font-weight: bold;display: block;font-size: 14px;color: #606266;">文章简述</label>
            <el-input type="textarea" v-model="article.brief" style="width: 550px;" rows="9" placeholder="简述..."/>
          </div>
        </el-collapse-item>
        <div v-if="showMde">
          <el-form-item prop="content" style="margin-left: -80px;margin-top: 15px;">
            <d2-mde v-model="article.content" class="mde"/>
          </el-form-item>
        </div>
      </el-collapse>
    </el-form>
    <section style="margin-top: 10px; display: flex; flex-direction: row-reverse;">
      <el-button type="primary" icon="el-icon-edit-outline" @click="editArticle">提交修改</el-button>
    </section>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    export default {
        name: 'articles-edit',
        data() {
            return {
                showMde: false,
                article: {
                    id: 0,
                    cover: null,
                    isTop: 0,
                    isPrivate: 0,
                    brief: null,
                    title: null,
                    categoryName: null,
                    tag: null,
                    author: null,
                    categoryId: null,
                    content: null
                },
                imageUrl: '',
                categoryList: [],
                rules: {
                    title: [
                        {required: true, message: '请输入文章标题', trigger: 'blur'},
                        {min: 1, max: 45, message: '长度在 1 到 45 个字符', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请输入文章作者', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    categoryId: [
                        {required: true, message: '请选择分类', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '请输入文章内容', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            // 获取文章详情
            getArticleDetails(){
                api.ArticleDetails({
                    id: this.article.id
                }).then((response) => {
                    let data = response.data.data
                    this.article = data
                    this.showMde = true
                    if(data.cover != null && data.cover != ''){
                        this.imageUrl = data.cover;
                    }
                })
            },
            // 文章类目列表
            getCategoryList(){
              api.CategorySelect().then((response) => {
                  let data = response.data.data
                  this.categoryList = data;
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

                api.UploadImage(formData).then((response) => {
                    let data = response.data.data;
                    if(data.file != null && data.file != '' && data.file != undefined){
                        this.article.cover = data.file
                        this.imageUrl = data.file
                    }
                })
            },
            editArticle(){
                this.$refs.article.validate((valid) => {
                    if (valid) {
                        api.EditArticle(this.article).then((response) => {
                            let data = response.data;
                            if(data.code === 200){
                                this.$message.success('修改成功！')
                                this.getArticleDetails()
                            }
                        })
                    }
                })
            }
        },
        mounted: function(){
            this.article.id = this.$route.query.id
            this.getArticleDetails()
            this.getCategoryList()
        }
    }
</script>

<style>
  .mde {
    margin-bottom: -16px;
  }
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