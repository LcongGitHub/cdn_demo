import 'dart:async';

import 'package:common_lib/common_lib.dart';
import 'package:flutter/material.dart';

enum TabBarType {
  /// 首页
  home,

  /// 类目
  category,

  /// 消息
  message,

  /// 购物车
  cart,

  /// 我的
  mine,
}

extension TabBarTypeExt on TabBarType {
  String title() {
    switch (this) {
      case TabBarType.home:
        return 'home';
      case TabBarType.category:
        return 'category';
      case TabBarType.message:
        return 'message';
      case TabBarType.cart:
        return 'cart';
      case TabBarType.mine:
        return 'mine';
    }
  }
}

class TabBarModel {
  /// 未选择时候的图标
  final String unselectedIcon;

  /// 选择后的图标
  final String selectedIcon;

  /// 标题类型
  final TabBarType type;

  /// 页面组件
  final Widget widget;

  TabBarModel({required this.unselectedIcon, required this.selectedIcon, required this.type, required this.widget});
}

class BottomTabbarPage extends StatefulWidget {
  const BottomTabbarPage({Key? key}) : super(key: key);

  @override
  State<BottomTabbarPage> createState() => _BottomTabbarPageState();
}

class _BottomTabbarPageState extends State<BottomTabbarPage> {
  /// 当前选择下标
  int currentIndex = 0;
  List<TabBarModel> data = [
    TabBarModel(
      widget: Container(),
      type: TabBarType.home,
      selectedIcon: 'tabbar/tabbar_home_select',
      unselectedIcon: 'tabbar/tabbar_home_normal',
    ),
    TabBarModel(
      widget: Container(),
      type: TabBarType.category,
      selectedIcon: 'tabbar/tabbar_category_select',
      unselectedIcon: 'tabbar/tabbar_category_normal',
    ),
    TabBarModel(
      widget: Container(),
      type: TabBarType.message,
      selectedIcon: 'tabbar/tabbar_message_select',
      unselectedIcon: 'tabbar/tabbar_message_normal',
    ),
    TabBarModel(
      widget: Container(),
      type: TabBarType.cart,
      selectedIcon: 'tabbar/tabbar_cart_select',
      unselectedIcon: 'tabbar/tabbar_cart_normal',
    ),
    TabBarModel(
      widget: Container(),
      type: TabBarType.mine,
      selectedIcon: 'tabbar/tabbar_mine_select',
      unselectedIcon: 'tabbar/tabbar_mine_normal',
    ),
  ];
  late StreamSubscription changeTabbarSubscription;

  @override
  void initState() {
    super.initState();
  }

  /// Tab 改变
  Future<void> onTabChanged(int value) async {
    setState(() {
      currentIndex = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: IndexedStack(
          index: currentIndex,
          children: data.map((e) {
            return e.widget;
          }).toList(),
        ),
        // 底部导航栏
        bottomNavigationBar: Theme(
          data: ThemeData(splashColor: Colors.transparent),
          child: BottomNavigationBar(
            backgroundColor: Colors.white,
            items: List.generate(
              data.length,
              (index) {
                var label = data[index].type.title();

                String imageString = index == currentIndex ? data[index].selectedIcon : data[index].unselectedIcon;

                return BottomNavigationBarItem(
                  icon: Stack(
                    alignment: Alignment.center,
                    clipBehavior: Clip.none,
                    children: [
                      Padding(
                        padding: EdgeInsets.only(bottom: 5, top: 9),
                        child: Image.asset(
                          Utils.getImgPath(imageString),
                          width: 20,
                          height: 20,
                          package: 'common_lib',
                        ),
                      ),
                      Container(),
                    ],
                  ),
                  label: label,
                );
              },
            ),
            currentIndex: currentIndex,
            type: BottomNavigationBarType.fixed,
            onTap: (index) {
              onTabChanged(index);
            },
            selectedItemColor: Colors.red,
            unselectedItemColor: Colors.black,
            selectedFontSize: 9,
            unselectedFontSize: 9,
          ),
        ));
  }
}
