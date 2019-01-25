<template>
    <div>
        <textarea ref="mde"></textarea>
        <input type="file" ref="file" @change="readFile()" v-show="false"/>
    </div>
</template>

<script>
    import SimpleMDE from 'simplemde'
    import 'simplemde/dist/simplemde.min.css'
    import {Upload} from '@/api'

    export default {
        name: 'd2-mde',
        props: {
            // 值
            value: {
                type: String,
                required: false,
                default: ''
            },
            // 配置参数
            config: {
                type: Object,
                required: false,
                default: () => ({})
            }
        },
        data() {
            return {
                // 编辑器实例
                mde: null,
                // 编辑器默认参数
                // 详见 https://github.com/sparksuite/simplemde-markdown-editor#configuration
                defaultConfig: {
                    autoDownloadFontAwesome: false
                }
            }
        },
        mounted() {
            // 初始化
            this.init()
        },
        destroyed() {
            // 在组件销毁后销毁实例
            this.mde = null
        },
        methods: {
            // 初始化
            init() {
                // 合并参数
                const config = Object.assign({}, this.defaultConfig, this.config)
                // 初始化
                this.mde = new SimpleMDE({
                    ...config,
                    // 初始值
                    initialValue: this.value,
                    // 挂载元素
                    element: this.$refs.mde,
                    toolbar: [
                        {
                            "name": "bold",
                            "className": "fa fa-bold",
                            "title": "Bold",
                            "default": true,
                            "action": SimpleMDE.toggleBold
                        },
                        {
                            "name": "italic",
                            "className": "fa fa-italic",
                            "title": "Italic",
                            "default": true,
                            "action": SimpleMDE.toggleItalic
                        },
                        {
                            "name": "heading",
                            "className": "fa fa-header",
                            "title": "Heading",
                            "default": true,
                            "action": SimpleMDE.toggleHeadingSmaller
                        },
                        "|",
                        {
                            "name": "quote",
                            "className": "fa fa-quote-left",
                            "title": "Quote",
                            "default": true,
                            "action": SimpleMDE.toggleBlockquote
                        },
                        {
                            "name": "unordered-list",
                            "className": "fa fa-list-ul",
                            "title": "Generic List",
                            "default": true,
                            "action": SimpleMDE.toggleUnorderedList
                        },
                        {
                            "name": "ordered-list",
                            "className": "fa fa-list-ol",
                            "title": "Numbered List",
                            "default": true,
                            "action": SimpleMDE.toggleOrderedList
                        },
                        {
                            "name": "table",
                            "className": "fa fa-table",
                            "title": "Table",
                            "default": true,
                            "action": SimpleMDE.drawTable
                        },
                        "|",
                        {
                            "name": "link",
                            "className": "fa fa-link",
                            "title": "Create Link",
                            "default": true,
                            "action": SimpleMDE.drawLink
                        },
                        {
                            "name": "image",
                            "className": "fa fa-picture-o",
                            "title": "Insert Image",
                            "default": true,
                            "action": SimpleMDE.drawImage
                        },
                        "|",
                        {
                            "name": "preview",
                            "className": "fa fa-eye no-disable",
                            "title": "Toggle Preview",
                            "default": true,
                            "action": SimpleMDE.togglePreview
                        },
                        {
                            "name": "side-by-side",
                            "className": "fa fa-columns no-disable no-mobile",
                            "title": "Toggle Side by Side",
                            "default": true,
                            "action": SimpleMDE.toggleSideBySide
                        },
                        {
                            "name": "fullscreen",
                            "className": "fa fa-arrows-alt no-disable no-mobile",
                            "title": "Toggle Fullscreen",
                            "default": true,
                            "action": SimpleMDE.toggleFullScreen
                        },
                        "|",
                        {
                            "name": "file",
                            "className": "fa fa-file",
                            "title": "Importing Files",
                            "action": this.selectFile
                        },
                        '|',
                        {
                            "name": "guide",
                            "action": "https://simplemde.com/markdown-guide",
                            "className": "fa fa-question-circle",
                            "title": "Markdown Guide",
                            "default": true
                        },
                        "|"]
                })
                this.mde.codemirror.on('change', () => {
                    this.$emit('input', this.mde.value())
                }),
                    this.mde.codemirror.on('paste', (editor, e) => {
                        if (!(e.clipboardData && e.clipboardData.items)) {
                            console.log('此浏览器不支持粘贴图片操作！')
                            return
                        }

                        let dataList = e.clipboardData.items
                        for (var i = 0; i < dataList.length; i++) {
                            if (dataList[i].type.indexOf('image') !== -1) {
                                e.preventDefault()
                                this.uploadImages(dataList[i].getAsFile())
                            }
                        }
                    })
            },
            selectFile() {
                this.$refs.file.click()
            },
            readFile() {
                const reader = new FileReader()
                reader.onload = e => {
                    this.mde.value(e.target.result)
                }
                reader.readAsText(this.$refs.file.files[0])
            },
            uploadImages(file) {
                let formData = new FormData()
                formData.append("file", file)

                Upload(formData).then((response) => {
                    let data = response.data.data;
                    if (data.file != null && data.file != '' && data.file != undefined) {
                        this.mde.drawImageByUrl(data.file)
                    }
                })

            }
        }
    }
</script>
