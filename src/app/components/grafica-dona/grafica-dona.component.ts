import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts/lib/base-chart.directive';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafica-dona',
  templateUrl: './grafica-dona.component.html',
  styles: []
})
export class GraficaDonaComponent implements OnInit {

  @Input() 'labels': string[];
  @Input() 'data': any[];
  @Input() 'type': any;
  @Input() 'leyenda': any;

  public doughnutChartLabels: Label[];
  public doughnutChartData: MultiDataSet;
  public doughnutChartType: ChartType;

  constructor() {
  }

  ngOnInit() {
    // console.log(this.labels);
    this.doughnutChartData = this.data;
    this.doughnutChartLabels = this.labels;
    this.doughnutChartType = this.type;
    this.leyenda = this.leyenda;
  }

}
