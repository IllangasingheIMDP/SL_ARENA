# SL_ARENA

# For Windows
first create Android/Sdk folder in C Drive
extract the zip file.
copy cmdline-tools into Sdk
create a latest folder in cmdline - tools.
move contents in cmdline - tools to latest.

add C:\Android\Sdk\cmdline-tools\latest\bin to the PATH
add System variable
  key=ANDROID_HOME
  value= C:\Android\Sdk

after that run below is cmd
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

after this there will be platform-tools folder in Sdk.
add C:\Android\Sdk\platform-tools to the PATH

in windows explorer open cmd from address line.in cmd type "code ."
open in vs code.
to run the mobile app in one terminal
cd slarena
npx react-native start

connect to mobile device through usb
in another terminal
cd slarena
npx react-native run-android


