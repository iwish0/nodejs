'use strict';

var Loan =require('./Loan.js');

class LoanSimulation extends Loan{

	constructor(obj){
        super();
		for (var prop in obj) {
            if(prop=="capital"){
              this.capital=obj[prop];
            }
    		if(prop=="rate") {
    			this.rate=obj[prop];
    		}
            if(prop=="durationFormat"){
              this.durationFormat=obj[prop];
            }
    		if(prop=="monthlyPayment") {
        			this.monthlyPayment=obj[prop];
    		}
            if(prop=="duration") {
              this.duration=obj[prop];
            }
		}
        this.capitalLabel="Capital";
    }

    calculateCapital(){   
       let capital=(this.monthlyPayment*(1-Math.pow(1+(this.rate/100/12),-this.duration))/(this.rate/100/12));
        this.capital=capital;
        return capital;

    }

    calculateTotalAMount(){       
        return this.totalInterest+this.capital;
    }
	
     calculateCostPercentage(){
        let costPercentage= (this.totalInterest/this.capital)*100;
        return costPercentage;
    }

    calculateRate()
    {
        
        // make an initial guess
        let error=0.0000001; let high=1.00; let low=0.00;
        let rate=(2.0*(this.duration*this.monthlyPayment-this.capital))/(this.capital*this.duration);
        if(rate>0)
        {
            while(true) 
            {
                // check for error margin
                let calc=Math.pow(1 +rate,this.duration);
                calc=(rate*calc)/(calc-1.0);
               calc-=this.monthlyPayment/this.capital;
            
                if(calc>error) {
                    // guess too high, lower the guess
                    high=rate;
                    rate=(high+low)/2;
                } 
                else if(calc<-error) 
                {
                    // guess too low, higher the guess
                    low=rate;
                    rate=(high+low)/2;
                } 
                else 
                {
                    // acceptable guess
                    break;
                }
            }
        
        }
        rate=Math.round((rate*12*100)*100.0)/100.0;
        if(rate>0 && rate<50){
            this.rate=rate;
            return rate;
        }else{
            return 'Le simulateur retourne une durée incohérente';
        }    
    }
   

	
}

module.exports=LoanSimulation;