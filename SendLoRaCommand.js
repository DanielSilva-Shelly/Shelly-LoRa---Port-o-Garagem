// 🔐 Chave AES partilhada
const aesKey = 'YOUR AES KEY';
const CHECKSUM_SIZE = 4;
const peerId = 100;  // ID do Shelly recetor

// 🔧 Funções utilitárias
function padRight(str, blockSize) {
  const padLength = (blockSize - str.length % blockSize) % blockSize;
  let padding = '';
  for (let i = 0; i < padLength; i++) padding += ' ';
  return str + padding;
}

function bufferToString(buf) {
  let result = '';
  for (let i = 0; i < buf.length; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}

function encryptMessage(msg, keyHex) {
  const key = [];
  for (let i = 0; i < keyHex.length; i += 2) {
    key.push(parseInt(keyHex.substr(i, 2), 16));
  }
  const padded = padRight(msg, 16);
  const encryptedBytes = AES.encrypt(padded, key, { mode: 'ECB' });
  
  let base64Ready = '';
  for (let i = 0; i < encryptedBytes.length; i++) {
    base64Ready += String.fromCharCode(encryptedBytes[i]);
  }

  return btoa(base64Ready);  // só aqui usas btoa uma vez
}


function generateChecksum(msg) {
  let checksum = 0;
  for (let i = 0; i < msg.length; i++) checksum ^= msg.charCodeAt(i);
  let hex = checksum.toString(16);
  while (hex.length < CHECKSUM_SIZE) hex = '0' + hex;
  return hex.slice(-CHECKSUM_SIZE);
}

// 🚀 Envia comando LoRa (ligar portão)
function sendPulseCommand() {
  const command = {
    method: "Switch.Set",
    params: { id: 0, on: true }
  };
  const json = JSON.stringify(command);
  const fullMsg = generateChecksum(json) + json;
  const encoded = encryptMessage(fullMsg, aesKey);

  Shelly.call("Lora.SendBytes", {
    id: peerId,
    data: encoded
  }, function (_, err_code, err_msg) {
    if (err_code !== 0) {
      print("❌ Erro LoRa:", err_code, err_msg);
    } else {
      print("✅ Comando LoRa enviado.");
    }
  });
}

// 🎯 EVENTOS
Shelly.addEventHandler(function (e) {
  // ▶️ Componente virtual button
  if (e.name === "button" && e.info.id === 201) {
    //print("🛰 Componente virtual (button:200) evento:", JSON.stringify(e.info));
    if (e.info.event === "single_push") {
      Shelly.call("Boolean.Set", { id: 200, value: true });
      //print("🛰 Componente virtual (button:200) → enviar comando LoRa");
      sendPulseCommand();   
      Timer.set(15000, false, function () {
        Shelly.call("Boolean.Set", { id: 200, value: false });
      });
    }
  }
});
