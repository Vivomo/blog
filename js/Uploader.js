/**
 * 一个轻量级的文件上传
 * 配置参数:
 *  url: 上传路径
 *  uploadBtn:上传按钮 selector 或 HTMLElement
 *  autoStart:是否自动上传 如果是则不需要 uploadBtn
 *  uploadFile:input[type=file]  selector 或 HTMLElement
 *  onProgress: 文件上传百分比的回调
 *  beforeUpload: 文件上传前执行,可用于校验信息 return false 则停止上传
 *  onLoad: 上传完成是触发
 *  onError: 上传失败时触发
 */
export default class Uploader {
    requiredParams = ['uploadBtn', 'url', 'uploadFile'];
    autoStart = false;
    /**
     *
     * @param cfg
     */
    constructor(cfg) {
        this.requiredParams.every((param) => {
            if (param in cfg) {
                return true;
            } else {
                throw Error(`${param} 是必选项`);
            }
        });
        Object.assign(this, cfg);

        ['uploadBtn', 'uploadFile'].forEach((key) => {
            if (typeof this[key] === 'string') {
                this[key] = document.querySelector(this[key]);
            }
        });

        if (this.autoStart) {
            this.uploadFile.onchange = () => {
                this.triggerUpload();
            };
        } else {
            this.uploadBtn.addEventListener('click', () => {
                if (this.uploadFile.files.length > 0) {
                    this.triggerUpload();
                }
            });
        }
    }

    triggerUpload = () => {
        const formData = new FormData();
        formData.append('file', this.uploadFile.files[0]);
        this.upload(formData);
    }

    upload = (formData) => {
        const xhr = new XMLHttpRequest();

        // 监听文件上传进度
        if (this.onProgress) {
            xhr.upload.onprogress = (evt) => {
                // lengthComputabel: 文件长度是否可计算
                if (evt.lengthComputable) {
                    // evt.loaded: 已下载的字节数
                    // evt.total: 文件总字节数
                    const percent = Math.round(evt.loaded * 100 / evt.total);
                    console.log(percent);
                    this.onProgress(percent);
                }
            };
        }

        // 监听文件传输开始
        if (this.beforeUpload) {
            xhr.onloadstart = () => {
                if (this.beforeUpload() === false) {
                    xhr.abort(); // 终止上传
                }
            };
        }


        // 监听ajax成功完成事件
        if (this.onLoad) {
            xhr.onload = () => {
                this.onLoad();
            };
        }

        if (this.onError) {
            xhr.onerror = (evt) => {
                console.log(evt);
            };
        }

        xhr.open('POST', this.url, true);
        xhr.send(formData);
    }

}