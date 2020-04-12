import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {combineLatest} from 'rxjs';
import {startWith} from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'kswe-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
  @Input() hideTime = false;
  public dateFormControl: FormControl = new FormControl();
  public timeFormControl: FormControl = new FormControl();
  public onChange: (val: any) => void;
  public onTouch: () => void;

  constructor() {
  }

  ngOnInit(): void {
    combineLatest([
      this.dateFormControl.valueChanges.pipe(startWith(null)),
      this.timeFormControl.valueChanges.pipe(startWith('00:00')),
    ]).subscribe(([date, time]) => {
      debugger;
      this.writeValue(
        moment(date)
          .startOf('day')
          .add(time.split(':')[0], 'hours')
          .add(time.split(':')[1], 'minutes')
      );
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(obj: any): void {
    if (this.onChange) {
      if (moment(obj).isValid()) {
        this.onChange(obj);
        console.log(moment(obj).format('DD.MM.YYYY'));
        this.dateFormControl.patchValue(moment(obj), {emitEvent: false});
        this.timeFormControl.patchValue(moment(obj).format('hh:mm'), {emitEvent: false});
      } else {
        this.onChange(null);
      }
    }
  }

}
