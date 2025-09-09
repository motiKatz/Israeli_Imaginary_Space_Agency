import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.html',
  styleUrls: ['./file-input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInput),
      multi: true
    }
  ]
})
export class FileInput implements ControlValueAccessor {

  value: string | null = null;
  fileName: string | null = null;
  isDisabled = false;
  private onChange: any = () => { };
  private onTouched: any = () => { };

  writeValue(value: string | null) {
    this.value = value;
    if (value) {
      this.fileName = 'Current file'; // <-- כאן מציגים קובץ קיים
    } else {
      this.fileName = null;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {    
    this.isDisabled = isDisabled;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const dataUrl = await file.arrayBuffer().then(buf => {
      const bytes = new Uint8Array(buf);
      const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '');
      return 'data:' + file.type + ';base64,' + btoa(binary);
    });

    this.value = dataUrl;
    this.fileName = file.name;
    this.onChange(this.value);
    this.onTouched();
  }
}
