import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterContentChecked } from '@angular/core';

import { UserService } from '../../services/user.service';
import { Account } from '../../classes/account';
import { Constants } from '../../classes/constants';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterContentChecked {
    @ViewChildren('cards', { read: ElementRef }) private cards: QueryList<ElementRef>;
    tallestCardContent = 'auto';

    rowHeight = 300;
    user: Account;
    roles = Constants.getRoles();

    constructor(
        private _usersService: UserService
    ) { }

    ngOnInit() {
        this.getUserInfo();
    }

    getUserInfo() {
        this._usersService.getDetailUser().subscribe(account => {
            this.user = account[0];
        });
    }

    ngAfterContentChecked() {
        if (this.cards !== undefined) {
            let tallestContent = null;
            this.cards.forEach(card => {
                const cardContent = card.nativeElement.children[1];
                if (card !== undefined && card.nativeElement.offsetHeight > this.rowHeight) {
                    this.rowHeight = card.nativeElement.offsetHeight;
                }
                if (card !== undefined
                    && (tallestContent == null || cardContent.offsetHeight > tallestContent.offsetHeight)
                ) {
                    tallestContent = cardContent;
                }
            });
            this.cards.forEach(card => {
                const cardContent = card.nativeElement.children[1];
                cardContent.style.height = tallestContent.offsetHeight;
            });
            this.tallestCardContent = tallestContent.offsetHeight;
        }
    }

}
