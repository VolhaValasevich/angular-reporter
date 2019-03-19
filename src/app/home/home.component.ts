import { Component, OnInit } from '@angular/core';
import { HttpService } from './home.service';
import { TestElement } from './testElement';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HttpService]
})
export class HomeComponent implements OnInit {

  constructor(private httpService: HttpService) { }
  tests: TestElement[] = [];
  outputData: TestElement[];
  passed: number = 0;
  failed: number = 0;
  skipped: number = 0;
  featureNum: number = 0;
  scenarioNum: number = 0;
  stepNum: number = 0;
  totalDuration: number = 0;
  ngOnInit() {
    this.httpService.getJSON().subscribe((value) => {
      this.tests = this.parseRawData(value);
      this.processElements(this.tests);
      this.outputData = JSON.parse(JSON.stringify(this.tests));
    });
  }

  parseRawData(value: any) {
    let tests: TestElement[] = [];
    value.forEach((feature) => {
      let newFeature = new TestElement(feature.keyword, feature.name);
      feature.elements.forEach((element) => {
        let scenario = new TestElement(element.keyword, element.name);
        element.steps.forEach((step) => {
          if (step.keyword != 'After') {
            let newStep = new TestElement(step.keyword, step.name);
            newStep.duration = step.result.duration;
            newStep.status = step.result.status;
            scenario.innerElements.push(newStep);
          }
        })
        newFeature.innerElements.push(scenario);
      })
      tests.push(newFeature);
    })
    return tests;
  }

  getElementDuration(element: TestElement) {
    let duration: number = 0;
    element.innerElements.forEach((innerElement) => {
      if (typeof innerElement.duration === 'number') {
        duration += innerElement.duration;
      }
    })
    return duration;
  }

  formatDuration(duration: number) {
    let result = '';
    if (typeof (duration) === 'number') {
      result = "Duration:";
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      const milliseconds = duration % 1000;
      if (minutes > 0) result += ` ${minutes}m`;
      if (seconds > 0) result += ` ${seconds}s`;
      result += ` ${milliseconds}ms`;
    }
    return result;
  }

  getElementStatus(element: TestElement) {
    let status: string = "passed";
    element.innerElements.forEach((innerElement) => {
      if (innerElement.status === "failed") status = "failed";
    })
    return status;
  }

  processElements(elements: TestElement[]) {
    elements.forEach((feature) => {

      feature.innerElements.forEach((scenario) => {

        scenario.duration = this.getElementDuration(scenario);
        scenario.status = this.getElementStatus(scenario);
        this[scenario.status]++;
        scenario.innerElements.forEach(() => this.stepNum++)
      })

      feature.duration = this.getElementDuration(feature);
      feature.status = this.getElementStatus(feature);
      this.scenarioNum += feature.innerElements.length;
      this.totalDuration += feature.duration;
      this.featureNum++;
    })
  }

  getElementsWithStatus(status: string) {
    this.outputData = this.tests.map((feature) => {
      if (feature.status === status) {
        feature.innerElements = feature.innerElements.filter((el) => {
          return el.status === status;
        })
        return feature;
      }
    }).filter((el) => {
      return el != null;
    })
  }

  searchInTests(keyword: string) {
    this.outputData = this.outputData.filter((feature) => {
      feature.innerElements = feature.innerElements.filter((el) => {
        return el.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      })
      return feature.innerElements.length > 0;
    })
  }

  removeFiltering() {
    this.outputData = this.tests;
  }
}
