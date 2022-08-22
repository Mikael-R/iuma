import md5 from "js/library/utils/md5.js";
import CryptoJS from "crypto-js";
import { store } from 'js/core/configureStore';

export function validateFullName(name) {
  let validName = name.split(' ');

  validName.map(function (array, i) {
    if (array === '') {
      return validName.splice(i, 1)
    }
    else {
      return null;
    }
  });

  return validName.length <= 1 ? false : true;
}

//confirma que a data é válida
export function confirmDate(date) {
  let validDay = true;
  let validMonth = true;
  let validYear = true;

  let day = date.substring(0, 2);
  day <= 31 && day > 0 ? day = clamp(day, 1, 31) : validDay = false;

  let month = date.substring(3, 5);
  month <= 12 && month > 0 ? month = clamp(month, 1, 12) : validMonth = false;

  let year = date.substring(6);
  year <= new Date().getFullYear() && year > 1900 ? year = clamp(year, 1900, new Date().getFullYear()) : validYear = false;

  if (validMonth !== false && validDay !== false) {
    //meses com dia 30
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      day > 30 ? validDay = false : validDay = true;
    }

    //anos bissextos
    if (month === 2) {
      if (year % 4 === 0 && (year % 400 === 0 || year % 100 !== 0)) {
        day > 29 ? validDay = false : validDay = true;
      } else {
        day > 28 ? validDay = false : validDay = true;
      }
    }
  }
  month = month - 1;

  let finalDate = new Date(year.toString(), month.toString(), day.toString());

  if (finalDate <= Date.now() && validDay === true && validMonth === true && validYear === true) {
    return true;
  } else {
    return false;
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function hashTriibo1(apiToken, passPhrase, channelToken) {

  let challenge1 = passPhrase + apiToken; //Passo 1: String a apiToken + passPhrase
  challenge1 = md5.hexMD5(challenge1); //Passo 2: challenge1 ou challenge intermediário

  let challenge2 = challenge1 + channelToken; //Passo 3: String a challenge1 + channelToken - sendo este valor o do ITEM B ou ex: keychannelclubmapfre (é a sua Private KEY)
  challenge2 = md5.hexMD5(challenge2);

  return challenge2;
}

export function encrypt(msg, key) {

  if (!msg) return null;

  const myEncrypt = {
    pass: CryptoJS.enc.Utf8.parse(key),
    iv: CryptoJS.enc.Hex.parse("0000000000000000"),
  };

  let options = {
    mode: CryptoJS.mode.CBC,
    iv: myEncrypt.iv
  };

  let json = CryptoJS.AES.encrypt(msg, myEncrypt.pass, options);

  return json.ciphertext.toString(CryptoJS.enc.Base64);
}

export function decrypt(msg, key) {
  if (!msg) return null;

  const myEncrypt = {
    pass: CryptoJS.enc.Utf8.parse(key),
    iv: CryptoJS.enc.Hex.parse("0000000000000000"),
  };

  let options = {
    mode: CryptoJS.mode.CBC,
    iv: myEncrypt.iv
  };

  let json = CryptoJS.AES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(msg)
  }, myEncrypt.pass, options);
  return json.toString(CryptoJS.enc.Utf8);
}

export function cellPhoneMask(value) {

  value = value.replace(/\D/g, "");

  let cellPhone = '';

  if ((value.length === 0) || (value.length === 2 && value === '55')) {
    cellPhone = '';
  }
  else if (value.length === 1) {
    cellPhone = '+55 (' + value.substr(0, 1);
  }
  else if (value.length > 1 && value.length <= 4) {
    cellPhone = '+55 (' + value.substr(2, 2);
  }
  else if (value.length > 4 && value.length <= 9) {
    cellPhone = '+55 (' + value.substr(2, 2) + ') ' + value.substr(4, 5);
  }
  else {
    cellPhone = '+55 (' + value.substr(2, 2) + ') ' + value.substr(4, 5) + '-' + value.substr(9, 4);
  }

  return cellPhone;
}

export function formatPhone(value) {
  value = value.replace(/\D/g, "");

  return '(' + value.substr(0, 2) + ') ' + value.substr(2, 4) + '-' + value.substr(6, 4);
}

export function cpfMask(value) {

  value = value.replace(/\D/g, '');

  let cpf = '';

  if (value.length === 0) {
    cpf = '';
  }
  else if (value.length >= 1 && value.length <= 3) {
    cpf = value.substr(0, 3);
  }
  else if (value.length > 3 && value.length <= 6) {
    cpf = value.substr(0, 3) + '.' + value.substr(3, 3);
  }
  else if (value.length > 6 && value.length <= 9) {
    cpf = value.substr(0, 3) + '.' + value.substr(3, 3) + '.' + value.substr(6, 3);
  }
  else {
    cpf = value.substr(0, 3) + '.' + value.substr(3, 3) + '.' + value.substr(6, 3) + '-' + value.substr(9, 2);
  }

  return cpf;
}

//mascara para CEP
export function maskCEP(cpf) {
  cpf = cpf.replace(/\D/g, "")
  cpf = cpf.replace(/(\d{5})(\d)/, "$1-$2")
  cpf = cpf.slice(0, 9)
  cpf = cpf.replace(/(\d{5})(\d{3})$/, "$1-$2")
  return cpf
}

export function maskCard(card) {
  card = card.replace(/\D/g, ""); // Permite apenas dígitos
  card = card.replace(/(\d{4})/g, "$1 "); // Coloca um ponto a cada 4 caracteres
  card = card.replace(/\.$/, ""); // Remove o ponto se estiver sobrando
  card = card.substring(0, 19)// Limita o tamanho
  return card
}

export function maskDate(value) {
  value = value.replace(/\D/g, '');

  let date = '';

  if (value.length === 0) {
    date = '';
  }
  else if (value.length > 0 && value.length < 3) {
    date = value.substr(0, 2);
  }
  else if (value.length > 2 && value.length < 5) {
    date = value.substr(0, 2) + '/' + value.substr(2, 2);
  }
  else {
    date = value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4, 4);
  }

  return date;
}

export function findIndexInArray(array, type, value) {

  let x = null;

  if (Array.isArray(array)) {
    array.map(function (array, i) {
      if (array !== null && array[type] !== undefined && array[type] === value) {
        x = i;
      }

      return x;
    });
  }

  return x;
};

export function findValueInArray(array, type, value) {

  let x = null;

  if (Array.isArray(array)) {
    array.map(function (array, i) {
      if (array !== null && array[type] !== undefined && array[type] === value) {
        x = array;
      }

      return x;
    });
  }

  return x;
};

export function getLastUserInfo() {
  let userInfo = null;

  if (store.getState().mapfreQueryModel.uId === null && store.getState().userFormModel.userInfo === null) {
    userInfo = JSON.parse(localStorage.getItem('userInfoAuxiliar'));
  }
  else {
    if (store.getState().mapfreQueryModel.isTriibo === true && store.getState().mapfreQueryModel.isMapfreV3 === true) {
      userInfo = { ...store.getState().mapfreQueryModel };
    }
    else {
      userInfo = { ...store.getState().userFormModel.userInfo };
      userInfo.partnerList = [...store.getState().userFormModel.partnerList];
      userInfo.uId = store.getState().phoneInputModel.userInfo.uId;
      userInfo.triiboId = store.getState().phoneInputModel.userInfo.triiboId;
      userInfo.contactList = store.getState().phoneInputModel.userInfo.contactList;
    }
  }

  if (store.getState().editUserInfoModel.userInfo !== null && store.getState().editUserInfoModel.userInfo.updateDate > userInfo.updateDate && store.getState().editUserInfoModel.userInfo.uId === userInfo.uId) {
    userInfo = store.getState().editUserInfoModel.userInfo;
  }

  return userInfo;
}

export function diffDays(date1, date2) {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function getUrlVariables() {
  let GET = {};
  if (document.location.toString().indexOf('?') !== -1) {
    let query = document.location
      .toString()
      .replace(/^.*?\?/, '')
      .replace(/#.*$/, '')
      .split('&');

    for (let i = 0, l = query.length; i < l; i++) {
      let aux = decodeURIComponent(query[i]).split('=');
      GET[aux[0]] = aux[1];
    }
  }

  return GET;
}

export function placeIsOpen(hours) {
  let open = false;

  const currentTime = new Date();

  if (hours !== undefined && hours[currentTime.getDay()].ativo) {

    if (((currentTime.getHours() > parseInt(hours[currentTime.getDay()].horarioInicio.split(':')[0], 10)) || (currentTime.getHours() === parseInt(hours[currentTime.getDay()].horarioInicio.split(':')[0], 10) && currentTime.getMinutes() >= parseInt(hours[currentTime.getDay()].horarioInicio.split(':')[1], 10))) && ((currentTime.getHours() < parseInt(hours[currentTime.getDay()].horarioFim.split(':')[0], 10)) || (currentTime.getHours() === parseInt(hours[currentTime.getDay()].horarioFim.split(':')[0], 10) && currentTime.getMinutes() <= parseInt(hours[currentTime.getDay()].horarioFim.split(':')[1], 10)))) {
      open = true;
    }
  }

  return open;
}

export function validateRegistrationDate(registrationDate) {
  try {

    const mkTime = new Date(registrationDate).getTime() / 1000.00;
    const mkTimeCurrent = new Date().getTime() / 1000.00;
    const date = Math.floor((mkTimeCurrent - mkTime) / 60);

    if (date > 15 || registrationDate === null) {
      return false;
    } else {
      return true;
    }
  } catch {
    return false;
  }
};

export function formatDate(millis) {

  if (millis !== undefined) {
    const date = new Date(millis);
    return date.toLocaleDateString();
  }
  else {
    return null;
  }
}

export function detectmob() {
  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  }
  else {
    return false;
  }
}

export function define(value) {

  if (value === undefined) {
    return null;
  }
  else {
    return value;
  }
}

export function validateCPF(strCPF) {
  strCPF = strCPF
    .replace(/[-]/gi, "")
    .replace(/[.]/gi, "")
    .replace(/[a-z]/gi, "");

  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF === "00000000000") return false;

  for (let i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

export function trackEventMatomo(location, event, element, elementName) {

  const elementType = `element:${element}; elementName:${elementName}`;

  var _paq = window._paq = window._paq || [];
  _paq.push(['trackEvent', location, event, elementType]);

}

export function trackEventMatomoElementId(location, event, element, elementId) {

  const elementType = `element:${element}; elementId:${elementId}`;

  var _paq = window._paq = window._paq || [];
  _paq.push(['trackEvent', location, event, elementType]);

}

export function trackEventMatomoVisit(locationName) {
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackEvent', locationName, 'visualizar', window.location.href, 0]);
}