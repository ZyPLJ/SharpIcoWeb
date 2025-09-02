// notifications.js
export const VERSION =  import.meta.env.VITE_APP_VERSION;

export const buildNotifications = (t) => ({
    welcome: {
        dangerouslyUseHTMLString: true,
        title: t('notify.announce'),
        message: t('notify.welcomeMessageHtml', { version: VERSION }),
        type: 'success'
    }
});