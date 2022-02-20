import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
import {dataSeries} from "./data-series";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FinanceRecord} from "../web-api";
import {AppService} from "../app.service";
import { FinanceMonthPlan } from '../models/financeMonthPlan.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private financeRecords: FinanceRecord[] = [];
  public monthPlan!: FinanceMonthPlan[];

  ngOnInit(): void {
    this.monthlyPlanForm = new FormGroup({
      amount: new FormControl(100, [
        Validators.required,
      ]),
    });

    this.addRecordForm = new FormGroup({
      amount: new FormControl("", [
        Validators.required,
        Validators.min(0)
      ]),
      type: new FormControl(1, [
        Validators.required
      ])
    });

    this.updateForm = new FormGroup({
      type: new FormControl(1, [
        Validators.required
      ])
    });

    this.getMonthPlan();
    this.getFinanceRecords();
  }

  public monthlyPlanForm!: FormGroup;
  public addRecordForm!: FormGroup;
  public updateForm!: FormGroup;

  public seriesconsumption!: any;
  public seriesIncome!: any;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public titleIncome!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  public lastUpdatedTime: number = Date.now();

  public summIncome: number = 0;
  public summconsumption: number = 0;


  constructor(
    private http: HttpClient,
    public app: AppService
  ) {
  }

  private inicializeIncome(){
    let dates: (number | Date | undefined)[][] = [];

    this.financeRecords.forEach(financeRecord => {

      if (financeRecord.type == 0){
        if(financeRecord.createdDate) dates.push([financeRecord.createdDate, financeRecord.amount]);
      }
    })

    this.seriesIncome = [
      {
        name: "USD",
        data: dates
      }
    ];

    this.titleIncome = {
      text: "Income chart",
      align: "left"
    };
  }

  public initChartData(): void {

    this.inicializeIncome();
    let dates: (number | Date | undefined)[][] = [];

    this.financeRecords.forEach(financeRecord => {

      if (financeRecord.type == 1){
        if(financeRecord.createdDate) dates.push([financeRecord.createdDate, financeRecord.amount]);
      }
    })

    this.seriesconsumption = [
      {
        name: "USD",
        data: dates
      }
    ];

    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: true
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Сonsumption chart",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val).toFixed(0); // return (val / 1000000).toFixed(0);
        }
      },
      title: {
        text: "Money"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val).toFixed(0); // return (val / 1000000).toFixed(0);
        }
      }
    };
  }

  addRecord() {
    this.http.post<any>(environment.apiUrl + '/api/FinanceRecord/create', this.addRecordForm.value).subscribe(response =>{
      this.app.isQuery = false;
      this.getFinanceRecords();
    })
  }

  updateMonthlyPlanForm() {

  }

  private processIncomeAndСonsumption() {
    let summIncome = 0;
    let summconsumption = 0;
    this.financeRecords.forEach(financeRecord =>{
      if (financeRecord.amount){
        if (financeRecord.type == 0){
          summIncome += financeRecord.amount;
        }
        else if (financeRecord.type == 1){
          summconsumption += financeRecord.amount;
        }
      }
    });
    this.summIncome = summIncome;
    this.summconsumption = summconsumption;
  }

  public getFinanceRecords(){
    let link = "getAllByUser";
    if(this.updateForm.value.type == 1) link = "getLastMonthByUser";
    this.http.get<FinanceRecord[]>(environment.apiUrl + '/api/FinanceRecord/' + link).subscribe(response =>{
      console.log(response)
      // @ts-ignore
      this.financeRecords = response;
      // this.financeRecords = response;
      this.initChartData();
      this.processIncomeAndСonsumption();
      this.app.isQuery = false;
      this.lastUpdatedTime = Date.now();
    })
  }

  public createMonthPlan(){
    this.http.post<FinanceMonthPlan[]>(environment.apiUrl + '/api/FinanceMonthPlan/create', this.monthlyPlanForm.value).subscribe(response => {
      console.log("createMonthPlan: ", response);
      this.app.isQuery = false;
      this.getMonthPlan();
    });
  }

  public getMonthPlan(){
    let link = "getAllByUser";
    if(this.updateForm.value.type == 1) link = "getLastMonthByUser";
    this.http.get<FinanceMonthPlan[]>(environment.apiUrl + '/api/FinanceMonthPlan/' + link).subscribe(response => {
      this.monthPlan = response;
      console.log("getMonthPlan: ", response);
      if (response && response.length != 0) this.monthlyPlanForm.controls['amount'].setValue(response[response.length - 1].amount);
      this.app.isQuery = false;
    });
  }

  public updateAll(){
    this.getMonthPlan();
    this.getFinanceRecords();
  }
}
