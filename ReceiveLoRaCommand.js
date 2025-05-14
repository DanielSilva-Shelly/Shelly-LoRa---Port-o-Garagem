const aesKey = 'YOUR AES KEY';
const CHECKSUM_SIZE = 4;

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

function bufferToString(buf) {
  let result = '';
  for (let i = 0; i < buf.length; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}

function manualTrim(str) {
  let start = 0;
  let end = str.length - 1;
  while (start <= end && str[start] === ' ') start++;
  while (end >= start && str[end] === ' ') end--;
  let result = '';
  for (let i = start; i <= end; i++) result += str[i];
  return result;
}

function decryptMessage(encMsgBase64) {
  const key = hexToBytes(aesKey);
  const encrypted = atob(encMsgBase64);
  const decryptedBuffer = AES.decrypt(encrypted, key, { mode: 'ECB' });
  const decrypted = bufferToString(decryptedBuffer);
  return manualTrim(decrypted);
}

function validateChecksum(msg) {
  const receivedChecksum = msg.slice(0, CHECKSUM_SIZE);
  const jsonPayload = msg.slice(CHECKSUM_SIZE);

  let checksum = 0;
  for (let i = 0; i < jsonPayload.length; i++) {
    checksum ^= jsonPayload.charCodeAt(i);
  }

  let hex = checksum.toString(16);
  while (hex.length < CHECKSUM_SIZE) hex = '0' + hex;
  const calculated = hex.slice(-CHECKSUM_SIZE);

  if (calculated === receivedChecksum) {
    return jsonPayload;
  } else {
    print("❌ Checksum inválido:", receivedChecksum, "!=", calculated);
    return null;
  }
}

Shelly.addEventHandler(function (e) {
  if (e.name === "lora" && e.info && e.info.event === "lora_received") {
    print("📨 Mensagem recebida (base64):", e.info.data);
    try {
      const decrypted = decryptMessage(e.info.data);
      print("📝 Mensagem desencriptada:", decrypted);

      const jsonMsg = validateChecksum(decrypted);
      if (jsonMsg) {
        const obj = JSON.parse(jsonMsg);
        print("✅ Executar comando:", JSON.stringify(obj));
        Shelly.call(obj.method, obj.params || {});
      }
    } catch (err) {
      print("❌ Erro ao processar:", err);
    }
  }
});

print("📡 Script recetor LoRa ativo");
