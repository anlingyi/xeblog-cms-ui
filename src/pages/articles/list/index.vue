<template>
  <d2-container>
    <el-table :data="articlesList" style="width: 100%" max-height="560">
      <el-table-column fixed prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="文章标题"></el-table-column>
      <el-table-column prop="categoryName" label="分类"></el-table-column>
      <el-table-column prop="pageviews" label="浏览量"></el-table-column>
      <el-table-column prop="isTop" label="置顶">
        <template slot-scope="scope">
          <el-switch
                  v-model="scope.row.isTop === 1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isPrivate" label="私有">
        <template slot-scope="scope">
          <el-switch
                  v-model="scope.row.isPrivate === 1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="260">>
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-view" @click="viewArticle(scope.row.id)">查看</el-button>
          <el-button size="small" type="primary" icon="el-icon-edit" @click="">编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteArticleConfirm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[30, 50, 70, 100]"
            :page-size="pagesSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
            background>
    </el-pagination>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    export default {
        data() {
            return {
                articlesList: [],
                total: 0,
                currentPage: 1,
                pagesSize: 30
            }
        },
        methods: {
            getArticlesList () {
                api.ArticlesList({
                    pageIndex: this.currentPage,
                    pageSize: this.pagesSize
                }).then((response) => {
                    let data = response.data.data
                    this.articlesList = data.list
                    this.total = data.total
                    this.currentPage = data.pageIndex
                })
            },
            // 每页显示数据量变更
            handleSizeChange: function (val) {
                this.pagesSize = val
                this.getArticlesList(this.currentPage, this.pagesize)
            },
            // 页码变更
            handleCurrentChange: function (val) {
                this.currentPage = val
                this.getArticlesList(this.currentPage, this.pagesize)
            },
            // 查看文章
            viewArticle (id) {
                window.location.href = this.$blog_url + 'archives/preview.html?id=' + id
            },
            // 删除文章
            deleteArticleConfirm (val) {
                this.$confirm('确认删除【'+ val.title +'】？', '确认操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteArticle(val.id)
                        this.$message.success('删除成功')
                        this.getArticlesList(this.currentPage, this.pagesize)
                    })
                    .catch(() => {
                        this.$message('取消删除')
                    })
            },
            deleteArticle(id){
                api.DeleteArticle({
                    id: id
                })
            }
        },
        mounted() {
            this.getArticlesList(this.currentPage, this.pagesize)
        }
    }
</script>
<style>
  .page-center{
    width: 480px;
    margin: 10px auto;
  }
</style>
