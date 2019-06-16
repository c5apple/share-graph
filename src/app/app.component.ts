import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  private hotRegisterer = new HotTableRegisterer();

  id = 'my-custom-id';

  hotSettings: Handsontable.GridSettings = {
    data: [
      ["", "広", "巨", "横", "阪", "ヤ", "中"],
      ['2012', 61, 86, 46, 55, 68, 75],
      ['2013', 69, 84, 64, 73, 57, 64],
      ['2014', 74, 82, 67, 75, 60, 67],
      ['2015', 69, 75, 62, 70, 76, 62],
      ['2016', 89, 71, 69, 64, 64, 58],
      ['2017', 88, 72, 73, 78, 45, 59],
      ['2018', 82, 67, 67, 62, 75, 63],
    ],
    colHeaders: true,
    rowHeaders: true,
    stretchH: 'all',
    contextMenu: true,
    fillHandle: false,
    manualColumnResize: true,
    manualRowResize: true
  };

  @ViewChild('myCanvas') myCanvas: ElementRef;

  type: ChartType | string = 'line';
  data: ChartData = {
    labels: ["2012", "2013", "2014", "2015", "2016", "2017", "2018"],
    datasets: [{
      label: "広",
      backgroundColor: 'rgb(254, 0, 2)',
      borderColor: 'rgb(254, 0, 2)',
      fill: false,
      data: [61, 69, 74, 69, 89, 88, 82],
    }, {
      label: "巨",
      backgroundColor: 'rgb(255, 101, 1)',
      borderColor: 'rgb(255, 101, 1)',
      fill: false,
      data: [86, 84, 82, 75, 71, 72, 67],
    }, {
      label: "横",
      backgroundColor: 'rgb(4, 78, 199)',
      borderColor: 'rgb(4, 78, 199)',
      fill: false,
      data: [46, 64, 67, 62, 69, 73, 67],
    }, {
      label: "阪",
      backgroundColor: 'rgb(255, 255, 0)',
      borderColor: 'rgb(1, 1, 1)',
      fill: false,
      data: [55, 73, 75, 70, 64, 78, 62],
    }, {
      label: "ヤ",
      backgroundColor: 'rgb(10, 12, 131)',
      borderColor: 'rgb(10, 12, 131)',
      fill: false,
      data: [68, 57, 60, 76, 64, 45, 75],
    }, {
      label: "中",
      backgroundColor: 'rgb(0, 0, 172)',
      borderColor: 'rgb(0, 0, 172)',
      fill: false,
      data: [75, 64, 67, 62, 58, 59, 63],
    }]
  };
  options: ChartOptions = {};
  chart: Chart;

  ngAfterViewInit(): void {
    const canvas = this.myCanvas.nativeElement;
    this.drawChart(canvas);
  }

  drawChart(ctx: string | CanvasRenderingContext2D | HTMLCanvasElement | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>) {
    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: this.options
    });
  }
}