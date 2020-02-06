public with sharing class ContactRole {
     @AuraEnabled(Cacheable=true)
    public static List <OpportunityContactRole> getContactRoles(String oppId) {
     //   String strLastNameLike = '%'+strLastName+'%';
        List<OpportunityContactRole> contList = [SELECT Id, OpportunityId, ContactId, Role, IsPrimary
                                   FROM OpportunityContactRole 
                                   WHERE OpportunityId=:oppId  LIMIT 10];
        return contList;
    }   
    @AuraEnabled(Cacheable=true)
    public static List <OpportunityLineItem> getOpportunity(String oppId) {
     //   String strLastNameLike = '%'+strLastName+'%';
     System.debug('oppId======'+ oppId);
        List<OpportunityLineItem> contList = [SELECT Id,name,CheckData__c
                                   FROM OpportunityLineItem 
                                   WHERE OpportunityId=:oppId  LIMIT 10];
                                   
                                   System.debug('logLevel======'+ contList);
        return contList;
    }
    @AuraEnabled
    public static void updateRecords(String ids,String updatefields){
       OpportunityLineItem oli = new OpportunityLineItem();
       oli.id =ids;
        System.debug('oppId2323======'+ updatefields);
      if(updatefields == 'true'){
        oli.CheckData__c = false;
        update oli;
      }
      else{
       oli.CheckData__c = true;
         update oli;
      }
       
    }   
}
