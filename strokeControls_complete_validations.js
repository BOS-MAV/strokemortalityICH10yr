
$(document).ready(function () {
    setTimeout(function () {
        $("#txtAge").focus().select();
    }, 200);

    loadAvgArray().then(() => {
        console.log(avgLabs["malewhite1"].measure[measureEnum.AVGSYS]);
    });

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
        return ($("input[name='dementia']:checked").val() === 'Yes' || $("input[name='dementia']:checked").val() === 'No');
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

    $('#sub').on('click', function (event) {
        var isvalidate = $("#myForm")[0].checkValidity();
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
            BP_Sys_Val() &&
            BP_Dia_Val() &&
            totChol_Val() &&
            creat_Val() &&
            BMI_Val()) 
        {
            event.preventDefault();
            var risk_res = [];
            risk_res = calc_risk();
            $('#message').html('30 day risk ' + risk_res[0] + "%<br/>90 day risk " + risk_res[1] + "%<br/>6 month risk " + risk_res[2] +
                "%</br>1 year risk " + risk_res[3] + "%");
            $('#myModal').modal('show');
        }
        else
        {
            // Form invalid, fallback to detailed error handling
        }
    });
});
