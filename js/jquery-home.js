
'use strict';

$(document).ready(function () {

    // Run only on the homepage.
    if (!$('body').hasClass('home-page')) {
        return;
    }

    const $main = $('main').first();

    if (!$main.length) {
        return;
    }

    // Demonstration testimonial records.
    // These are sample project entries, not verified patient reviews.
    const testimonials = [
        {
            id: 'aida',
            name: 'Aida Serikova',
            service: '3D Intraoral Scanning',
            text: 'Very fast and comfortable scan without traditional paste.',
            details: 'This sample testimonial describes a comfortable digital scanning experience and the use of modern intraoral diagnostic technology.'
        },
        {
            id: 'marat',
            name: 'Marat Aliyev',
            service: 'Dental Implantation',
            text: 'Dr. Mukhamedyarov is a master of implant surgery.',
            details: 'This sample testimonial highlights the dental implantation service and the importance of experienced implantology specialists.'
        },
        {
            id: 'dinara',
            name: 'Dinara Ospanova',
            service: 'Therapeutic Dentistry',
            text: 'Clean facilities, microscope treatment was great.',
            details: 'This sample testimonial describes the clinic environment and therapeutic treatment using microscopic dental equipment.'
        }
    ];

    // Locate the existing gallery in index.html.
    // The original three images are preserved.
    const $gallery = $main
        .find('section[aria-labelledby="gallery-heading"]')
        .first();

    // Remove any previous dynamically generated version.
    $('#patient-testimonials').remove();

    // Create the testimonials section.
    const $section = $('<section>', {
        id: 'patient-testimonials',
        class: 'bg-white border rounded-4 shadow-sm p-4 mb-4',
        'aria-labelledby': 'testimonials-heading'
    });

    const $header = $('<div>', {
        class: 'd-flex flex-wrap justify-content-between align-items-center gap-2 mb-3'
    });

    const $headingGroup = $('<div>');

    $('<p>', {
        class: 'text-uppercase text-secondary fw-bold small mb-1',
        text: 'PATIENT EXPERIENCE'
    }).appendTo($headingGroup);

    $('<h2>', {
        id: 'testimonials-heading',
        class: 'h3 text-primary mb-0',
        text: 'Patient Testimonials'
    }).appendTo($headingGroup);

    const $badge = $('<span>', {
        class: 'badge text-bg-secondary',
        text: 'Sample Demonstration Content'
    });

    $header.append($headingGroup, $badge);

    const $notice = $('<p>', {
        class: 'small text-muted',
        text: 'The following examples are illustrative project content and are not verified patient reviews.'
    });

    const $list = $('<div>', {
        id: 'testimonial-list',
        class: 'row g-3'
    });

    // Build one independent testimonial card.
    function createTestimonialCard(item) {

        const $column = $('<div>', {
            class: 'col-12 col-md-6 col-lg-4'
        });

        const $card = $('<article>', {
            class: 'card testimonial-card h-100 shadow-sm'
        }).attr('data-testimonial-id', item.id);

        const $body = $('<div>', {
            class: 'card-body d-flex flex-column'
        });

        const $name = $('<h3>', {
            class: 'h5 text-primary mb-2',
            text: item.name
        });

        const $service = $('<span>', {
            class: 'badge text-bg-light align-self-start mb-3',
            text: item.service
        });

        const $text = $('<p>', {
            class: 'card-text',
            text: item.text
        });

        // Each card has its OWN details element.
        const detailsId = 'testimonial-details-' + item.id;

        const $details = $('<div>', {
            id: detailsId,
            class: 'testimonial-details border-top pt-3 mt-2'
        }).hide();

        $('<p>', {
            class: 'small text-muted mb-0',
            text: item.details
        }).appendTo($details);

        const $button = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-primary w-100 mt-auto js-testimonial-details-toggle',
            text: 'Read Details'
        });

        $button
            .attr('data-testimonial-id', item.id)
            .attr('aria-controls', detailsId)
            .attr('aria-expanded', 'false');

        $body.append(
            $name,
            $service,
            $text,
            $details,
            $button
        );

        $card.append($body);
        $column.append($card);

        return $column;
    }

    // Render all three independent cards.
    $.each(testimonials, function (_, item) {

        $list.append(
            createTestimonialCard(item)
        );
    });

    $section.append(
        $header,
        $notice,
        $list
    );

    // Place testimonials directly after the existing image gallery.
    if ($gallery.length) {
        $gallery.after($section);
    } else {
        $main.append($section);
    }

    // Remove only handlers registered by this module before rebinding.
    // This prevents duplicate clicks if the module is initialised again.
    $section.off('click.testimonialDetails');

    // Delegated event handling for dynamically generated buttons.
    $section.on(
        'click.testimonialDetails',
        '.js-testimonial-details-toggle',
        function (event) {

            event.preventDefault();

            const $button = $(this);

            // Find ONLY the card associated with the clicked button.
            const $card = $button.closest('.testimonial-card');

            // Find ONLY the details inside that specific card.
            const $details = $card.find('.testimonial-details');

            // Toggle the current card, not the whole testimonial list.
            $details.stop(true, true).slideToggle(250, function () {

                const isOpen = $details.is(':visible');

                $button
                    .text(isOpen ? 'Hide Details' : 'Read Details')
                    .attr('aria-expanded', String(isOpen));

            });

        }
    );

});
