import 'package:flutter/material.dart';
import 'package:tcc/screens/screens.dart';
import 'package:intl/date_symbol_data_local.dart';
Future<void> main() async {
   await initializeDateFormatting('pt_BR', null);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GoSchool',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
      ),
      home: LoginScreen(), // Define a tela de login como inicial
    );
  }
}
