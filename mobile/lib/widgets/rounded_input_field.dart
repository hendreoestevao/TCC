import 'package:flutter/material.dart';
import '../constants.dart';
import 'text_field_container.dart';

class RoundedInputField extends StatelessWidget {
  const RoundedInputField({
    Key? key,
    required this.controller, // Declarando como campo da classe
    this.hintText,
    this.icon = Icons.person,
  }) : super(key: key);

  final TextEditingController controller; // Campo para armazenar o controller
  final String? hintText;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
      child: TextFormField(
        controller: controller, // Usando o controller no TextFormField
        cursorColor: kPrimaryColor,
        decoration: InputDecoration(
          icon: Icon(
            icon,
            color: kPrimaryColor,
          ),
          hintText: hintText,
          hintStyle: const TextStyle(fontFamily: 'OpenSans'),
          border: InputBorder.none,
        ),
      ),
    );
  }
}
