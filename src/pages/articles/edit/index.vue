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
                <el-select
                        v-model="tags"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        remote
                        reserve-keyword
                        placeholder="添加标签"
                        :remote-method="blurryQueryTags"
                        :loading="tagLoading">
                    <el-option
                            v-for="tag in queryTags"
                            :key="tag"
                            :label="tag"
                            :value="tag">
                    </el-option>
                </el-select>
                <!--                <el-autocomplete-->
                <!--                        :select-when-unmatched="true"-->
                <!--                        :fetch-suggestions="blurryQueryTags"-->
                <!--                        @select="addTag"-->
                <!--                        placeholder="添加标签">-->
                <!--                    <template slot-scope="{ item }">-->
                <!--                        <div>{{ item }}</div>-->
                <!--                    </template>-->
                <!--                </el-autocomplete>-->
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
                <el-input v-model="article.cover" placeholder="输入图片地址" @blur="updateImageUrl"></el-input>
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
            <xe-mde :content="article.content" @changeContent="val => {this.article.content = val}"/>
          </el-form-item>
        </div>
      </el-collapse>
    </el-form>
    <section style="margin-top: 10px; display: flex; flex-direction: row-reverse;">
        <el-button type="primary" icon="el-icon-edit-outline" @click="saveOrUpdateArticle">{{ this.article.id ? '提交修改' :
            '发布文章' }}
        </el-button>
    </section>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    import {mapState} from 'vuex'

    export default {
        name: 'articles-edit',
        computed: {
            ...mapState('d2admin/user', [
                'info'
            ])
        },
        data() {
            return {
                showMde: false,
                article: {
                    id: '',
                    cover: '',
                    isTop: 0,
                    isPrivate: 0,
                    brief: '',
                    title: '',
                    categoryName: '',
                    tag: '',
                    author: '',
                    categoryId: '',
                    content: ''
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
                },
                tags: [],
                queryTags: [],
                tagLoading: false
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
                    if (data.tag && data.tag != null) {
                        this.tags = data.tag.split(',')
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
            upload(param) {
              let watermarked = false
              this.$confirm('添加水印？', '确认操作', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'info'
              }).then(() => {
                watermarked = true
              }).finally(() => {
                let formData = new FormData()
                formData.append("files", param.file)
                formData.append("watermarked", watermarked);

                api.UploadImage(formData).then((response) => {
                    let data = response.data.data;
                  if (data && data.length > 0) {
                    this.article.cover = data[0]
                    this.imageUrl = data[0]
                    }
                })
                })
            },
            updateImageUrl() {
                this.imageUrl = this.article.cover
            },
            saveOrUpdateArticle() {
                this.$refs.article.validate((valid) => {
                    if (valid) {
                        this.article.tag = this.tags.join(',')

                        if (this.article.id) {
                            // 更新
                            api.EditArticle(this.article).then((response) => {
                                let data = response.data;
                                if (data.code === 200) {
                                    this.$message.success('修改成功！')
                                    this.getArticleDetails()
                                }
                            })
                        } else {
                            // 新增
                            api.AddArticle(this.article).then((response) => {
                                let data = response.data;
                                if (data.code === 200) {
                                    this.$message.success('发布成功！')
                                    this.$store.dispatch('d2admin/page/close', {
                                        tagName: 'articles-release'
                                    })
                                    this.$router.push({
                                        name: 'articles-list'
                                    })
                                }
                            })
                        }
                    }
                })
            },
            blurryQueryTags(str) {
                this.tagLoading = true
                api.BlurryQueryTags(str).then(resp => {
                    this.tagLoading = false
                    let data = resp.data;
                    if (data.code === 200) {
                        if (data.data) {
                            this.queryTags = data.data
                        }
                    }
                })
            }
        },
        mounted() {
            if (this.$route.query.id) {
                this.article.id = this.$route.query.id
                this.getArticleDetails()
            } else {
                this.article.author = this.info.name
                this.showMde = true
            }

            this.getCategoryList()

            document.onkeydown = (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    this.saveOrUpdateArticle()
                    e.preventDefault()
                    return false
                }
            }
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