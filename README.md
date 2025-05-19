🔌 Shelly Gen3 LoRa Add-on — Virtual Button + Encrypted Command

This project uses **two Shelly Gen3 devices** equipped with the **LoRa Add-on** to wirelessly control a garage gate with a secure, encrypted command triggered by a virtual button.

📦 Devices Overview

  🟢 **Shelly 2PM Gen3** — *Sender* (connected to Wi-Fi)
  
    - Controls the **hallway light** locally.
    - Sends an encrypted LoRa command to the receiver device when the **virtual button** is pressed.
    - Includes a virtual boolean component as feedback status.
    - Implements a 15-second indicator to show gate is opening.
  
    #Virtual Components (in a Virtual Device Group):
    - **Virtual Button (ID 201)** – used to trigger the LoRa command.
    - **Virtual Boolean (ID 200)** – represents gate status:
      - **False** → _"Fechado"_ (Closed)
      - **True** → _"A abrir..."_ (Opening...)
      - **Web Icon**: `garage`
      - **Default Value**: `false`
  
  🔴 **Shelly 1PM Gen3** — *Receiver* (offline, not connected to Wi-Fi)
  
    - Listens for encrypted LoRa commands.
    - Executes the received command to pulse the relay for 1 second (garage gate trigger).
    - Has auto-off configured on relay (1s).

🔐 Encryption

  This system uses **AES encryption in ECB mode** to secure the LoRa payload. Each message includes a checksum to ensure integrity.
  
  You can generate a random 128-bit key here:
  👉 generate-random.org/encryption-key-generator

📡 How It Works
    -  User presses Virtual Button 201 in the Shelly app.
    -  Script sets Boolean 200 to true (visual feedback).
    -  Sends an encrypted JSON command to the peer device using Lora.SendBytes.
    -  After 15 seconds, the Boolean resets to false.

🧠 Dependencies
  -  Shelly Gen3 firmware (JS Automation support)
  -  LoRa Add-on properly paired between devices
  -  Virtual Components configured in the app

🖼️ Setup Diagram

![image](https://github.com/user-attachments/assets/f2f3d9e6-ebd5-4a06-b0cc-18198dd88c03)

![image](https://github.com/user-attachments/assets/24fc8032-5759-4dc4-af1d-d1cd2392ed61)

![image](https://github.com/user-attachments/assets/a93a5f28-5c85-41b5-ac23-13bd54bd795d)




🤝 Credits
Script and integration by [DanielSilva-Shell].

Tested with:
  - Shelly 2PM Gen3
  - Shelly 1PM Gen3
  - LoRa Add-on


Feel free to open issues or suggest improvements. Happy automating! 🚀
