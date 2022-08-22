export function saveForm(userInfo, userInfoCofry, userInfoMapfre, userInfoSIS) {

    return new Promise((resolve) => {
        window.pathname = '/confirmarCelular-clubmapfre';
        resolve({
            'userInfo': userInfo,
            'partnerList': [userInfoCofry, userInfoMapfre, userInfoSIS]
        });
    });
};