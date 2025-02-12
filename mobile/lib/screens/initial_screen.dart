import 'package:flutter/material.dart';
import 'package:tcc/constants.dart';
import 'package:webview_flutter/webview_flutter.dart';

class Constants {
  static const Color primaryColor = Color(0xFF1bb274);
  static const Color blackColor = Colors.black;
}

class InitialScreen extends StatefulWidget {
  const InitialScreen({Key? key}) : super(key: key);

  @override
  State<InitialScreen> createState() => _InitialScreenState();
}

class _InitialScreenState extends State<InitialScreen> {
  late Size size;

  // Lista de URLs de imagens para o carrossel
  List<String> _carouselImages = [
    'https://www.alfaumuarama.edu.br/downloads/banner/1718395532_1.jpg',
    'https://www.alfaumuarama.edu.br/downloads/banner/1732535621_1.jpg',
    'https://www.alfaumuarama.edu.br/downloads/banner/1713567262_1.jpg',
  ];

  // Lista de artigos ou notícias
  List<Map<String, String>> _articles = [
    {
      'title': 'Com IGC 4, UniAlfa de Umuarama é a 3ª melhor instituição privada do Paraná',
      'description': 'O Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (Inep) divulgou no dia 2 de abril os resultados',
      'url': 'https://www.alfaumuarama.edu.br/fau/noticia/243/com-igc-4-unialfa-de-umuarama-e-a-3-melhor-instituicao-privada-do-parana',
    },
    {
      'title': 'Resultados e Ações da Comissão Própria de Avaliação da Faculdade ALFA Umuarama – UniALFA',
      'description': 'Ana Paula O. Becker Alvarenga - Coordenadora da CPA UniALFA',
      'url': 'https://www.alfaumuarama.edu.br/fau/noticia/241/resultados-e-acoes-da-comissao-propria-de-avaliacao-da-faculdade-alfa-umuarama-%E2%80%93-unialfa',
    },
    {
      'title': 'Seleção do Programa Institucional de Iniciação Científica 2024',
      'description': 'Inscrições de 01/08/2023 até 31/08/2023',
      'url': 'https://www.alfaumuarama.edu.br/fau/noticia/242/selecao-do-programa-institucional-de-iniciacao-cientifica-2024',
    },
    {
      'title': 'Sobre a Faculdade ALFA Umuarama - UniALFA',
      'description': 'História da Faculdade ALFA Umuarama - UniALFA',
      'url': 'https://www.alfaumuarama.edu.br/fau/sobre',
    },
    {
      'title': 'Pós UniALFA - Cursos de Pós-Graduação',
      'description': 'MBA em Gestão de Instituições Financeiras e Cooperativas de Crédito · MBA em Liderança e Gestão Estratégica de Pessoas',
      'url': 'https://pos.alfaumuarama.edu.br/',
    },
  ];

  // Lista de atividades
  List<Map<String, String>> _activities = [
    {
      'title': 'Workshop de Programação',
      'description': 'Aprenda sobre as últimas tendências em desenvolvimento.',
      'url': 'https://www.alfaumuarama.edu.br/atividades/workshop-programacao',
    },
    {
      'title': 'Feira de Ciências 2024',
      'description': 'Mostre seus projetos e inovações científicas.',
      'url': 'https://www.alfaumuarama.edu.br/atividades/feira-ciencias',
    },
    {
      'title': 'Seminário de Empreendedorismo',
      'description': 'Descubra como transformar ideias em negócios.',
      'url': 'https://www.alfaumuarama.edu.br/atividades/seminario-empreendedorismo',
    },
  ];

  List<Map<String, String>> filteredArticles = [];
  List<Map<String, String>> filteredActivities = [];
  TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    filteredArticles = _articles;
    filteredActivities = _activities;
  }

  // Função para filtrar os artigos e atividades
  void filterSearch(String query) {
    setState(() {
      filteredArticles = _articles
          .where((article) =>
              article['title']!.toLowerCase().contains(query.toLowerCase()))
          .toList();
      filteredActivities = _activities
          .where((activity) =>
              activity['title']!.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    size = MediaQuery.of(context).size;

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSearchBar(), // Adicionado barra de pesquisa
            _buildFeaturedNews(),
            _buildCarousel(),
            _buildNewArticles(),
            _buildActivities(),
          ],
        ),
      ),
    );
  }

  // Widget para a barra de pesquisa
  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: TextField(
        controller: searchController,
        onChanged: filterSearch,
        decoration: InputDecoration(
          hintText: 'Pesquisar...',
          prefixIcon: const Icon(Icons.search),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20.0),
          ),
        ),
      ),
    );
  }

  // Widget para as notícias em destaque
  Widget _buildFeaturedNews() {
    return Container(
      padding: const EdgeInsets.only(left: 16, bottom: 20, top: 20),
      child: const Text(
        'Notícias em Destaque',
        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18.0),
      ),
    );
  }

  // Widget para o carrossel de imagens
  Widget _buildCarousel() {
    return Container(
      height: 150,
      child: PageView.builder(
        itemCount: _carouselImages.length,
        itemBuilder: (BuildContext context, int index) {
          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 8.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              image: DecorationImage(
                image: NetworkImage(_carouselImages[index]),
                fit: BoxFit.cover,
              ),
            ),
          );
        },
      ),
    );
  }

  // Widget para exibir os artigos ou notícias
  Widget _buildNewArticles() {
    return Container(
      padding: const EdgeInsets.only(left: 16, bottom: 20, top: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: filteredArticles.map((article) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => WebViewScreen(url: article['url']!),
                  ),
                );
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article['title']!,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16.0,
                      color: kPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    article['description']!,
                    style: const TextStyle(
                      fontSize: 14.0,
                      color: Colors.black54,
                    ),
                  ),
                  const Divider(color: Colors.black26),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // Widget para exibir as atividades
  Widget _buildActivities() {
    return Container(
      padding: const EdgeInsets.only(left: 16, bottom: 20, top: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Atividades',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18.0),
          ),
          const SizedBox(height: 10),
          ...filteredActivities.map((activity) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => WebViewScreen(url: activity['url']!),
                    ),
                  );
                },
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      activity['title']!,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16.0,
                        color: kPrimaryColor,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      activity['description']!,
                      style: const TextStyle(
                        fontSize: 14.0,
                        color: Colors.black54,
                      ),
                    ),
                    const Divider(color: Colors.black26),
                  ],
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}

// WebView para exibir conteúdo dos artigos ou atividades
class WebViewScreen extends StatefulWidget {
  final String url;

  const WebViewScreen({Key? key, required this.url}) : super(key: key);

  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController();
    _controller.loadRequest(Uri.parse(widget.url)); // Carrega a URL no WebView
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detalhes')),
      body: WebViewWidget(controller: _controller), // Exibe o WebView
    );
  }
}
