'use strict';

class TradingResultSimulation{

	constructor(obj){

		for(var prop in obj){
			if(prop=="purchasedQuantity"){
				this.purchasedQuantity=obj[prop];
				console.log(this.purchasedQuantity);
			}
			if(prop=="purchasedUnitPrice"){
				this.purchasedUnitPrice=obj[prop];
			}
			if(prop=="purchasedBrokerCostsPercentage"){
				this.purchasedBrokerageCostsPercentage=obj[prop];
				console.log("mlkmk"+this.purchasedBrokerageCostsPercentage);
			}
			if(prop=="salesQuantity"){
				this.salesQuantity=obj[prop];
			}
			if(prop=="salesUnitPrice"){
				this.salesUnitPrice=obj[prop];
			}
			if(prop=="salesBrokerageCostsPercentage"){
				this.salesBrokerageCostsPercentage=obj[prop];
			}

			this.calculatePurchasedBrokerageCostsAmount();
			this.calculatePurchasedAmount();
			this.calculatePurchasedUnitCostPrice();
			
			if(obj.choice=="buyAndSell"){
				this.calculateSalesBrokerageCostsAmount();
				this.calculateSalesAmount();
				this.calculateGrossResult();
			}

		}

	}
	
	calculatePurchasedBrokerageCostsAmount()
	{
		let purchasedBrokerageCostsAmount=(this.purchasedQuantity*this.purchasedUnitPrice)*(this.purchasedBrokerageCostsPercentage/100);
		console.log(typeof purchasedBrokerageCostsAmount);

		this.purchasedBrokerageCostsAmount=purchasedBrokerageCostsAmount;
				console.log(this.purchasedBrokerageCostsAmount);
	}
	 calculateSalesBrokerageCostsAmount()
	{
		let salesBrokerageCostsAmount=(this.salesQuantity*this.salesUnitPrice)*(this.salesBrokerageCostsPercentage/100);
		this.salesBrokerageCostsAmount=salesBrokerageCostsAmount;
	}
	 calculatePurchasedAmount()
	{
		let purchasedAmount=(this.purchasedQuantity*this.purchasedUnitPrice)+this.purchasedBrokerageCostsAmount;
		this.purchasedAmount=purchasedAmount;
		
	}
	 calculateSalesAmount()
	{
		let salesAmount=(this.salesQuantity*this.salesUnitPrice)-this.salesBrokerageCostsAmount;
		this.salesAmount=salesAmount;
		return salesAmount;
	}
	 calculatePurchasedUnitCostPrice()
	{
		let purchasedUnitCostPrice=this.purchasedAmount/this.purchasedQuantity;
		this.purchasedUnitCostPrice=purchasedUnitCostPrice;
	}
	 calculateSalesUnitCostPrice()
	{
		let salesUnitCostPrice=this.salesBrokerageCostsAmount/this.salesQuantity;
	}

	 calculateGrossResult(){
		let grossResult=this.salesAmount-this.purchasedAmount;
		this.grossResult=grossResult;
		this.grossResultLabel=grossResult;
		this.calculatePerformance();
		if(grossResult>0){
			this.calculateSocialP(grossResult);
			this.calculateNetResult();
		}
	}

	 set grossResultLabel(grossResult){
		if(grossResult>0){
			this._grossResultLabel="Plus-value brut";
		}else{
			this._grossResultLabel="Moins value";
		}
	}

	 get grossResultLabel()
    {
        return this._grossResultLabel;
    }
	
     get purchasedQuantity()
    {
        return this._purchasedQuantity;
    }

     set purchasedQuantity(purchasedQuantity)
    {
        this._purchasedQuantity = purchasedQuantity;
    }
    
     get salesQuantity()
    {
        return this._salesQuantity;
    }

     set salesQuantity(salesQuantity)
    {
        this._salesQuantity = salesQuantity;
    }

     get purchasedUnitPrice()
    {
        return this._purchasedUnitPrice;
    }

     set purchasedUnitPrice(purchasedUnitPrice)
    {
        this._purchasedUnitPrice = purchasedUnitPrice;
    }

     get salesUnitPrice()
    {
        return this._salesUnitPrice;
    }

     set salesUnitPrice(salesUnitPrice)
    {
        this._salesUnitPrice = salesUnitPrice;
    }

     get purchasedBrokerageCostsPercentage()
    {
        return this._purchasedBrokerageCostsPercentage;
    }

     set purchasedBrokerageCostsPercentage(purchasedBrokerageCostsPercentage)
    {
        this._purchasedBrokerageCostsPercentage = purchasedBrokerageCostsPercentage;
    }

     get salesBrokerageCostsPercentage()
    {
        return this._salesBrokerageCostsPercentage;
    }

     set salesBrokerageCostsPercentage(salesBrokerageCostsPercentage)
    {
        this._salesBrokerageCostsPercentage = salesBrokerageCostsPercentage;
    }

     get purchasedBrokerageCostsAmount()
    {
        return this._purchasedBrokerageCostsAmount;
    }

     set purchasedBrokerageCostsAmount(purchasedBrokerageCostsAmount)
    {
        this._purchasedBrokerageCostsAmount = purchasedBrokerageCostsAmount;
    }

     get salesBrokerageCostsAmount()
    {
        return this._salesBrokerageCostsAmount;
    }

     set salesBrokerageCostsAmount(salesBrokerageCostsAmount)
    {
        this._salesBrokerageCostsAmount = salesBrokerageCostsAmount;
    }

     get purchasedUnitCostPrice()
    {
        return this._purchasedUnitCostPrice;
    }

     set purchasedUnitCostPrice(purchasedUnitCostPrice)
    {
        this._purchasedUnitCostPrice = purchasedUnitCostPrice;
    }

     get salesUnitCostPrice()
    {
        return this._salesUnitCostPrice;
    }

     set salesUnitCostPrice(salesUnitCostPrice)
    {
        this._salesUnitCostPrice = salesUnitCostPrice;
    }

     get purchasedAmount()
    {
        return this._purchasedAmount;
    }

     set purchasedAmount(purchasedAmount)
    {
        this._purchasedAmount = purchasedAmount;
    }

     get salesAmount()
    {
        return this._salesAmount;
    }

     set salesAmount(salesAmount)
    {
        this._salesAmount = salesAmount;
    }

     get grossResult()
    {
        return this._grossResult;
    }

     set grossResult(grossResult)
    {
        this._grossResult = grossResult;
    }
      
     calculatePerformance(){
    	let performance=(this.salesAmount-this.purchasedAmount)/this.purchasedAmount*100;
    	this.performance=performance;
    }
    
     get performance()
    {
        return this._performance;
    }

     set performance(performance)
    {
        this._performance = performance;
    }

     calculateSocialP(grossResult){
    	let socialP=(this.grossResult*15.5)/100;
    	this.socialP=socialP;
    }

     get socialP()
    {
        return this._socialP;
    }

     set socialP(socialP)
    {
        this._socialP = socialP;
    }

  	 calculateNetResult(){
  		let netResult=this.grossResult-this.socialP;
  		this.netResult=netResult;
  	}
     get netResult()
    {
        return this._netResult;
    }

     set netResult(netResult)
    {
        this._netResult = netResult;
    }
}


module.exports=TradingResultSimulation;