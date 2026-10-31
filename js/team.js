/* ==========================================================================
   Dent house Dental Clinic — Medical Team Script
   jQuery Version: 3.7.1
   $(function () { ... }) не үшін қажет:
   Бұл — $(document).ready() әдісінің қысқа түрі. Браузер team.html бетінің
   DOM құрылымын толық жүктеп болғаннан кейін ғана осы іштегі код орындалады.
   ========================================================================== */

$(function () {

    /* --------------------------------------------------------------------------
       1. Мамандық белгілеріне (Badges) сүзгі логикасын қосу
       Селектор: '.doctor-card .badge'
       Traversal: .closest(), .find(), .siblings()
       Эффектілер: .fadeOut(200), .fadeIn(300)
       -------------------------------------------------------------------------- */

    // Мамандық белгілеріне тышқан көрсеткішін (cursor) бағыттау стилін беру
    $(".doctor-card .badge").css("cursor", "pointer");

    // Белгіні шерткенде (click) сүзгілеу
    $(".doctor-card .badge").on("click", function () {
        // $(this) — дәл осы шертілген badge элементін білдіреді
        const selectedSpecialty = $(this).text().trim();

        // 1-ШЫНЖЫР (Chaining 1): Түймені басу анимациясы
        $(this)
            .stop(true, true)
            .animate({ opacity: 0.5 }, 100)
            .animate({ opacity: 1.0 }, 150);

        // Барлық дәрігер карточкаларын аралап тексеру (.each() қолданысы)
        $(".doctor-card").each(function () {
            const $cardWrapper =$(this).closest("article");
            const cardText = $(this).text();

            // Егер дәрігердің мамандығы сәйкес келсе — көрсету, келмесе — жасыру
            if (cardText.indexOf(selectedSpecialty) !== -1) {
                $cardWrapper.fadeIn(300); } else {$cardWrapper.fadeOut(200);
            }
        });
    });


    /* --------------------------------------------------------------------------
       2. Дәрігер карточкаларына тышқан келгендегі эффект (mouseenter / mouseleave)
       2-ШЫНЖЫР (Chaining 2):
       1) $(this) -> Тышқан үстіне келген карточканы таңдайды
       2) .stop(true, true) -> Алдыңғы аяқталмаған қимылды тоқтатады
       3) .animate({ translateY: '-4px' }) -> Карточканы жұмсақ көтереді
       -------------------------------------------------------------------------- */
    $(".doctor-card")
        .on("mouseenter", function () {
            $(this).addClass("border-primary shadow");
        })
        .on("mouseleave", function () {
            $(this).removeClass("border-primary shadow");
        });


    /* --------------------------------------------------------------------------
       3. Сүзгіні қалпына келтіру (Барлық дәрігерді қайта көрсету)
       Парақшаның кез келген бос жерін немесе тақырыбын шерткенде қайтару
       -------------------------------------------------------------------------- */
    $("#team-title").css("cursor", "pointer").attr("title", "Click to reset filter");

    $("#team-title").on("click", function () {
        // Барлық карточкаларды қайта эффектімен ашу
        $("section[aria-label='Dental specialists'] article").fadeIn(300);
    });

});