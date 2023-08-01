import 'package:common_lib/common_lib.dart';
import 'package:flutter/material.dart';

class App extends StatefulWidget {
  const App({Key? key}) : super(key: key);

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  Widget build(BuildContext context) {
    return _initBuild(context);
  }

  /// 初始化App
  Widget _initBuild(BuildContext context) {
    return MaterialApp(
      title: 'Matata',
      home: const BottomTabbarPage(),
    );
  }
}
