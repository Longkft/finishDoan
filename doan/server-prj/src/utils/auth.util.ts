import * as JWT from 'jsonwebtoken';
export const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '3 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log('error verify: ', error);
    }
};

export const verifyJwt = async (token, keySecret) => {
    return JWT.verify(token, keySecret);
};
