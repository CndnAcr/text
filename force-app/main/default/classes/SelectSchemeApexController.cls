public with sharing class SelectSchemeApexController {
      
    @AuraEnabled(cacheable=true)
    public static Fixed_Deposit_Details__c fetchCusType(String fdId){
       Fixed_Deposit_Details__c recFd= [SELECT Id, Name,
       Customer_Type__c From Fixed_Deposit_Details__c where Id =:fdId with Security_ENFORCED];
         return recFd;
       } 
    

 
 }