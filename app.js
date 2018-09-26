const {getOauthToken, sendMessage} = require('./pushClient');
const config = require('./config');

const sendPushNotification = async (user, message) => {
    const authToken = await getOauthToken();

    const messageStatus = sendMessage(user, message, authToken.data);


    return messageStatus;
    
};

sendPushNotification(config.testuser, 'Test messge from Node').then(
    (response) => {
        console.log(JSON.stringify(response.data));
    }
    ).catch(e => console.log(e.message));
