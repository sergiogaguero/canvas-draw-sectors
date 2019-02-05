// Angular basics for validator creation
import { AbstractControl } from '@angular/forms';

// services
import { StoresService } from '../services/stores.service';

export class ValidateIdInCustomerDB {
    static createValidator(storesService: StoresService, editingMode: boolean) {
        return (control: AbstractControl) => {
            return storesService.getStoreByIdInCustomerDB(control.value)
            .map(response => {
                if (editingMode) {
                    const store = response.find(s => s.idinCustomerDB === control.value);
                    if (response.length > 0 && store === null) {
                        return { idTaken: true };
                    } else {
                        return null;
                    }
                } else {
                    if (response.length > 0) {
                        return { idTaken: true };
                    } else {
                        return null;
                    }
                }
            });
        }
    }
}