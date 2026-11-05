
'use strict';

$(document).ready(function () {

    if (!$('body').hasClass('home-page')) {
        return;
    }

    // Clinic facility images.
    const facilities = [
        {
            id: 1,
            image: 'images/1.jpeg',
            title: 'Modern Dental Facilities',
            description: 'Dental clinic facilities and patient areas.'
        },
        {
            id: 2,
            image: 'images/2.jpeg',
            title: 'Patient Environment',
            description: 'A comfortable environment for dental visits.'
        },
        {
            id: 3,
            image: 'images/3.jpeg',
            title: 'Dental Care Environment',
            description: 'The Dent house clinic environment.'
        }
    ];

    // Demonstration testimonials based on the homepage reference.
    // These are not verified patient records.
    const testimonials = [
        {
            id: 1,
            name: 'Aida Serikova',
            service: '3D Intraoral Scanning',
            text: 'Very fast and comfortable scan without traditional paste.',
            details: 'This demonstration entry illustrates how patients can describe their experience with digital diagnostics.'
        },
        {
            id: 2,
            name: 'Marat Aliyev',
            service: 'Dental Implantation',
            text: 'Dr. Mukhamedyarov is a master of implant surgery.',
            details: 'This example highlights the implantology service and professional experience information shown on the medical team page.'
        },
        {
            id: 3,
            name: 'Dinara Ospanova',
            service: 'Therapeutic Dentistry',
            text: 'Clean facilities, microscope treatment was great.',
            details: 'This example demonstrates a testimonial about the clinic environment and therapeutic dentistry.'
        }
    ];

    // Render clinic facilities.
    function renderFacilities() {

        const $grid = $('#facility-grid');

        if (!$grid.length) {
            return;
        }

        $grid.empty();

        $.each(facilities, function (_, facility) {

            const $column = $('<div>', {
                class: 'col-12 col-md-6 col-lg-4'
            });

            const $card = $('<article>', {
                class: 'card h-100 shadow-sm overflow-hidden'
            });

            const $image = $('<img>', {
                src: facility.image,
                alt: facility.title,
                class: 'card-img-top',
                loading: 'lazy'
            });

            $image.css({
                width: '100%',
                height: '220px',
                objectFit: 'cover'
            });

            // Display a fallback message if an image is missing.
            $image.on('error', function () {

                $(this).replaceWith(
                    $('<div>', {
                        class: 'bg-light d-flex align-items-center justify-content-center text-muted',
                        text: 'Image unavailable'
                    }).css({
                        height: '220px'
                    })
                );

            });

            const $body = $('<div>', {
                class: 'card-body'
            });

            const $title = $('<h3>', {
                class: 'h5 card-title',
                text: facility.title
            });

            const $description = $('<p>', {
                class: 'card-text small text-muted mb-0',
                text: facility.description
            });

            $body.append($title, $description);

            $card.append($image, $body);

            $column.append($card);

            $grid.append($column);
        });
    }

    // Create a static decorative star display.
    // No patient rating is collected or stored.
    function createStars() {

        return $('<span>', {
            class: 'text-warning fw-bold',
            text: '★★★★★',
            'aria-label': 'Illustrative display only'
        });
    }

    // Create one demonstration testimonial.
    function createTestimonialCard(item) {

        const $column = $('<div>', {
            class: 'col-12 col-md-6 col-lg-4'
        });

        const $card = $('<article>', {
            class: 'card h-100 shadow-sm'
        });

        const $body = $('<div>', {
            class: 'card-body d-flex flex-column'
        });

        const $header = $('<div>', {
            class: 'd-flex flex-wrap justify-content-between align-items-center gap-2'
        });

        const $name = $('<h3>', {
            class: 'h5 mb-0',
            text: item.name
        });

        const $stars = createStars();

        $header.append($name, $stars);

        const $service = $('<span>', {
            class: 'badge text-bg-light align-self-start mt-3 mb-2',
            text: item.service
        });

        const $text = $('<p>', {
            class: 'card-text',
            text: item.text
        });

        const $details = $('<p>', {
            class: 'small text-muted js-testimonial-details',
            text: item.details
        }).hide();

        const $button = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-primary w-100 mt-auto js-testimonial-button',
            text: 'Read Details'
        })
        .attr('data-testimonial-id', item.id)
        .attr('aria-expanded', 'false');

        $body.append(
            $header,
            $service,
            $text,
            $details,
            $button
        );

        $card.append($body);

        $column.append($card);

        return $column;
    }

    // Render all testimonials.
    function renderTestimonials() {

        const $list = $('#testimonial-list');

        if (!$list.length) {
            return;
        }

        $list.empty();

        $.each(testimonials, function (_, item) {

            $list.append(
                createTestimonialCard(item)
            );

        });
    }

    // Delegation handles dynamically generated testimonial buttons.
    // A direct click handler would not catch buttons created later.
    $('#testimonial-list').on(
        'click',
        '.js-testimonial-button',
        function (event) {

            event.preventDefault();

            const $button = $(this);

            const $card = $button.closest('.card');

            const $details = $card.find(
                '.js-testimonial-details'
            );

            $details.stop(true, true).slideToggle(250, function () {

                const visible = $details.is(':visible');

                $button
                    .text(visible ? 'Hide Details' : 'Read Details')
                    .attr('aria-expanded', String(visible));

            });
        }
    );

    // Render the main page.
    renderFacilities();
    renderTestimonials();

});
