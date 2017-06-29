class Loan{
   
    constructor(){}

    set capital(capital)
    {
        this._capital = capital;
    }

    get capital()
    {
        return this._capital;
    }

     set capitalLabel(capitalLabel){
        this._capitalLabel=capitalLabel;
    }

     get capitalLabel(){
        return this._capitalLabel;
    }

     set rate(rate)
    {
        this._rate=rate;

    }

     get rate()
    {
        return this._rate;
    }

     set duration(duration)
    {
         if(this.durationFormat=="year"){
             this._duration=duration*12;

        }else{
             this._duration=duration;
        }
       
    }

     get duration()
    {
        return this._duration;
    }

     set durationFormat(durationFormat){
        this._durationFormat=durationFormat;
    }

     get durationFormat(){
        return this._durationFormat;
    }

     set monthlyPayment(monthlyPayment)
    {
        this._monthlyPayment = monthlyPayment;

    }

     get monthlyPayment()
    {
        return this._monthlyPayment;
    }

     setTotalInterest(totalInterest){
        this.totalInterest=totalInterest;
        return this;
    }

     getTotalInterest(){
        return this.totalInterest;
    }

     calculateMonthlyPayment(){

       let monthlyPayment=(this.capital*((this.rate/100)/12))/(1-Math.pow(1+((this.rate/100)/12),-this.duration));
        this.monthlyPayment=monthlyPayment;

        return monthlyPayment;
    }

     calculateDuration(){
    
       let duration=Math.round((Math.log(this.monthlyPayment)-Math.log(this.monthlyPayment-this.rate/100/12*this.capital))/Math.log(1+this.rate/100/12));
        
        if(!isNaN(duration) && duration>0){
            this.duration=duration;
            return duration;
        }else{
            return 'Le simulateur retourne une durée incohérente';
        }
          
    }

     getDurationOnString(){
        if(this.durationFormat=="year")
        {
           let duration=this.duration/12;
            if(duration==1)
            {
                return "1 an";
            }
            else
            {
                return duration+' ans';
            }
        }
        else
        {
            if(this.duration<12)
            {
            return this.duration+' mois';
            }
            else if (this.duration==12) {
               return this.duration+' mois, soit 1 an'; 
            }
            else if(this.duration>12)
            {
              let  year=this.duration/12;
                if((this.duration%12)==0)
                {
                    return this.duration+' mois, soit '+year+' ans';
                }
                else
                {   
                   year=Math.floor(year);
                   let month=this.duration%12;
                    if(year==1){
                        return this.duration+' mois, soit 1 an et '+month+' mois';
                    }else{
                        return this.duration+' mois, soit '+year+' ans et '+month+' mois';
                    }
                }
            }
        }
    }

      getDurationOnStringWithParam(duration){
        
        if(duration<12){
            return duration+' mois';
        }else if (duration==12){
           return duration+' mois, soit 1 an'; 
        }else if(duration>12){
           let year=duration/12;
            if((duration%12)==0){
                return duration+' mois, soit '+year+' ans';
            }else{   
                year=Math.floor(year);
                let month=duration%12;
                if(year==1){
                    return duration+' mois, soit 1 an et '+month+' mois';
                }else{
                    return duration+' mois, soit '+year+' ans et '+month+' mois';
                }
            }
        }
    }


     calculateTotalInterest(){

        let totalInterest=((this.monthlyPayment*this.duration)-this.capital);
        this.setTotalInterest(totalInterest);
        return totalInterest;
    }

      calculateAmortizationSchedule(){

        let duration=this.duration;
       let i=0;
          
        let index=i+1;

        let monthlyPayment=this.monthlyPayment;
          
        let interest=(this.capital*(this.rate/100))/12;

        let amortization=this.monthlyPayment-interest;
          
        let remainingCapital=this.capital-amortization;

        let result=[];
            result.push({"index":index,"monthlyPayment":monthlyPayment,"interest":interest,"amortization":amortization,"remainingCapital":remainingCapital});

        i=1;
        while(duration>1){

            index=i+1;
            // monthlyPayment=monthlyPayment; 
            interest=(remainingCapital*(this.rate/100))/12;
            amortization=this.monthlyPayment-interest;
            remainingCapital=remainingCapital-amortization;
            result.push({"index":index,"monthlyPayment":monthlyPayment,"interest":interest,"amortization":amortization,"remainingCapital":remainingCapital});
            duration--;
            i++;
        }
        return result;
    }
}

module.exports=Loan;

