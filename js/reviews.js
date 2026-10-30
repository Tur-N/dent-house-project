/* ==========================================================================
   Dent house Dental Clinic — Dynamic Reviews & Patient Testimonials
   jQuery Version: 3.7.1
   $(function () { ... }) мақсаты:
   Браузер DOM ағашын толық оқып біткенше күтеді, скрипт қатесіз жұмыс істеуі үшін қажет.
   ========================================================================== */

$(function () {

    /* --------------------------------------------------------------------------
       FEATURE 3 REWRITTEN: Массивтен пікір карточкаларын динамикалық құру
       Plain JS-те: document.createElement(), className, appendChild, onclick
       jQuery әдістері: $('<div class="...">'), .append(), .each(), .closest(), .find()
       Салыстыру: jQuery арқылы HTML үзінділерін жасау әлдеқайда оңай әрі жинақы,
       ал оқиғаларды делегация арқылы басқару жадты үнемдейді.
       -------------------------------------------------------------------------- */

    // 1. Деректер массиві (HTML-де мүлде жоқ, тек кодта сақталған)
    const reviewsData = [
        {
            name: "Aida Serikova",
            service: "3D Intraoral Scanning",
            stars: "★★★★★",
            shortText: "Very fast and comfortable scan without traditional paste.",
            fullReview: "The 3D intraoral scanning took only 10 minutes. The doctor explained every step clearly on the screen. Highly recommended!"
        },
        {
            name: "Marat Aliyev",
            service: "Dental Implantation",
            stars: "★★★★★",
            shortText: "Dr. Mukhamedyarov is a master of implant surgery.",
            fullReview: "I had two implants placed in one session. Completely painless procedure, fast recovery and very caring clinic staff."
        },
        {
            name: "Dinara Ospanova",
            service: "Therapeutic Dentistry",
            stars: "★★★★☆",
            shortText: "Clean facilities, microscope treatment was great.",
            fullReview: "Root canal treatment was performed under a dental microscope. High-tech equipment and pleasant atmosphere."
        }
    ];

    // Басты беттегі соңғы секцияның алдына пікірлер контейнерін динамикалық енгізу
    let $reviewsSection = $("#reviews-list");
    if ($reviewsSection.length === 0) {
        $reviewsSection = $(
            '<section id="reviews-list" class="bg-white border rounded-4 shadow-sm p-4 mb-4">' +
            '<div class="d-flex justify-content-between align-items-center mb-3">' +
            '<h2 class="h3 text-primary mb-0">Patient Testimonials</h2>' +
            '<span class="badge bg-primary text-white">Verified Visits</span>' +
            '</div>' +
            '<div class="reviews-wrapper row g-3"></div>' +
            '</section>'
        );
        $("main.container section:last").before($reviewsSection);
    }

    const $cardsWrapper = $reviewsSection.find(".reviews-wrapper");

    // 2. Массивті .each() арқылы айналып, карточкаларды .append() арқылы салу
    $.each(reviewsData, function (index, item) {
        const cardMarkup = $(
            '<article class="col-12 col-md-4">' +
            '<div class="review-card bg-light border rounded-3 p-3 h-100 d-flex flex-column">' +
            '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<h3 class="h5 mb-0 author-name text-primary">' + item.name + '</h3>' +
            '<span class="text-warning rating-stars">' + item.stars + '</span>' +
            '</div>' +
            '<span class="badge bg-white text-secondary border align-self-start mb-2">' + item.service + '</span>' +
            '<p class="short-desc flex-grow-1">' + item.shortText + '</p>' +
            /* ТҮЗЕТІЛГЕН ЖЕР: Bootstrap-тің d-none класының орнына style="display: none;"
               қолданылды, себебі slideToggle() біркелкі жұмыс істеуі қажет */
            '<p class="full-desc text-muted small mt-2" style="display: none;">' + item.fullReview + '</p>' +
            '<button type="button" class="btn btn-sm btn-outline-primary mt-2 toggle-review-btn">' +
            'Read Details' +
            '</button>' +
            '</div>' +
            '</article>'
        );
        $cardsWrapper.append(cardMarkup);
    });

    /*
       CHAINING МЫСАЛЫ ЖӘНЕ СЕЛЕКТОР ФИЛЬТРІ (:first):
       1) $(".review-card:first") -> Тізімдегі бірінші карточканы сүзіп алады
       2) .removeClass("bg-light") -> Сұр фонды алып тастайды
       3) .addClass("border-primary shadow-sm") -> Көк жақтау мен көлеңке қосады
       4) .find(".author-name").prepend("★ ") -> Автор атының алдына таңба салады
    */
    $(".review-card:first")
        .removeClass("bg-light")
        .addClass("border-primary shadow-sm")
        .find(".author-name")
        .prepend("★ ");


    /* --------------------------------------------------------------------------
       EVENT DELEGATION
       Ата-ана: $("#reviews-list") (бұрыннан бар элемент)
       Бала элемент: ".toggle-review-btn" (код арқылы кейін құрылған батырма)

       Неліктен $(".toggle-review-btn").on("click", ...) тікелей байланысы жұмыс істемейді?
       Себебі бұл батырмалар парақша алғаш ашылған кезде DOM ағашында болған жоқ. Олар тек
       JS коды орындалған соң кейіннен пайда болды. Егер тікелей байласақ, jQuery оларды таппай,
       шерту оқиғасы мүлде орындалмай қалады.
       Ал делегация арқылы оқиғаны басынан бар ата-анасына (#reviews-list) тапсырамыз, батырма
       басылғанда оқиға DOM ағашымен жоғары көтеріліп (event bubbling), ата-анасы оны ұстап алады.
       -------------------------------------------------------------------------- */
    $("#reviews-list").on("click", ".toggle-review-btn", function (event) {
        event.preventDefault();

        // $(this) — дәл басылған батырманы көрсетеді
        const $clickedButton = $(this);

        // TRAVERSAL (ағаш бойынша элемент іздеу):
        // 1) .closest() — батырмадан жоғары көтеріліп, ең жақын карточканы табады
        const $currentCard = $clickedButton.closest(".review-card");

        // 2) .find() — сол карточканың ішіндегі жасырын мәліметті табады
        const $detailedText = $currentCard.find(".full-desc");

        // ЭФФЕКТ: slideToggle(300ms) ұзақтығымен және аяқталу Callback функциясымен
        $detailedText.slideToggle(300, function () {
            // Callback: анимация аяқталған соң батырманың жазуы мен класын ауыстыру
            if ($detailedText.is(":visible")) {
                $clickedButton
                    .text("Hide Details")
                    .removeClass("btn-outline-primary")
                    .addClass("btn-secondary");
            } else {
                $clickedButton
                    .text("Read Details")
                    .removeClass("btn-secondary")
                    .addClass("btn-outline-primary");
            }
        });
    });

});