// notifications.js
export const VERSION =  import.meta.env.VITE_APP_VERSION;

export const notifications = {
    welcome: {
        title: '公告',
        message: `欢迎使用 sharpIcoWeb ！当前版本 ${VERSION}`,
        type: 'success'
    }
}