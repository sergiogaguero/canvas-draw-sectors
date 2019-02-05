import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'section-drawing',
  templateUrl: './section-drawing.component.html',
})
export class SectionDrawingComponent implements AfterViewInit {

  private poligonoActual;

  constructor() {
  }

  // a reference to the canvas element from our template
  @ViewChild('miCanvas') public canvas: ElementRef;

  // setting a width and height for the canvas
  @Input() poligonos: any[] = [];
  @Input() width = 400;
  @Input() height = 400;
  @Input() snap = 20;
  @Input() colores = [{ r: 200, g: 50, b: 50 }, { r: 150, g: 90, b: 30 }, { r: 150, g: 50, b: 200 }, { r: 250, g: 250, b: 50 }];
  @Input() tolerance = 10;
  @Input() action;

  colorPoligonos = { r: 255, g: 0, b: 0 };
  colorPoligonoActual = { r: 0, g: 0, b: 255 };

  private cx: CanvasRenderingContext2D;

  sizeRect: number = 8;

  //tolerancia de piexeles de distancias a buscar al hacer mouse downd

  //indice del punto seleccionado
  puntoSelected: number;

  ajustando: boolean = false;

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    canvasEl.addEventListener('mousedown', e => {
      const rect = canvasEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      switch (this.action) {
        case 'editar':
          if (this.searchPoint(this.tolerance, e)) {
            canvasEl.addEventListener('mousemove', e => {
              if (this.ajustando) {
                this.ajustarPunto(e);
              }
            })
          }
          break;
        case 'borrar':
          if (this.searchPoint(this.sizeRect / 2, e)) {
            this.eliminarPunto(this.puntoSelected);
          }
          break;
        case 'seleccionar':
          this.poligonoActual = this.poligonos[this.buscarPuntoMasCercano(e)];
          this.drawOnCanvas();
          break;
        // case 'mover':
        //   canvasEl.addEventListener('mousemove', e => {
        //     const clickXMov = e.clientX - rect.left;
        //     const clickYMov = e.clientY - rect.top;
        //     this.poligonoActual.ptos.forEach(punto => {
        //       console.log(clickXMov - clickX + punto.x);
        //       punto.x = this.snapToGrid(clickXMov - clickX + punto.x, this.snap);
        //       punto.y = this.snapToGrid(clickYMov - clickY + punto.y, this.snap);
        //     });
        //     this.drawOnCanvas();
        //   })
        //   break;
        default:
          break;
      }
      // if (this.action == 'editar' && this.searchPoint(this.tolerance, e)) {
      //   canvasEl.addEventListener('mousemove', (e) => {
      //     if (this.ajustando) {
      //       this.ajustarPunto(e);
      //     }
      //   })
      // }
    })

    canvasEl.addEventListener('mouseup', e => {
      canvasEl.removeEventListener('mousemove', function () { });

      switch (this.action) {
        case 'editar':
          if (!this.ajustando) {
            let lineaCercana = this.buscarLineaCerca(e);
            if (lineaCercana == -1) {
              this.agregarPuntoPoligono(e);
            } else {
              const rect = canvasEl.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const clickY = e.clientY - rect.top;
              this.crearPuntoNuevo(this.snapToGrid(clickX, this.snap), this.snapToGrid(clickY, this.snap), lineaCercana);
            }
          }
          break;
        default:
          break;
      }

      this.ajustando = false;
    })
  }

  borrarPunto() {
    this.action = 'borrar';
  }

  seleccionarPoligono() {
    this.action = 'seleccionar';
  }

  eliminarPunto(i: number) {
    this.poligonoActual.ptos.splice(i, 1);

    this.drawOnCanvas();
  }

  crearPuntoNuevo(x: number, y: number, i: number) {
    //INMUTABLE
    // let poli: any[] = this.poligonoActual.ptos;
    // poli = this.poligonoActual.ptos.slice(0, i + 1);
    // poli.push({ x: x, y: y });
    // poli.push(...this.poligonoActual.ptos.slice(i + 1, this.poligonoActual.ptos.length));

    // this.poligonoActual.ptos = poli;

    //MUTABLE
    this.poligonoActual.ptos.splice(i + 1, 0, { x: x, y: y });

    this.drawOnCanvas();
  }

  buscarLineaCerca(e: MouseEvent): number {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (this.poligonoActual) {
      let poli: any[] = this.poligonoActual.ptos;

      if (poli.length > 2) {
        for (var i = 0; i < poli.length - 1; i++) {

          let diffPto1X = Math.abs(poli[i].x - clickX);
          let diffPto1Y = Math.abs(poli[i].y - clickY);

          let diffPto2X = Math.abs(poli[i + 1].x - clickX);
          let diffPto2Y = Math.abs(poli[i + 1].y - clickY);

          let diffX = Math.abs(poli[i].x - poli[i + 1].x);
          let diffY = Math.abs(poli[i].y - poli[i + 1].y);

          let distPtos = Math.hypot(diffX, diffY);
          let distPto1 = Math.hypot(diffPto1X, diffPto1Y);
          let distPto2 = Math.hypot(diffPto2X, diffPto2Y);

          if (Math.abs(distPtos - (distPto1 + distPto2)) < 10) {
            return i;
          }
        }

        //Procesa ultimo registro
        let diffPto1X = Math.abs(poli[i].x - clickX);
        let diffPto1Y = Math.abs(poli[i].y - clickY);

        let diffPto2X = Math.abs(poli[0].x - clickX);
        let diffPto2Y = Math.abs(poli[0].y - clickY);

        let diffX = Math.abs(poli[i].x - poli[0].x);
        let diffY = Math.abs(poli[i].y - poli[0].y);

        let distPtos = Math.hypot(diffX, diffY);
        let distPto1 = Math.hypot(diffPto1X, diffPto1Y);
        let distPto2 = Math.hypot(diffPto2X, diffPto2Y);

        if (Math.abs(distPtos - (distPto1 + distPto2)) < 10) {
          return i;
        }
      }
    }
    return -1;
  }

  ajustarPunto(e: MouseEvent) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // console.log("x:", clickX, "y:", clickY);
    // console.log("xSnap:", this.snapToGrid(clickX, 5), "ySnap:", this.snapToGrid(clickY, 5));

    this.poligonoActual.ptos[this.puntoSelected].x = this.snapToGrid(clickX, this.snap);
    this.poligonoActual.ptos[this.puntoSelected].y = this.snapToGrid(clickY, this.snap);
    this.drawOnCanvas();
  }

  buscarPuntoMasCercano(e: MouseEvent) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    let dist = 0;
    let poligonoMasCercano: number = -1;

    this.poligonos.forEach((poligono, index) => {
      poligono.ptos.forEach(punto => {
        const distAux = Math.hypot(Math.abs(punto.x - clickX), Math.abs(punto.y - clickY));
        if (dist == 0 || distAux < dist) {
          dist = distAux;
          poligonoMasCercano = index;
        }
      });
    });

    return poligonoMasCercano;
  }

  searchPoint(tolerancia: number, e: MouseEvent): boolean {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    if (this.poligonoActual) {
      for (var i = 0; i < this.poligonoActual.ptos.length; i++) {

        let difX = this.poligonoActual.ptos[i].x - (e.clientX - rect.left);
        let difY = this.poligonoActual.ptos[i].y - (e.clientY - rect.top);

        if (Math.abs(difX) < tolerancia && Math.abs(difY) < tolerancia) {

          //encontro punto
          this.ajustando = true;
          this.puntoSelected = i;
          return true;
        }
      }
    }
    return false;
  }

  agregarPuntoPoligono(e: MouseEvent) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pos = {
      x: this.snapToGrid(clickX, this.snap),
      y: this.snapToGrid(clickY, this.snap)
    };

    this.poligonoActual.ptos.push(pos);
    this.drawOnCanvas();
  }

  drawGrid() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    this.cx.lineWidth = 1;
    this.cx.strokeStyle = 'rgba(0,0,0,0.1)';

    if (!this.cx) { return; }
    this.cx.setLineDash([5, 5]);

    for (let i = this.snap; i < canvasEl.width; i += this.snap) {
      this.cx.moveTo(i, 0);
      this.cx.lineTo(i, canvasEl.width);
    }

    for (let j = this.snap; j < canvasEl.height; j += this.snap) {
      this.cx.moveTo(0, j);
      this.cx.lineTo(canvasEl.height, j);
    }

    this.cx.stroke();
  }

  drawOnCanvas() {
    if (!this.cx) { return; }

    this.cx.canvas.width = this.cx.canvas.width; // borra el canvas

    this.cx.lineWidth = 2;
    this.cx.lineCap = 'round';

    this.poligonos.forEach(pol => {
      if (pol === this.poligonoActual) {
        this.cx.strokeStyle = `rgba(${this.colorPoligonoActual.r},${this.colorPoligonoActual.g + 10},${this.colorPoligonoActual.b},1)`;
        this.cx.fillStyle = `rgba(${this.colorPoligonoActual.r},${this.colorPoligonoActual.g},${this.colorPoligonoActual.b},0.5)`;
      } else {
        this.cx.strokeStyle = `rgba(${this.colorPoligonos.r},${this.colorPoligonos.g + 10},${this.colorPoligonos.b},1)`;
        this.cx.fillStyle = `rgba(${this.colorPoligonos.r},${this.colorPoligonos.g},${this.colorPoligonos.b},0.5)`;
      }

      if (pol.ptos.length) {
        this.cx.beginPath();
        this.cx.moveTo(pol.ptos[0].x, pol.ptos[0].y);
        for (var i = 1; i < pol.ptos.length; i++) {
          this.cx.lineTo(pol.ptos[i].x, pol.ptos[i].y);
        }
        this.cx.lineTo(pol.ptos[0].x, pol.ptos[0].y);

        this.cx.fill();
        this.cx.stroke();
        this.cx.closePath();
      }
    });

    if (this.poligonoActual) {
      this.poligonoActual.ptos.forEach(punto => {
        this.cx.strokeStyle = `rgba(${this.colorPoligonoActual.r},${this.colorPoligonoActual.g + 10},${this.colorPoligonoActual.b},1)`;
        this.cx.fillStyle = `rgba(${this.colorPoligonoActual.r},${this.colorPoligonoActual.g},${this.colorPoligonoActual.b},0.5)`;
        this.cx.beginPath();
        this.cx.rect(punto.x - (this.sizeRect / 2), punto.y - (this.sizeRect / 2), this.sizeRect, this.sizeRect);
        this.cx.stroke();
        this.cx.closePath();
      });
    }
    this.drawGrid();
  }

  existenColisiones() {
    const data = this.cx.getImageData(0, 0, this.width, this.height).data;

    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (data[(y * this.width + x) * 4 + 0] != 0 && data[(y * this.width + x) * 4 + 2] != 0 && data[(y * this.width + x) * 4 + 1] == 0) {
          return true;
        }
      }
    }
    return false;
  }

  mostrarPoligonos() {
    this.action = '';
    if (!this.cx) { return; }

    this.cx.canvas.width = this.cx.canvas.width; // borra el canvas

    this.cx.lineWidth = 2;
    this.cx.lineCap = 'round';

    this.poligonos.forEach((pol, index) => {
      this.cx.strokeStyle = `rgba(${this.colores[index % this.colores.length].r},${this.colores[index % this.colores.length].g},${this.colores[index % this.colores.length].b},1)`;
      this.cx.fillStyle = `rgba(${this.colores[index % this.colores.length].r},${this.colores[index % this.colores.length].g},${this.colores[index % this.colores.length].b},0.5)`;
      if (pol.ptos.length) {
        this.cx.beginPath();
        this.cx.moveTo(pol.ptos[0].x, pol.ptos[0].y);
        for (var i = 1; i < pol.ptos.length; i++) {
          this.cx.lineTo(pol.ptos[i].x, pol.ptos[i].y);
        }
        this.cx.lineTo(pol.ptos[0].x, pol.ptos[0].y);

        this.cx.fill();
        this.cx.stroke();
        this.cx.closePath();
      }
    });
  }

  editarPoligono() {
    if (this.poligonoActual && this.poligonoActual.ptos.length > 0) {
      this.action = 'editar';
    }
    this.drawOnCanvas();
  }

  crearPoligono(ptos: Array<{ x: number, y: number }>) {
    return { ptos: ptos };
  }

  private nuevoPoligono() {
    this.action = 'editar';
    this.editarPoligono();
    if (!this.existenColisiones()) {
      if ((this.poligonoActual && this.poligonoActual.ptos.length > 2) || this.poligonos.length == 0) {
        this.poligonoActual = this.crearPoligono([]);
        this.poligonos.push(this.poligonoActual);
      }
    }
    this.drawOnCanvas();
  }

  snapToGrid(v: number, dist: number) {
    const divEntera = Math.floor(v / dist) * dist;
    const resto = v % dist;
    const snap = Math.floor(dist / 2);

    if (resto > snap) {
      return divEntera + dist;
    } else {
      return divEntera;
    }
  }

  ///////////////////////////////////////////

  retornarPoligonoActual() {
    return this.poligonoActual;
  }

  seleccionarPoligonoID(id: number) {
    const pol = this.poligonos.filter((pa) => {
      return pa.id == id;
    })[0];

    console.log(pol, this.poligonos);
    if (pol) {
      this.poligonoActual = pol;
      this.drawOnCanvas();
    };
  }

  setPoligonoID(id: number) {
    this.poligonoActual.id = id;
  }
}