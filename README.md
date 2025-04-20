# SL_ARENA - React Native Setup Guide (Windows)

## 🛠️ Android SDK Setup

### 1. Prepare SDK Directory
- Create the following directory:
  ```
  C:\Android\Sdk
  ```
- Extract the downloaded Android SDK `.zip` file.
- Copy the `cmdline-tools` folder into:
  ```
  C:\Android\Sdk\
  ```
- Inside `cmdline-tools`, create a folder named `latest`, and **move all contents** from `cmdline-tools` into this `latest` folder. Your structure should look like this:
  ```
  C:\Android\Sdk\cmdline-tools\latest\bin
  ```

---

## 🔧 Environment Variables Setup

### Add to `PATH`:
- `C:\Android\Sdk\cmdline-tools\latest\bin`
- `C:\Android\Sdk\platform-tools` *(will be available after installing platform tools)*

### Add System Variable:
- **Key:** `ANDROID_HOME`  
- **Value:** `C:\Android\Sdk`

---

## 📦 Install Android Packages

Open Command Prompt and run:

```bash
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"
```

This will download and add the required tools under `C:\Android\Sdk\platform-tools`.

---

## 🧑‍💻 Project Setup in VS Code

### 1. Open Project in VS Code
- Open File Explorer and navigate to your project directory.
- In the address bar, type:
  ```
  cmd
  ```
- Then run:
  ```
  code .
  ```

---

## 🚀 Running the App

### Terminal 1: Start Metro Bundler

```bash
cd slarena
npx react-native start
```

### Terminal 2: Run the App on Device

1. Connect your Android device via USB.
2. Make sure **Developer Mode** and **USB Debugging** are enabled.
3. Then run:

```bash
cd slarena
npx react-native run-android
```
