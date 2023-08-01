import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class Utils {
  static String getImgPath(String name, {String format = 'png'}) {
    if (name.startsWith('lib/assets')) {
      return name;
    } else {
      return 'lib/assets/images/$name.$format';
    }
  }
}
