import { firebaseAuth } from 'js/library/utils/firebaseUtils';

//função de login do usuário
export function loginUser(email, password) {
    
    return new Promise((resolve, reject) => {
        firebaseAuth.signInWithEmailAndPassword(email, password)
        .then(function (login) {
            return resolve(login)
        }).catch(function (error) {
            console.log(error)
            return reject(error);
        });
    })
};

export function logoutUser() {
    
    return new Promise(function (resolve, reject) {
        firebaseAuth.signOut()
        .then(function (logout) {
            localStorage.clear();
            window.location.href = '/oficinas';
            resolve(logout);
        }).catch(function (error) {
            reject(error);
        });
    })
};