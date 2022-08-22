import { firebaseStorage } from 'js/library/utils/firebaseUtils';

//funcao para baixar imagens do storage do firebase
export function downloadImage(pastaStorage, img) {
    const storage = firebaseStorage;
    return new Promise((resolve, reject) => {

        storage.ref(pastaStorage).child(img).getDownloadURL().then(function (url) {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';

            xhr.open('GET', url);
            xhr.send();
            
            resolve(url);
        }).catch(function (error) {
            // Handle any errors
            reject(error);
        });
    });
}