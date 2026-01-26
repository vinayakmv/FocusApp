const requestPermission = async () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
};

const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
        new Notification(title, { body, icon: '/vite.svg' });
    }
};

const notifyFn = {
    requestPermission,
    sendNotification
};

export default notifyFn;
