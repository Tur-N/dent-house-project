/* ==========================================================================
   Dent house Dental Clinic — Contacts & Booking Script
   jQuery Version: 3.7.1
   $(function () { ... }) мақсаты:
   DOM құрылымы толық жүктелгеннен кейін ғана осы іштегі код іске қосылады.
   ========================================================================== */

$(function () {

    // 1. Дәрігерлердің бос уақыттарының деректер нысаны (Object)
    const doctorSchedules = {
        mukhamedyarov: ["10:00", "11:00", "14:00", "16:00"],
        tauershe: ["10:30", "12:00", "15:00", "17:00"],
        kenzhe: ["09:30", "11:30", "14:30", "17:30"],
        sagimbayeva: ["10:00", "12:30", "15:00", "16:30"]
    };

    // Бүгінгі күнді күнтізбеге ең алғашқы күн етіп бекіту (.attr)
    const today = new Date().toISOString().split("T")[0];
    $("#appointment-date").attr("min", today);


    /* --------------------------------------------------------------------------
       FEATURE 1 REWRITTEN: Дәрігер уақыттарын басқару (Effects + DOM)
       Plain JS: hidden=true, replaceChildren, innerHTML
       jQuery: .slideDown(), .slideUp(), .html(), .prop(), .append()
       -------------------------------------------------------------------------- */
    function updateSchedule() {
        const doctorKey = $("#doctor").val();
        const $panel = $("#availability-panel");
        const $timeSelect = $("#appointment-time");
        const $info = $("#availability-info");
        const $result = $("#booking-result");

        // Дәрігер таңдалмаса панельді жабу (slideUp 300ms)
        if (!doctorKey) {
            $panel.slideUp(300, function () {
                $timeSelect.html('<option value="">Select a doctor first</option>').prop("disabled", true);
            });
            $info.text("Select a doctor to view available times.");
            $result.text("Select a specialist and appointment date to view the available times.");
            return;
        }

        // Дәрігер таңдалса панельді жұмсақ ашу (slideDown 300ms)
        $panel.slideDown(300);
        $timeSelect.prop("disabled", false).html('<option value="">Choose an available time</option>');

        const times = doctorSchedules[doctorKey] || [];
        const doctorName = $("#doctor option:selected").text().trim();

        // Опцияларды .append() арқылы тіркеу (.each циклі)
        $.each(times, function (index, time) {
            $timeSelect.append($("<option>", { value: time, text: time }));
        });

        $info.text("Available times loaded for " + doctorName);
        $result.text("Select a convenient time from the list above.");
    }

    $("#doctor").on("change", updateSchedule);


    /* --------------------------------------------------------------------------
       FEATURE 2 REWRITTEN: Форма валидациясы және Талонды шығару
       Plain JS: reportValidity(), alert()
       jQuery: .on("submit"), .val().trim(), .addClass(), .siblings(), .fadeIn()

       КОММЕНТАРИЙ (МҰҒАЛІМ СҰРАҒЫНА ЖАУАП):
       Браузерлік тексеріс ешқашан серверлік тексерісті алмастыра алмайды!
       Себебі кез келген адам DevTools арқылы тексеруді өшіре салады. Сервер — басты қорғаныс.
       -------------------------------------------------------------------------- */

    // Өріс қатесін шығару (.siblings арқылы жанындағы блокты табу)
    function showError($input, message) {
        $input.addClass("is-invalid").removeClass("is-valid");

        let $feedback = $input.siblings(".invalid-feedback");
        if ($feedback.length === 0) {
            $feedback = $('<div class="invalid-feedback"></div>');
            $input.after($feedback);
        }
        $feedback.text(message).show();
    }

    // Қатені өшіру
    function clearError($input) {
        $input.removeClass("is-invalid").addClass("is-valid");
        $input.siblings(".invalid-feedback").text("").hide();
    }

    // Пациент мәтін жазғанда қатені лезде кетіру (live check, $(this))
    $(".form-control, .form-select").on("input change", function () {
        if ($(this).val().trim() !== "") {
            clearError($(this));
        }
    });

    // Келісім чекбоксы басылғанда қатені өшіру (.prop("checked"))
    $("#privacy-consent").on("change", function () {
        if ($(this).prop("checked")) {
            $(this).removeClass("is-invalid");
            $(this).siblings(".invalid-feedback").hide();
        }
    });

    // Форма жіберілген (submit) кез
    $("#booking-form").on("submit", function (event) {
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
            showError($service, "Please select a required service.");
            isValid = false;
        } else {
            clearError($service);
        }

        // 4. Дәрігерді тексеру
        const $doctor = $("#doctor");
        if (!$doctor.val()) {
            showError($doctor, "Please choose a specialist.");
            isValid = false;
        } else {
            clearError($doctor);
        }

        // 5. Күнді тексеру
        const $date = $("#appointment-date");
        if (!$date.val()) {
            showError($date, "Please choose an appointment date.");
            isValid = false;
        } else {
            clearError($date);
        }

        // 6. Уақытты тексеру (.prop("disabled"))
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
            showError($consent, "You must confirm the details before booking.");
            isValid = false;
        } else {
            $consent.removeClass("is-invalid");
            $consent.siblings(".invalid-feedback").hide();
        }

        // Егер қате болса — тоқтату
        if (!isValid) {
            $("#booking-error")
                .removeClass("d-none")
                .html("<strong>Error:</strong> Please fill in all highlighted fields.")
                .fadeIn(400);

            $("#booking-confirmation").fadeOut(200);
            return;
        }

        // Қате блогын жасыру
        $("#booking-error").fadeOut(200);

        const patientName = $name.val().trim();
        const patientPhone = $phone.val().trim();
        const serviceName = $service.val();
        const doctorName = $("#doctor option:selected").text().trim();
        const appDate = $date.val();
        const appTime = $time.val();
        const ticketNumber = "DH-" + Math.floor(1000 + Math.random() * 9000);

        // ҚАБЫЛДАУ ТАЛОНЫНЫҢ МАЗМҰНЫ
        const ticketMarkup = `
            <div class="p-3 border border-success rounded-3 bg-white text-dark mt-2 shadow-sm">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h4 class="h5 mb-0 text-success fw-bold">✓ Appointment Confirmed!</h4>
                    <span class="badge bg-success fs-6">Ticket: ${ticketNumber}</span>
                </div>
                <p class="mb-1"><strong>Patient:</strong> ${patientName}</p>
                <p class="mb-1"><strong>Phone:</strong> ${patientPhone}</p>
                <p class="mb-1"><strong>Doctor:</strong> ${doctorName}</p>
                <p class="mb-1"><strong>Service:</strong> ${serviceName}</p>
                <p class="mb-2"><strong>Date & Time:</strong> <span class="text-primary fw-bold">${appDate} at ${appTime}</span></p>
                <p class="small text-muted mb-0">Clinic address: 48 Alikhan Bokeikhan Street, Astana</p>
            </div>
        `;

        /* CHAINING + CALLBACK:
           Талон шығады, инпуттар тазарады, бірақ талон өшпей сақталып қалады */
        $("#booking-confirmation")
            .removeClass("d-none")
            .html(ticketMarkup)
            .fadeIn(500, function () {
                // Экранды талонға қарай жұмсақ жылжыту
                $("html, body").animate({
                    scrollTop: $("#booking-confirmation").offset().top - 30
                }, 400);

                // Өрістердің мәнін тазарту (талонды өшірмейтін қауіпсіз тәсіл)
                $("#fullname, #phone, #appointment-date, #message").val("");
                $("#doctor, #service, #appointment-time").val("");
                $("#privacy-consent").prop("checked", false);
                $(".form-control, .form-select").removeClass("is-valid is-invalid");
                $("#availability-panel").slideUp(300);
            });
    });

    // Қолданушы өзі "Reset" батырмасын қолмен басқанда ғана талонды өшіру
    $("#reset-booking").on("click", function () {
        setTimeout(function () {
            $(".form-control, .form-select").removeClass("is-invalid is-valid");
            $(".invalid-feedback").hide();
            $("#availability-panel").slideUp(300);
            $("#booking-error, #booking-confirmation").fadeOut(200);
            $("#appointment-time").html('<option value="">Select a doctor first</option>').prop("disabled", true);
        }, 0);
    });

});