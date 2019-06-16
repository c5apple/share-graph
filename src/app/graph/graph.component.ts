import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotTableRegisterer } from '@handsontable/angular';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import * as Chart from 'chart.js';
import 'chartjs-plugin-colorschemes';

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
    contextMenu: {
      callback: (key, options) => {
        this.swapChartData();
      },
      items: {
        'row_above': {

        },
        'row_below': {

        },
        'sep1': { name: '---------' },
        'col_left': {
          callback: (key, selection, clickEvent) => {
            // 列追加
            this.hotRegisterer.getInstance(this.id).alter('insert_col', selection[0].start.col);
            this.chart.data.datasets.push({
              fill: false
            });
          }
        },
        'col_right': {
          callback: (key, selection, clickEvent) => {
            // 列追加
            this.hotRegisterer.getInstance(this.id).alter('insert_col', selection[0].start.col + 1);
            this.chart.data.datasets.push({
              fill: false
            });
          }
        },
        'sep2': { name: '---------' },
        'remove_row': {
          disabled: () => {
            return (this.hotRegisterer.getInstance(this.id).getSelectedLast()[0] === 0
              || this.hotRegisterer.getInstance(this.id).getSelectedLast()[2] === 0);
          },
        },
        'remove_col': {
          callback: (key, selection, clickEvent) => {
            // 列追加
            this.hotRegisterer.getInstance(this.id).alter('remove_col', selection[0].start.col);
            this.chart.data.datasets.splice(selection[0].start.col - 1, 1);
          },
          disabled: () => {
            return (this.hotRegisterer.getInstance(this.id).getSelectedLast()[1] === 0
              || this.hotRegisterer.getInstance(this.id).getSelectedLast()[3] === 0);
          }
        },
        'sep3': { name: '---------' },
        // 'undo': {
        //   // TODO 列追加後エラーになる
        // },
        // 'redo': {

        // },
        // 'sep4': { name: '---------' },
        'copy': {

        },
        'cut': {

        }
      }
    } as Handsontable.contextMenu.Settings,
    undo: false,
    fillHandle: false,
    manualColumnResize: true,
    manualRowResize: true
  };

  @ViewChild('myCanvas') myCanvas: ElementRef;

  type: ChartType | string = 'line';
  data: ChartData = {
    labels: [],
    datasets: []
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
    const hot = this.hotRegisterer.getInstance(this.id);
    if (hot) {
      const l = hot.countCols() - 1;
      for (var i = 0; i < l; i++) {
        this.data.datasets.push({
          fill: false
        });
      }
      this.chart = new Chart(ctx, {
        type: this.type,
        data: this.data,
        options: this.options
      });
    }
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
