<template>
  <d2-container>
    <section style="margin-bottom: 10px; display: flex; flex-direction: row-reverse;">
      <el-button type="primary" icon="el-icon-plus" @click="showDialogs">添加</el-button>
    </section>
    <el-table :data="menuList" style="width: 100%" max-height="560">
      <el-table-column fixed prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="菜单名称"></el-table-column>
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope">
          <i class="fa" :class="'fa-'+ scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="orderId" label="排序"></el-table-column>
      <el-table-column prop="url" label="跳转地址"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="260">>
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="showDialogs(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteMenuConfirm(scope.row)">删除</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :before-close="hideDialogs">
      <el-form :model="menu" label-width="80px" :rules="menuRules" ref="menu">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <d2-icon-select v-model="menu.icon"/>
          <el-input type="hidden" v-model="menu.icon" style="display: none;"/>
        </el-form-item>
        <el-form-item label="跳转地址" prop="url">
          <el-input v-model="menu.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderId">
          <el-input v-model="menu.orderId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialogs">取 消</el-button>
        <el-button type="primary" @click="execute">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
    import * as api from '@/api'
    export default {
        data() {
            return {
                menuList: [],
                total: 0,
                currentPage: 1,
                menu: {
                    id: 0,
                    name: '',
                    url: '',
                    orderId: 0,
                    icon: ''
                },
                pagesSize: 30,
                showDialog: false,
                dialogTitle: '',
                menuRules: {
                    name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    icon: [
                        {required: true, message: '请选择菜单图标', trigger: 'change'}
                    ],
                    url: [
                        {required: true, message: '请输入跳转地址', trigger: 'blur'},
                    ],
                    orderId: [
                        {type: 'number', required: false, message: '请输入数字', trigger: 'blur', transform(val){
                            return _.toNumber(val)}}
                    ]
                }
            }
        },
        methods: {
            getMenuList () {
                api.MenuList({
                    pageIndex: this.currentPage,
                    pageSize: this.pagesSize
                }).then((response) => {
                    let data = response.data.data
                    this.menuList = data.list
                    this.total = data.total
                    this.currentPage = data.pageIndex
                })
            },
            // 每页显示数据量变更
            handleSizeChange: function (val) {
                this.pagesSize = val
                this.getMenuList(this.currentPage, this.pagesize)
            },
            // 页码变更
            handleCurrentChange: function (val) {
                this.currentPage = val
                this.getMenuList(this.currentPage, this.pagesize)
            },
            // 删除菜单确认
            deleteMenuConfirm (val) {
                this.$confirm('确认删除【'+ val.name +'】？', '确认操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.deleteMenu(val.id)
                    })
                    .catch(() => {
                        this.$message('取消删除')
                    })
            },
            // 删除菜单
            deleteMenu(id){
                api.DeleteMenu({
                    id: id
                }).then((res => {
                    let data = res.data
                    if(data.code === 200){
                        this.$message.success('删除成功')
                        this.getMenuList(this.currentPage, this.pagesize)
                    }
                }))
            },
            // 修改菜单
            editMenu(){
                api.EditMenu(this.menu).then((res) => {
                    let data = res.data
                    if(data.code === 200){
                        this.$message.success('修改成功')
                        this.getMenuList(this.currentPage, this.pagesize)
                    }
                })
            },
            // 添加菜单
            addMenu(){
                api.AddMenu(this.menu).then((res) => {
                    let data = res.data
                    if(data.code === 200){
                        this.$message.success('添加成功')
                        this.getMenuList(this.currentPage, this.pagesize)
                    }
                })
            },
            // 隐藏对话框
            hideDialogs(){
                this.$nextTick(() => {
                    this.$refs['menu'].resetFields();
                });
                this.menu = {
                    id: 0,
                    name: '',
                    url: '',
                    orderId: 0,
                    icon: ''
                }
                this.showDialog = false
            },
            // 显示对话框
            showDialogs(val){
                if(val.id){
                    this.dialogTitle = '编辑菜单信息'
                    this.menu.id = val.id
                    this.menu.name = val.name
                    this.menu.icon = val.icon
                    this.menu.orderId = val.orderId
                    this.menu.url = val.url
                }else{
                    this.dialogTitle = '添加菜单信息'
                }

               this.showDialog = true
            },
            // 校验菜单规则
            checkMenu(){
                let flag
                this.$refs.menu.validate((valid) => {
                     flag = valid
                })
                return flag
            },
            execute(){
                if(!this.checkMenu()){
                    return
                }
                if(this.menu.id){
                    this.editMenu()
                }else{
                    this.addMenu()
                }
                this.hideDialogs()
            }
        },
        mounted() {
            this.getMenuList(this.currentPage, this.pagesize)
        }
    }
</script>
<style>
  .page-center{
    width: 480px;
    margin: 10px auto;
  }
</style>
