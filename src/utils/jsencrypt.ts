import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair; 把下面生成的公钥、私钥换成自己生成的即可
// const publicKey = ''//生成的公钥
// const privateKey=''

// 加密
export async function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  const publicKey = await fetch('/cret/public.pem').then((res) => res.text()); // 读取公钥

  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export async function decrypt(txt: string) {
  const encryptor = new JSEncrypt()
  const privateKey = await fetch('/cret/private.key').then((res) =>
  res.text(),
); // 读取私钥
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
