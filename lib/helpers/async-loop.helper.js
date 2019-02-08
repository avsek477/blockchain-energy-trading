((asyncForEach) => {
    'use strict';
  
    asyncForEach.asyncForEachLoop = async (req, next, array, data, callback) => {
      for (let index = 0; index < array.length; index++) {
          await callback(req, next, array[index], data);
      }
    }
  
  })(module.exports);
  