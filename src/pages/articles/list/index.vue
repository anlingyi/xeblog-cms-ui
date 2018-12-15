<template>
  <d2-container>
    <template slot="header">Page 1 header</template>
    Hello World
    <p @click="getArticlesList">文章列表</p>
      {{ info }}
    <template slot="footer">footer</template>
  </d2-container>
</template>

<script>
    import { ArticlesList } from '@/api'
    export default {
        data() {
            return {
                info: ""
            }
        },
        methods: {
            getArticlesList () {
                ArticlesList().then((response) => {
                    console.log(response)
                    let data = response.data
                    this.info = data
                })
            }
        }
    }
</script>
