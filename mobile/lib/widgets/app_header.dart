import 'dart:io';
import 'package:flutter/material.dart';

class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  final String userName;
  final File? userImageFile; // Imagem local do usuário (se disponível)

  const AppHeader({
    Key? key,
    required this.userName,
    this.userImageFile,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Nome do usuário à esquerda
          Text(
            userName,
            style: const TextStyle(
              color: Colors.black,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          // Imagem do usuário à direita
          // CircleAvatar(
          //   radius: 20,
          //   backgroundImage: userImageFile != null
          //       ? FileImage(userImageFile!)
          //       : const AssetImage('assets/images/default_profile.png')
          //           as ImageProvider,
          // ),
        ],
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}
