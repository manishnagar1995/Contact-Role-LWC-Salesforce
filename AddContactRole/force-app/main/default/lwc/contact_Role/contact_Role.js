/* eslint-disable no-undef */
import { LightningElement,track,api,wire } from 'lwc';
//import getOppconRole from '@salesforce/apex/ContactRole.getContactRoles';
import getOppconRole from '@salesforce/apex/ContactRole.getOpportunity';
import updaterecords from '@salesforce/apex/ContactRole.updateRecords';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 

// row actions

const actions = [
 /*  { label: 'Edit', name: 'edit'}, 
    { label: 'Delete', name: 'delete'}*/
];

// datatable columns with row actions
 /* const columns = [
  { label: 'IsPrimary ', fieldName: 'IsPrimary',type :'boolean',cellAttributes: {
        iconName: { fieldName: "IsPrimary_chk" },
        iconPosition: "left"
    }}, 
    { label: 'Role', fieldName: 'Role' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
           }
    }
];*/
export default class Contact_Role extends NavigationMixin(LightningElement){
    @track data = [];
    @track refreshTable=[];
   // @track columns = columns;
   @track columns =[];
    @api recordId

    constructor() {
        super();
        this.columns = [
            { label: 'Name', fieldName: 'Name' },
            { label: 'CheckData', fieldName: 'CheckData__c',type :'boolean',cellAttributes: {
                iconName: { fieldName: "IsPrimary_chk" },
                iconPosition: "left"
            } },
            { type: 'action', typeAttributes: { rowActions: this.getRowActions } },
        ]
    }


    @wire(getOppconRole,{ oppId : '$recordId'})
    roles(result) {
        this.refreshTable = result;
        // eslint-disable-next-line no-console
        console.log('refreshTable===>',JSON.stringify(this.refreshTable));
        if (result.data) {
            // eslint-disable-next-line no-console
            console.log('test===>',JSON.stringify(result.data));
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
   
    getRowActions(row, doneCallback) {
        const actions = [];
        // eslint-disable-next-line no-console
        console.log('row====================>',JSON.stringify(row));
          // eslint-disable-next-line dot-notation
          if (row['CheckData__c']) {
                actions.push({
                    'label': 'Deactivate',
                    'iconName': 'utility:block_visitor',
                    'name': 'deactivate'
                });
            } else {
                actions.push({
                    'label': 'Activate',
                    'iconName': 'utility:adduser',
                    'name': 'activate'
                });
            }
          // eslint-disable-next-line @lwc/lwc/no-async-operation
          setTimeout(() => {
                doneCallback(actions);
         }, 300);
    }
      handleRowAction(event){
        const action = event.detail.action;
        const row = event.detail.row;
        // eslint-disable-next-line no-console
        console.log('test row data=========>',JSON.stringify(action.name));
      // eslint-disable-next-line default-case
      switch (action.name) {
            case 'deactivate':
                this.updateRecords(row);
                // eslint-disable-next-line no-console
                console.log('test row data=========>',JSON.stringify(row));
                break;
            case 'activate':
                this.updateRecords(row);
               break;
        } 
        
    }
    updateRecords(row){
         // eslint-disable-next-line no-console
         console.log('test update++++++++++++>',JSON.stringify(row));
         updaterecords({ ids : row.Id , updatefields : row.CheckData__c})
         .then(result => {
            // eslint-disable-next-line no-console
            console.log('result ====> ' + result);
                 // showing success message
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Product Updated successfully',
                    variant: 'success'
                }),);
               return refreshApex(this.refreshTable);   
             })
          
     }
         

    

}