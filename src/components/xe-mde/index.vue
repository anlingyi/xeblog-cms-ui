<template>
    <div>
        <mavon-editor ref="md" v-model="value" @imgAdd="$imgAdd" placeholder="开始写作吧..."/>
    </div>
</template>

<script>
    import {UploadImage} from '@/api'
    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'

    export default {
        props: {
            content: {
                type: String,
                require: true,
                default: ''
            }
        },
        data() {
            return {
                value: this.content
            }
        },
        components: {
            mavonEditor
        },
        methods: {
            $imgAdd(pos, $file) {
                let watermarked = false
                this.$confirm('添加水印？', '确认操作', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'info'
                }).then(() => {
                    watermarked = true
                }).finally(() => {
                    let formData = new FormData()
                    formData.append("files", $file)
                    formData.append("watermarked", watermarked);

                    UploadImage(formData).then((response) => {
                        let data = response.data.data;
                        if (data && data.length > 0) {
                            this.$refs.md.$img2Url(pos, data[0])
                        }
                    })
                })
            }
        },
        watch: {
            value() {
                this.$emit('changeContent', this.value)
            }
        }
    }
</script>

<style scoped>

</style>