
'use strict';

$(document).ready(function () {

    if (!$('body').hasClass('orthodontics-page')) {
        return;
    }

    const $main = $('main').first();

    if (!$main.length) {
        return;
    }

    // Dent House frequently asked questions.
    const faqItems = [
        {
            id: 1,
            question: 'What is 3D intraoral scanning?',
            answer: '3D intraoral scanning creates a digital image of teeth and jaw structures. It can support clinical assessment and treatment planning.'
        },
        {
            id: 2,
            question: 'What are the benefits of digital scanning?',
            answer: 'Digital scanning supports visual records, treatment planning and easier comparison of digital dental models.'
        },
        {
            id: 3,
            question: 'How much does 3D scanning cost?',
            answer: 'The listed starting price for 3D Intraoral Scanning is 15,000 KZT. The final treatment plan must be confirmed with a specialist.'
        },
        {
            id: 4,
            question: 'Can I book an orthodontic consultation?',
            answer: 'Yes. Open the Contacts and Booking page, select a specialist and prepare an appointment request.'
        },
        {
            id: 5,
            question: 'What are the clinic opening hours?',
            answer: 'Monday-Friday: 10:00-21:00. Saturday-Sunday: 10:00-18:00.'
        },
        {
            id: 6,
            question: 'Who decides the orthodontic treatment plan?',
            answer: 'A qualified dental specialist evaluates the patient and discusses appropriate treatment options.'
        },
        {
            id: 7,
            question: 'Can digital models be used for follow-up?',
            answer: 'Digital records may support the comparison of dental models during follow-up appointments.'
        }
    ];

    // Create the FAQ section dynamically.
    const $section = $('<section>', {
        id: 'jquery-orthodontics-faq',
        class: 'bg-white border rounded-4 shadow-sm p-4 mt-4'
    });

    const $title = $('<h2>', {
        class: 'h3 text-primary',
        text: 'Frequently Asked Questions'
    });

    const $description = $('<p>', {
        class: 'text-muted',
        text: 'Choose a question to reveal its answer.'
    });

    const $list = $('<div>', {
        id: 'jquery-faq-list',
        class: 'mt-3'
    });

    // Generate every question and answer from the array.
    $.each(faqItems, function (_, item) {

        const $card = $('<article>', {
            class: 'card mb-3'
        });

        const $body = $('<div>', {
            class: 'card-body'
        });

        const $button = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-primary w-100 text-start js-faq-button',
            text: item.question
        });

        $button
            .attr('data-faq-id', item.id)
            .attr('aria-expanded', 'false');

        const $answer = $('<p>', {
            class: 'mt-3 mb-0 js-faq-answer',
            text: item.answer
        }).hide();

        $body.append($button, $answer);

        $card.append($body);

        $list.append($card);
    });

    const $note = $('<p>', {
        class: 'small text-muted mt-3 mb-0',
        text: 'For individual treatment advice, contact a qualified dental specialist.'
    });

    $section.append(
        $title,
        $description,
        $list,
        $note
    );

    $main.append($section);

    // Delegation allows this handler to catch FAQ buttons created later.
    // Direct event binding before card creation would miss those buttons.
    $main.on('click', '#jquery-faq-list .js-faq-button', function (event) {

        // Without preventDefault(), a button inside a form could submit it.
        event.preventDefault();

        const $button = $(this);

        const $answer = $button
            .closest('.card')
            .find('.js-faq-answer');

        const alreadyOpen = $answer.is(':visible');

        // Close other answers.
        $list.find('.js-faq-answer')
            .not($answer)
            .slideUp(200);

        $list.find('.js-faq-button')
            .not($button)
            .removeClass('active')
            .attr('aria-expanded', 'false');

        // Toggle the selected answer.
        $answer.stop(true, true).slideToggle(250, function () {

            const isOpen = $answer.is(':visible');

            $button.attr(
                'aria-expanded',
                String(isOpen)
            );

            $button.toggleClass(
                'active',
                isOpen
            );

        });

    });

});
