import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:table_calendar/table_calendar.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({Key? key}) : super(key: key);

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<String, List<String>> _events = {};

  final TextEditingController _eventController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    final prefs = await SharedPreferences.getInstance();
    final String? storedEvents = prefs.getString('events');
    if (storedEvents != null) {
      setState(() {
        _events = Map<String, List<String>>.from(
          Map<String, dynamic>.from(
            Map.castFrom(jsonDecode(storedEvents)),
          ).map(
            (key, value) => MapEntry(key, List<String>.from(value)),
          ),
        );
      });
    }
  }

  Future<void> _saveEvents() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('events', jsonEncode(_events));
  }

  void _addEvent(String event) {
    if (_selectedDay != null) {
      final String formattedDate = _selectedDay.toString().split(' ')[0];
      if (_events[formattedDate] == null) {
        _events[formattedDate] = [];
      }
      _events[formattedDate]?.add(event);

      _saveEvents();
      _eventController.clear();
      setState(() {});
    }
  }

  void _removeEvent(String date, String event) {
    if (_events[date] != null) {
      _events[date]?.remove(event);
      if (_events[date]?.isEmpty ?? true) {
        _events.remove(date);
      }
      _saveEvents();
      setState(() {});
    }
  }

  void _editEvent(String date, String oldEvent) {
    _eventController.text = oldEvent;
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Editar Evento', style: TextStyle(color: Color(0xFF007BFF))),
          content: TextField(
            controller: _eventController,
            decoration: const InputDecoration(
              hintText: 'Digite o evento atualizado',
              focusedBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF007BFF)),
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancelar', style: TextStyle(color: Color(0xFF007BFF))),
            ),
            TextButton(
              onPressed: () {
                if (_eventController.text.isNotEmpty) {
                  final index = _events[date]?.indexOf(oldEvent);
                  if (index != null && index >= 0) {
                    _events[date]?[index] = _eventController.text;
                    _saveEvents();
                  }
                  Navigator.pop(context);
                  _eventController.clear();
                  setState(() {});
                }
              },
              child: const Text('Atualizar', style: TextStyle(color: Color(0xFF007BFF))),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calendário Acadêmico'),
      ),
      body: Column(
        children: [
          TableCalendar(
            locale: 'pt_BR',
            firstDay: DateTime.utc(2020, 1, 1),
            lastDay: DateTime.utc(2030, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
            eventLoader: (day) {
              final String formattedDate = day.toString().split(' ')[0];
              return _events[formattedDate] ?? [];
            },
            headerStyle: const HeaderStyle(
              titleCentered: true,
              formatButtonVisible: false,
            ),
            calendarStyle: const CalendarStyle(
              selectedDecoration: BoxDecoration(
                color: Color(0xFF007BFF), // Azul para o dia selecionado
                shape: BoxShape.circle,
              ),
              todayDecoration: BoxDecoration(
                color: Color(0xFF87CEEB), // Azul claro para o dia atual
                shape: BoxShape.circle,
              ),
              defaultTextStyle: TextStyle(color: Colors.black),
              weekendTextStyle: TextStyle(color: Colors.redAccent),
            ),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: _selectedDay != null
                ? Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          'Eventos em ${_selectedDay.toString().split(' ')[0]}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16.0,
                            color: Color(0xFF007BFF), // Azul para o título dos eventos
                          ),
                        ),
                      ),
                      Expanded(
                        child: ListView.builder(
                          itemCount: _events[_selectedDay.toString().split(' ')[0]]?.length ?? 0,
                          itemBuilder: (context, index) {
                            final event = _events[_selectedDay.toString().split(' ')[0]]?[index];
                            return ListTile(
                              title: Text(
                                event ?? '',
                                style: const TextStyle(color: Color(0xFF007BFF)), // Azul para o texto do evento
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.edit, color: Color(0xFF007BFF)), // Azul para o ícone de edição
                                    onPressed: () {
                                      _editEvent(
                                          _selectedDay.toString().split(' ')[0], event ?? '');
                                    },
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.delete, color: Colors.redAccent), // Vermelho para o ícone de exclusão
                                    onPressed: () {
                                      _showDeleteConfirmationDialog(
                                          _selectedDay.toString().split(' ')[0], event ?? '');
                                    },
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  )
                : const Center(
                    child: Text(
                      'Selecione um dia para visualizar ou adicionar eventos',
                      style: TextStyle(color: Color(0xFF007BFF)), // Azul para o texto
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddEventDialog,
        backgroundColor: const Color(0xFF007BFF), // Azul para o botão flutuante
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showAddEventDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Adicionar Evento', style: TextStyle(color: Color(0xFF007BFF))),
          content: TextField(
            controller: _eventController,
            decoration: const InputDecoration(
              hintText: 'Digite o evento',
              focusedBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF007BFF)),
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancelar', style: TextStyle(color: Color(0xFF007BFF))),
            ),
            TextButton(
              onPressed: () {
                if (_eventController.text.isNotEmpty) {
                  _addEvent(_eventController.text);
                  Navigator.pop(context);
                }
              },
              child: const Text('Adicionar', style: TextStyle(color: Color(0xFF007BFF))),
            ),
          ],
        );
      },
    );
  }

  void _showDeleteConfirmationDialog(String date, String event) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Confirmar Exclusão', style: TextStyle(color: Color(0xFF007BFF))),
          content: Text('Tem certeza de que deseja excluir o evento "$event"?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancelar', style: TextStyle(color: Color(0xFF007BFF))),
            ),
            TextButton(
              onPressed: () {
                _removeEvent(date, event);
                Navigator.pop(context);
              },
              child: const Text('Excluir', style: TextStyle(color: Color(0xFF007BFF))),
            ),
          ],
        );
      },
    );
  }
}
