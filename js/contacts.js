/* ==========================================================================
   Dent house Dental Clinic — Contacts & Booking Script
   jQuery Version: 3.7.1
   $(function () { ... }) не үшін қажет:
   Бұл — $(document).ready() әдісінің қысқа жазылуы. Ол браузер бүкіл HTML
   құрылымын (DOM) жүктеп болғаннан кейін ғана осы іштегі кодты іске қосады.
   Онсыз біз іздеген тегтер әлі табылмауы мүмкін.
   ========================================================================== */

$(function () {

    // 1. Дәрігерлердің демонстрациялық бос уақыттары (нысан/object)
    const doctorSchedules = {
        mukhamedyarov: ["10:00", "11:00", "14:00", "16:00"],
        tauershe: ["10:30", "12:00", "15:00", "17:00"],
        kenzhe: ["09:30", "11:30", "14:30", "17:30"],
        sagimbayeva: ["10:00", "12:30", "15:00", "16:30"]
    };

    // 2. Бүгінгі күнді анықтап, өткен күндерді таңдауға тыйым салу (.attr қолданысы)
    const today = new Date().toISOString().split("T")[0];
    $("#appointment-date").attr("min", today);


    /* --------------------------------------------------------------------------
       FEATURE 1 REWRITTEN: Дәрігер уақыттарын басқару (Effects + DOM manipulation)
       Plain JS-тегі: addEventListener("change"), hidden, replaceChildren, innerHTML
       jQuery әдістері: .on("change"), .slideDown(), .slideUp(), .html(), .prop(), .append()
       Салыстыру: Код едәуір қысқарды әрі jQuery-дің .slideDown/slideUp анимацияларының
       арқасында блок бірден жоғалып кетпей, жұмсақ ашылып-жабылатын болды.
       -------------------------------------------------------------------------- */
    function updateSchedule() {
        const doctorKey = $("#doctor").val();
        const $panel = $("#availability-panel");
        const $timeSelect = $("#appointment-time");
        const $info = $("#availability-info");

        // Егер дәрігер таңдалмаса — панельді жоғары қарай жұмсақ жабу (slideUp 300ms)
        if (!doctorKey) {
            $panel.slideUp(300, function () {
                // Callback: жабылып болған соң селекторды тазартып, өшіру (disabled)
                $timeSelect.html('<option value="">Select a doctor first</option>').prop("disabled", true);
            });
            $info.text("Select a doctor to view available times.");
            return;
        }

        // Дәрігер таңдалса — панельді төмен қарай ашу (slideDown 300ms)
        $panel.slideDown(300);
        $timeSelect.prop("disabled", false).html('<option value="">Choose an available time</option>');

        // Сол дәрігердің бос уақыттарын <select> ішіне .append() арқылы салу (.each қолданысы)
        const times = doctorSchedules[doctorKey] || [];
        $.each(times, function (index, time) {
            $timeSelect.append($("<option>", { value: time, text: time }));
        });

        const doctorName = $("#doctor option:selected").text().trim();
        $info.text("Available times loaded for " + doctorName);
    }

    // Дәрігер таңдауы ауысқан кезде функцияны шақыру (.on("change") қолданысы)
    $("#doctor").on("change", updateSchedule);


    /* --------------------------------------------------------------------------
       FEATURE 2 REWRITTEN: Форма валидациясы (Validation + Traversal + Chaining)
       Plain JS-тегі: form.reportValidity(), alert() терезесі
       jQuery әдістері: .on("submit"), .val().trim(), .addClass(), .siblings(), .fadeIn()
       Салыстыру: Қате енді экранға қарабайыр alert() болып емес, Bootstrap-тің
       is-invalid класы арқылы нақты қатесі бар өрістің астына әдемі шығады.

       МАҢЫЗДЫ ТҮСІНІКТЕМЕ (МҰҒАЛІМ СҰРАҒЫНА ЖАУАП):
       Браузерлік (клиенттік) валидация ешқашан сервердегі тексерісті алмастыра алмайды!
       Себебі кез келген пайдаланушы браузердің DevTools (F12) құралынан JS-ті өшіре салады
       немесе Postman/скрипт арқылы тура сұраныс жібере алады. Сервер — басты қорғаныс шебі.
       -------------------------------------------------------------------------- */

    // Өріс қатесін шығару функциясы (.siblings қолданысы)
    function showError($input, message) {
        $input.addClass("is-invalid").removeClass("is-valid");

        // .siblings() арқылы осы инпуттың дәл қасындағы қате блогын табамыз
        let $feedback = $input.siblings(".invalid-feedback");
        if ($feedback.length === 0) {
            $feedback = $('<div class="invalid-feedback"></div>');
            $input.after($feedback);
        }
        $feedback.text(message).show();
    }

    // Қатені тазарту функциясы
    function clearError($input) {
        $input.removeClass("is-invalid").addClass("is-valid");
        $input.siblings(".invalid-feedback").text("").hide();
    }

    // Қолданушы өрісті түзей бастағанда қатені бірден өшіру (live check, $(this) қолдану)
    $(".form-control, .form-select").on("input change", function () {
        // $(this) — дәл қазір өзгертіліп жатқан нақты инпут
        if ($(this).val().trim() !== "") {
            clearError($(this));
        }
    });

    // Келісім чекбоксы басылғанда қатені алып тастау (.prop("checked"))
    $("#privacy-consent").on("change", function () {
        if ($(this).prop("checked")) {
            $(this).removeClass("is-invalid");
            $(this).siblings(".invalid-feedback").hide();
        }
    });

    // Форма жіберілген (submit) кездегі басты тексеріс
    $("#booking-form").on("submit", function (event) {
        /*
           event.preventDefault() түсініктемесі:
           Бұл әдіс браузердің парақшаны қайта жүктеп (page reload) жіберуін тоқтатады.
           Онсыз деректер тексерілмей жоғалып кетіп, парақша басынан ашылып кетер еді.
        */
        event.preventDefault();

        let isValid = true;

        // 1. Аты-жөнін тексеру (.val().trim())
        const $name = $("#fullname");
        if ($name.val().trim().length < 3) {
            showError($name, "Please enter your full name (at least 3 characters).");
            isValid = false;
        } else {
            clearError($name);
        }

        // 2. Телефон нөмірін тексеру (Regex)
        const $phone = $("#phone");
        const phoneRegex = /^\+?[0-9\s\-()]{10,18}$/;
        if (!phoneRegex.test($phone.val().trim())) {
            showError($phone, "Please enter a valid phone number (e.g. +7 707 000 00 00).");
            isValid = false;
        } else {
            clearError($phone);
        }

        // 3. Қызметті тексеру
        const $service = $("#service");
        if (!$service.val()) {
            showError($service, "Please choose a service from the list.");
            isValid = false;
        } else {
            clearError($service);
        }

        // 4. Дәрігерді тексеру
        const $doctor = $("#doctor");
        if (!$doctor.val()) {
            showError($doctor, "Please select a specialist.");
            isValid = false;
        } else {
            clearError($doctor);
        }

        // 5. Күнді тексеру
        const $date = $("#appointment-date");
        if (!$date.val()) {
            showError($date, "Please choose a preferred appointment date.");
            isValid = false;
        } else {
            clearError($date);
        }

        // 6. Уақытты тексеру (.prop("disabled") арқылы)
        const $time = $("#appointment-time");
        if (!$time.val() || $time.prop("disabled")) {
            showError($time, "Please select an available appointment time.");
            isValid = false;
        } else {
            clearError($time);
        }

        // 7. Чекбоксты тексеру (.prop("checked"))
        const $consent = $("#privacy-consent");
        if (!$consent.prop("checked")) {
            $consent.addClass("is-invalid");
            showError($consent, "You must agree before submitting.");
            isValid = false;
        } else {
            $consent.removeClass("is-invalid");
            $consent.siblings(".invalid-feedback").hide();
        }

        // Егер кем дегенде бір өріс қате болса — тоқтату
        if (!isValid) {
            /* 1-ШЫНЖЫР (Chaining 1): 3 әдісті қатар қолдану
               1) .removeClass("d-none") -> жасыру класын өшіреді
               2) .html(...) -> қате мәтінін жазады
               3) .fadeIn(400) -> 400 миллисекунд ішінде эффектімен шығарады */
            $("#booking-error")
                .removeClass("d-none")
                .html("<strong>Error:</strong> Please correct the highlighted fields above.")
                .fadeIn(400);

            $("#booking-confirmation").fadeOut(200);
            return;
        }

        // Барлық өріс дұрыс болса
        $("#booking-error").fadeOut(200);

        const doctorName = $("#doctor option:selected").text().trim();
        const messageVal = $("#message").val().trim() || "Not provided";

        // WhatsApp-қа жіберілетін мәтін
        const whatsappMsg =
            "DENT HOUSE — APPOINTMENT REQUEST\n\n" +
            "Full Name: " + $name.val().trim() + "\n" +
            "Phone Number: " + $phone.val().trim() + "\n" +
            "Service: " + $service.val() + "\n" +
            "Specialist: " + doctorName + "\n" +
            "Preferred Date: " + $date.val() + "\n" +
            "Preferred Time: " + $time.val() + "\n" +
            "Additional Info: " + messageVal;

        const whatsappURL = "https://wa.me/77763362830?text=" + encodeURIComponent(whatsappMsg);

        /* 2-ШЫНЖЫР (Chaining 2) + Callback:
           1) .removeClass("d-none") -> класты алып тастайды
           2) .text(...) -> растау мәтінін орнатады
           3) .fadeIn(500, callback) -> 500мс ішінде пайда болып, аяқталған соң callback іске қосылады */
        $("#booking-confirmation")
            .removeClass("d-none")
            .text("Verification successful! Opening WhatsApp...")
            .fadeIn(500, function () {
                // Callback: анимация біткен сәтте орындалады
                window.open(whatsappURL, "_blank", "noopener,noreferrer");
                $("#booking-form").trigger("reset");
                $(".form-control, .form-select").removeClass("is-valid");
                $("#availability-panel").slideUp(300);
            });
    });

    // Форма "Reset" басылғанда өрістер мен кестені тазарту (.on("reset"))
    $("#booking-form").on("reset", function () {
        setTimeout(function () {
            $(".form-control, .form-select").removeClass("is-invalid is-valid");
            $(".invalid-feedback").hide();
            $("#availability-panel").slideUp(300);
            $("#booking-error, #booking-confirmation").fadeOut(200);
            $("#appointment-time").html('<option value="">Select a doctor first</option>').prop("disabled", true);
        }, 0);
    });

});