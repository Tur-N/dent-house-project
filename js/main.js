/* ==========================================================================
   Dent house Dental Clinic — Shared Main Script
   jQuery Version: 3.7.1 (Assignment талабы бойынша қосылған нұсқа)
   $(function () { ... }) не үшін қажет:
   Бұл — $(document).ready() әдісінің қысқа түрі. Браузер бүкіл HTML құрылымын
   (DOM) толық оқып біткеннен кейін ғана осы іштегі код орындалады. Онсыз элементтер
   әлі құрылмаған болып шығып, код қате береді.
   ========================================================================== */

$(function () {

    /* --------------------------------------------------------------------------
       1. Ортақ навигацияны бақылау (Active Navigation Link Handler)
       Селекторлар: тег пен класс бойынша ('nav .nav-link')
       Traversal: .parent(), .siblings(), .find(), .each() әдістері
       -------------------------------------------------------------------------- */
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    $("nav .nav-link").each(function () {
        const linkHref = $(this).attr("href");

        // Егер сілтеме дәл осы ашылып тұрған бетке тең болса — active класын бекіту
        if (linkHref === currentPath) {
            $(this)
                .addClass("active")
                .attr("aria-current", "page")
                .parent()
                .siblings()
                .find(".nav-link")
                .removeClass("active")
                .removeAttr("aria-current");
        }
    });


    /* --------------------------------------------------------------------------
       2. Шынжырлау (Chaining) және тышқан оқиғалары (mouseenter / mouseleave)
       Батырмаларға анимациялық интерактивті микро-эффект беру
       -------------------------------------------------------------------------- */
    /* 
       CHAINING МЫСАЛЫ:
       1) $(this) -> Тышқан үстіне келген нақты батырманы таңдайды
       2) .stop(true, true) -> Алдыңғы аяқталмаған анимацияны бірден тоқтатады
       3) .animate({ opacity: 0.85 }, 150) -> 150мс ішінде мөлдірлікті жұмсақ өзгертеді
    */
    $(".btn-primary, .btn-warning")
        .on("mouseenter", function () {
            $(this).stop(true, true).animate({ opacity: 0.85 }, 150);
        })
        .on("mouseleave", function () {
            $(this).stop(true, true).animate({ opacity: 1.0 }, 150);
        });


    /* --------------------------------------------------------------------------
       3. Shared Booking Link Handler (Брондау блогына жылжу)
       README талабы: contacts.html#booking-form бағытына өту
       -------------------------------------------------------------------------- */
    $('a[href^="contacts.html#booking-form"]').on("click", function (event) {
        // Егер қолданушы дәл қазір contacts.html бетінде тұрса, парақшаны қайта жүктемейді
        if (window.location.pathname.endsWith("contacts.html")) {
            event.preventDefault();
            const $targetForm =$("#booking-form");

            if ($targetForm.length > 0) {$("html, body").animate({
                scrollTop: $targetForm.offset().top - 40
            }, 400);

                // Формаға назар аударту үшін қысқа жыпылықтау эффектісі
                $targetForm.fadeOut(100).fadeIn(200);
            }
        }
    });

});