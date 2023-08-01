import 'dart:async';
import 'package:common_lib/common_lib.dart';
import 'package:flutter/material.dart';

void main() async {
  await runZonedGuarded(() async {
    runApp(App());
  }, (error, stackTrace) {});
}
