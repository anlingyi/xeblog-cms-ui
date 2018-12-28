<template>
  <d2-container>
    <section style="margin-bottom: 10px; display: flex; flex-direction: row-reverse;">
      <el-button type="primary" icon="el-icon-plus" @click="addCategoryBox">添加</el-button>
    </section>
    <el-table :data="categoryList" style="width: 100%" max-height="560">
      <el-table-column fixed prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="类目名称"></el-table-column>
      <el-table-column prop="articleTotal" label="文章数"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="260">>
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="editCategoryBox(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteCategoryConfirm(scope.row)">删除</el-button>
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
                categoryList: [],
                total: 0,
                currentPage: 1,
                pagesSize: 30
            }
        },
        methods: {
            getCategoryList () {
                api.CategoryList({
                    pageIndex: this.currentPage,
                    pageSize: this.pagesSize
                }).then((response) => {
                    let data = response.data.data
                    this.categoryList = data.list
                    this.total = data.total
                    this.currentPage = data.pageIndex
                })
            },
            // 每页显示数据量变更
            handleSizeChange: function (val) {
                this.pagesSize = val
                this.getCategoryList(this.currentPage, this.pagesize)
            },
            // 页码变更
            handleCurrentChange: function (val) {
                this.currentPage = val
                this.getCategoryList(this.currentPage, this.pagesize)
            },
            // 删除类目确认
            deleteCategoryConfirm (val) {
                this.$confirm('确认删除【'+ val.name +'】？', '确认操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteCategory(val.id)
                    })
                    .catch(() => {
                        this.$message('取消删除')
                    })
            },
            // 删除类目
            deleteCategory(id){
                api.DeleteCategory({
                    id: id
                }).then((res => {
                    let data = res.data
                    if(data.code === 200){
                        this.$message.success('删除成功')
                        this.getCategoryList(this.currentPage, this.pagesize)
                    }
                }))
            },
            // 修改分类名称弹框
            editCategoryBox(val){
                this.$prompt('', '修改分类', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: val.name,
                    inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
                    inputErrorMessage: '分类名称不合法'
                }).then(({ value }) => {
                    api.EditCategory({
                        id: val.id,
                        name: value
                    }).then((res) => {
                        let data = res.data
                        if(data.code === 200){
                            this.$message.success('修改成功')
                            this.getCategoryList(this.currentPage, this.pagesize)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                });
            },
            // 添加分类弹框
            addCategoryBox(){
                this.$prompt('', '添加分类', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
                    inputErrorMessage: '分类名称不合法'
                }).then(({ value }) => {
                    api.AddCategory({
                        name: value
                    }).then((res) => {
                        let data = res.data
                        if(data.code === 200){
                            this.$message.success('添加成功')
                            this.getCategoryList(this.currentPage, this.pagesize)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消添加'
                    });
                });
            }
        },
        mounted() {
            this.getCategoryList(this.currentPage, this.pagesize)
        }
    }
</script>
<style>
  .page-center{
    width: 480px;
    margin: 10px auto;
  }
</style>
