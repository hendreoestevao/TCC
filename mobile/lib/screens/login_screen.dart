import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tcc/services/save_student.dart';
import 'home_screen.dart';
import 'signup_screen.dart';
import '../components/page_title_bar.dart';
import '../components/under_part.dart';
import '../components/upside.dart';
import '../constants.dart';
import '../widgets/rounded_button.dart';
import '../widgets/rounded_input_field.dart';
import '../widgets/rounded_password_field.dart';
import 'package:http/http.dart' as http;

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _raController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  bool isLoading = false;
  bool _stayLoggedIn = false; // Estado do checkbox

  @override
  void initState() {
    super.initState();
    _checkLoginStatus(); // Verifica se o usuário optou por "Permanecer Logado"
  }

  Future<void> _checkLoginStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final stayLoggedIn = prefs.getBool('stayLoggedIn') ?? false;
    final token = prefs.getString('token');

    if (stayLoggedIn && token != null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
      );
    }
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final ra = _raController.text.trim();
    final senha = _passwordController.text.trim();

    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('http://192.168.56.1:8080/api/alunos/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'ra': ra, 'senha': senha}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();

        await prefs.setString('token', data['token']);
        await prefs.setString('alunoId', data['alunoId']);
        await prefs.setBool(
            'stayLoggedIn', _stayLoggedIn); // Salva a preferência

        _showSnackBar('Login realizado com sucesso!', Colors.green);

        fetchData();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomeScreen()),
        );
      } else {
        _showSnackBar('Credenciais inválidas', Colors.red);
      }
    } catch (e) {
      _showSnackBar('Erro ao realizar login', Colors.red);
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> fetchData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final alunoId = prefs.getString('alunoId');

    if (token == null || alunoId == null) {
      print('Token ou AlunoID não encontrado.');
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
        print(data);
        final aluno = data['aluno'];
        final notasEFaltas = data['notasEFaltas'];

        await prefs.setString('nome', aluno['nome'] ?? 'N/A');
        await prefs.setString('sobrenome', aluno['sobrenome'] ?? 'N/A');
        await prefs.setString('email', aluno['email'] ?? 'N/A');
        await prefs.setString('cursoNome', aluno['cursoNome'] ?? 'N/A');

        List<Map<String, dynamic>> disciplinas = [];
        for (var item in notasEFaltas) {
          final disciplina = item['disciplina'];
          disciplinas.add({
            'disciplinaId': disciplina['id'],
            'nome': disciplina['nome'],
            'nota': item['nota'],
            'faltas': item['faltas'],
          });
        }

        await prefs.setString('notasEFaltas', jsonEncode(disciplinas));
      } else {
        print('Erro na requisição: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao fazer a requisição: $e');
    }
  }

  void _showSnackBar(String message, Color color) {
    final snackBar = SnackBar(
      content: Text(message, style: const TextStyle(color: Colors.white)),
      backgroundColor: color,
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SafeArea(
      child: Scaffold(
        body: SizedBox(
          width: size.width,
          height: size.height,
          child: SingleChildScrollView(
            child: Stack(
              children: [
                const Upside(imgUrl: "assets/images/login.png"),
                const PageTitleBar(title: 'Faça login na sua conta'),
                Padding(
                  padding: const EdgeInsets.only(top: 320.0),
                  child: Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(50),
                        topRight: Radius.circular(50),
                      ),
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const SizedBox(height: 15),
                          const Text(
                            "Use seu RA e senha",
                            style: TextStyle(
                              color: Colors.grey,
                              fontFamily: 'OpenSans',
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            child: Column(
                              children: [
                                TextFormField(
                                  controller: _raController,
                                  keyboardType: TextInputType.number,
                                  decoration: const InputDecoration(
                                    labelText: 'RA',
                                    prefixIcon: Icon(Icons.person),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'Por favor, insira seu RA.';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 15),
                                TextFormField(
                                  controller: _passwordController,
                                  obscureText: true,
                                  decoration: const InputDecoration(
                                    labelText: 'Senha',
                                    prefixIcon: Icon(Icons.lock),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'Por favor, insira sua senha.';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 15),
                                Row(
                                  children: [
                                    Checkbox(
                                      value: _stayLoggedIn,
                                      activeColor: const Color(
                                          0xFF007BFF), // Cor azul no Checkbox
                                      onChanged: (value) {
                                        setState(() {
                                          _stayLoggedIn = value!;
                                        });
                                      },
                                    ),
                                    const Text("Permanecer logado"),
                                  ],
                                ),
                                RoundedButton(
                                  text: isLoading ? 'CARREGANDO...' : 'Entrar',
                                  press: isLoading ? null : _login,
                                ),
                                const SizedBox(height: 10),
                                UnderPart(
                                  title: "Esqueceu sua senha?",
                                  navigatorText: "Contate-nos",
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) =>
                                              const RecoverPasswordScreen()),
                                    );
                                  },
                                ),
                                const SizedBox(height: 20),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
