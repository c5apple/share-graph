import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotTableRegisterer } from '@handsontable/angular';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {

  private sub: any;

  /** グラフID */
  private graphId: string;

  constructor(private route: ActivatedRoute) { }

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
    labels: [],
    datasets: [{
      backgroundColor: 'rgb(254, 0, 2)',
      borderColor: 'rgb(254, 0, 2)',
      fill: false,
    }, {
      backgroundColor: 'rgb(255, 101, 1)',
      borderColor: 'rgb(255, 101, 1)',
      fill: false,
    }, {
      backgroundColor: 'rgb(4, 78, 199)',
      borderColor: 'rgb(4, 78, 199)',
      fill: false,
    }, {
      backgroundColor: 'rgb(255, 255, 0)',
      borderColor: 'rgb(1, 1, 1)',
      fill: false,
    }, {
      backgroundColor: 'rgb(10, 12, 131)',
      borderColor: 'rgb(10, 12, 131)',
      fill: false,
    }, {
      backgroundColor: 'rgb(0, 0, 172)',
      borderColor: 'rgb(0, 0, 172)',
      fill: false,
    }]
  };
  options: ChartOptions = {};
  chart: Chart;

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params: { graphId: string }) => {
      this.graphId = params.graphId;
    });
  }

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

  ngOnDestroy() {
    this.sub.unsubscribe();
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

      // ラベルリフレッシュ
      const labels = transData.shift();
      labels.shift();
      this.chart.data.labels = labels;

      // データリフレッシュ
      this.chart.data.datasets.forEach((dataset) => {
        const row = transData.shift();
        const label = row.shift();

        dataset.label = label;
        dataset.data = row;
      });
      this.chart.update();
    }
  }
}
