'use strict';

const LoanSimulation=require('./LoanSimulation.js');

class PartiallyPaybackSimulation extends LoanSimulation{

	 constructor(previousCapital,rate,previousDuration,previousMonthlyPayment,partialAmount){
        super();
		this.capital=previousCapital;
		this.previousCapital=previousCapital;
    	this.capitalLabel="Nouveau capital restant dû";
		this.rate=rate;
		this.previousDuration=previousDuration;
		this.duration=previousDuration;
		this.previousMonthlyPayment=previousMonthlyPayment;
		this.partialAmount=partialAmount;
		this.monthlyPayment=previousMonthlyPayment;
	
	}

	 get partialAmount(){
		return this._partialAmount;
	}

	 set partialAmount(partialAmount){
		this._partialAmount=partialAmount;
	}
	 get previousCapital(){
		return this._previousCapital;
	}

	 set previousCapital(previousCapital){
		this._previousCapital=previousCapital;
	}

	 calculateNewCapital(){
		let newCapital=this.capital-this.partialAmount;
		this.capital=newCapital;
		return newCapital;
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

       let previousTotalInterest=((this.previousMonthlyPayment*this.previousDuration)-this.previousCapital);
        this.previousTotalInterest=previousTotalInterest;
        return previousTotalInterest;
    }

     calculateTotalInterestGain(){
    	return this.previousTotalInterest-this.totalInterest;
    }
}

module.exports=PartiallyPaybackSimulation;