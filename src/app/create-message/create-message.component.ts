import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

export enum PriorityEnum {
  NORMAL,
  URGENT,
  INFO
}

@Component({
  selector: 'kswe-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css']
})
export class CreateMessageComponent implements OnInit {
  public messageForm: FormGroup;
  public messageTypes: string[] = ['Termine und infos', 'Infos', 'Warnungen'];
  showValues: boolean;

  constructor(
    private fb: FormBuilder
  ) {
    this.messageForm = this.fb.group({
      display: [null, Validators.required],
      title: [null, [Validators.required, Validators.minLength(5)]],
      message: [null, [Validators.required, Validators.minLength(20)]],
      priority: [PriorityEnum.NORMAL, [Validators.required]],
      recipientGroup: [null, [this.atLeastOne, Validators.required]],
      from: [null, [Validators.required]],
      till: [null, [Validators.required]],
      state: [null, Validators.required],
      creator: ['Daniel Schmitz']
    });
  }

  public atLeastOne(c: FormControl) {
    if (c.value instanceof Array) {
      return c.value.length >= 0 ? null : {
        atLeastOne: {given: 0}
      };
    } else {
      return null;
    }
  }

  ngOnInit(): void {
  }

  toggle(toggleValue: string) {

  }

  isChecked(isChecked: string) {

  }
}
