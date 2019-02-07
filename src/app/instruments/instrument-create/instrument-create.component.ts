import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  NgForm
} from "@angular/forms";
import {
  ActivatedRoute,
  ParamMap
} from "@angular/router";
import {
  Category
} from '../instrument-search/category.model';
import {
  InstrumentModel
} from '../instrument.model';
import {
  InstrumentsService
} from '../instruments.service';

import {
  MatDialog
} from "@angular/material";
import {
  ModalGenericComponent
} from "../../modal-generic/modal-generic.component";

@Component({
  selector: 'app-instrument-create',
  templateUrl: './instrument-create.component.html',
  styleUrls: ['./instrument-create.component.css']
})
export class InstrumentCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private instrument_id: string;
  instrument: InstrumentModel;
  categories: Category[] = [{
      name: 'Capacitores',
      viewValue: 'Capacitor'
    },
    {
      name: 'Herramientas',
      viewValue: 'Herramienta'
    },
    {
      name: 'Diodos',
      viewValue: 'Diodo'
    },
    {
      name: 'Transistores',
      viewValue: 'Transistor'
    }
  ];
  //"Diodos", "Capacitores", "Transistores", "Herramientas"
  constructor(private route: ActivatedRoute,
    private instrumentService: InstrumentsService,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      instrumentImage: new FormControl(null, {
        validators: [Validators.required]
      }),
      cantidad: new FormControl(null, {
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit";
        this.instrument_id = paramMap.get("id");
        this.isLoading = true;
        this.instrumentService.getInstrument(this.instrument_id)
          .subscribe(instrumentData => {
            this.isLoading = false;
            this.instrument = {
              name: instrumentData.instrument.name,
              instrumentImage: instrumentData.instrument.instrumentImage,
              cantidad: instrumentData.instrument.cantidad,
              categories: instrumentData.instrument.categories,
              location: instrumentData.instrument.location
            };
            this.form.setValue({
              name: this.instrument.name,
              instrumentImage: this.instrument.instrumentImage,
              cantidad: this.instrument.cantidad,
              category: this.instrument.categories,
              location: this.instrument.location
            });
          })
      } else {
        this.mode = "create";
        this.instrument_id = null;
      }
    })
  }

  onSavePost() {
    let Message = "";
    if (this.form.invalid) {
      Message = "Favor de completar los campos requeridos";
      this.dialog.open(ModalGenericComponent, {
        data: {
          message: Message
        }
      });
      return;
    } else {
      if (this.form.value.cantidad <= 0) {
        Message = "La cantidad ingresada debe ser mayor a 0";
        this.dialog.open(ModalGenericComponent, {
          data: {
            message: Message
          }
        });
        return;
      }
    }
    // if(this.form.value.instrumentImage == ""){
    //   console.log(this.form.value.instrumentImage);
    // }
    const newInstrument: InstrumentModel = {
      name: this.form.value.name,
      instrumentImage: this.form.value.instrumentImage,
      cantidad: this.form.value.cantidad,
      categories: this.form.value.category,
      location: this.form.value.location
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.instrumentService.createInstrument(newInstrument)
        .subscribe(response => {
          this.isLoading = false;
          Message = "Instrumento Creado!!";
          this.dialog.open(ModalGenericComponent, {
            data: {
              message: Message
            }
          });
          this.form.reset();
        }, error => {
          this.isLoading = false;
        })
    } else {
      this.instrumentService.updateInstrument(this.instrument_id, newInstrument)
        .subscribe(response => {
          this.isLoading = false;
          Message = "Instrumento Actualizado!!";
          this.dialog.open(ModalGenericComponent, {
            data: {
              message: Message
            }
          });
        }, error => {
          this.isLoading = false;
        })
    }
  }

}
