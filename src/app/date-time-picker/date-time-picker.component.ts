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
  /**
   * Gives the user the ability to hide the time-picker
   */
  @Input() hideTime = false;
  public dateFormControl: FormControl = new FormControl();
  public timeFormControl: FormControl = new FormControl();
  public onChange: (val: any) => void;
  public onTouch: () => void;

  constructor() {
  }

  /**
   * Sets up the streams to keep the display in sync with the value propagated
   */
  ngOnInit(): void {
    combineLatest([
      this.dateFormControl.valueChanges.pipe(startWith(null)),
      this.timeFormControl.valueChanges.pipe(startWith('00:00')),
    ]).subscribe(([date, time]) => {
      this.writeValue(
        moment(date)
          .startOf('day')
          .add(time.split(':')[0], 'hours')
          .add(time.split(':')[1], 'minutes')
      );
    });
  }

  /**
   * Assigned the injected on change function to a local property
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Assigned the injected on touch function to a local property
   */
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * This function is called whenever patchValue is called or an value gets assigned to our form.
   * Also the function is manually called from our side, when either one of the formControls got changed.
   */
  writeValue(obj: any): void {
    if (this.onChange) {
      if (moment(obj).isValid()) {
        this.onChange(obj);
        this.dateFormControl.patchValue(moment(obj), {emitEvent: false});
        this.timeFormControl.patchValue(moment(obj).format('HH:mm'), {emitEvent: false});
      } else {
        this.onChange(null);
      }
    }
  }

}
