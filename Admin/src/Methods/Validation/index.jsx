const emailvalidation = (val) => {
  if (
    val.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return true;
  }
  return false;
}; 
const passwordValidation = (val) => {
  if (val.length < 8 || val.length > 16) {
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/;
  if (passwordRegex.test(val)) {
    return true;
  }
  return false;
};
const methods = {emailvalidation,passwordValidation};
export default methods;