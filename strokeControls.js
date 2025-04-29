/* Program Title: strokeControl.js
 * Author: John Russo
 * Date: April 2025
 * 
 * Description: This program controls all data entry and navigation for the stroke 1 yr SAH
 * 
 */
// declare tooltip variables

var txtAgeToolTipOn = 1;
var txtHospToolTipOn = 1;
var BP_SysToolTipOn = 1;
var BP_DiaToolTipOn = 1;
var totCholToolTipOn = 1;
var creatToolTipOn = 1;
var BMIToolTipOn = 1;
var sexToolTipOn = 1;
var raceToolTipOn = 1;
var ethTootTipOn = 1;
var dementiaToolTipOn = 1;
var hyperToolTipOn = 1;
var statinToolTipOn = 1;
var priorKidToolTipOn = 1;
var priorHFToolTipOn = 1;

// variables to flag when a field has not been entered into yet
var txtHospFirst = true;
var BP_SysFirst = true;
var BP_DiaFirst = true;
var totcholFirst = true;
var creatFirst = true;
var BMIFirst = true;


/*function to fix problem with digits - i.e. user enters 1..2 */
function enforceOneDigitTwoDecimal(input) {
    input = input.replace("/[^\d.]/g", '');
    const parts = input.split('.');
    if (parts.length > 2) {
      input = parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '');
    }
  
    const match = input.match(/^(\d)?(?:\.(\d{0,2})?)?/);
    if (match) {
      const before = match[1] || '';
      const after = match[2] || '';
      return before + (after !== '' ? '.' + after : '');
    }
  
    return '';
  }

$(function () {
    $(".controlgroup").controlgroup();
    $(".controlgroup-vertical").controlgroup({
        "direction": "vertical"
    });
});
// get selection
$('.colors input[type=radio]').on('change', function () {
    console.log(this.value);
});
$("input:radio[name='thename']").each(function (i) {
    this.checked = false;
});

$(document).ready(function () {
    /*$('[data-toggle="tooltip"]').tooltip({
        trigger: 'focus', // or 'hover' or 'manual' as needed
        placement: 'bottom'
    });*/

    //$("#txtAge").focus().select();
    //set focus on txtAge
    setTimeout(function () {
        $("#txtAge").focus().select();
    }, 200);
    // loads json array of missing values

    loadAvgArray().then(() => {
        // Now avgLabs is ready to use
        console.log(avgLabs["malewhite1"].measure[measureEnum.AVGSYS]);
    });
    
    //create tooltips

    $("#txtAge").tooltip({title: "Please enter an age of 18 or greater", placement: "bottom", trigger: "manual"});
    $("#sexMark").tooltip({title: "Please choose either Male or Female", placement: "bottom", trigger: "manual"});
    $("#raceMark").tooltip({title: "Please choose White, African American or Other", placement: "bottom", trigger: "manual"});
    $("#ethnMark").tooltip({title: "Please choose not Hispanic/Latino or Hispanic/Latino", placement: "bottom", trigger: "manual"});
    $("#txtHosp").tooltip({title: "Please enter a value between 1 and 365", placement: "bottom", trigger: "manual"});
    $("#diabMark").tooltip({title: "Please choose either yes or no",placement: "bottom", trigger: "manual"});
    $("#dementMark").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger:"manual"});
    $("#hyperMark").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger:"manual"});
    $("#statinMark").tooltip({title: "Please choose either yes or no",placement:"bottom", trigger:"manual"});
    $("#priorKid").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger: "manual"});
    $("#priorHF").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger: "manual"});
    $("#afibMark").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger: "manual"});
    $("#BP_Sys").tooltip({title: "Please enter a systolic blood pressure between 80 and 300 mm HG, leave blank if you do not have a value", placement: "right", trigger: "manual"});
    $("#BP_Dia").tooltip({title: "Please enter a diastolic blood pressure between 50 and 180 mm HG, leave blank if you do not have a value", placement: "right", trigger: "manual"});
    $("#TotChol").tooltip({title: "Please enter total cholesterol between 0 and 500 mg/dL, leave blank if you do not have a value", placement: "bottom", trigger: "manual"});
    $("#creat").tooltip({title: "Please enter creatinine level between 0.59 and 1.39 mg/dL, leave blank if you do not have a value", placement: "bottom", trigger: "manual"});
    $("#BMI").tooltip({title: "Please enter a BMI between 12 and 60,leave blank if you do not have a value", placement: "bottom", trigger: "manual"});
    function ethnicity_Val() {
        return ($("input[name='Ethnicity']:checked").val() === 'nhisp' || $("input[name='Ethnicity']:checked").val() === 'hisp');
    }
    function sex_Val() {
        return ($("input[name='Sex']:checked").val() === 'Male' || $("input[name='Sex']:checked").val() === 'Female');
    }
    function race_Val() {
        const race = $("input[name='Race']:checked").val();
        return (race === 'White' || race === 'Black' || race === 'Hisp' || race === 'Other');
    }
    function diabetes_Val() {
        return ($("input[name='Diabetes']:checked").val() === 'Yes' || $("input[name='Diabetes']:checked").val() === 'No');
    }
    function dementia_Val() {
        return ($("input[name='Dementia']:checked").val() === 'Yes' || $("input[name='Dementia']:checked").val() === 'No');
    }
    function hypertension_Val() {
        return ($("input[name='Hypertension']:checked").val() === 'Yes' || $("input[name='Hypertension']:checked").val() === 'No');
    }
    function statin_Val() {
        return ($("input[name='Statin']:checked").val() === 'Yes' || $("input[name='Statin']:checked").val() === 'No');
    }
    function afib_Val() {
        return ($("input[name='afib']:checked").val() === 'Yes' || $("input[name='afib']:checked").val() === 'No');
    }
    function priorKid_Val() {
        return ($("input[name='priorKid']:checked").val() === 'Yes' || $("input[name='priorKid']:checked").val() === 'No');
    }
    function priorHF_Val() {
        return ($("input[name='priorHF']:checked").val() === 'Yes' || $("input[name='priorHF']:checked").val() === 'No');
    }

    //submit onclick handler

    $('#sub').on('click', function (event) {
        var isvalidate = $("#myForm")[0].checkValidity();
        //if the form is valid and all text fields validate then proceed with message
        //if ((isvalidate) && txtAge_Val() && txtHosp_Val() && BP_Sys_Val() && BP_Dia_Val() && totChol_Val() && creat_Val() && BMI_Val()) {
            if (isvalidate &&
                txtAge_Val() &&
                sex_Val() &&
                race_Val() &&
                ethnicity_Val() &&
                txtHosp_Val() &&
                diabetes_Val() &&
                dementia_Val() &&
                hypertension_Val() &&
                statin_Val() &&
                afib_Val() &&
                priorKid_Val() &&
                priorHF_Val() &&
                BP_Sys_Val(true) &&
                BP_Dia_Val(true) &&
                totChol_Val(true) &&
                creat_Val(true) &&
                BMI_Val()) 
                {
            event.preventDefault();
            var risk_res = [];
            risk_res = calc_risk();
            $('#message').html('30 day risk ' + risk_res[0]+"%<br/>90 day risk "+risk_res[1]+"%<br/>6 month risk "+risk_res[2]+
                "%</br>1 year risk "+risk_res[3]+"%");
            //$('#message').html('Results ' + calc_risk()+"%");
            $('#myModal').modal('show');
        }
        else
        {
            //find out where invalid value is or unchecked button
            
            if (txtAge_Val())
            {
                txtAgeToolTipOn = 1;
                $("#txtAge").tooltip("hide");
                if (($("input[name = 'Sex']:checked").val() !== 'Male') && ($("input[name = 'Sex']:checked").val() !== 'Female'))
                {
                    $("#sexMark").tooltip("show");
                    $("#sex").focus();
                }
                else
                {
                    $("#sexMark").tooltip("hide");
                    if (($("input[name = 'Race']:checked").val() != 'White') && ($("input[name = 'Race']:checked").val() != 'Black')
                            && ($("input[name = 'Race']:checked").val() != 'Hisp') && ($("input[name = 'Race']:checked").val() != 'Other'))
                    {
                        $("#raceMark").tooltip("show");
                        $("#race").focus();
                    }
                    else
                    {
                        $("#raceMark").tooltip("hide");
                        console.log($("input[name = 'Ethnicity']:checked").val());
                        if (($("input[name = 'Ethnicity']:checked").val() != 'nhisp') && ($("input[name = 'Ethnicity']:checked").val() != 'hisp'))
                            {
                               $("#ethnMark").tooltip("show");
                               $("#ethn").focus();
                            }
                        else
                            {
                                $("#ethnMark").tooltip("hide");
                                if (txtHosp_Val())
                                {
                                    
                                
                                if (($("input[name = 'Diabetes']:checked").val() !== 'Yes') && ($("input[name = 'Diabetes']:checked").val() != 'No'))
                                {
                                     $("#diabMark").tooltip("show");
                                     $("#diab").focus();
                                    }
                                else
                                {
                                    $("#diabMark").tooltip("hide");
                               
                                    if (($("input[name = 'Dementia']:checked").val() !== 'Yes') && ($("input[name = 'Dementia']:checked").val() !== 'No'))
                                    {
                                        console.log($("input[name = 'Dementia']:checked").val());
                                        $("#dementMark").tooltip("show");
                                        $("#dementia").focus().select();
                                    }
                                    else
                                    {
                                       $("#dementMark").tooltip("hide");
                                        if (($("input[name = 'Hypertension']:checked").val() !== 'Yes') && ($("input[name = 'Hypertension']:checked").val() !== 'No'))
                                        {
                                        $("#hyperMark").tooltip("show");
                                            $("#hbp").focus();
                                        }
                                        else
                                        {
                                            $("#hyperMark").tooltip("hide");
                                            if (($("input[name = 'Statin']:checked").val() !== 'Yes') && ($("input[name = 'Statin']:checked").val() !== 'No'))
                                            {
                                                $("#statinMark").tooltip("show");
                                                $("#Statin").focus();
                                            }
                                            else
                                            {
                                                $("#statinMark").tooltip("hide");
                                                if (($("input[name= 'afib']:checked").val() !== 'Yes') && ($("input[name= 'afib']:checked").val() !== 'No'))
                                                {
                                                    $("#afibMark").tooltip("show");
                                                    $("#afib").focus();
                                                }
                                                else
                                                {
                                                    $("#afibMark").tooltip("hide");                                          
                                                        
                                                    if (($("input[name= 'priorKid']:checked").val() !== 'Yes') && ($("input[name= 'priorKid']:checked").val() !== 'No'))
                                                    {
                                                        $("#priorKid").tooltip("show");
                                                        $("#priorKid").focus();
                                                          
                                                    }
                                                    else
                                                    {
                                                        $("#priorKid").tooltip("hide");
                                                        if (($("input[name= 'priorHF']:checked").val() !== 'Yes') && ($("input[name= 'priorHF']:checked").val() !== 'No'))
                                                        {
                                                            $("#priorHF").tooltip("show");
                                                            $("#priorHF").focus();
                                                              
                                                        }
                                                        else 
                                                        $("#priorHF").tooltip("hide");
                                                        if (!(BP_Sys_Val(true)))
                                                        {
                                                            $("#BP_Sys").tooltip("show");
                                                            $("#BP_Sys").focus();
                                                        }
                                                        else
                                                        {
                                                            $("#BP_Sys").tooltip("hide");
                                                            BP_SysToolTipOn = 1;
                                                            if (!(BP_Dia_Val(true)))
                                                            {
                                                                $("#BP_Dia").tooltip("show");
                                                                $("#BP_Dia").focus();
                                                            }
                                                            else
                                                            {
                                                                $("#BP_Dia").tooltip("hide");
                                                                BP_DiaToolTipOn = 1;
                                                                if (!(totChol_Val(true)))
                                                                {
                                                                    $("#totChol").tooltip("show");
                                                                    $("#totChol").focus();
                                                                }
                                                                else
                                                                {
                                                                    $("#totChol").tooltip("hide");
                                                                    totCholToolTipOn = 1;
                                                                    if (!(creat_Val(true)))
                                                                    {
                                                                        $("#creat").tooltip("show");
                                                                        $("#creat").focus().select();
                                                                    }
                                                                    else
                                                                    {
                                                                        $("#creat").tooltip("hide");
                                                                        creatToolTipOn  = 1;
                                                                        if (!(BMI_Val()))
                                                                        {       
                                                                            $("#BMI").tooltip("show");
                                                                            $("#BMI").focus().select();
                                                                        }
                                                                        else
                                                                        {
                                                                            $("#BMIL").tooltip("hide");
                                                                            BMIToolTipOn =1;
                                                                        }
                                                            }                                                
                                                        }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
        }
    }
}
        }
    });
    $('#BP_Sys').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (BP_Sys_Val(false)) {
                $("#BP_Dia").focus().select();
            }
        }
    });

    $('#BP_Dia').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (BP_Dia_Val(false)) {
                $("#TotChol").focus().select();
            }
        }
    });

    $('#TotChol').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (totChol_Val(false)) {
                $("#creat").focus().select();
            }
        }
    });

    $('#creat').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (creat_Val(false)) {
                $("#BMI").focus().select();
            }
        }
    });
    $("#txtAge").blur(function () {
          if (txtAge_Val())
          {
            txtAgeToolTipOn = 1;
            $("#sex").focus().select();
          }
    });

    $("#txtHosp").blur(function () {
        if (txtHosp_Val())
        {
          txtHospToolTipOn = 1;
        }
  });
  $("#BP_Sys").blur(function () {
    if (BP_Sys_Val(false))
    {
        BP_SysToolTipOn = 1;
    }
});

$("#BP_Dia").blur(function () {
    if (BP_Dia_Val(false))
    {
        BP_DiaToolTipOn = 1;
    }
});

$("#TotChol").blur(function () {
    if (totChol_Val(false))
    {
        totCholToolTipOn = 1;
    }
});

$("#creat").blur(function () {
    if (creat_Val(false))
    {
        creatToolTipOn = 1;
    }
});

$("#BMI").blur(function () {
    if (BMI_Val())
    {
        BMIToolTipOn = 1;
    }
});

$("#ethn").change(function (){
    
    //$("#txtHosp").focus().select();
    setTimeout(function () {
        $("#txtHosp").focus().select();
    }, 100);
    
})


    $("input[name='Sex']").change(function () {
        $("#sexMark").tooltip("hide");
        if ($("input[name='Sex']:checked").val()==="Male")
        {
            $("#sexMark").addClass("btn-selected");
            $("#maleGlyph").show();
            $("#femaleGlyph").hide();            
            $("#sexMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#sexMark1").addClass("btn-selected");
            $("#femaleGlyph").show();
            $("#maleGlyph").hide();
            $("#sexMark").removeClass("btn-selected");
        }
        $("#race").focus();
    });

    $("input[name='Race']").change(function () {
        $("#raceMark").tooltip("hide");
        if ($("input[name='Race']:checked").val()==="White")
        {
            $("#raceMark").addClass("btn-selected");
            $("#whiteGlyph").show();
            $("#afrAmGlyph").hide();  
            $("#otherRaceGlyph").hide();          
            $("#raceMark1").removeClass("btn-selected");
            $("#raceMark2").removeClass("btn-selected");
        }
        else if ($("input[name='Race']:checked").val()==="Black")
        {
            
            $("#raceMark1").addClass("btn-selected");
            $("#afrAmGlyph").show();
            $("#whiteGlyph").hide();
            $("#otherRaceGlyph").hide();     
            $("#raceMark").removeClass("btn-selected");
            $("#raceMark2").removeClass("btn-selected");
        }
        else
        {
             
            $("#raceMark2").addClass("btn-selected");
            $("#otherRaceGlyph").show();
            $("#whiteGlyph").hide();
            $("#afrAmGlyph").hide();  
            $("#raceMark").removeClass("btn-selected");
            $("#raceMark1").removeClass("btn-selected");
        }
    });
        $("input[name='Ethnicity']").change(function () {
            $("#ethnMark").tooltip("hide");
            if ($("input[name='Ethnicity']:checked").val()==="nhisp")
            {
                $("#ethnMark").addClass("btn-selected");
                $("#nhspGlyph").show();
                $("#hspGlyph").hide();                 
                $("#ethnMark1").removeClass("btn-selected");
            }
            else
            {
                $("#ethnMark1").addClass("btn-selected");
                $("#hspGlyph").show();
                $("#nhspGlyph").hide();                 
                $("#ethnMark").removeClass("btn-selected");
            }
        $("#txtHosp").focus().select();
    });
    $("input[name='Diabetes']").change(function () {
        $("#diabMark").tooltip("hide");
        if ($("input[name='Diabetes']:checked").val()==="Yes")
        {
            $("#diabMark").addClass("btn-selected");
            $("#diabYGlyph").show();
            $("#diabNGlyph").hide();            
            $("#diabMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#diabMark1").addClass("btn-selected");
            $("#diabNGlyph").show();
            $("#diabYGlyph").hide();
            $("#diabMark").removeClass("btn-selected");
        }
        $("#Dementia").focus();
    });
    $("input[name='Dementia']").change(function () {
       $("#dementMark").tooltip("hide");
       if ($("input[name='Dementia']:checked").val()==="Yes")
        {
            $("#dementMark").addClass("btn-selected");
            $("#dementYGlyph").show();
            $("#dementNGlyph").hide();            
            $("#dementMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#dementMark1").addClass("btn-selected");
            $("#dementNGlyph").show();
            $("#dementYGlyph").hide();
            $("#dementMark").removeClass("btn-selected");
        }
       $("#hbp").focus();
    });
    $("input[name='Hypertension']").change(function (){
       $("#hyperMark").tooltip("hide");
       if ($("input[name='Hypertension']:checked").val()==="Yes")
        {
            $("#hyperMark").addClass("btn-selected");
            $("#hyperYGlyph").show();
            $("#hyperNGlyph").hide();            
            $("#hyperMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#hyperMark1").addClass("btn-selected");
            $("#hyperNGlyph").show();
            $("#hyperYGlyph").hide();
            $("#hyperMark").removeClass("btn-selected");
        }
       $("Statin").focus();
    });
    $("input[name='Statin']").change(function () {
       $("#statinMark").tooltip("hide");
       if ($("input[name='Statin']:checked").val()==="Yes")
        {
            $("#statinMark").addClass("btn-selected");
            $("#statinYGlyph").show();
            $("#statinNGlyph").hide();            
            $("#statinMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#statinMark1").addClass("btn-selected");
            $("#statinNGlyph").show();
            $("#statinYGlyph").hide();
            $("#statinMark").removeClass("btn-selected");
        }
       $("#afib").focus();
    });
    $("input[name='afib']").change(function () {
        $("#afibMark").tooltip("hide");
        if ($("input[name='afib']:checked").val()==="Yes")
         {
             $("#afibMark").addClass("btn-selected");
             $("#afibYGlyph").show();
             $("#afibNGlyph").hide();            
             $("#afibMark1").removeClass("btn-selected");
         }
         else
         {
             
             $("#afibMark1").addClass("btn-selected");
             $("#afibNGlyph").show();
             $("#afibYGlyph").hide();
             $("#afibMark").removeClass("btn-selected");
         }
        $("#priorKid").focus().select();
     });
     $("input[name='priorKid']").change(function () {
        $("#priorKid").tooltip("hide");
        if ($("input[name='priorKid']:checked").val()==="Yes")
         {
             $("#priorKidMark").addClass("btn-selected");
             $("#priorKidYGlyph").show();
             $("#priorKidNGlyph").hide();            
             $("#priorKidMark1").removeClass("btn-selected");
         }
         else
         {
             
             $("#priorKidMark1").addClass("btn-selected");
             $("#priorKidNGlyph").show();
             $("#priorKidYGlyph").hide();
             $("#priorKidMark").removeClass("btn-selected");
         }
        $("#priorHF").focus();
     });
     $("input[name='priorHF']").change(function () {
        $("#priorHF").tooltip("hide");
        if ($("input[name='priorHF']:checked").val()==="Yes")
         {
             $("#priorHFMark").addClass("btn-selected");
             $("#priorHFYGlyph").show();
             $("#priorHFNGlyph").hide();            
             $("#priorHFMark1").removeClass("btn-selected");
         }
         else
         {
             
             $("#priorHFMark1").addClass("btn-selected");
             $("#priorHFNGlyph").show();
             $("#priorHFYGlyph").hide();
             $("#priorHFMark").removeClass("btn-selected");
         }
       // $("#BP_Sys").focus().select();
        setTimeout(function() {
            $('#BP_Sys').focus().select();
        }, 100);
  
     });
   /* $("#BP_Sys").blur(function () {
        if (BP_Sys_Val())
        {
            BP_SysToolTipOn = 1;
        }
    });*/
    $("#BP_Sys").change(function () {
     
        if (BP_Sys_Val(false))
        {
            setTimeout(function () {
                $("#BP_Dia").focus().select();
            }, 100);
            BP_SysToolTipOn = 1;
        }
    });
    $("#BP_Sys").on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (BP_Sys_Val(false)) {
                $("#BP_Dia").focus().select();
            }
        }
    });
    $("#BP_Dia").blur(function () {
       
       if (BP_Dia_Val(false))
       {
        BP_DiaToolTipOn = 1;
       }
    });
    $("#BP_Dia").change(function () {
     
        if (BP_Dia_Val(false))
        {
            setTimeout(function () {
                $("#TotChol").focus().select();
            }, 100);
            BP_DiaToolTipOn = 1;
        }
        else 
            $("BP_Dia").focus().select();
    });
    $("#TotChol").blur(function () {
       if (totChol_Val(false))
       {
        setTimeout(function () {
            $("#creat").focus().select();
        }, 100);
        totCholToolTipOn = 1;
       }
    });
    $("#TotChol").change(function () {
        if (totChol_Val(false))
        {
            setTimeout(function () {
                $("#creat").focus().select();
            }, 100);
         totCholToolTipOn = 1;
        }
     });
    
});

function txtAge_Val() {
        var input = $("#txtAge");
        if (parseInt(input.val()) < 18 || (input.val() === ''))
        {
            if (txtAgeToolTipOn===1)
            {
                $("#txtAge").tooltip("show");
                input.removeClass("valid").addClass("invalid");
                $("#myForm input").prop("disabled",true);
                $("#myForm button").prop("disabled",true);
                $("#txtAge").prop("disabled",false);
                $("#txtAge").focus();
                txtAgeToolTipOn = 0;
            }
             return false;
        }
        else
        {
            $("#txtAge").tooltip("hide");
            input.removeClass("invalid").addClass("valid");
            $("#myForm input").prop("disabled",false);
            $("#myForm button").prop("disabled",false);
            $("#sex").focus().select();
            return true;
        }
}

function txtHosp_Val() {
    var input = $("#txtHosp");
    if (((parseInt(input.val()) < 1 || parseInt(input.val()) > 365) || (input.val() === ''))&& !txtHospFirst)
    {
        if (txtHospToolTipOn===1)
        {
            $("#txtHosp").tooltip("show");
            input.removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#txtHosp").prop("disabled",false);
            $("#txtHosp").focus();
            txtHospToolTipOn = 0;
        }
         return false;
    }
    else
    {
        $("#txtHosp").tooltip("hide");
        input.removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        if (!txtHospFirst)
            $("#diab").focus();
        else   
            txtHospFirst = false;
        return true;
    }
}
function BP_Sys_Val(finalChk) {
    var input = $("#BP_Sys");

    if (input.val() === ''  && !finalChk) 
    {
        BP_SysFirst = false;
        return false;
    }
    if (parseInt(input.val()) < 80 || parseInt(input.val()) > 300 )
    {

        if (BP_SysToolTipOn ===1)
        {
            $("#BP_Sys").tooltip("show");
            $("#BP_Sys").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
           /* $("#BP_Sys").prop("disabled",false);
            $("#BP_Sys").focus();*/
            input.prop("disabled", false).focus();
            bySysToolTipOn = 0;
        }
        return false;
    }
    else
    {
        $("#BP_Sys").tooltip("hide");
        $("#BP_Sys").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        $("#BP_Dia").focus().select();
        return true;
    }
}

function BP_Dia_Val(finalChk) {
    var input = $("#BP_Dia");
    if (input.val() === ''  && !finalChk)
    {
        BP_DiaFirst = false;
        return false;
    }

    if (parseInt(input.val()) < 50 || parseInt(input.val()) > 180 )
    {

        if (BP_DiaToolTipOn ===1)
        {
            $("#BP_Dia").tooltip("show");
            $("#BP_Dia").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#BP_Dia").prop("disabled",false);
            $("#BP_Dia").focus();
            BP_DiaToolTipOn = 0;
        }
        return false;
    }
    else
    {
        $("#BP_Dia").tooltip("hide");
        $("#BP_Dia").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        $("#TotChol").focus();
        return true;
    }
}

function totChol_Val(finalChk) {
    var input = $("#TotChol");
    if (input.val() === ''  && !finalChk)
    {
        totcholFirst = false;
        return false;
    }

    if (parseInt(input.val()) < -1 || parseInt(input.val()) > 500)
    {

        if (totCholToolTipOn === 1)
        {
            $("#TotChol").tooltip("show");
            $("#TotChol").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#TotChol").prop("disabled",false); 
            $("#TotChol").focus();
            totCholToolTipOn = 0;            
        }
        return false;
    }
    else
    {
        $("#TotChol").tooltip("hide");
        $("#TotChol").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        $("#creat").focus().select();
        return true;
    }
}

function creat_Val(finalChk) {
    var input = $("#creat");
    if (input.val() === ''  && !finalChk)
    {
        creatFirst = false;
        return false;
    }
    if (enforceOneDigitTwoDecimal(input.val()) != input.val())
    {
        $("#creat").val(enforceOneDigitTwoDecimal(input.val()));
        $("#BMI").focus().select();
        /*if (creatToolTipOn === 1)
            {
                $("#creat").tooltip("show");
                $("#creat").removeClass("valid").addClass("invalid");
                $("#myForm input").prop("disabled",true);
                $("#myForm button").prop("disabled",true);
                $("#creat").prop("disabled",false); 
                $("#creat").focus();
                creatToolTipOn = 0;            
            }
            return false;*/
    }
    else
    {
        if (input.val() !== "" && (parseFloat(input.val()) < 0.59 || parseFloat(input.val()) > 1.39  ))
        {

            if (creatToolTipOn === 1)
            {
                $("#creat").tooltip("show");
                $("#creat").removeClass("valid").addClass("invalid");
                $("#myForm input").prop("disabled",true);
                $("#myForm button").prop("disabled",true);
                $("#creat").prop("disabled",false); 
                $("#creat").focus().select();
                creatToolTipOn = 0;            
            }
            return false;
        }
        else    
        {
            $("#creat").tooltip("hide");
            $("#creat").removeClass("invalid").addClass("valid");
            $("#myForm input").prop("disabled",false);
            $("#myForm button").prop("disabled",false);
            $("#BMI").focus().select();
            return true;
        }
    }
}
function BMI_Val() {
    var input = $("#BMI");
    if (BMIFirst)
    {
        BMIFirst = false;
        return true;
    }

    if (parseFloat(input.val()) < 12 || parseFloat(input.val()) > 49 || input.val() === "")
    {

        if (BMIToolTipOn === 1)
        {
            $("#BMI").tooltip("show");
            $("#BMI").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#BMI").prop("disabled",false); 
            $("#BMI").focus();
            BMIToolTipOn = 0;            
        }
        return false;
    }
    else
    {
        $("#BMI").tooltip("hide");
        $("#BMI").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        return true;
    }
}