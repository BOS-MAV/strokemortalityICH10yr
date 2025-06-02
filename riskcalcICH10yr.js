/*risk calculation all cause mortality 1 year post SAH*/
function numberFormat(val, decimalPlaces) {

    var multiplier = Math.pow(10, decimalPlaces);
    return (Math.round(val * multiplier) / multiplier).toFixed(decimalPlaces);
}

function calc_risk() {
                //declare a totscore variable
               var totScore;
                //declare variables to hold the rest
                var age,ageCat,ageWeight, sex, sex_t,sexWeight,diabetes, diabetesWeight, 
                    dementia, dementiaWeight,  systolic,systolicWeight,priorKid,priorKidWeight,
                    priorHF,priorHFWeight,BMI,BMIWeight,ethnicity_t,ethnicityWeight,creatinine,
                    creatWeight,hospLength,hospLengthWeight,TBIWeight, marker;
               const risk = [0,0,0];
                age = parseInt($("#txtAge").val());
                // break out age by categories to compute weight
                if (age >=18 && age <= 44)
                {
                    ageCat = 1;
                    ageWeight =  -0.98376;
                }
                else if (age <= 54)
                {
                    ageCat = 2;
                    ageWeight =  -0.26662;
                }
                else if (age <= 64)
                {
                    ageCat = 3;
                    ageWeight = 0;
                }
                else if (age <=74)
                {
                    ageCat = 4;
                    ageWeight =  0.27649;
                }
                else if (age >= 75)
                {
                    ageWeight = 0.793;
                    ageCat = 5;
                }
                //next sex
                sex_t=$("input[name = 'Sex']:checked").val();
                if ( sex_t === "Male")
                    sexWeight = 0;
                else
                    sexWeight = -0.41222;
                // ethnicity
                ethnicity_t = $("input[name='Ethnicity']:checked").val();
                if (ethnicity_t === "nhisp")
                    ethnicityWeight = 0;
                else
                    ethnicityWeight = -0.23512;
                //length of hospitilization
                hospLength = parseInt($("#txtHosp").val());
                //determine weights based on cat
                if (hospLength <=4)
                    hospLengthWeight = 0;
                else if (hospLength <=9)
                    hospLengthWeight = 0.13458;
                else if (hospLength <=29)
                    hospLengthWeight = 0.41439;
                else if (hospLength <=89)
                    hospLengthWeight = 0.01992;
                else
                    hospLengthWeight = -0.856633;
                // diabetes
                if ($("input[name = 'Diabetes']:checked").val() === "Yes")
                    diabetes = 1;
                else
                    diabetes = 0;
                diabetesWeight = diabetes * 0.11899;
                //dementia
                if ($("input[name = 'Dementia']:checked").val() === "Yes")
                    dementia = 1;
                else
                    dementia = 0;
                dementiaWeight = dementia * 0.5389;
                //bpmeds
                if ($("input[name='Hypertension']:checked").val()==="No")
                    bpmedsWeight =0;
                else
                    bpmedsWeight = -0.11648;
                //prior chronic kidney disease
                if ($("input[name = 'priorKid']:checked").val() == "No")
                    priorKidWeight = 0;
                else
                    priorKidWeight= 0.1624;
                //prior heart failure
                if ($("input[name = 'priorHF']:checked").val() == "No")
                    priorHFWeight = 0;
                else
                    priorHFWeight= 0.38008;
                //blood pressure/labs
                if ($("#BP_Sys").val() ==="" || $("#BP_Sys").val() ==="M" || $("#BP_Sys").val() ==="m" )
                    {
                        marker = sex_t.trim().toLowerCase()+race_t.trim().toLowerCase()+ageCat;
                        console.log(marker);
                        bpSys = avgLabs[marker].measure[measureEnum.AVGSYS];
                    }
                    else
                    {           
                        bpSys = parseFloat($("#BP_Sys").val());
                    }
                    //compute weights for bpsys;
                    if (bpSys < 120)
                        bpSysWeight = 0.14765;
                    else if (bpSys <=129)
                        bpSysWeight = 0.17194;
                    else if (bpSys <= 139)
                        bpSysWeight = 0;
                    else 
                        bpSysWeight = 0.1596;
               
                // bmi
                if ($("#BMI").val() ==="" || $("#BMI").val() ==="M" || $("#BMI").val() ==="m" )
                    {
                        marker = sex_t.trim().toLowerCase()+race_t.trim().toLowerCase()+ageCat;
                        console.log(marker);
                        BMI = avgLabs[marker].measure[measureEnum.AVGBMI];
                    }
                    else
                    {           
                        BMI = parseFloat($("#BMI").val());
                    }
                    //compute weights for BMI;
                if (BMI < 18.5)
                   BMIWeight = 0.65892;
                else if (BMI <=24.9)
                    BMIWeight = 0.26783;
                else if (BMI <=29.9)
                    BMIWeight = 0;
                else if (BMI <=34.9)
                    BMIWeight = -0.13744;
                else if (BMI <=39.9)
                    BMIWeight = -0.01768;
                else
                    BMIWeight = -0.08244;
                // creatine
                if ($("#creat").val()  === '' || $("#creat").val() === "M" || $("#creat").val() ==="m")
                {
                    marker = sex_t.trim().toLowerCase()+race_t.trim().toLowerCase()+ageCat;
                    creatinine = avgLabs[marker].measure[measureEnum.AVGCREAT];
                }
                else
                    creatinine = parseFloat($("#creat").val());
                if (creatinine < 0.74)
                    creatWeight = 0.04083;
                else if (creatinine <= 1.35)
                    creatWeight = 0;
                else
                    creatWeight = 0.22305;
                //TBI
                if ($("input[name = 'TBIR']:checked").val() === "No")
                    TBIWeight = 0;
                else
                    TBIWeight = 0.39449;

                xbeta = ageWeight + sexWeight +  ethnicityWeight + hospLengthWeight +
                        diabetesWeight + dementiaWeight + bpmedsWeight+priorKidWeight+
                        priorHFWeight+bpSysWeight+creatWeight+BMIWeight;
                console.log(creatWeight);
                console.log(ageWeight);
                //eXbeta = Math.exp(xbeta-2.93853);
                eXbeta = Math.exp(xbeta);
                //calculate risk and put in array
                console.log(xbeta);
                console.log(eXbeta);
                //risk = 1 - Math.pow(0.98731,eXbeta);
                risk[0] = numberFormat(Math.pow(0.9604461,eXbeta)*100,0);
                risk[1] = numberFormat(Math.pow(0.8634509,eXbeta)*100,0);
                risk[2] = numberFormat(Math.pow(0.7227288,eXbeta)*100,0);
                return risk;
                }   