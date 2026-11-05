
'use strict';

$(document).ready(function () {

    const STORAGE_KEYS = {
        booking: 'dentHouse.confirmedAppointment',
        draft: 'dentHouse.bookingDraft',
        cart: 'dentHouse.serviceCart',
        doctor: 'dentHouse.selectedDoctor'
    };

    // Shared browser storage functions.
    function readStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.error('Storage read error:', error);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage write error:', error);
            return false;
        }
    }

    function removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage removal error:', error);
            return false;
        }
    }

    function formatPrice(value) {
        return new Intl.NumberFormat('en-US').format(value) + ' KZT';
    }

    window.DentHouse = {
        storageKeys: STORAGE_KEYS,
        readStorage: readStorage,
        writeStorage: writeStorage,
        removeStorage: removeStorage,
        formatPrice: formatPrice
    };

    // Use one shared header layout on every page.
    // This stylesheet is inserted after the existing project CSS.
    $('#dent-house-common-header-style').remove();

    const headerCSS = `
        .main-header {
            width: 100% !important;
            min-height: 280px !important;
            box-sizing: border-box !important;
        }

        .main-header > .container-fluid {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 auto !important;
            padding: 24px 48px !important;
            box-sizing: border-box !important;
        }

        .main-header .eyebrow {
            display: block !important;
            margin-bottom: 8px !important;
            line-height: 1.4 !important;
        }

        .main-header .site-title {
            display: block !important;
            font-size: clamp(2rem, 3.5vw, 3.5rem) !important;
            font-weight: 700 !important;
            line-height: 1.1 !important;
            margin: 0 0 8px !important;
            text-align: left !important;
        }

        .main-header .site-tagline {
            display: block !important;
            font-size: 1.25rem !important;
            line-height: 1.5 !important;
            margin: 0 0 24px !important;
            text-align: left !important;
        }

        .main-header nav.navbar {
            display: flex !important;
            width: 100% !important;
            justify-content: center !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .main-header .navbar-toggler {
            margin: 0 auto !important;
        }

        .main-header .navbar-collapse {
            flex-grow: 1 !important;
            justify-content: center !important;
        }

        .main-header .navbar-nav {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            list-style: none !important;
            gap: 8px !important;
        }

        .main-header .navbar-nav > .nav-item {
            display: flex !important;
            flex: 0 0 auto !important;
            align-items: center !important;
        }

        .main-header .navbar-nav .nav-link {
            display: block !important;
            text-align: center !important;
            white-space: nowrap !important;
        }

        @media (min-width: 992px) {
            .main-header .navbar-collapse {
                display: flex !important;
                flex-basis: auto !important;
            }
        }

        @media (max-width: 991.98px) {
            .main-header {
                min-height: auto !important;
            }

            .main-header .navbar-collapse:not(.show) {
                display: none !important;
            }

            .main-header .navbar-collapse.show {
                display: block !important;
            }

            .main-header .navbar-nav {
                flex-direction: column !important;
                align-items: center !important;
            }
        }

        @media (max-width: 767.98px) {
            .main-header > .container-fluid {
                padding: 24px 16px !important;
            }

            .main-header .site-title {
                font-size: clamp(2rem, 7vw, 3rem) !important;
            }

            .main-header .site-tagline {
                font-size: 1.1rem !important;
            }
        }
    `;

    $('<style>', {
        id: 'dent-house-common-header-style',
        text: headerCSS
    }).appendTo('head');

    // Remove previously generated duplicate booking links.
    $('.main-header .js-booking-nav-item').remove();
    $('.main-header .js-quick-booking-wrap').remove();

    $('.main-header .navbar-nav a').filter(function () {
        return $(this).text().trim() === 'Book an Appointment';
    }).each(function () {
        $(this).closest('li').remove();
    });

    // Use the same active navigation logic on all pages.
    const currentPage =
        window.location.pathname.split('/').pop() || 'index.html';

    $('.main-header .navbar-nav a.nav-link').each(function () {

        const $link = $(this);
        const destination = ($link.attr('href') || '').split('#')[0];

        if (destination === currentPage) {
            $link.addClass('active');
            $link.attr('aria-current', 'page');
        } else {
            $link.removeClass('active');
            $link.removeAttr('aria-current');
        }
    });

    // Show a saved appointment reminder outside the Contacts page.
    if (!$('body').hasClass('contacts-page')) {

        const booking = readStorage(STORAGE_KEYS.booking);

        const $main = $('main').first();

        if (
            booking &&
            booking.ticket &&
            $main.length &&
            !$('#saved-booking-notice').length
        ) {
            const $notice = $('<section>', {
                id: 'saved-booking-notice',
                class: 'alert alert-success d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4'
            });

            const $details = $('<div>');

            $('<h2>', {
                class: 'h5 fw-bold mb-1',
                text: 'Saved Appointment: ' + booking.ticket
            }).appendTo($details);

            $('<p>', {
                class: 'mb-1',
                text: 'Patient: ' + booking.patient
            }).appendTo($details);

            $('<p>', {
                class: 'small mb-0',
                text: 'Date: ' + booking.date + ' at ' + booking.time
            }).appendTo($details);

            const $link = $('<a>', {
                href: 'contacts.html#booking-form',
                class: 'btn btn-success',
                text: 'View Saved Appointment'
            });

            $notice.append($details, $link);
            $main.prepend($notice);
        }
    }

});
