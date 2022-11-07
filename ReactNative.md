# React Native #

## React Native 打包步骤 ##

生成签名
`keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`

更新签名
`keytool -importkeystore -srckeystore my-release-key.keystore -destkeystore my-release-key.keystore -deststoretype pkcs12`

放到`android/app`下

修改`android/gradle.properties`为以下内容

```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=
MYAPP_RELEASE_KEY_PASSWORD=
```

修改`android/app/build.gradle`文件中`android.signingConfigs.release`
 ```
{
  storeFile file("my-release-key.keystore")
  storePassword  ""
  keyAlias "my-key-alias"
  keyPassword ""
}
```
`buildTypes.release`新增`signingConfig signingConfigs.release` 

`android`目录下使用`gradlew assembleRelease`打包

如果报错，修改`andriod/build.grable`在`allprojects`中新增下面的东西
````
gradle.projectsEvaluated {
  tasks.withType(JavaCompile) {
    options.compilerArgs << "-Xlint:unchecked" << "-Xlint:deprecation"
  }
}
```

