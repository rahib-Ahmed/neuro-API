const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.key; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    // console.log(text)
	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var m = crypto.createHash('md5');
    m.update(`${process.env.key}`);
    var key = m.digest();
    
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);    
    var encoded = cipher.update(text, 'utf8', 'hex');
    encoded += cipher.final('hex');
    
    return encoded;
}
 
function decrypt(text) {
    
	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var m = crypto.createHash('md5');
    m.update(`${process.env.key}`);
    var key = m.digest();
	let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(text, 'hex', 'utf8');
    decoded += decipher.final('utf8');
	return decoded.toString();
}   

module.exports = { decrypt, encrypt };