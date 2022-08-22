import { firebaseDatabase } from 'js/library/utils/firebaseUtils';

//CRIAR OU ATUALIZAR TABELAS NO FIREBASE COM PUSH
export function pushDatabase(node, data, path) {

    return new Promise((resolve, reject) => {

        if (data !== null) {
            firebaseDatabase.ref(node).push(data)
                .then(function (result) {
                    if (path !== null && path !== undefined) {
                        window.pathname = path;
                    }
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
        }
    });
};
