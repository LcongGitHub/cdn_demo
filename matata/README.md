# matata

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.


# 一、目录介绍

工程地址，拉取分支1.0.0：http://sz.git.egatee.cn:90/2b2c/flutter_app/matata.git

1、android ：安卓原生应用代码
2、iOS：iOS原生代码
3、lib：业务代码
lib/assets: 资源文件
lib/common： 公共目录（公共widget，page等)
lib/event_bus：类似通知事件定义
lib/generated：国际化文件，自动创建的（没啥用）
lib/l10n：国际化文件（本地化字符串都写在这里)
lib/global：全局配置信息
lib/manager：单例类
lib/modules：业务模块
lib/routes：路由
lib/utils：工具类
lib/vendor：第三方库

4、analysis_optinos.yaml: lint规则（代码规范）
5、pubspec.yaml：第三方库管理


# 二、代码规范
## 2.1 命名规范
1、**文件夹名称** ：由小写英文加下划线组成
如：event_bus、login_register

2、**文件名(包名)**：由小写英文加下划线组成==
如：login_page、home_api

3、**类名**：大驼峰法==
如：LoginPage、HomeApi

4、**变量名、方法名**：小驼峰命名
如： passWord、 areaCode、 loginReust()

## 2.2 库引入规范

正确：import 'package:matata/modules/login_register/bloc/login_bloc.dart';
错误：import '../bloc/login_bloc.dart';

## 2.3 其他规范

1、**私有方法方法名**：前加下划线
如: \_loginReust
2、**字符串**： 单引号或双引号、推荐单引号
如：'hello word',

更多规则设置：https://www.jianshu.com/p/571290dd7744

## 2.4  代码自动格式化：设置
Preference->Flutter->Format code on save 勾选

# 三、状态管理

- **Provider、BLoC、GetX**

Bloc官网: https://bloclibrary.dev/#/zh-cn/gettingstarted
Bloc使用： https://juejin.cn/post/6856268776510504968
Bloc使用: https://blog.csdn.net/jdsjlzx/article/details/123432110

Provider： https://juejin.cn/post/6968272002515894303

GetX：https://gitcode.net/mirrors/jonataslaw/getx?utm_source=csdn_github_accelerator

# 四、路由

第三方：Fluro:https://juejin.cn/post/6844903866262093837

- **路由定义：**

路径 lib/routes/routes.dart

```dart
class Routes {
  /// 前缀
	static final String appScheme = 'invknow://';  
	static final String webScheme = 'webview://';  

	/// 页面路由定义
	static String root = '/';  
	static String login = '${appScheme}login';  
	static String notFound = '${appScheme}notFound';

	/// 路由处理
	static void configureRoutes(FluroRouter router) {
 		router.define(root, handler: rootHandler);
		 router.define(login, handler: loginHandler);
	}
}

```

- **路由处理**

```dart
Handler rootHandler = Handler(
  handlerFunc: (context, params) {
    return APP();
  },
);

Handler loginHandler = Handler(
  handlerFunc: (context, params) {
    return LoginPage();
  },
);
```

-  **使用**

```dart
class NavigatorUtil {
 /// 返回
  static void goBack(BuildContext context, {dynamic params}) {
    
  }
  
/// 删除当前页面跳转下个页面
  static void popAndPushNamed(BuildContext context, String path,
      {Map<String, dynamic>? params}) {
   
  }
  
 /// 跳转页面
  static Future jumpPage(BuildContext context, String routeName,
      {Map<String, dynamic>? params}) {
   
  }
}

///使用 NavigatorUtil.jumpPage(context, Routes.login, params: {});
```



# 五、国际化

第三方：flutter_localizations

使用:

```dart
/// Text(S.current.login)
```



# 六、网络

<img src="/Users/tran/Library/Application Support/typora-user-images/image-20221017172243120.png" alt="image-20221017172243120" style="zoom:50%;" /> 

使用：dio

```dart
//登录
Future<UserInfoModel> _login(
    {LoginType loginType = LoginType.verification,
    required String phone,
    required String areaCode,
    String? verificationCode,
    String? passWord}) async {
  
  var response =
      await HttpUtils.post(LoginApi.login, data: params, isTrack: true);
  if (response['code'] == 200) {
    var result = LoginResult.fromJson(response);

    if (result.data?.accessToken == null) {
      return Future.error(AppException(-1, '未知异常'));
    }
    var isSuccess = await SpUtil.saveToken(result.data!.accessToken!);
    _token = result.data!.accessToken!;

    if (isSuccess) {
      var userRes = await HttpUtils.post(MineApi.userInfo,
          data: <String, dynamic>{}, isTrack: true);
      if (userRes['code'] == 200) {
        _streamController.sink.add(true);
        var userResult = UserInfoResult.fromJson(userRes);
        userResult.data?.popupPwd = result.data?.popupPwd;
        await SpUtil.saveUserInfo(userResult.data);
        _info = userResult.data!;
        LogUtils.updateName(_info.userId ?? '');
        return userResult.data!;
      } else {
        return Future.error(AppException(response['code'], response['msg']));
      }
    } else {
      return Future.error(AppException(-1, '缓存token失败'));
    }
  } else if (response['code'] == 2002) {
    if (response['data'] == null || response['data']['errorTimes'] == null) {
      ToastUtil.showMsg(response['msg']);
      return Future.error(AppException(response['code'], '0'));
    }
    if (response['data']['errorTimes'] < 3) {
      ToastUtil.showMsg(response['msg']);
    }
    return Future.error(
      AppException(response['code'], '${response['data']['errorTimes']}'),
    );
  } else {
    return Future.error(AppException(response['code'], response['msg']));
  }
}
```



# 七、Json转Model

原生

`json_serializable` + [JSONConverter](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fvvkeep%2FJSONConverter)

https://pub.dev/packages/json_serializable



# 八、日志打印

Logger:https://pub.dev/packages/logger

使用

```dart
/// LogUtil.i('info级别');
/// LogUtil.d('debug级别');
/// LogUtil.w('warn级别');
/// LogUtil.e('error级别');
```

# 九、实用教程

1、Flutter 开发文档（推荐）：https://flutter.cn/docs/get-started/install

2、Flutter中文网：https://book.flutterchina.club/

