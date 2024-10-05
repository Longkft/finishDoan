import axios from 'axios';
import { StatusCode } from './status';

const axiosClient = axios.create();
const apiUrl = 'http://localhost:3056/v1/api';

const getAccessToken = async () => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('_id'))
        return { accessToken: localStorage.getItem('accessToken'), clientId: localStorage.getItem('_id') };

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(null);
        }, 10000);

        const accessToken = localStorage.getItem('accessToken');
        const clientId = localStorage.getItem('_id');
        resolve({ accessToken, clientId });

        clearTimeout(timeout);
    });
};

const configure = () => {
    axiosClient.interceptors.request.use(async (config) => {
        config.headers['Content-type'] = 'application/json';
        if (!config.headers[`x-api-key`]) config.headers[`x-api-key`] = '123456';

        if (config.url.indexOf('/login') >= 0 || config.url.indexOf('/handlerefreshtoken') >= 0) {
            return config;
        }

        const { accessToken, clientId } = await getAccessToken();
        if (accessToken && clientId) {
            config.headers.Authorization = accessToken;
            config.headers[`client-id`] = clientId;
        }

        return config;
    });
};

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
    refreshSubscribers.map((callback) => callback(token));
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

const refreshToken = async () => {
    const url = `${apiUrl}/handlerefreshtoken`;
    const clientId = localStorage.getItem('_id');
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(
        url,
        {
            refreshToken,
        },
        {
            headers: {
                'Content-type': 'application/json',
                [`x-api-key`]: '123456',
                [`refreshtoken`]: refreshToken,
                [`client-id`]: clientId,
            },
        },
    );
    return response.data;
};

const saveTokens = (accessToken, refreshToken, clientId) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('_id', clientId);
};

const removeLocalStorage = () => {
    localStorage.removeItem('_id');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

axiosClient.interceptors.response.use(
    async (response) => {
        return response.data;
    },
    async (error) => {
        const { status } = error.response;
        const originalRequest = error.config;

        // lỗi token hết hạn
        if (status === StatusCode.NETWORK_AUTHENTICATION_REQUIRED) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const { message, status, metadata } = await refreshToken();
                    if (status != StatusCode.OK) throw new Error(message);
                    saveTokens(metadata.tokens.accessToken, metadata.tokens.refreshToken, metadata.user._id);

                    isRefreshing = false;
                    onRefreshed(metadata.tokens.accessToken);
                    refreshSubscribers = [];

                    originalRequest.headers.Authorization = metadata.tokens.accessToken;

                    return axiosClient(originalRequest);
                } catch (refreshError) {
                    console.error('Có lỗi xảy ra! Vui lòng đăng nhập lại');
                    setTimeout(() => {
                        isRefreshing = false;
                        refreshSubscribers = [];

                        removeLocalStorage();
                        window.location.href = '/';

                        return Promise.reject(refreshError);
                    }, 2200);
                }
            } else {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = token;
                        resolve(axiosClient(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    },
);

const HttpService = {
    configure,
    axiosClient,
    apiUrl,
    saveTokens,
    removeLocalStorage,
};

export default HttpService;
