import moment from 'moment';

export function copyArrayObjByNoRef(paramArrObj) { 
  let arrObj = [];
  paramArrObj = paramArrObj || [];
  for (var i = 0; i < paramArrObj.length; i++) {
    arrObj[i] = {};
    for (var prop in paramArrObj[i]) {
      arrObj[i][prop] = paramArrObj[i][prop];
    }
  }
  return arrObj;
}

export function dateFormatter(date) {
  if (date) {
    return moment(date).local().format("DD/MM/YYYY");
  }
  else {
    return '';
  }
}

export function ConvertBlobToBase64String(blob){
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = () => resolve(reader.result)
    return reader.readAsDataURL(blob);
  })
}