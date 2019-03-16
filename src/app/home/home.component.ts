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
  passed: number;
  failed: number;
  skipped: number;
  featureNum: number;
  scenarioNum: number;
  stepNum: number;
  totalDuration: number;
  ngOnInit() {
    this.httpService.getJSON().subscribe((value) => {
      this.parseRawData(value);      
    });
  }

  parseRawData(value: any) {
    value.forEach((feature) => {
      let newFeature = new TestElement(feature.keyword, feature.name);
      feature.elements.forEach((element) => {
        let scenario = new TestElement(element.keyword, element.name);
        element.steps.forEach((step) => {
          let newStep = new TestElement(step.keyword, step.name);
          newStep.duration = step.result.duration;
          newStep.status = step.result.status;
          scenario.innerElements.push(newStep);
        })
        newFeature.innerElements.push(scenario);
      })
      this.tests.push(newFeature);
      this.processElements(this.tests);
    })
  }

  getElementDuration(element: TestElement) {
    let duration: number;
    element.innerElements.forEach((innerElement) => {
      if (typeof innerElement.duration === 'number') {
        duration += innerElement.duration;
      }
    })
    return duration;
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
        this.stepNum += scenario.innerElements.length;

        scenario.innerElements.forEach((step) => {
          this[step.status]++;
        })

      })

      feature.duration = this.getElementDuration(feature);
      feature.status = this.getElementStatus(feature);
      this.scenarioNum += feature.innerElements.length;
      this.totalDuration += feature.duration;
      this.featureNum++;

    })
  }
}
