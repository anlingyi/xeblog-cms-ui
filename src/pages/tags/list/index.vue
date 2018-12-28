<template>
  <d2-container>
    <el-table :data="tagList" style="width: 100%" max-height="560">
      <el-table-column fixed prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="标签"></el-table-column>
      <el-table-column prop="articleTotal" label="文章数"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="260">>
        <template slot-scope="scope">
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteTagConfirm(scope.row)">删除</el-button>
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
                tagList: [],
                total: 0,
                currentPage: 1,
                pagesSize: 30
            }
        },
        methods: {
            getTagList () {
                api.TagList({
                    pageIndex: this.currentPage,
                    pageSize: this.pagesSize
                }).then((response) => {
                    let data = response.data.data
                    this.tagList = data.list
                    this.total = data.total
                    this.currentPage = data.pageIndex
                })
            },
            // 每页显示数据量变更
            handleSizeChange: function (val) {
                this.pagesSize = val
                this.getTagList(this.currentPage, this.pagesize)
            },
            // 页码变更
            handleCurrentChange: function (val) {
                this.currentPage = val
                this.getCategoryList(this.currentPage, this.pagesize)
            },
            // 删除标签确认
            deleteTagConfirm (val) {
                this.$confirm('确认删除【'+ val.name +'】？', '确认操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteTag(val.id)
                    })
                    .catch(() => {
                        this.$message('取消删除')
                    })
            },
            // 删除标签
            deleteTag(id){
                api.DeleteTag({
                    id: id
                }).then((res => {
                    let data = res.data
                    if(data.code === 200){
                        this.$message.success('删除成功')
                        this.getTagList(this.currentPage, this.pagesize)
                    }
                }))
            }
        },
        mounted() {
            this.getTagList(this.currentPage, this.pagesize)
        }
    }
</script>
<style>
  .page-center{
    width: 480px;
    margin: 10px auto;
  }
</style>
