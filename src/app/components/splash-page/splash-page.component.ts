import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EditorModule } from 'primeng/primeng';
import { SplashPageService } from '../../services/splashPage.service'
import { Pattern } from 'app/classes/patterns';
import { Constants } from '../../classes/constants';
import { OpenMessageDialog } from '../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-splash-page',
    templateUrl: 'splash-page.component.html',
    styleUrls: [
        'splash-page.component.scss',
        '../../styles/headerBar.style.scss'
    ]
})
export class StepperSplashComponent implements OnInit {
    // stepper reference
    @ViewChild('stepperContainer') stepper: ElementRef;

    // some variables for the forms
    isLinear = true;
    text: string;
    backgroundColor = '#dddddd';
    message: string;
    hideEditorText = true;
    finished = false;

    // image handling
    img = '';
    logo = '';
    imgLoadingAttempt = 0;
    dataImage: any = {
        splash: {
            name: '',
            uploadedfile: null
        }
    }
    dataLogo: any = {
        splash: {
            name: '',
            uploadedfile: null
        }
    }

    // state handlers for the view mode buttons
    viewMode: any = {
        'desktop': {
            active: true,
            sizes: {
                width: '100%',
                height: '100%'
            }
        },
        'tablet': {
            active: false,
            sizes: {
                width: Constants.DEVICE_SCREEN_SIZES.tablet.width + 'px',
                height: Constants.DEVICE_SCREEN_SIZES.tablet.height + 'px'
            }
        },
        'phone': {
            active: false,
            sizes: {
                width: Constants.DEVICE_SCREEN_SIZES.smartphone.width + 'px',
                height: Constants.DEVICE_SCREEN_SIZES.smartphone.height + 'px'
            }
        }
    };
    activeViewMode = {
        width: this.viewMode.desktop.sizes.width,
        height: this.viewMode.desktop.sizes.height
    };
    maxViewModeHeight = 550;
    hexColorsPattern = Pattern.getHexColors();
    // controllers for the form
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    bgColorCtrl: FormControl = new FormControl(
        [
            '',
            [Validators.required, Validators.pattern(this.hexColorsPattern)]
        ]
    );
    bgImgCtrl: FormControl = new FormControl(['', Validators.required]);
    logoImgCtrl: FormControl = new FormControl(['', Validators.required]);

    constructor(
        private dialog: MatDialog,
        private _splashPageService: SplashPageService
    ) { }

    ngOnInit() {
        this.firstFormGroup = new FormGroup({
            'BackgroundCtrl': this.bgImgCtrl,
            'ColorCtrl': this.bgColorCtrl
        });
        this.secondFormGroup = new FormGroup({
            'LogoCtrl': this.logoImgCtrl
        });
    }
    fileChangeBackground(event) {
        this.img = '';
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.dataImage.splash.uploadedfile = file;
            this.dataImage.splash.name = file.name;
            this._splashPageService.postBackgroundImage(this.dataImage.splash.uploadedfile)
                .subscribe(result => {
                    this.getBackgroundURL();
                });
        }
        this.isLinear = false;
    };
    fileChangeLogo(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.dataLogo.splash.uploadedfile = file;
            this.dataLogo.splash.name = file.name;
            this._splashPageService.postLogo(this.dataLogo.splash.uploadedfile).subscribe(result => {
                this.getLogoURL();
            });
        }
    };

    postText() {
        this._splashPageService.postText(this.message, this.backgroundColor).subscribe(result => {
        });
        this.hideEditorText = false;
        this.getText();
    };

    getBackgroundURL() {
        this.img = this._splashPageService.splashPageURL + '/download/background?access_token=' + this._splashPageService.getAccessToken() + '&imageLoadNo=' + this.imgLoadingAttempt;
        this.imgLoadingAttempt += 1;
    };

    getLogoURL() {
        this.logo = this._splashPageService.splashPageURL + '/download/logo?access_token=' + this._splashPageService.getAccessToken() + '&imageLoadNo=' + this.imgLoadingAttempt;
        this.imgLoadingAttempt += 1;
    };

    getText() {
        this._splashPageService.getText().subscribe(result => {
            this.text = result;
            const parseText = this.text.split(/(?=<p>)/g);
            this.backgroundColor = parseText[0];
            this.message = parseText[1];
        });
    };

    saveSplashPage() {
        this._splashPageService.postSplashPage().subscribe(ok => {
            OpenMessageDialog('config.splash-page.saveSuccessTitle', 'config.splash-page.saveSuccessMessage', this.dialog);
            this.finished = true;
        });
    };

    switchViewMode(newMode: string): void {
        for (const mode in this.viewMode) {
            if (mode !== newMode) {
                this.viewMode[mode].active = false;
            } else {
                this.viewMode[mode].active = true;
                // check for overflows
                let widthOverflow = false;
                let heightOverflow = false;
                if (parseInt(this.viewMode[mode].sizes.width.slice(0, -2))
                    > this.stepper.nativeElement.clientWidth) {
                    widthOverflow = true;
                }
                if (parseInt(this.viewMode[mode].sizes.height.slice(0, -2))
                    > this.maxViewModeHeight) {
                    heightOverflow = true;
                }
                // if both dimensions overflow, check which overflows THE MOST and ignore the other one
                if (heightOverflow && widthOverflow) {
                    if (parseInt(this.viewMode[mode].sizes.width.slice(0, -2)) / this.stepper.nativeElement.clientWidth
                        >= parseInt(this.viewMode[mode].sizes.height.slice(0, -2)) / this.maxViewModeHeight) {
                        heightOverflow = false;
                    } else {
                        widthOverflow = false;
                    }
                }

                // so, if there's no overflow we just use the sizes we just got
                if (!widthOverflow && !heightOverflow) {
                    this.activeViewMode.width = this.viewMode[mode].sizes.width;
                    this.activeViewMode.height = this.viewMode[mode].sizes.height;
                } else if (widthOverflow) {
                    // if there's a predominant width overflow, we gotta calc the new height
                    this.activeViewMode.height =
                        (parseInt(this.viewMode[mode].sizes.height.slice(0, -2))
                            * this.stepper.nativeElement.clientWidth
                            / parseInt(this.viewMode[mode].sizes.width.slice(0, -2))) + 'px';
                    this.activeViewMode.width = this.stepper.nativeElement.width + 'px';
                } else if (heightOverflow) {
                    // if there's a predominant height overflow, we gotta calc the new width
                    this.activeViewMode.width =
                        (parseInt(this.viewMode[mode].sizes.width.slice(0, -2))
                            * this.maxViewModeHeight
                            / parseInt(this.viewMode[mode].sizes.height.slice(0, -2))) + 'px';
                    this.activeViewMode.height = this.maxViewModeHeight + 'px';
                }
            }
        }
    }
}
