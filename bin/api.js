"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slothking = (host, fn) => ({
    user: {
        name: 'user',
        endpoints: {
            refresh: ({ props, method = 'POST' }) => fn(`${host}user/refresh`, {
                props,
                method,
            }).then(res => res.json()),
            auth: ({ props, method = 'POST' }) => fn(`${host}user/auth`, {
                props,
                method,
            }).then(res => res.json()),
            register: ({ props, method = 'POST' }) => fn(`${host}user/register`, {
                props,
                method,
            }).then(res => res.json()),
            login: ({ props, method = 'POST' }) => fn(`${host}user/login`, {
                props,
                method,
            }).then(res => res.json()),
            changePassword: ({ props, method = 'POST' }) => fn(`${host}user/changePassword`, {
                props,
                method,
            }).then(res => res.json()),
            resetPassword: ({ props, method = 'POST' }) => fn(`${host}user/resetPassword`, {
                props,
                method,
            }).then(res => res.json()),
            resetPasswordFromLink: ({ props, method = 'POST' }) => fn(`${host}user/resetPasswordFromLink`, {
                props,
                method,
            }).then(res => res.json()),
            github: ({ props, method = 'POST' }) => fn(`${host}user/github`, {
                props,
                method,
            }).then(res => res.json())
        }
    },
    imp: {
        name: 'imp',
        endpoints: {
            initImp: ({ props, method = 'POST' }) => fn(`${host}imp/initImp`, {
                props,
                method,
            }).then(res => res.json()),
            updateImp: ({ props, method = 'POST' }) => fn(`${host}imp/updateImp`, {
                props,
                method,
            }).then(res => res.json()),
            removeImp: ({ props, method = 'POST' }) => fn(`${host}imp/removeImp`, {
                props,
                method,
            }).then(res => res.json()),
            searchImp: ({ props, method = 'POST' }) => fn(`${host}imp/searchImp`, {
                props,
                method,
            }).then(res => res.json()),
            getImp: ({ props, method = 'POST' }) => fn(`${host}imp/getImp`, {
                props,
                method,
            }).then(res => res.json())
        }
    }
});
exports.default = slothking;
//# sourceMappingURL=api.js.map