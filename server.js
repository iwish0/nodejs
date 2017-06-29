'use strict';

const Hapi = require('hapi'); // nodejs framework
var port = process.env['PORT'] || 8080;
const LoanSimulation=require('./Entity/loan/LoanSimulation.js');
const RateRenegociationSimulation=require('./Entity/loan/RateRenegociationSimulation.js');
const PartiallyPaybackSimulation=require('./Entity/loan/PartiallyPaybackSimulation.js');
const LoanModulationSimulation=require('./Entity/loan/LoanModulationSimulation.js');
const TradingResultSimulation=require('./Entity/trading/TradingResultSimulation.js');
const pdf = require('html-pdf'); // html and css to pdf
const fs=require('fs');
const Path = require('path');
const winston = require('winston') // logger
const nodemailer = require('nodemailer'); // for mailing
const MongoClient = require("mongodb").MongoClient;
const Handlebars = require("handlebars"); //template engine
const NumeralHelper = require("handlebars.numeral");
NumeralHelper.registerHelpers(Handlebars);

const server = new Hapi.Server();
server.connection({ port: port, host: 'localhost' });

winston.configure({
    transports: [
      new (winston.transports.File)({ filename: 'info.log' })
    ]
  });

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'combiencamefait.contact@gmail.com',
        pass: 'CombienCaMeFait_2017%'
    }
});

       // Le plugininert (serve a simple static file from disk)
      // vision plugin do the connexion between handlebars and hapi.js
server.register([
  {register:require('inert')},
  {register:require('vision')},
  {register: require('hapi-geo-locate'),
    options: {
        enabledByDefault: true
    }
  }
  ], (err) => {

    server.views({
      engines: {
          html: require('handlebars')
      },
      relativeTo: __dirname,
      path: './templates',
      layoutPath: './templates/layout'
      //helpersPath: './templates/helpers'
    });

    if (err) {
        throw err;
    }

server.route({
    method: 'GET',
    path: '/loan/monthly-payment/{capital}/{rate}/{duration}/{durationFormat}',
    handler: function (request, reply) {

        let capital=request.params.capital;
        let rate=request.params.rate;
        let duration=Number(request.params.duration);
        let durationFormat=request.params.durationFormat;

        const location = request.location;
        winston.info({
          search: 'crédit =>recherche mensualité:',
          capital: capital,
          rate:rate,
          duration:duration,
          durationFormat:durationFormat,
          ip:location
        });

        let loan=new LoanSimulation({
            "capital":capital,
            "rate":rate,
            "durationFormat":durationFormat,
            "duration":duration,
        });
        //console.log(loan);
        let monthlyPayment=loan.calculateMonthlyPayment();
        let capitalLabel=loan.capitalLabel;
        let totalInterest=loan.calculateTotalInterest();
        let durationOnString=loan.getDurationOnString();
        let totalAMount=loan.calculateTotalAMount();
        let costPercentage=loan.calculateCostPercentage();
        let amortizationSchedule=loan.calculateAmortizationSchedule();

    let result={
        "url":"credit/simulation-emprunt",
        "labelSimulation":"Simulation pour un nouveau crédit",
        "capital":capital,
        "capitalLabel":capitalLabel,
        "rate":rate,
        "duration":duration,
        "monthlyPayment":monthlyPayment,
        "totalInterest":totalInterest,
        "durationOnString":durationOnString,
        "totalAMount":totalAMount,
        "costPercentage":costPercentage,
        "label":"Mensualité",
        "search":"monthlyPayment",
        "amortizationSchedule":amortizationSchedule
    }

    reply(result);
    
    }
});


server.route({
    method: 'GET',
    path: '/loan/duration/{capital}/{rate}/{monthlyPayment}',
    handler: function (request, reply) {

        let capital=request.params.capital;
        let rate=request.params.rate;
        let monthlyPayment=request.params.monthlyPayment;

          const location = request.location; 
         winston.info({
          search: 'crédit =>recherche durée:',
          capital: capital,
          rate:rate,
          monthlyPayment:monthlyPayment,
          ip:location
        });

        let loan=new LoanSimulation({
            "capital":capital,
            "rate":rate,
            "monthlyPayment":monthlyPayment
        });
        let duration=loan.calculateDuration();
        if(typeof duration!=='string'){
        let monthlyPayment=loan.calculateMonthlyPayment();
        let capitalLabel=loan.capitalLabel;
        let totalInterest=loan.calculateTotalInterest();
        let durationOnString=loan.getDurationOnString();
        let totalAMount=loan.calculateTotalAMount();
        let costPercentage=loan.calculateCostPercentage();
        let amortizationSchedule=loan.calculateAmortizationSchedule();

    let result={
        "url":"credit/simulation-emprunt",
        "labelSimulation":"Simulation pour un nouveau crédit",
        "capital":capital,
        "capitalLabel":capitalLabel,
        "rate":rate,
        "duration":duration,
        "monthlyPayment":monthlyPayment,
        "totalInterest":totalInterest,
        "durationOnString":durationOnString,
        "totalAMount":totalAMount,
        "costPercentage":costPercentage,
        "label":"Durée",
        "search":"duration",
        "amortizationSchedule":amortizationSchedule
    }

    reply(result);
    }else{
        let result={
        "NaNResult":duration
      };

        reply(result);
    }
    }
});

server.route({
    method: 'GET',
    path: '/loan/rate/{capital}/{duration}/{durationFormat}/{monthlyPayment}',
    handler: function (request, reply) {

        let capital=request.params.capital;
        let duration=request.params.duration;
        let durationFormat=request.params.durationFormat;
        let monthlyPayment=request.params.monthlyPayment;

         const location = request.location;
         winston.info({
          search: 'crédit =>recherche taux:',
          capital: capital,
          duration:duration,
          durationFormat:durationFormat,
          monthlyPayment:monthlyPayment,
          ip:location
        });

        let loan=new LoanSimulation({
            "capital":capital,
            "durationFormat":durationFormat,
            "duration":duration,
            "monthlyPayment":monthlyPayment
        });
       // console.log(loan);
        let rate=loan.calculateRate();
        if(typeof duration!=='string'){
        let monthlyPayment=loan.calculateMonthlyPayment();
        let capitalLabel=loan.capitalLabel;
        let totalInterest=loan.calculateTotalInterest();
        let durationOnString=loan.getDurationOnString();
        let totalAMount=loan.calculateTotalAMount();
        let costPercentage=loan.calculateCostPercentage();
        let amortizationSchedule=loan.calculateAmortizationSchedule();

    let result={
        "url":"credit/simulation-emprunt",
        "labelSimulation":"Simulation pour un nouveau crédit",
        "capital":capital,
        "capitalLabel":capitalLabel,
        "rate":rate,
        "duration":duration,
        "monthlyPayment":monthlyPayment,
        "totalInterest":totalInterest,
        "durationOnString":durationOnString,
        "totalAMount":totalAMount,
        "costPercentage":costPercentage,
        "label":"Taux",
        "search":"rate",
        "amortizationSchedule":amortizationSchedule
    }

    reply(result);
    }else{
        let result={
        "NaNResult":duration
      };

        reply(result);
    }
    }
});

server.route({
    method:'GET',
    path:'/loan/capital/{rate}/{duration}/{durationFormat}/{monthlyPayment}',
    handler: function (request,reply){

        let rate=request.params.rate;
       // console.log(rate);
        let duration=Number(request.params.duration);
        let durationFormat=request.params.durationFormat;
        let monthlyPayment=request.params.monthlyPayment;
       
         const location = request.location;
         winston.info({
          search: 'crédit =>recherche capital:',
          rate:rate,
          duration:duration,
          durationFormat:durationFormat,
          monthlyPayment:monthlyPayment,
          ip:location
        });

                let loan=new LoanSimulation({
            "rate":rate,
            "durationFormat":durationFormat,
            "duration":duration,
            "monthlyPayment":monthlyPayment
        });
       // console.log(loan);
        let capital=loan.calculateCapital();
        let capitalLabel=loan.capitalLabel;


    if(typeof capital!=="string"){

      let totalInterest=loan.calculateTotalInterest();
      let durationOnString=loan.getDurationOnString();
      let totalAMount=loan.calculateTotalAMount();
      let costPercentage=loan.calculateCostPercentage();
      let amortizationSchedule=loan.calculateAmortizationSchedule();

        let result={
            "url":"credit/simulation-emprunt",
            "labelSimulation":"Simulation pour un nouveau crédit",
            "capital":capital,
            "capitalLabel":capitalLabel,
            "rate":rate,
            "duration":duration,
            "monthlyPayment":monthlyPayment,
            "totalInterest":totalInterest,
            "durationOnString":durationOnString,
            "totalAMount":totalAMount,
            "costPercentage":costPercentage,
            "label":"Capital",
        "search":"capital",
            "amortizationSchedule":amortizationSchedule
        }

        reply(result);
        }
        else
    {
      let result={
        "NaNResult":rate
      };

        reply(result);
    }
    }
});

server.route({
    method:'GET',
    path:'/loan/rate-renegociation/{capital}/{previousRate}/{previousDuration}/{previousMonthlyPayment}/{newRate}/{choice}',
    handler: function (request,reply){


        let result;

        let capital=request.params.capital;
        let previousRate=request.params.previousRate;
        let previousDuration=Number(request.params.previousDuration);
        let previousMonthlyPayment=request.params.previousMonthlyPayment;
        let newRate=request.params.newRate;
        let choice=request.params.choice

         const location = request.location;
         winston.info({
          search: 'crédit =>renégociation de taux:',
          capital: capital,
          previousRate:previousRate,
          duration:previousDuration,
          monthlyPayment:previousMonthlyPayment,
          newRate:newRate,
          choice:choice,
          ip:location
        });

        let rateRenegociation=new RateRenegociationSimulation(
            capital,
            previousRate,
            previousDuration,
            previousMonthlyPayment,
            newRate
        );

      //  console.log(rateRenegociation);
        if(choice=='monthly-payment'){

       

      let monthlyPayment=rateRenegociation.calculateMonthlyPayment();
       let monthlyPaymentDecrease=rateRenegociation.calculateMonthlyPaymentDecrease();
       let capitalLabel=rateRenegociation.capitalLabel;
      let previousTotalInterest=rateRenegociation.calculatePreviousTotalInterest();
      let totalInterest=rateRenegociation.calculateTotalInterest();
      let totalInterestGain=rateRenegociation.calculateTotalInterestGain();
      let interestGainPercentage=rateRenegociation.calculateInterestGainPercentage();
      let durationOnString=rateRenegociation.getDurationOnString();
      let amortizationSchedule=rateRenegociation.calculateAmortizationSchedule();

      result={
         "url":"credit/simulation-renegociation-taux-pret-immobilier",
        "labelSimulation":'Simulation de renégociation de taux pour diminuer la mensualité',
        "capital":capital,
        "capitalLabel":capitalLabel,
        "newRate":newRate,
        "previousRate":previousRate,
        "monthlyPayment":monthlyPayment,
         "monthlyPaymentDecrease":monthlyPaymentDecrease,
         "previousTotalInterest":previousTotalInterest,
        "totalInterest":totalInterest,
        "totalInterestGain":totalInterestGain,
        "interestGainPercentage":interestGainPercentage,
        "durationOnString":durationOnString,
        "label":'Nouvelle mensualité',
        "search":'monthlyPayment',
        "amortizationSchedule":amortizationSchedule
      };

    //  console.log(result);
        
    }else{
      
      let previousTotalInterest=rateRenegociation.calculatePreviousTotalInterest();
      let newDuration=rateRenegociation.calculateDuration();
      let durationOnString=rateRenegociation.getDurationOnString();
      let monthlyPayment=rateRenegociation.calculateMonthlyPayment();
      let durationDecrease=rateRenegociation.calculateDurationDecrease();
      let durationDecreaseOnString=rateRenegociation.getDurationOnStringWithParam(durationDecrease);
      let capitalLabel=rateRenegociation.capitalLabel;
      let totalInterest=rateRenegociation.calculateTotalInterest();
      let totalInterestGain=rateRenegociation.calculateTotalInterestGain();
      let interestGainPercentage=rateRenegociation.calculateInterestGainPercentage();
      let amortizationSchedule=rateRenegociation.calculateAmortizationSchedule();

       result={
       "url":"credit/simulation-renegociation-taux-pret-immobilier",
        "labelSimulation":"Simulation de renégociation de taux pour diminuer la durée",
        "capital":capital,
        "capitalLabel":capitalLabel,
        "newRate":newRate,
        "previousRate":previousRate,
        "newDuration":newDuration,
        "durationOnString":durationOnString,
        "monthlyPayment":monthlyPayment,
        "durationDecrease":durationDecrease,
        "durationDecreaseOnString":durationDecreaseOnString,
         "previousTotalInterest":previousTotalInterest,
        "totalInterest":totalInterest,
        "totalInterestGain":totalInterestGain,
        "interestGainPercentage":interestGainPercentage,
        "label":"Nouvelle durée",
        "search":"duration",
        "amortizationSchedule":amortizationSchedule
      };
   //   console.log(result);

    } 
       reply(result);
    }
});

server.route({
    method:'GET',
    path:'/loan/partially-payback/{previousCapital}/{rate}/{previousDuration}/{previousMonthlyPayment}/{partialAmount}/{choice}',
    handler: function (request,reply){

        let result;

        let previousCapital=request.params.previousCapital;
        let rate=request.params.rate;
        let previousDuration=Number(request.params.previousDuration);
        let previousMonthlyPayment=request.params.previousMonthlyPayment;
        let partialAmount=request.params.partialAmount;
        let choice=request.params.choice
       
         const location = request.location;
         winston.info({
    search: 'crédit =>remboursement partiel:',
    capital: previousCapital,
    rate:rate,
    duration:previousDuration,
    monthlyPayment:previousMonthlyPayment,
    partialAmount:partialAmount,
    choice:choice,
    ip:location
  });

        let partiallyPayBack=new PartiallyPaybackSimulation(
            previousCapital,
            rate,
            previousDuration,
            previousMonthlyPayment,
            partialAmount
        );

//        console.log(partiallyPayBack);
       if(choice=='monthly-payment'){

      let newCapital=partiallyPayBack.calculateNewCapital();
     let monthlyPayment=partiallyPayBack.calculateMonthlyPayment();
     let monthlyPaymentDecrease=partiallyPayBack.calculateMonthlyPaymentDecrease();
     let capitalLabel=partiallyPayBack.capitalLabel;
      let previousTotalInterest=partiallyPayBack.calculatePreviousTotalInterest();
      let totalInterest=partiallyPayBack.calculateTotalInterest();
     let totalInterestGain=partiallyPayBack.calculateTotalInterestGain();
     let interestGainPercentage=partiallyPayBack.calculateInterestGainPercentage();
     let durationOnString=partiallyPayBack.getDurationOnString();
      let amortizationSchedule=partiallyPayBack.calculateAmortizationSchedule();

      result={
       "url":"credit/simulation-remboursement-anticipe-partiel",
       "labelSimulation":"Simulation pour un remboursement par anticipation partiel pour diminuer la mensualité",
        "capital":newCapital,
        "capitalLabel":capitalLabel,
        "rate":rate,
        "monthlyPayment":monthlyPayment,
	"partialAmount":partialAmount,
         "monthlyPaymentDecrease":monthlyPaymentDecrease,
         "previousTotalInterest":previousTotalInterest,
        "totalInterest":totalInterest,
        "totalInterestGain":totalInterestGain,
        "interestGainPercentage":interestGainPercentage,
        "durationOnString":durationOnString,
        "label":"Nouvelle mensualité",
        "search":"monthlyPayment",
        "amortizationSchedule":amortizationSchedule
      };
        
    }else{
      
      let previousTotalInterest=partiallyPayBack.calculatePreviousTotalInterest();
         let newCapital=partiallyPayBack.calculateNewCapital();
      let newDuration=partiallyPayBack.calculateDuration();
      let durationOnString=partiallyPayBack.getDurationOnString();
      let monthlyPayment=partiallyPayBack.calculateMonthlyPayment();
      let durationDecrease=partiallyPayBack.calculateDurationDecrease();
      let durationDecreaseOnString=partiallyPayBack.getDurationOnStringWithParam(durationDecrease);
      let capitalLabel=partiallyPayBack.capitalLabel;
      let totalInterest=partiallyPayBack.calculateTotalInterest();
      let totalInterestGain=partiallyPayBack.calculateTotalInterestGain();
      let interestGainPercentage=partiallyPayBack.calculateInterestGainPercentage();
      let amortizationSchedule=partiallyPayBack.calculateAmortizationSchedule();

      result={
       "url":"credit/simulation-remboursement-anticipe-partiel",
        "labelSimulation":"Simulation pour un remboursement par anticipation partiel pour diminuer la durée",
        "capital":newCapital,
        "capitalLabel":capitalLabel,
        "rate":rate,
	"partialAmount":partialAmount,
        "newDuration":newDuration,
        "durationOnString":durationOnString,
        "monthlyPayment":monthlyPayment,
        "durationDecrease":durationDecrease,
        "durationDecreaseOnString":durationDecreaseOnString,
         "previousTotalInterest":previousTotalInterest,
        "totalInterest":totalInterest,
        "totalInterestGain":totalInterestGain,
        "interestGainPercentage":interestGainPercentage,
        "label":"Nouvelle durée",
        "search":"duration",
        "amortizationSchedule":amortizationSchedule
      };
      

    }
//      console.log(result);

    
       reply(result);
    }
});


server.route({
    method:'GET',
    path:'/loan/loan-modulation/{capital}/{rate}/{previousDuration}/{previousMonthlyPayment}/{choice}/{newMonthlyPayment}/{newDuration}',
    handler: function (request,reply){

        let result;

        let capital=request.params.capital;
        let rate=request.params.rate;
        let previousDuration=Number(request.params.previousDuration);
        let previousMonthlyPayment=request.params.previousMonthlyPayment;
        let choice=request.params.choice
        let newMonthlyPayment=request.params.newMonthlyPayment;
        let newDuration=Number(request.params.newDuration);
      
     // console.log(choice);
      
       const location = request.location;
         winston.info({
    search: 'crédit =>modulation du prêt:',
    capital: capital,
    rate:rate,
    duration:previousDuration,
    monthlyPayment:previousMonthlyPayment,
    choice:choice,
    newMonthlyPayment:newMonthlyPayment,
    newDuration:newDuration,
    ip:location
  })

        if(choice=='monthly-payment'){

      let loanModulation=new LoanModulationSimulation(capital,rate,previousDuration,previousMonthlyPayment,newMonthlyPayment,newDuration);

      let duration=loanModulation.calculateDuration();
      let durationOnString=loanModulation.getDurationOnStringWithParam(duration);
      let durationGap=loanModulation.calculateDurationGap();
      let durationGapLabel=loanModulation.durationGapLabel;
      let capitalLabel=loanModulation.capitalLabel;
      let durationGapOnString=loanModulation.getDurationOnStringWithParam(durationGap);

     let monthlyPayment=loanModulation.calculateMonthlyPayment();
      let previousTotalInterest=loanModulation.calculatePreviousTotalInterest();
      let totalInterest=loanModulation.calculateTotalInterest();
      let totalInterestGap=loanModulation.calculateTotalInterestGap();
      let totalInterestGapLabel=loanModulation.totalInterestGapLabel;
      let interestGapPercentage=loanModulation.calculateInterestGapPercentage();
      let amortizationSchedule=loanModulation.calculateAmortizationSchedule();

      result={
        "url":"credit/simulation-pret-modulable",
         "labelSimulation":"Simulation pour moduler le montant de la mensualité",
        "capital":capital,
        "capitalLabel":capitalLabel,
        "rate":rate,
        "monthlyPayment":monthlyPayment,
        "duration":duration,
        "durationOnString":durationOnString,
        "durationGap":durationGap,
        "gapLabel":durationGapLabel,
        "durationGapOnString":durationGapOnString,
        "previousTotalInterest":previousTotalInterest,
        "totalInterest":totalInterest,
        "totalInterestGap":totalInterestGap,
        "totalInterestGapLabel":totalInterestGapLabel,
        "interestGapPercentage":interestGapPercentage,
        "label":"Nouvelle durée",
        "search":"duration",
        "amortizationSchedule":amortizationSchedule
      };
        
    }else{
      
      let loanModulation=new LoanModulationSimulation(capital,rate,previousDuration,previousMonthlyPayment,newMonthlyPayment,newDuration);

      let monthlyPayment=loanModulation.calculateMonthlyPayment();
      let durationOnString=loanModulation.getDurationOnStringWithParam(newDuration);
      let monthlyPaymentGap=loanModulation.calculateMonthlyPaymentGap();
      let monthlyPaymentGapLabel=loanModulation.monthlyPaymentGapLabel;
      let capitalLabel=loanModulation.capitalLabel;
     
     let  previousTotalInterest=loanModulation.calculatePreviousTotalInterest();
      let totalInterest=loanModulation.calculateTotalInterest();
      let totalInterestGap=loanModulation.calculateTotalInterestGap();
      let totalInterestGapLabel=loanModulation.totalInterestGapLabel;
      let interestGapPercentage=loanModulation.calculateInterestGapPercentage();
      let amortizationSchedule=loanModulation.calculateAmortizationSchedule();

      result={
        "url":"credit/simulation-pret-modulable",
        "labelSimulation":"Simulation pour moduler la durée de votre prêt",
        "capital":capital,
        "capitalLabel":capitalLabel,
        "rate":rate,
        "monthlyPayment":monthlyPayment,
        "duration":newDuration,
        "durationOnString":durationOnString,
        "monthlyPaymentGap":monthlyPaymentGap,
        "gapLabel":monthlyPaymentGapLabel,    
        "previousTotalInterest":previousTotalInterest,
        "totalInterest":totalInterest,
        "totalInterestGap":totalInterestGap,
        "totalInterestGapLabel":totalInterestGapLabel,
        "interestGapPercentage":interestGapPercentage,
        "label":"Nouvelle mensualité",
        "search":"monthlyPayment",
        "amortizationSchedule":amortizationSchedule
      };

    }
       
      
    // console.log(result);

    
       reply(result);
    }
});



server.route({
    method:'POST',
    path:'/loan/download-amortization-schedule',
    handler: function (request,reply){

       let payload = request.payload;   
       let html = fs.readFileSync('./templates/index.html', 'utf8');
       let data=JSON.parse(payload);
       let template = Handlebars.compile(html);
       let result = template(data);
       let fileName="./"+Math.random()+".pdf"
       pdf.create(result).toStream(function(err, stream){
        stream.pipe(fs.createWriteStream(fileName));
      });

    MongoClient.connect("mongodb://localhost/test", function(error, db) {
      if (error) throw error;

       const location = request.location;
      let obj= { "url": data.url, "date": Date(),"ip":location };  
      db.collection("download").insert(obj, null, function (error, results) {
      if (error) throw error;
      //console.log("Connecté à la base de données 'tutoriel'");
      });
    });

    setTimeout(function(){  

      let mailOptions = {
        from: '"CombienCaMeFait" <combiencamefait.contact@gmail.com>', // sender address
        to: 'iwish@hotmail.fr',
        bcc:'cdricbresson@gmail.com', // list of receivers
        subject: 'Le résultat de votre simulation ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>',
        attachments:[
          {
            filename: 'resultat-simulation.pdf',
            path: fileName // stream this file
          }
        ] // html body
      };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        //    console.log('Message %s sent: %s', info.messageId, info.response);
        });
        reply.file(fileName); }, 2000);
    }
       // la méthode .file provient du plugin inert (serve a simple file from disk)
});

server.route({
    method:'POST',
    path:'/loan/send-by-email-amortization-schedule',
    handler: function (request,reply){

       let payload = request.payload;   
       let html = fs.readFileSync('./templates/index.html', 'utf8');
      let emailContent = fs.readFileSync('./templates/email.html', 'utf8');
       let data=JSON.parse(payload);
       let template = Handlebars.compile(html);
       let result = template(data);
       let fileName="./"+Math.random()+".pdf"
       pdf.create(result).toStream(function(err, stream){
        stream.pipe(fs.createWriteStream(fileName));
      });

    MongoClient.connect("mongodb://localhost/test", function(error, db) {
      if (error) throw error;

       const location = request.location;
      let obj= { "url": data.url,"email":data.email, "date": Date(),"ip":location };  
      db.collection("download").insert(obj, null, function (error, results) {
      if (error) throw error;
      console.log("Connecté à la base de données 'tutoriel'");
      });
    });

    setTimeout(function(){  

       let mailOptions = {
    from: '"CombienCaMeFait" <combiencamefait.contact@gmail.com>', // sender address
    to: data.email,
    bcc:'iwish@hotmail.fr', // list of receivers
    subject: 'Le résultat de votre simulation ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: emailContent,
    attachments:[
      {
        filename: 'resultat-simulation.pdf',
        path: fileName // stream this file
      }
    ] // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
      
    let response={
      "emailSendingStatus":"L'email a bien été envoyé."
    } 
     reply(response);},2000);
      
    }
       // la méthode .file provient du plugin inert (serve a simple file from disk)
});

server.route({
    method: 'POST',
    path: '/contact',
    handler: function (request, reply) {

        let payload = request.payload;
        let data=JSON.parse(payload);
       const location=request.location;       

         MongoClient.connect("mongodb://localhost/test",   function(error, db) {
      if (error) throw error;

      let obj= { "email": data.email,"message":data.message, "date": Date(),"ip":location };  
      db.collection("contact").insert(obj, null, function (error, results) {
      if (error) throw error;
      console.log("Connecté à la base de données 'tutoriel'");
      });
    });

  

       let mailOptions = {
    from: '"CombienCaMeFait" <combiencamefait.contact@gmail.com>', // sender address
    to: 'iwish@hotmail.fr',
    subject:'Formulaire de contact' , // Subject line
    text: 'Hello world ?',
    html:'<p>'+data.email+'</p><p>'+data.message+'</p>'
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});


      let result={
        "answer":"Le message a bien été envoyé."
      };

    reply(result);
    
    }
    
});


server.route({
    method: 'POST',
    path: '/trading/trading-result',
    handler: function (request, reply) {

      let data=request.payload;
      let obj=JSON.parse(data);
      let result;
      
       console.log(obj);
       console.log(obj.choice);

      const location = request.location;
      winston.info(obj);

     let trading= new TradingResultSimulation(obj);

     if(obj.choice=='buyAndSell'){

      let purchasedBrokerageCostsAmount=trading.purchasedBrokerageCostsAmount;
      let purchasedAmount=trading.purchasedAmount;
      let purchasedUnitCostPrice=trading.purchasedUnitCostPrice;
      let salesBrokerageCostsAmount=trading.salesBrokerageCostsAmount;
      let salesAmount=trading.salesAmount;
      let grossResult=trading.grossResult;
      let grossResultLabel=trading.grossResultLabel;
      let performance=trading.performance;
      let socialP=trading.socialP;
      let netResult=trading.netResult;

      result={
         "purchasedBrokerageCostsAmount":purchasedBrokerageCostsAmount,
         "purchasedAmount":purchasedAmount,
         "purchasedUnitCostPrice":purchasedUnitCostPrice,
         "salesBrokerageCostsAmount":salesBrokerageCostsAmount,
         "salesAmount":salesAmount,
         "grossResult":grossResult,
         "grossResultLabel":grossResultLabel,
         "performance":performance,
         "ps":socialP,
         "netResult":netResult
      };
    
    }else{
    
      let purchasedBrokerageCostsAmount=trading.purchasedBrokerageCostsAmount;
      let purchasedAmount=trading.purchasedAmount;
      let purchasedUnitCostPrice=trading.purchasedUnitCostPrice;

      result={
         "purchasedBrokerageCostsAmount":purchasedBrokerageCostsAmount,
         "purchasedAmount":purchasedAmount,
         "purchasedUnitCostPrice":purchasedUnitCostPrice,
      };
    
    }

    reply(result);
    
    }
});



server.start((err)=>{

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

});
