import { Directive, Self, Input, Component, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/startWith';
import { MatGridList } from '@angular/material';

@Directive({
    selector: '[appGridList]'
})

export class GridListDirective implements OnInit {

    @Input() xs = 1;
    @Input() sm = 2;
    @Input() md = 2;
    @Input() lg = 3;
    @Input() xl = 3;

    constructor(private observableMedia: ObservableMedia,
        @Self() private component: MatGridList) { }

    ngOnInit() {

        const grid = new Map([
            ['xs', this.xs],
            ['sm', this.sm],
            ['md', this.md],
            ['lg', this.lg],
            ['xl', this.xl]
        ]);

        let start: number;
        grid.forEach((cols, mqAlias) => {
            if (this.observableMedia.isActive(mqAlias)) {
                start = cols;
            }
        });
        this.observableMedia.asObservable()
            .map(change => {
                return grid.get(change.mqAlias);
            })
            .startWith(start)
            .subscribe(cols => this.component.cols = cols);
    }
}
