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
    data: [],
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
      data: [],
    }, {
      label: "巨",
      backgroundColor: 'rgb(255, 101, 1)',
      borderColor: 'rgb(255, 101, 1)',
      fill: false,
      data: [],
    }, {
      label: "横",
      backgroundColor: 'rgb(4, 78, 199)',
      borderColor: 'rgb(4, 78, 199)',
      fill: false,
      data: [],
    }, {
      label: "阪",
      backgroundColor: 'rgb(255, 255, 0)',
      borderColor: 'rgb(1, 1, 1)',
      fill: false,
      data: [],
    }, {
      label: "ヤ",
      backgroundColor: 'rgb(10, 12, 131)',
      borderColor: 'rgb(10, 12, 131)',
      fill: false,
      data: [],
    }, {
      label: "中",
      backgroundColor: 'rgb(0, 0, 172)',
      borderColor: 'rgb(0, 0, 172)',
      fill: false,
      data: [],
    }]
  };
  options: ChartOptions = {};
  chart: Chart;

  ngAfterViewInit(): void {
    const data = [
      ["", "広", "巨", "横", "阪", "ヤ", "中"],
      ['2012', 61, 86, 46, 55, 68, 75],
      ['2013', 69, 84, 64, 73, 57, 64],
      ['2014', 74, 82, 67, 75, 60, 67],
      ['2015', 69, 75, 62, 70, 76, 62],
      ['2016', 89, 71, 69, 64, 64, 58],
      ['2017', 88, 72, 73, 78, 45, 59],
      ['2018', 82, 67, 67, 62, 75, 63],
    ];

    // テーブルデータ設定
    this.swapHotData(data);
    this.updateHotSettings();

    // チャートデータ設定
    const canvas = this.myCanvas.nativeElement;
    this.drawChart(canvas);
    this.swapChartData();
  }

  swapHotData(data: any[]): void {
    const hot = this.hotRegisterer.getInstance(this.id);
    if (hot) {
      hot.loadData(data);
    }
  }

  updateHotSettings(): void {
    const hot = this.hotRegisterer.getInstance(this.id);
    if (hot) {
      hot.updateSettings({
        afterChange: (changes, source) => {
          // チャートデータリフレッシュ
          this.swapChartData();
        }
      } as Handsontable.GridSettings, false);
    }
  }

  drawChart(ctx: string | CanvasRenderingContext2D | HTMLCanvasElement | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>) {
    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: this.options
    });
  }

  swapChartData() {
    const hot = this.hotRegisterer.getInstance(this.id);
    if (hot) {
      const transpose = a => a[0].map((_, c) => a.map(r => r[c]));
      let transData: any[] = transpose(hot.getData());

      const labels = transData.shift();
      // console.log('labels', labels);

      // データリフレッシュ
      this.chart.data.datasets.forEach((dataset) => {
        const row = transData.shift();
        row.shift();
        dataset.data = row;
      });
      this.chart.update();
    }
  }
}