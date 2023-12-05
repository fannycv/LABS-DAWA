import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reporte-peliculas',
  templateUrl: './reporte-peliculas.component.html',
  styleUrls: ['./reporte-peliculas.component.css'],
})
export class ReportePeliculasComponent implements OnInit {
  peliculas: any[] = [];
  peliculasFiltradas: any[] = [];
  generoFiltro: string = '';
  lanzamientoFiltro: number | null = null;

  constructor(private http: HttpClient) {
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    this.http.get<any[]>('./assets/peliculas.json').subscribe((data) => {
      this.peliculas = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.peliculasFiltradas = this.peliculas;

    if (this.generoFiltro) {
      this.peliculasFiltradas = this.peliculasFiltradas.filter(
        (pelicula) => pelicula.genero === this.generoFiltro
      );
    }

    if (this.lanzamientoFiltro !== null) {
      this.peliculasFiltradas = this.peliculasFiltradas.filter(
        (pelicula) => pelicula.lanzamiento === this.lanzamientoFiltro
      );
    }
  }

  generarPDF() {
    const contenido = [
      { text: 'Informe de Películas', style: 'header' },
      { text: '\n\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            ['Título', 'Género', 'Año de lanzamiento'],
            ...this.peliculasFiltradas.map((pelicula) => [
              {
                text: pelicula.titulo,
                bold: true,
                fontSize: 12,
                color: '#333',
              },
              { text: pelicula.genero, fontSize: 10, color: '#666' },
              {
                text: pelicula.lanzamiento.toString(),
                fontSize: 10,
                color: '#777',
              },
            ]),
          ],
        },
      },
    ];

    const estilos = {
      header: {
        fontSize: 18,
        bold: true,
        color: '#74C8F0',
      },
    };

    const documentDefinition = {
      content: contenido,
      styles: estilos,
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.peliculasFiltradas
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Peliculas');

    XLSX.writeFile(wb, 'peliculas.xlsx');
  }
}
