import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = pkg;
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

export const generateTokensForConsulta =async (channelName, uid, role, expireTime = 3600) => {
    // const currentTime = Math.floor(Date.now() / 1000);
    // const privilegeExpireTime = currentTime + expireTime;

    // const rtcToken = RtcTokenBuilder.buildTokenWithUid(
    //     APP_ID,
    //     APP_CERTIFICATE,
    //     channelName,
    //     uid,
    //     role,
    //     privilegeExpireTime
    // );

    // const rtmToken = RtmTokenBuilder.buildToken(
    //     APP_ID,
    //     APP_CERTIFICATE,
    //     uid,
    //     RtmRole.Rtm_User,
    //     privilegeExpireTime
    // );
    const token= await axios.get(`https://telesaude-token-server.onrender.com/rtc/${channelName}/${role}/uid/${uid}/?${expireTime}=`)
    return token.data;
}; 