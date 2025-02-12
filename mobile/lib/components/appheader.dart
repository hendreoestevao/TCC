import 'dart:io';
import 'package:flutter/material.dart';

// Gerenciador global para a imagem de perfil
ValueNotifier<File?> profileImageNotifier = ValueNotifier<File?>(null);

class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  final String userName;

  const AppHeader({
    Key? key,
    required this.userName,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      title: Row(
        children: [
          // Exibindo o avatar com atualização dinâmica
          ValueListenableBuilder<File?>(
            valueListenable: profileImageNotifier,
            builder: (context, file, child) {
              return CircleAvatar(
                radius: 20,
                backgroundImage: file != null
                    ? FileImage(file, scale: DateTime.now().millisecondsSinceEpoch.toDouble())
                    : const AssetImage('assets/images/default_profile.png')
                        as ImageProvider,
              );
            },
          ),
          const SizedBox(width: 10),
          // Exibindo o nome do usuário
          Text(
            userName,
            style: const TextStyle(color: Colors.black, fontSize: 18),
          ),
        ],
      ),
      iconTheme: const IconThemeData(color: Colors.black),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}
