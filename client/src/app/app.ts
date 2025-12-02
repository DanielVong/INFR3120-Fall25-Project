import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./partials/header/header";
import { Footer } from "./partials/footer/footer";
import { MainNav } from "./partials/main-nav/main-nav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MainNav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MovieTheater');
}
