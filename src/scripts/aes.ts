import CryptoJS from 'crypto-js'

export function GenerateAesKey(): string {
  var e = ":F0wKU!Qg3}UkbW+w[:9|D3-5h=:T;7t#_GZ4#G;~ZNSq{8;}QIP>'{q.lje";
  var t = new Date;
  var n = t.getFullYear();
  var r = t.getMonth() + 1;
  var o = t.getDate();
  var i = 33 + o * r * 33;
  var a = String.fromCharCode((i % 94) + 33);
  var s = e[o + r];
  var c = (n * r * o) % e.length;
  var u = e.substring(0, c);
  var l = e.substring(c);
  var f = (l + u).substring(0, 14);
  return "".concat(a).concat(f).concat(s);
}

const key = CryptoJS.enc.Utf8.parse(GenerateAesKey());

export function AesDecrypt(encryptedString: string): string {
    return CryptoJS.AES.decrypt(encryptedString, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
}
