// notifications.js
export const VERSION =  import.meta.env.VITE_APP_VERSION;

export const notifications = {
    welcome: {
        dangerouslyUseHTMLString: true,
        title: '公告',
        message: `<p>欢迎使用 sharpIcoWeb ！当前版本 ${VERSION}</p>
        <p><a href="https://afdian.com/a/pljzy" target="_blank">赞助：爱发电</a></p>`,
        type: 'success'
    }
}