
'use strict';

$(document).ready(function () {

    const $form = $('#booking-form');

    if (!$form.length || !window.DentHouse) {
        console.error('Booking form or shared storage is unavailable.');
        return;
    }

    const storage = window.DentHouse;
    const keys = storage.storageKeys;

    // Form elements.
    const $name = $('#fullname');
    const $phone = $('#phone');
    const $email = $('#email');
    const $service = $('#service');
    const $doctor = $('#doctor');
    const $date = $('#appointment-date');
    const $time = $('#appointment-time');
    const $message = $('#message');
    const $consent = $('#privacy-consent');

    // Appointment time elements.
    const $showTimes = $('#show-times');
    const $panel = $('#availability-panel');
    const $info = $('#availability-info');

    // Existing X-ray elements from HTML.
    const $xraySection = $('#xray-selection');
    const $xrayCheckboxes = $('#xray-checkboxes');
    const $xrayError = $('<p>', {
        class: 'small text-danger mt-2 mb-0'
    }).hide();

    // Calculator elements.
    const $calculatorItems = $('#calculator-items');
    const $calculatorTotal = $('#calculator-total');
    const $calculatorNote = $('#calculator-note');

    // Feedback elements.
    const $result = $('#booking-result');
    const $confirmation = $('#booking-confirmation');
    const $errorBox = $('#booking-error');
    const $messageCounter = $('#message-counter');

    if (
        !$name.length ||
        !$phone.length ||
        !$email.length ||
        !$service.length ||
        !$doctor.length ||
        !$date.length ||
        !$time.length ||
        !$xrayCheckboxes.length
    ) {
        console.error('Some required Contacts HTML elements are missing.');
        return;
    }

    // Remove an old dynamically generated X-ray block, if one remains
    // from the previous JavaScript implementation.
    $('#jquery-xray-selection, #jquery-xray-column').remove();

    // Keep only one original HTML X-ray fieldset.
    $('fieldset[id="xray-selection"]')
        .slice(1)
        .remove();

    // Add the X-ray error to the original HTML fieldset.
    $xraySection.append($xrayError);

    // Use custom validation messages.
    // A production system must also validate data on a server.
    $form.prop('noValidate', true);

    // Clinic opening hours in minutes.
    const openingTime = 10 * 60;
    const weekdayClosing = 21 * 60;
    const weekendClosing = 18 * 60;

    const clinicAddress =
        '48 Alikhan Bokeikhan Street, Astana, Kazakhstan';

    // =========================================
    // 1. MEDICAL TEAM
    // =========================================

    const doctors = [
        {
            id: 'mukhamediyarov',
            name: 'Мухамедьяров Канат Магауиянович',
            specialty: 'Implantologist and prosthodontist',
            experience: 25
        },
        {
            id: 'tauershe',
            name: 'Тауерше Багжан Ордабаевич',
            specialty: 'Surgeon and implantologist',
            experience: 7
        },
        {
            id: 'kenzhe',
            name: 'Кенже Саржан Байжанович',
            specialty: 'Therapeutic dentist, surgeon, implantologist and prosthodontist',
            experience: 9
        },
        {
            id: 'sagimbayeva',
            name: 'Сагимбаева Зухра Бериковна',
            specialty: 'Therapeutic dentist and microscopic dentistry',
            experience: 10
        },
        {
            id: 'shalabay',
            name: 'Шалабай Жамиля Кайратовна',
            specialty: 'Therapeutic dentist and microscopic dentistry',
            experience: 6
        },
        {
            id: 'tukesheva',
            name: 'Тукешева Светлана Маратовна',
            specialty: 'Therapeutic dentist and periodontist',
            experience: 15
        },
        {
            id: 'abzhapbar',
            name: 'Абжапбар Сымбат Багдатовна',
            specialty: 'Pediatric dentist and microscopic dentistry',
            experience: 10
        },
        {
            id: 'otarbaeva',
            name: 'Отарбаева Алма Аманжоловна',
            specialty: 'Orthodontist',
            experience: 10
        }
    ];

    // =========================================
    // 2. COMPLETE PRICE CATALOGUE
    // =========================================

    const services = [
        {
            id: 'caries',
            name: 'Caries Treatment',
            price: 24000,
            duration: 60
        },
        {
            id: 'extraction',
            name: 'Tooth Extraction',
            price: 20000,
            duration: 45
        },
        {
            id: 'implant',
            name: 'Dental Implantation',
            price: 200000,
            duration: 120
        },
        {
            id: 'root1',
            name: '1-Canal Root Canal Therapy',
            price: 90000,
            duration: 90
        },
        {
            id: 'root2',
            name: '2-Canal Root Canal Therapy',
            price: 110000,
            duration: 120
        },
        {
            id: 'zirconium-natural',
            name: 'Zirconium Dioxide Crown — Natural Tooth',
            price: 140000,
            duration: 90
        },
        {
            id: 'zirconium-implant',
            name: 'Zirconium Dioxide Crown — Implant',
            price: 165000,
            duration: 90
        },
        {
            id: 'metal-natural',
            name: 'Metal-Ceramic Crown — Natural Tooth',
            price: 85000,
            duration: 90
        },
        {
            id: 'metal-implant',
            name: 'Metal-Ceramic Crown — Implant',
            price: 120000,
            duration: 90
        },
        {
            id: 'orthodontics',
            name: 'Orthodontics',
            price: null,
            duration: 60
        },
        {
            id: 'scan',
            name: '3D Intraoral Scanning',
            price: 15000,
            duration: 30
        },
        {
            id: 'model',
            name: '3D Diagnostic Model',
            price: 25000,
            duration: 45
        },
        {
            id: 'consultation',
            name: 'General Consultation',
            price: null,
            duration: 30
        },
        {
            id: 'xray-lower',
            name: 'Lower Jaw X-ray',
            price: 7500,
            duration: 15,
            isXray: true
        },
        {
            id: 'xray-upper',
            name: 'Upper Jaw X-ray',
            price: 7500,
            duration: 15,
            isXray: true
        }
    ];

    function formatPrice(value) {

        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
        }).format(value) + ' KZT';
    }

    function getToday() {

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function formatDate(value) {

        const date = new Date(value + 'T12:00:00');

        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    // =========================================
    // 3. POPULATE DOCTOR SELECT
    // =========================================

    $doctor.empty();

    $('<option>', {
        value: '',
        text: 'Choose a specialist'
    }).appendTo($doctor);

    $.each(doctors, function (_, doctor) {

        $('<option>', {
            value: doctor.id,
            text: doctor.name + ' — ' + doctor.specialty
        }).appendTo($doctor);

    });

    // =========================================
    // 4. POPULATE SERVICE SELECT
    // =========================================

    $service.empty();

    $('<option>', {
        value: '',
        text: 'Choose an additional service'
    }).appendTo($service);

    services
        .filter(item => !item.isXray)
        .forEach(function (item) {

            const priceText = item.price === null
                ? 'Price to be confirmed'
                : formatPrice(item.price);

            $('<option>', {
                value: item.id,
                text: item.name + ' — ' + priceText
            }).appendTo($service);

        });

    // =========================================
    // 5. X-RAY SELECTION
    // =========================================

    // The two X-ray checkboxes already exist in HTML.
    // This JavaScript only reads their current values.
    function getSelectedXrays() {

        return $xrayCheckboxes
            .find('input[type="checkbox"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get();
    }

    // Import X-rays selected on the Services page.
    function restoreCartXrays() {

        const cart = storage.readStorage(keys.cart, []);

        if (!Array.isArray(cart)) {
            return;
        }

        cart.forEach(function (item) {

            if (
                item.id === 'xray-lower' ||
                item.id === 'xray-upper'
            ) {

                $xrayCheckboxes
                    .find('input[value="' + item.id + '"]')
                    .prop('checked', true);
            }

        });
    }

    // Update X-ray visual states.
    function updateXrayAppearance() {

        $xrayCheckboxes.find('.form-check').each(function () {

            const $card = $(this);

            const checked = $card
                .find('input[type="checkbox"]')
                .prop('checked');

            $card.toggleClass('border-success', checked);

        });
    }

    // =========================================
    // 6. SERVICE CART
    // =========================================

    function getCart() {

        const cart = storage.readStorage(keys.cart, []);

        return Array.isArray(cart) ? cart : [];
    }

    // Sync X-ray checkbox states back to the service cart.
    function syncXrayCart() {

        const cart = getCart();

        const nonXrayItems = cart.filter(
            item =>
                item.id !== 'xray-lower' &&
                item.id !== 'xray-upper'
        );

        const selectedXrays = getSelectedXrays();

        selectedXrays.forEach(function (id) {

            nonXrayItems.push({
                id: id,
                quantity: 1
            });

        });

        storage.writeStorage(
            keys.cart,
            nonXrayItems
        );
    }

    // =========================================
    // 7. MERGE ALL SELECTED SERVICES
    // =========================================

    function getSelectedItems() {

        const selected = new Map();

        // First: import services from the catalogue cart.
        getCart().forEach(function (cartItem) {

            const service = services.find(
                item => item.id === cartItem.id
            );

            if (!service) {
                return;
            }

            const quantity = service.isXray
                ? 1
                : Math.max(
                    1,
                    Math.min(
                        10,
                        Number(cartItem.quantity) || 1
                    )
                );

            selected.set(service.id, {
                ...service,
                quantity: quantity
            });

        });

        // Second: add selected X-ray checkboxes.
        getSelectedXrays().forEach(function (id) {

            if (selected.has(id)) {
                return;
            }

            const service = services.find(
                item => item.id === id
            );

            if (service) {

                selected.set(id, {
                    ...service,
                    quantity: 1
                });

            }

        });

        // Third: add a service selected directly on Contacts.
        const selectedServiceId = $service.val();

        if (
            selectedServiceId &&
            !selected.has(selectedServiceId)
        ) {

            const service = services.find(
                item => item.id === selectedServiceId
            );

            if (service) {

                selected.set(service.id, {
                    ...service,
                    quantity: 1
                });

            }

        }

        // Map prevents duplicate services.
        return [...selected.values()];
    }

    // =========================================
    // 8. PRICE CALCULATOR
    // =========================================

    function calculateTotal() {

        return getSelectedItems().reduce(
            function (total, item) {

                if (item.price === null) {
                    return total;
                }

                return total + item.price * item.quantity;

            },
            0
        );
    }

    function calculateDuration() {

        const selected = getSelectedItems();

        const xrayItems = selected.filter(
            item => item.isXray
        );

        const treatmentItems = selected.filter(
            item => !item.isXray
        );

        // Both X-ray areas are treated as one combined procedure.
        const xrayDuration = xrayItems.length === 2
            ? 20
            : xrayItems.length === 1
                ? 15
                : 0;

        const treatmentDuration = treatmentItems.reduce(
            function (total, item) {

                return total + item.duration * item.quantity;

            },
            0
        );

        return xrayDuration + treatmentDuration;
    }

    function hasUnknownPrice() {

        return getSelectedItems().some(
            item => item.price === null
        );
    }

    function renderCalculator() {

        const selected = getSelectedItems();

        $calculatorItems.empty();

        if (selected.length === 0) {

            $('<p>', {
                class: 'text-muted mb-0',
                text: 'No service selected.'
            }).appendTo($calculatorItems);

        } else {

            $.each(selected, function (_, item) {

                const label = item.name +
                    (item.quantity > 1
                        ? ' x ' + item.quantity
                        : '');

                const priceText = item.price === null
                    ? 'Price to be confirmed'
                    : formatPrice(item.price * item.quantity);

                const $row = $('<div>', {
                    class: 'd-flex justify-content-between align-items-start gap-3 border-bottom py-2'
                });

                const $serviceName = $('<span>', {
                    text: label
                });

                const $price = $('<strong>', {
                    class: 'text-nowrap',
                    text: priceText
                });

                $row.append(
                    $serviceName,
                    $price
                );

                $calculatorItems.append($row);

            });

        }

        // Display the complete total.
        $calculatorTotal.text(
            'TOTAL PRICE: ' + formatPrice(calculateTotal())
        );

        if (hasUnknownPrice()) {

            $calculatorNote.text(
                'Some treatment prices are not listed. Their final cost must be confirmed with the clinic.'
            );

        } else if (selected.length === 0) {

            $calculatorNote.text(
                'Select a dental treatment or X-ray area to calculate the total.'
            );

        } else {

            $calculatorNote.text(
                'Estimated treatment duration: ' +
                calculateDuration() +
                ' minutes. All prices are displayed in KZT.'
            );

        }
    }

    // =========================================
    // 9. FORM VALIDATION
    // =========================================

    function createError($field, id) {

        const $error = $('<div>', {
            id: id,
            class: 'invalid-feedback'
        }).hide();

        $field.after($error);

        $field.attr('aria-describedby', id);

        return $error;
    }

    const errors = {
        name: createError($name, 'error-name'),
        phone: createError($phone, 'error-phone'),
        email: createError($email, 'error-email'),
        service: createError($service, 'error-service'),
        doctor: createError($doctor, 'error-doctor'),
        date: createError($date, 'error-date'),
        time: createError($time, 'error-time')
    };

    const $consentError = $('<p>', {
        class: 'small text-danger'
    }).hide();

    $consent.closest('.form-check').after($consentError);

    function showError($field, $error, message) {

        $field
            .addClass('is-invalid')
            .attr('aria-invalid', 'true');

        $error
            .stop(true, true)
            .text(message)
            .fadeIn(150);
    }

    function clearError($field, $error) {

        $field
            .removeClass('is-invalid')
            .removeAttr('aria-invalid');

        $error
            .stop(true, true)
            .fadeOut(100, function () {
                $(this).text('');
            });
    }

    function validateName() {

        const value = String($name.val() || '').trim();

        if (value.length < 2 || value.length > 100) {

            showError(
                $name,
                errors.name,
                'Enter your full name using 2 to 100 characters.'
            );

            return false;
        }

        clearError($name, errors.name);
        return true;
    }

    function validatePhone() {

        const value = String($phone.val() || '').trim();

        const digits = value.replace(/\D/g, '');

        const pattern = /^\+?[0-9\s()-]{10,20}$/;

        if (
            !pattern.test(value) ||
            digits.length < 10 ||
            digits.length > 15
        ) {

            showError(
                $phone,
                errors.phone,
                'Enter a valid phone number containing 10 to 15 digits.'
            );

            return false;
        }

        clearError($phone, errors.phone);
        return true;
    }

    function validateEmail() {

        const value = String($email.val() || '').trim();

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!pattern.test(value)) {

            showError(
                $email,
                errors.email,
                'Enter a valid email address.'
            );

            return false;
        }

        clearError($email, errors.email);
        return true;
    }

    function validateDoctor() {

        if (!$doctor.val()) {

            showError(
                $doctor,
                errors.doctor,
                'Choose a preferred dental specialist.'
            );

            return false;
        }

        clearError($doctor, errors.doctor);
        return true;
    }

    function validateService() {

        if (getSelectedItems().length === 0) {

            showError(
                $service,
                errors.service,
                'Select at least one dental service or X-ray area.'
            );

            $xrayError
                .text('Please select at least one treatment or X-ray.')
                .fadeIn(150);

            return false;
        }

        clearError($service, errors.service);

        $xrayError.fadeOut(100);

        return true;
    }

    function validateDate() {

        const value = $date.val();

        if (!value || value < getToday()) {

            showError(
                $date,
                errors.date,
                'Select today or a future appointment date.'
            );

            return false;
        }

        clearError($date, errors.date);
        return true;
    }

    function validateTime() {

        const selectedTime = $time.val();

        if (!$doctor.val()) {

            showError(
                $time,
                errors.time,
                'Select a specialist first.'
            );

            return false;
        }

        if (!$date.val()) {

            showError(
                $time,
                errors.time,
                'Select an appointment date first.'
            );

            return false;
        }

        if (
            !selectedTime ||
            $time.prop('disabled')
        ) {

            showError(
                $time,
                errors.time,
                'Choose an available appointment time.'
            );

            return false;
        }

        const optionExists = $time.find('option').filter(function () {
            return $(this).val() === selectedTime;
        }).length > 0;

        if (!optionExists) {

            showError(
                $time,
                errors.time,
                'Select one of the available time slots.'
            );

            return false;
        }

        const parts = selectedTime.split(':').map(Number);

        const startMinutes = parts[0] * 60 + parts[1];

        const selectedDate = new Date(
            $date.val() + 'T12:00:00'
        );

        const day = selectedDate.getDay();

        const weekend = day === 0 || day === 6;

        const closing = weekend
            ? weekendClosing
            : weekdayClosing;

        const now = new Date();

        const currentMinutes =
            now.getHours() * 60 + now.getMinutes();

        const pastToday =
            $date.val() === getToday() &&
            startMinutes <= currentMinutes;

        const finishesTooLate =
            startMinutes + calculateDuration() > closing;

        if (
            pastToday ||
            startMinutes < openingTime ||
            startMinutes >= closing ||
            finishesTooLate
        ) {

            showError(
                $time,
                errors.time,
                'Select a future time within clinic working hours.'
            );

            return false;
        }

        clearError($time, errors.time);
        return true;
    }

    function validateConsent() {

        if (!$consent.prop('checked')) {

            $consent.addClass('is-invalid');

            $consentError
                .text('Please confirm that your appointment information is correct.')
                .fadeIn(150);

            return false;
        }

        $consent.removeClass('is-invalid');

        $consentError.fadeOut(100);

        return true;
    }

    function validateForm() {

        const validations = [
            [validateName(), $name],
            [validatePhone(), $phone],
            [validateEmail(), $email],
            [validateService(), $service],
            [validateDoctor(), $doctor],
            [validateDate(), $date],
            [validateTime(), $time],
            [validateConsent(), $consent]
        ];

        const firstInvalid = validations.find(
            item => !item[0]
        );

        if (firstInvalid) {

            const $field = firstInvalid[1];

            if ($field.is($time)) {
                openTimePanel();
            }

            $field.trigger('focus');

            return false;
        }

        return true;
    }

    // =========================================
    // 10. APPOINTMENT DATE AND TIME
    // =========================================

    $date.attr('min', getToday());

    $time.prop('disabled', true);

    $panel.prop('hidden', true);

    // Open the time selection panel.
    function openTimePanel() {

        $panel.prop('hidden', false);

        if ($panel.is(':hidden')) {
            $panel.stop(true, true).slideDown(250);
        }

        $showTimes
            .text('Hide Appointment Times')
            .attr('aria-expanded', 'true');
    }

    // Close the time selection panel.
    function closeTimePanel() {

        $panel.stop(true, true).slideUp(250, function () {

            $panel.prop('hidden', true);

        });

        $showTimes
            .text('Choose Appointment Time')
            .attr('aria-expanded', 'false');
    }

    // The date and selected doctor determine the list of available
    // demonstration time slots.
    function updateAvailability() {

        const previousTime = $time.val();

        const doctor = doctors.find(
            item => item.id === $doctor.val()
        );

        const dateValue = $date.val();

        $time.empty();

        $('<option>', {
            value: '',
            text: 'Choose an appointment time'
        }).appendTo($time);

        $time.prop('disabled', true);

        if (!doctor) {

            $info.text(
                'Please select a dental specialist first.'
            );

            return;
        }

        if (!dateValue) {

            $info.text(
                'Please select an appointment date to see available demonstration times.'
            );

            return;
        }

        if (dateValue < getToday()) {

            $info.text(
                'The selected date is in the past. Please choose another date.'
            );

            return;
        }

        const date = new Date(
            dateValue + 'T12:00:00'
        );

        const day = date.getDay();

        const weekend = day === 0 || day === 6;

        const closing = weekend
            ? weekendClosing
            : weekdayClosing;

        // Use 30 minutes for a consultation if no duration is selected yet.
        const duration = calculateDuration() || 30;

        const now = new Date();

        const currentMinutes =
            now.getHours() * 60 + now.getMinutes();

        let slotCount = 0;

        // Generate appointments every 30 minutes.
        // A service must finish before the clinic closes.
        for (
            let minutes = openingTime;
            minutes + duration <= closing;
            minutes += 30
        ) {

            const alreadyPassed =
                dateValue === getToday() &&
                minutes <= currentMinutes;

            if (alreadyPassed) {
                continue;
            }

            const hours = String(
                Math.floor(minutes / 60)
            ).padStart(2, '0');

            const minuteText = String(
                minutes % 60
            ).padStart(2, '0');

            const value = hours + ':' + minuteText;

            $('<option>', {
                value: value,
                text: value
            }).appendTo($time);

            slotCount++;
        }

        if (slotCount > 0) {

            $time.prop('disabled', false);

            // Preserve the previous time only when it is still available.
            if (
                previousTime &&
                $time.find('option').filter(function () {
                    return $(this).val() === previousTime;
                }).length > 0
            ) {
                $time.val(previousTime);
            }

            $info.text(
                'Example time slots for ' + doctor.name +
                '. Clinic hours: ' +
                (weekend ? '10:00-18:00' : '10:00-21:00') +
                '. Choose a time from the list.'
            );

        } else {

            $info.text(
                'No time slots are available for the selected date and service duration.'
            );

        }
    }

    // Button toggles the time selector.
    $showTimes.on('click', function () {

        const panelIsOpen =
            !$panel.prop('hidden') && $panel.is(':visible');

        if (panelIsOpen) {

            closeTimePanel();

        } else {

            openTimePanel();

            updateAvailability();

        }
    });

    // Recalculate time slots after changing the date or doctor.
    $form.on(
        'change',
        '#doctor, #appointment-date',
        function () {

            updateAvailability();

            saveDraft();
        }
    );

    // Update calculator after selecting a service.
    $form.on('change', '#service', function () {

        renderCalculator();

        updateAvailability();

        saveDraft();
    });

    // Delegated X-ray event handler.
    // The HTML checkboxes already exist, so this handler does not create new ones.
    $form.on(
        'change',
        '#xray-checkboxes input[type="checkbox"]',
        function () {

            updateXrayAppearance();

            // Keep the catalogue cart consistent with the selected checkboxes.
            syncXrayCart();

            renderCalculator();

            updateAvailability();

            saveDraft();
        }
    );

    // =========================================
    // 11. PERSISTENT DRAFT
    // =========================================

    function saveDraft() {

        const draft = {
            name: $name.val(),
            phone: $phone.val(),
            email: $email.val(),
            service: $service.val(),
            doctor: $doctor.val(),
            date: $date.val(),
            time: $time.val(),
            message: $message.val(),
            consent: $consent.prop('checked'),
            xrays: getSelectedXrays()
        };

        storage.writeStorage(
            keys.draft,
            draft
        );
    }

    function restoreDraft() {

        const draft = storage.readStorage(
            keys.draft,
            null
        );

        if (!draft || typeof draft !== 'object') {
            return;
        }

        $name.val(draft.name || '');
        $phone.val(draft.phone || '');
        $email.val(draft.email || '');

        $service.val(draft.service || '');

        $doctor.val(draft.doctor || '');

        $date.val(draft.date || '');

        $message.val(draft.message || '');

        $consent.prop(
            'checked',
            Boolean(draft.consent)
        );

        if (Array.isArray(draft.xrays)) {

            draft.xrays.forEach(function (id) {

                $xrayCheckboxes
                    .find('input[value="' + id + '"]')
                    .prop('checked', true);

            });
        }
    }

    // =========================================
    // 12. TICKET GENERATION AND STORAGE
    // =========================================

    function generateTicket() {

        const randomNumber = Math.floor(
            1000 + Math.random() * 9000
        );

        return 'DH-' + randomNumber;
    }

    function saveAppointment() {

        const doctor = doctors.find(
            item => item.id === $doctor.val()
        );

        if (!doctor) {
            return false;
        }

        const selected = getSelectedItems();

        const appointment = {
            ticket: generateTicket(),

            patient: $name.val().trim(),

            phone: $phone.val().trim(),

            email: $email.val().trim(),

            doctor: doctor.name,

            specialty: doctor.specialty,

            services: selected.map(function (item) {

                return item.name +
                    (item.quantity > 1
                        ? ' x ' + item.quantity
                        : '');

            }),

            date: $date.val(),

            time: $time.val(),

            total: calculateTotal(),

            hasUnknownPrice: hasUnknownPrice(),

            address: clinicAddress,

            createdAt: new Date().toISOString()
        };

        // Save the record in browser localStorage.
        const saved = storage.writeStorage(
            keys.booking,
            appointment
        );

        if (!saved) {
            return false;
        }

        // Remove the unsubmitted information after confirmation.
        storage.removeStorage(keys.draft);

        storage.removeStorage(keys.cart);

        storage.removeStorage(keys.doctor);

        return true;
    }

    // =========================================
    // 13. SAVED APPOINTMENT CARD
    // =========================================

    function renderSavedAppointment() {

        const booking = storage.readStorage(
            keys.booking,
            null
        );

        $confirmation.empty();

        if (!booking || !booking.ticket) {
            return;
        }

        const $outer = $('<section>', {
            id: 'saved-appointment-card',
            class: 'border border-success rounded-4 shadow-sm p-3 p-md-4 mt-4'
        }).css({
            backgroundColor: '#d1e7dd'
        });

        const $card = $('<div>', {
            class: 'bg-white border border-success rounded-3 p-3'
        });

        const $header = $('<div>', {
            class: 'd-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom pb-2 mb-3'
        });

        const $heading = $('<h3>', {
            class: 'h4 text-success fw-bold mb-0',
            text: '✓ Appointment Saved!'
        });

        const $ticket = $('<span>', {
            class: 'badge text-bg-success fs-6',
            text: 'Ticket: ' + booking.ticket
        });

        $header.append($heading, $ticket);

        $card.append($header);

        const details = [
            ['Patient: ', booking.patient],
            ['Phone: ', booking.phone],
            ['Email: ', booking.email],
            ['Doctor: ', booking.doctor],
            ['Service: ', Array.isArray(booking.services)
                ? booking.services.join(', ')
                : 'Not specified'],
            ['Date & Time: ', formatDate(booking.date) + ' at ' + booking.time],
            ['TOTAL PRICE: ', formatPrice(booking.total)]
        ];

        // Create detail rows safely using jQuery text().
        details.forEach(function (item) {

            const $row = $('<p>');

            $('<strong>', {
                text: item[0]
            }).appendTo($row);

            $('<span>', {
                text: item[1]
            }).appendTo($row);

            $card.append($row);
        });

        $('<p>', {
            class: 'small text-muted',
            text: 'Clinic address: ' + clinicAddress
        }).appendTo($card);

        $('<p>', {
            class: 'small text-muted',
            text: booking.hasUnknownPrice
                ? 'Some selected services have unlisted prices. Contact the clinic to confirm the final price.'
                : 'Prices are informational estimates.'
        }).appendTo($card);

        $('<p>', {
            class: 'small text-muted mb-3',
            text: 'This appointment record is stored locally in this browser. It is a project demonstration, not a real clinic confirmation.'
        }).appendTo($card);

        const $clearButton = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-danger js-clear-saved-appointment',
            text: 'Clear Saved Appointment'
        });

        $card.append($clearButton);

        $outer.append($card);

        $confirmation.append($outer);

        $confirmation.stop(true, true).fadeIn(250);
    }

    // =========================================
    // 14. SUBMIT
    // =========================================

    let justSubmitted = false;

    $form.on('submit', function (event) {

        // Prevent normal form submission and browser page reload.
        event.preventDefault();

        $errorBox
            .prop('hidden', true)
            .empty();

        if (!validateForm()) {

            $errorBox
                .text('Please correct the highlighted fields.')
                .prop('hidden', false)
                .hide()
                .fadeIn(200);

            return;
        }

        const saved = saveAppointment();

        if (!saved) {

            $errorBox
                .text('Could not save the appointment. Check browser storage permissions.')
                .prop('hidden', false)
                .hide()
                .fadeIn(200);

            return;
        }

        const appointment = storage.readStorage(
            keys.booking,
            null
        );

        // Display the saved confirmation.
        renderSavedAppointment();

        $result
            .removeClass('alert-info')
            .addClass('alert-success')
            .text(
                'Appointment saved successfully. Ticket: ' +
                appointment.ticket
            );

        // Reset form inputs while preserving the saved appointment.
        justSubmitted = true;

        $form[0].reset();

        justSubmitted = false;

        // Move the page to the confirmation card.
        $confirmation[0].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });

    });

    // =========================================
    // 15. RESET FORM
    // =========================================

    $form.on('reset', function () {

        const submitted = justSubmitted;

        window.setTimeout(function () {

            // A successful submit already saved the appointment.
            // Manual Reset clears only incomplete form data.
            if (!submitted) {

                storage.removeStorage(keys.draft);

                storage.removeStorage(keys.cart);

                storage.removeStorage(keys.doctor);
            }

            // Clear validation messages.
            $.each(errors, function (_, $error) {

                $error
                    .stop(true, true)
                    .hide()
                    .text('');

            });

            $form.find('.is-invalid')
                .removeClass('is-invalid')
                .removeAttr('aria-invalid');

            $consentError.stop(true, true).hide().text('');

            $xrayError.stop(true, true).hide().text('');

            updateXrayAppearance();

            // Reset time selector.
            $time.empty();

            $('<option>', {
                value: '',
                text: 'Select a specialist and date first'
            }).appendTo($time);

            $time.prop('disabled', true);

            // Hide the time selection panel.
            $panel.stop(true, true).hide();

            $panel.prop('hidden', true);

            $showTimes
                .text('Choose Appointment Time')
                .attr('aria-expanded', 'false');

            $info.text(
                'Select a specialist and date to view example time slots.'
            );

            // Update calculator after reset.
            renderCalculator();

            // Keep the saved ticket visible.
            renderSavedAppointment();

            if (!submitted) {

                $result
                    .removeClass('alert-success')
                    .addClass('alert-info')
                    .text(
                        'Form reset. Any previously saved appointment remains available.'
                    );
            }

        }, 0);
    });

    // =========================================
    // 16. CLEAR SAVED APPOINTMENT
    // =========================================

    $confirmation.on(
        'click',
        '.js-clear-saved-appointment',
        function () {

            storage.removeStorage(keys.booking);

            $confirmation.stop(true, true).fadeOut(200, function () {
                $(this).empty();
            });

            $result
                .removeClass('alert-success')
                .addClass('alert-info')
                .text('The saved appointment has been removed.');
        }
    );

    // =========================================
    // 17. LIVE FIELD EVENTS
    // =========================================

    $form.on(
        'input',
        '#fullname, #phone, #email, #message',
        function () {

            const $field = $(this);

            if ($field.is($message)) {

                $messageCounter.text(
                    $message.val().length + ' / 500 characters'
                );
            }

            saveDraft();
        }
    );

    $form.on(
        'change',
        '#privacy-consent',
        function () {

            saveDraft();

            if ($consent.prop('checked')) {

                $consent.removeClass('is-invalid');

                $consentError.fadeOut(100);
            }
        }
    );

    // =========================================
    // 18. INITIAL PAGE SETUP
    // =========================================

    function initialisePage() {

        // Import the X-rays from the Services page.
        restoreCartXrays();

        // Restore the specialist selected on the Medical Team page.
        const savedDoctor = storage.readStorage(
            keys.doctor,
            null
        );

        if (savedDoctor) {
            $doctor.val(savedDoctor);
        }

        // Restore incomplete form data.
        const draft = storage.readStorage(
            keys.draft,
            null
        );

        if (draft && typeof draft === 'object') {

            $name.val(draft.name || '');
            $phone.val(draft.phone || '');
            $email.val(draft.email || '');
            $service.val(draft.service || '');
            $doctor.val(draft.doctor || savedDoctor || '');
            $date.val(draft.date || '');
            $message.val(draft.message || '');

            $consent.prop(
                'checked',
                Boolean(draft.consent)
            );

            if (Array.isArray(draft.xrays)) {

                draft.xrays.forEach(function (id) {

                    $xrayCheckboxes
                        .find('input[value="' + id + '"]')
                        .prop('checked', true);

                });
            }
        }

        // Generate available time options after restoring the date and doctor.
        updateAvailability();

        if (draft && draft.time) {

            $time.val(draft.time);

            if ($time.val() === null) {
                $time.val('');
            }
        }

        // Update checkbox styles and calculator.
        updateXrayAppearance();

        renderCalculator();

        // Display an existing saved appointment.
        renderSavedAppointment();

        $messageCounter.text(
            $message.val().length + ' / 500 characters'
        );
    }

    initialisePage();

});
