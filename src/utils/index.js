export function cleanObject(obj) {
  if (obj === null || obj === undefined)
    return obj;
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        cleanObject(obj[key]);
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      }
    });
  }
  return obj;
}

