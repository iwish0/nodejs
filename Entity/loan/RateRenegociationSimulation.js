'use strict';

const Loan=require("./Loan.js");

class RateRenegociationSimulation extends Loan{

	constructor(capital,previousRate,previousDuration,previousMonthlyPayment,newRate){
        super();
		this.capital=capital;
        this.capitalLabel="Capital restant dû";
		this.previousRate=previousRate;
		this.rate=newRate;
		this.previousDuration=previousDuration;
		this.duration=previousDuration;
		this.previousMonthlyPayment=previousMonthlyPayment;
		this.monthlyPayment=previousMonthlyPayment;
	
	}

     get previousRate()
    {
        return this._previousRate;
    }

     set previousRate(previousRate)
    {
        this._previousRate = previousRate;
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

     calculateDurationDecrease(){
    	return this.previousDuration-this.duration;
    }

	 calculateInterestGainPercentage()
	{
		let interestGainPercentage=((this.totalInterest-this.previousTotalInterest)/this.previousTotalInterest)*100;
		return interestGainPercentage=interestGainPercentage*(-1);
	}
       

     calculatePreviousTotalInterest(){

        let previousTotalInterest=((this.previousMonthlyPayment*this.duration)-this.capital);
        this.previousTotalInterest=previousTotalInterest;
        return previousTotalInterest;
    }

     calculateTotalInterestGain(){
    	return this.previousTotalInterest-this.totalInterest;
    }

}

module.exports=RateRenegociationSimulation;