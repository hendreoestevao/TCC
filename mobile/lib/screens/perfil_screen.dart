import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart';
import 'package:tcc/constants.dart';
import 'package:tcc/screens/login_screen.dart';

// Gerenciador global para a imagem de perfil
ValueNotifier<File?> profileImageNotifier = ValueNotifier<File?>(null);

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String nome = '';
  String curso = '';
  String turma = 'Nenhuma turma atribuída';
  String email = '';
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  // Função para buscar os dados do aluno na API
 Future<void> fetchData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final alunoId = prefs.getString('alunoId');

    if (token == null || alunoId == null) {
      setState(() {
        isLoading = false;
      });
      return;
    }

    final url = Uri.parse('http://192.168.56.1:8080/api/alunos/$alunoId');

    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          nome = '${data['aluno']['nome']} ${data['aluno']['sobrenome']}';
          curso = data['aluno']['cursoNome'] ?? 'Curso não disponível';
          turma = data['aluno']['turmas'].isNotEmpty
              ? data['aluno']['turmas'].join(', ') // Exibe lista de turmas
              : 'Nenhuma turma atribuída';
          email = data['aluno']['email'] ?? 'Email não disponível';
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }
  // Carregar a imagem de perfil salva
  Future<void> _loadProfileImage() async {
    final prefs = await SharedPreferences.getInstance();
    final imagePath = prefs.getString('profileImagePath');
    if (imagePath != null) {
      final file = File(imagePath);
      if (await file.exists()) {
        print('Imagem carregada do path: $imagePath');
        profileImageNotifier.value = file; // Atualiza o gerenciador global
      } else {
        print('Erro: Imagem não encontrada no path: $imagePath');
      }
    } else {
      print('Nenhuma imagem de perfil salva.');
    }
  }

  // Salvar a imagem localmente
  Future<void> _saveProfileImage(File image) async {
    final prefs = await SharedPreferences.getInstance();
    final directory = await getApplicationDocumentsDirectory();
    final imagePath = join(directory.path, 'profile_image.png');

    // Salvar a imagem no caminho especificado
    final savedImage = await image.copy(imagePath);
    await prefs.setString('profileImagePath', savedImage.path);

    // Atualizar o ValueNotifier
    profileImageNotifier.value = savedImage;
    print('Imagem salva e atualizada: ${savedImage.path}');
  }

  // Alterar a imagem de perfil
  Future<void> _changeProfileImage(BuildContext context) async {
    final picker = ImagePicker();

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: const Text(
            'Escolher Imagem',
            style: TextStyle(
              color: Color(0xFF007BFF), // Azul para o título
              fontWeight: FontWeight.bold,
            ),
          ),
          content: const Text(
            'Deseja tirar uma foto ou escolher da galeria?',
            style: TextStyle(
              color: Colors.black87, // Cor de contraste para o texto
              fontSize: 16.0,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () async {
                Navigator.pop(dialogContext);
                final pickedFile =
                    await picker.pickImage(source: ImageSource.camera);
                if (pickedFile != null) {
                  final imageFile = File(pickedFile.path);
                  print('Imagem selecionada da câmera: ${pickedFile.path}');
                  await _saveProfileImage(imageFile);
                }
              },
              child: const Text(
                'Câmera',
                style: TextStyle(
                  color: Color(0xFF007BFF), // Azul para o botão
                  fontWeight: FontWeight.w600, // Negrito para destaque
                ),
              ),
            ),
            TextButton(
              onPressed: () async {
                Navigator.pop(dialogContext);
                final pickedFile =
                    await picker.pickImage(source: ImageSource.gallery);
                if (pickedFile != null) {
                  final imageFile = File(pickedFile.path);
                  print('Imagem selecionada da galeria: ${pickedFile.path}');
                  await _saveProfileImage(imageFile);
                }
              },
              child: const Text(
                'Galeria',
                style: TextStyle(
                  color: Color(0xFF007BFF), // Azul para o botão
                  fontWeight: FontWeight.w600, // Negrito para destaque
                ),
              ),
            ),
          ],
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15.0), // Arredondar os cantos
          ),
        );
      },
    );
  }

  // Função para deslogar o usuário
  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('alunoId');

    print('Usuário deslogado.');
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return isLoading
        ? const Center(child: CircularProgressIndicator())
        : Scaffold(
            body: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [kPrimaryColor.withOpacity(0.5), Colors.white],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),
                    Center(
                      child: GestureDetector(
                        onTap: () => _changeProfileImage(context),
                        child: ValueListenableBuilder<File?>(
                          valueListenable: profileImageNotifier,
                          builder: (context, file, child) {
                            print(
                                'Reconstruindo CircleAvatar com imagem: ${file?.path}');
                            return CircleAvatar(
                              radius: 60,
                              backgroundImage: file != null
                                  ? FileImage(file,
                                      scale: DateTime.now()
                                          .millisecondsSinceEpoch
                                          .toDouble())
                                  : const AssetImage(
                                          'assets/images/default_profile.png')
                                      as ImageProvider,
                              child: file == null
                                  ? const Icon(Icons.add_a_photo,
                                      size: 30, color: Colors.white)
                                  : null,
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildInfoCard(Icons.person, 'Nome', nome, context),
                    _buildInfoCard(Icons.school, 'Curso', curso, context),
                    _buildInfoCard(Icons.class_, 'Turma', turma, context),
                    _buildInfoCard(Icons.email, 'E-mail', email, context),
                    const SizedBox(height: 20),
                    Center(
                      child: ElevatedButton(
                        onPressed: () => _logout(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          padding: const EdgeInsets.symmetric(
                              vertical: 20, horizontal: 40),
                          minimumSize: const Size(200, 60),
                          textStyle: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        child: const Text(
                          'Sair',
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
  }

  Widget _buildInfoCard(
      IconData icon, String title, String value, BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(icon, size: 30, color: kPrimaryColor),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            Text(
              value,
              style: const TextStyle(fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}
