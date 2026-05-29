import { AbstractControl, ValidatorFn } from "@angular/forms";

/**
 * Date Validator for End date comparison with Start Date. End Date to be greater than Start date 
 * @param beforeCtrlName  Form control name for Start Date 
 * @returns  Validator function
 */
export const dateAfterValidator = (beforeCtrlName : string): ValidatorFn => {
    const validatorFn = (c: AbstractControl) => {
        if(c?.parent && c.value!=""){
            const arr: string[] = [c.value, c.parent.get(beforeCtrlName)?.value];
            const [after, before] = arr;
            const [dateAfter, dateBefore] = [new Date(after), new Date(before)];
            const isBeforeDateGreater = dateBefore.getTime() > dateAfter.getTime();
            if(before && after && isBeforeDateGreater){
                return {dateOrder: true};
            }
        }
        return null;
    };
    return validatorFn;
}


/**
 * Date Validator for Start date comparison with End Date. Start Date to be smaller than End date 
 * @param afterCtrlName Form control name for End Date 
 * @returns : Validator function
 */
export const dateBeforeValidator = (afterCtrlName : string): ValidatorFn => {
    const validatorFn = (c: AbstractControl) => {
        if(c?.parent && c.value!=""){
            const arr: string[] = [c.value, c.parent.get(afterCtrlName)?.value];
            const [before, after] = arr;
            const [dateAfter, dateBefore] = [new Date(after), new Date(before)];
            const isEndDateSmaller = dateAfter.getTime() < dateBefore.getTime();
            if(before && after && isEndDateSmaller){
                return {dateOrder: true};
            }
        }
        return null;
    };
    return validatorFn;
}