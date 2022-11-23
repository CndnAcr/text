import fetchCusType from '@salesforce/apex/SelectSchemeApexController.fetchCusType';
import { api, LightningElement, wire } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import Fd_ObjectLocal from '@salesforce/schema/Fixed_Deposit_Details__c';
import Dep_Type from '@salesforce/schema/Fixed_Deposit_Details__c.Deposit_Type__c';
import Payout_Freq from '@salesforce/schema/Fixed_Deposit_Details__c.Payout_Frequency__c';


export default class SelectScheme extends LightningElement {

    customerOptions = [];
    depTypeOptions = [];
    selectedCusType = '';
    selectedDepType = '';

    payFreqOptions = []
    selectedPayFreqType = '';
    //customer type start
    @api recordId
    @wire(fetchCusType, {
        fdId: '$recordId'
    }) wireDataCus({ error, data }) {
        if (data) {
            let option = [];
            option.push({ label: data.Customer_Type__c, value: data.Customer_Type__c })
            this.customerOptions = option;
            console.log('option is' + JSON.stringify(this.customerOptions));

        } else if (error) {
            console.error(JSON.stringify(error));
        }
    }
    cusTypeChange(event) {
        console.log('Selected Value:' + event.detail.value);
        this.selectedCusType = event.detail.value;
    }

    // customer type finish
    // Deposit type start
    @wire(getObjectInfo, { objectApiName: Fd_ObjectLocal }) fdObjectInfo;
    @wire(getPicklistValues, {
        recordTypeId: '$fdObjectInfo.data.defaultRecordTypeId',
        fieldApiName: Dep_Type
    })
    wiredDataDep({ error, data }) {
        if (data) {
            let options = [];
            data.values.forEach(element => {
                options.push({ label: element.label, value: element.value });
            });
            this.depTypeOptions = options;
            console.log('Options are ' + JSON.stringify(this.depTypeOptions));
        } else if (error) {
            console.error(JSON.stringify(error));
        }
    }

    //Deposit type finish 

    @wire(getPicklistValues, {
        recordTypeId: '$fdObjectInfo.data.defaultRecordTypeId',
        fieldApiName: Payout_Freq
    })
    wiredDataPay({ error, data }) {
        if (data)
            this.payFreqData = data
        if (error) {
            console.error(JSON.stringify(error));
        }
    }
    payFreqChange(event) {
        console.log('Selected Value:' + event.detail.value);
        this.selectedPayFreqType = event.detail.value;
    }
    depTypeChange(event) {
        console.log('Selected Value:' + event.detail.value);
        this.selectedDepType = event.detail.value;
        let key = this.payFreqData.controllerValues[event.target.value];
        this.payFreqOptions = this.payFreqData.values.filter(opt =>
            opt.validFor.includes(key));
    }

    //Tenor starts here
    get tenorMonthsOptions() {
        let options = [];
        for (var cntr = 1; cntr < 13; cntr++) {
            options.push({ label: cntr.toString(), value: cntr.toString() });
        }
        return options;
    }
    tenorInMonths = '';
    tenorMonthsChange(event) {
        this.tenorInMonths = event.detail.value;
    }
    get tenorDaysOptions() {
        let options = [];

        for (var cntr = 1; cntr < 31; cntr++) {
            options.push({ label: cntr.toString(), value: cntr.toString() });
        }
        return options;
    }
    tenorDaysChange(event) {
        this.tenorInDays = event.detail.value;
    }
    //Fd Amouns starts 
    fdAmount = 0;
    onFDAmtChange(event) {
        this.fdAmount = event.detail.value;
    }
    //Button Start
    fetchScheme(event) {
        let isValid = true;//flag variable
        let inputFields = this.template.querySelectorAll('.clsFrmFetchSchm');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
    }
}