import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public teacherId!: number;
  public studentId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Acessa os parâmetros da URL
    this.teacherId = Number(this.route.snapshot.paramMap.get('teacherId'));
    this.studentId = Number(this.route.snapshot.paramMap.get('studentId'));
  }
}
