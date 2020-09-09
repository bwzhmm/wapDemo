import util from './util';

export function service(baseparams, path) {
    return util.postAjax({
        code: 'business',
        url: 'business/handler',
        data: {
            data: JSON.stringify(baseparams),
            path: path
        }
    })
};

export function logService(baseparams) {
    return util.postAjax({
        code: 'business',
        url: 'business/handler',
        data: {
            data: JSON.stringify(baseparams),
            path: 'env.ENV_LOG.save'
        }
    })
};
export function loginService(baseparams) {
    return util.postAjax({
        code: 'business',
        url: 'CPLogin/pcLogin',
        data: baseparams,


    })
};
