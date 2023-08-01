fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios custom_lane

```sh
[bundle exec] fastlane ios custom_lane
```

Description of what the lane does

### ios set_default_code_signing

```sh
[bundle exec] fastlane ios set_default_code_signing
```

设置debug模式默认证书签名配置

### ios create_new_profiles

```sh
[bundle exec] fastlane ios create_new_profiles
```

创建新的证书和描述文件

### ios download_profiles

```sh
[bundle exec] fastlane ios download_profiles
```

下载证书和描述文件

### ios nuke_profiles

```sh
[bundle exec] fastlane ios nuke_profiles
```

移除旧的证书和配置文件并重新生成

### ios update_profiles

```sh
[bundle exec] fastlane ios update_profiles
```

更新描述文件

### ios add_device

```sh
[bundle exec] fastlane ios add_device
```

添加新设备

### ios increment

```sh
[bundle exec] fastlane ios increment
```

构建号+1

### ios archive_dev

```sh
[bundle exec] fastlane ios archive_dev
```

测试打包

### ios archive_uat

```sh
[bundle exec] fastlane ios archive_uat
```

Prod打包

### ios archive_prod

```sh
[bundle exec] fastlane ios archive_prod
```

Prod打包

### ios upload_ipa_to_appstore

```sh
[bundle exec] fastlane ios upload_ipa_to_appstore
```

打包并上传IPA到App Store

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
