exports.success = (res, data = {}, message = 'Success', status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  };
  
  exports.error = (res, code, message = 'Error', status = 400) => {
    return res.status(status).json({
      success: false,
      code,
      message
    });
  };
  