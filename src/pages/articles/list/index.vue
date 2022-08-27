<template>
    <d2-container>
        <el-table :data="articlesList" style="width: 100%" max-height="560">
            <el-table-column fixed prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="title" label="文章标题" width="150"></el-table-column>
            <el-table-column prop="categoryName" label="分类"></el-table-column>
            <el-table-column prop="pageviews" label="浏览量" width="80"></el-table-column>
            <el-table-column prop="isTop" label="置顶" width="100">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isTop === 1"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changeTop(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="isPrivate" label="私有" width="100">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isPrivate === 1"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changePrivate(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="isRcmd" label="推荐" width="100">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isRcmd === 1"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changeRecommend(scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column fixed="right" prop="address" label="操作" width="350">>
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showPushDialogs(scope.row)"><i
                            class="fa fa-send-o"></i> 推送
                    </el-button>
                    <el-button size="small" type="primary" icon="el-icon-edit" @click="editArticle(scope.row.id)">编辑
                    </el-button>
                    <el-button size="small" type="danger" icon="el-icon-delete"
                               @click="deleteArticleConfirm(scope.row)">删除
                    </el-button>
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

        <el-dialog :title="dialogTitle" :visible.sync="showDialog" :before-close="hidePushDialogs" width="500px">
            <div style="text-align: center;font-size: 15px;width: 450px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #000;">
                《{{ articleTitle }}》
            </div>
            <div style="width: 300px;font-size: 15px;margin: 0 auto;">
                <div style="margin-top: 10px">
                    <label>推送成功：</label>
                    <span style="color: green">
            {{ articlePushStatistics.successTotal }}
          </span>
                    <span style="color:#000;"> / </span>
                    <span style="color: #2f74ff">
            {{ articlePushStatistics.total }}
          </span>&nbsp;
                    <i class="fa fa-refresh" style="cursor: pointer" @click="getArticlePushStatistics" title="刷新"></i>
                </div>
                <div style="margin-top: 10px">
                    <label>推送失败：</label>
                    <span style="color: darkred">{{ articlePushStatistics.failTotal }}</span>
                </div>
            </div>
            <div style="text-align: center;margin-top: 20px">
                <el-button type="primary" :loading="sendStatus" @click="pushArticle"><i class="fa fa-send"></i> 推送文章
                </el-button>
                <el-button icon="el-icon-close" @click="hidePushDialogs">取 消</el-button>
            </div>
        </el-dialog>
    </d2-container>
</template>

<script>
import * as api from '@/api'
import {SetTop} from "@/api";

export default {
    data() {
        return {
            articlesList: [],
            total: 0,
            currentPage: 1,
            pagesSize: 30,
            showDialog: false,
            dialogTitle: '文章推送',
            articlePushStatistics: {
                successTotal: 0,
                total: 0,
                failTotal: 0
            },
            articleId: '',
            articleTitle: '',
            sendStatus: false,
        }
    },
    methods: {
        getArticlesList() {
            api.ArticlesList({
                pageIndex: this.currentPage,
                pageSize: this.pagesSize
            }).then((response) => {
                let data = response.data.data
                this.articlesList = data.list
                this.total = data.total
                this.currentPage = data.pageNum
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
        // 删除文章确认
        deleteArticleConfirm(val) {
            this.$confirm('确认删除【' + val.title + '】？', '确认操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                    .then(() => {
                        this.deleteArticle(val.id)
                    })
                    .catch(() => {
                        this.$message('取消删除')
                    })
        },
        // 删除文章
        deleteArticle(id) {
            api.DeleteArticle({
                id: id
            }).then((res => {
                let data = res.data
                if (data.code === 200) {
                    this.$message.success('删除成功')
                    this.getArticlesList(this.currentPage, this.pagesize)
                }
            }))
        },
        // 编辑文章
        editArticle(id) {
            this.$router.push({
                name: 'articles-edit',
                query: {
                    id: id
                }
            })
        },
        // 隐藏对话框
        hidePushDialogs() {
            this.articleId = ''
            this.articleTitle = ''
            this.articlePushStatistics = {
                successTotal: 0,
                total: 0,
                failTotal: 0
            }
            this.showDialog = false
        },
        // 显示对话框
        showPushDialogs(val) {
            this.articleId = val.id
            this.articleTitle = val.title
            this.getArticlePushStatistics()
            this.showDialog = true
        },
        // 获取文章推送统计数据
        getArticlePushStatistics() {
            api.ArticlePushStatistics({
                articleId: this.articleId
            }).then((res => {
                let data = res.data
                this.articlePushStatistics = data.data
            }))
        },
        // 文章推送
        pushArticle() {
            this.$confirm('确定要推送吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.sendStatusTimer();
                api.ArticlePush({
                    articleId: this.articleId
                }).then(res => {
                    let data = res.data
                    if (data.code === 200) {
                        this.$message.success('正在推送中...')
                    }
                })
            });
        },
        async sendStatusTimer() {
            this.sendStatus = true
            setTimeout(() => {
                this.sendStatus = false
            }, 3000)
        },
        // 修改文章推荐状态
        changeRecommend(obj) {
            let status = 1 - obj.isRcmd;
            api.SetRecommend({
                id: obj.id,
                status: status
            }).then(res => {
                let data = res.data
                if (data.code === 200) {
                    this.$message.success('推荐状态修改成功！')
                    this.getArticlesList()
                }
            })
        },
        // 修改文章私有状态
        changePrivate(obj) {
            let status = 1 - obj.isPrivate;
            api.SetPrivate({
                id: obj.id,
                status: status
            }).then(res => {
                let data = res.data
                if (data.code === 200) {
                    this.$message.success('私有状态修改成功！')
                    this.getArticlesList()
                }
            })
        },
        // 修改文章置顶状态
        changeTop(obj) {
            let status = 1 - obj.isTop;
            api.SetTop({
                id: obj.id,
                status: status
            }).then(res => {
                let data = res.data
                if (data.code === 200) {
                    this.$message.success('置顶状态修改成功！')
                    this.getArticlesList()
                }
            })
        }
    },
    mounted() {
        this.getArticlesList()
    }
}
</script>
<style>
.page-center {
    width: 480px;
    margin: 10px auto;
}
</style>
