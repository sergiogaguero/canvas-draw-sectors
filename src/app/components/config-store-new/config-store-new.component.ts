// angular basics
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

// project basics
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

// classes
import { Store } from '../../classes/store';

// services
import { UserService } from '../../services/user.service';
import { StoresService } from '../../services/stores.service';
import { RegionsService } from '../../services/regions.service';

// validators
import { ValidateIdInCustomerDB } from '../../validators/idInCustomerDB.validator';
import { Constants } from '../../classes/constants';


@Component({
  selector: 'app-config-store-new',
  templateUrl: './config-store-new.component.html',
  styleUrls: [
    './config-store-new.component.scss',
    '../../styles/headerBar.style.scss'
  ]
})
export class ConfigStoreNewComponent implements OnInit {

  // arrays for the selects
  empleados: any[];
  regiones: any[];

  // info for the map
  public latitude: number;
  public longitude: number;
  public zoom: number;

  // form validation
  idFormControl: FormControl;
  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  responsableFormControl = new FormControl('', [
    Validators.required,
  ]);
  regionFormControl = new FormControl('', [
    Validators.required,
  ]);
  latitudeFormControl = new FormControl('', [
    Validators.required,
  ]);
  longitudeFormControl = new FormControl('', [
    Validators.required,
  ]);
  addressFormControl = new FormControl('', [
    Validators.required,
  ]);
  addStore: FormGroup;

  // actual form data
  store: Store = {
    name: '',
    regionId: null,
    responsableId: null,
    locationLat: null,
    locationLong: null,
    companyId: 1,
    idinCustomerDB: null,
    timeZoneOffset: 0,
    address: ''
  };

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private _empleadosService: UserService,
    private _regionesService: RegionsService,
    private _tiendasService: StoresService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private ngZone: NgZone) {


    this.idFormControl = new FormControl('', [
      Validators.required
    ],
      ValidateIdInCustomerDB.createValidator(this._tiendasService, false));

    this.addStore = new FormGroup({
      'idinCustomerDB': this.idFormControl,
      'name': this.nameFormControl,
      'responsableId': this.responsableFormControl,
      'regionId': this.regionFormControl,
      'longitude': this.longitudeFormControl,
      'latitude': this.latitudeFormControl,
      'address': this.addressFormControl,
    });
  }

  ngOnInit() {

    this._regionesService.getRegions()
      .subscribe(response => this.regiones = response);

    this._empleadosService.getUsersByRole(Constants.roles.storeMgr)
      .subscribe(response => {
        return this.empleados = response;
      });

    // set google maps defaults
    this.zoom = 16;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => this.whenPlaceChanges(autocomplete));
      });
    });
  }

  whenPlaceChanges(autocomplete: google.maps.places.Autocomplete) {
    const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    // verify result
    if (place.geometry === undefined || place.geometry === null) {
      return;
    }

    // set latitude, longitude and zoom
    this.latitude = place.geometry.location.lat();
    this.longitude = place.geometry.location.lng();

    this.store.locationLat = this.latitude.toString();
    this.store.locationLong = this.longitude.toString();
    this.store.timeZoneOffset = place.utc_offset;
    this.store.address = place.formatted_address;

    this.zoom = 16;
  }

  saveStore() {
    if (this.addStore.valid) {
      this._tiendasService.addStore(this.store).subscribe(data => {
        this.router.navigate(['settings', 'stores', data.storeId]);
      },
        error => console.error(error));
    } else {
      // validate all form fields
      Object.keys(this.addStore.controls).forEach(field => {
        const control = this.addStore.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 16;
      });
    }
  }


}
