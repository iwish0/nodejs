'use strict';

const Loan=require('./Loan.js');

class LoanModulationSimulation extends Loan{




	constructor(capital,rate,previousDuration,previousMonthlyPayment,newMonthlyPayment,newDuration){
        super();
		this.capital=capital;
		this.rate=rate;
		this.previousDuration=previousDuration;
        this.capitalLabel="Capital restant dû";
        if(newDuration==0){
		  this.duration=previousDuration;
        }else{
            this.duration=newDuration;
        }
		this.previousMonthlyPayment=previousMonthlyPayment;
        if(newMonthlyPayment==0){
            this.monthlyPayment=previousMonthlyPayment;
        }else{
             this.monthlyPayment=newMonthlyPayment;

        }
	
	}

     get previousMonthlyPayment(){
    	return this._previousMonthlyPayment;
    }

     set previousMonthlyPayment(previousMonthlyPayment){
    	this._previousMonthlyPayment=previousMonthlyPayment;
    }


     get previousDuration()
    {
        return this._previousDuration;
    }

     set previousDuration(previousDuration)
    {
        this._previousDuration = previousDuration;
    }

      get previousTotalInterest()
    {
        return this._previousTotalInterest;
    }

   
     set previousTotalInterest(previousTotalInterest)
    {
        this._previousTotalInterest = previousTotalInterest;
    }

     calculateMonthlyPaymentDecrease(){
    	return this.previousMonthlyPayment-this.monthlyPayment;
    }

     calculateDurationGap(){
    	
      let durationGap=this.previousDuration-this.duration;
        this.durationLabel=durationGap;
        if(durationGap<0){
            durationGap=Math.abs(durationGap);
        }
        return durationGap;
    }

      calculateMonthlyPaymentGap(){
        
        let monthlyPaymentGap=this.previousMonthlyPayment-this.monthlyPayment;
        this.monthlyPaymentLabel=monthlyPaymentGap;
        if(monthlyPaymentGap<0){
            monthlyPaymentGap=Math.abs(monthlyPaymentGap);
        }
        return monthlyPaymentGap;
    }


     get durationGapLabel(){
        return this._durationGapLabel;
    }

     set durationLabel(durationGap){
        if(durationGap>0){
        this._durationGapLabel="Diminution de";

        }else{
            this._durationGapLabel="Allongement de";
        }
    }
      get monthlyPaymentGapLabel(){
        return this._monthlyPaymentGapLabel;
    }

     set monthlyPaymentLabel(monthlyPaymentGap){
        if(monthlyPaymentGap>0){
        this._monthlyPaymentGapLabel="Diminution de";

        }else{
            this._monthlyPaymentGapLabel="Augmentation de";
        }
    }
   
	 calculateInterestGapPercentage()
	{
		let interestGapPercentage=((this.totalInterest-this.previousTotalInterest)/this.previousTotalInterest)*100;
         interestGapPercentage=interestGapPercentage*(-1);

         if(interestGapPercentage<0){
                         interestGapPercentage=Math.abs(interestGapPercentage);

         }
         return          interestGapPercentage;

	}
       

     calculatePreviousTotalInterest(){

      let  previousTotalInterest=((this.previousMonthlyPayment*this.previousDuration)-this.capital);
        this.previousTotalInterest=previousTotalInterest;
        return previousTotalInterest;
    }

     calculateTotalInterestGap(){
    	let totalInterestGap=this.previousTotalInterest-this.totalInterest;
        this.totalInterestGapLabel=totalInterestGap;
        if(totalInterestGap<0){
            totalInterestGap=Math.abs(totalInterestGap);
        }
        return totalInterestGap;
    }

     get totalInterestGapLabel(){
        return this._totalInterestGapLabel;
    }

     set totalInterestGapLabel(totalInterestGap){
        if(totalInterestGap>0){
            this._totalInterestGapLabel="Soit un gain de";
        }else{
             this._totalInterestGapLabel="Soit un surcoût de";
        }
        
    }
}

module.exports=LoanModulationSimulation;
