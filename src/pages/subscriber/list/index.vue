<template>
    <d2-container>
        <el-table :data="subscriberList" style="width: 100%" max-height="560">
            <el-table-column fixed prop="id" label="ID"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="status" label="订阅状态">
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.status === 0 ? 'info' : scope.row.status === 1 ? 'success' : 'danger'"
                            close-transition>{{scope.row.status === 0 ? '未验证' : scope.row.status === 1 ? '已订阅' : '未订阅'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="subscribeTime" label="订阅时间"></el-table-column>
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
                subscriberList: [],
                total: 0,
                currentPage: 1,
                pagesSize: 30
            }
        },
        methods: {
            getSubscriberList() {
                api.SubscriberList({
                    pageIndex: this.currentPage,
                    pageSize: this.pagesSize
                }).then((response) => {
                    let data = response.data.data
                    this.subscriberList = data.list
                    this.total = data.total
                    this.currentPage = data.pageIndex
                })
            },
            // 每页显示数据量变更
            handleSizeChange: function (val) {
                this.pagesSize = val
                this.getSubscriberList(this.currentPage, this.pagesize)
            },
            // 页码变更
            handleCurrentChange: function (val) {
                this.currentPage = val
                this.getSubscriberList(this.currentPage, this.pagesize)
            }
        },
        mounted() {
            this.getSubscriberList(this.currentPage, this.pagesize)
        }
    }
</script>
<style>
    .page-center {
        width: 480px;
        margin: 10px auto;
    }
</style>
