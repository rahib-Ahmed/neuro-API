exports.randomNumber = function() {
   return Math.floor(Math.random() * 10000001)
}
exports.capitalizeFirstLetter = async (string) => {
   return string.charAt(0).toUpperCase() + string.slice(1);
 }