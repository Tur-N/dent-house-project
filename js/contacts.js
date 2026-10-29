'use strict';

(() => {
    const form = document.querySelector('#booking-form');
    const data = window.DentHouseData;
    const utils = window.DentHouseUtils;

    if (!form || !data || !utils) {
        return;
    }

    const { services, clinicHours } = data;
    const {
        createNode,
        formatKzt,
        calculateTotal,
        findServiceById
    } = utils;

    const xrayServices = services.filter(
        (service) => service.id.startsWith('xray-')
    );

    const otherServices = services.filter(
        (service) => !service.id.startsWith('xray-')
    );

    const clinicOpensAt = 10 * 60;
    const clinicClosesAt = 21 * 60;

    form.setAttribute('novalidate', '');

    // Return today's date in YYYY-MM-DD format.
    function getTodayString() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // Create an input field with its label and error message.
    function makeField({
                           id,
                           label,
                           type,
                           placeholder = '',
                           autocomplete = 'off'
                       }) {
        const wrapper = createNode('div', 'mb-3');

        const fieldLabel = createNode(
            'label',
            'form-label fw-semibold',
            label
        );

        fieldLabel.htmlFor = id;

        const input = createNode('input', 'form-control');

        input.id = id;
        input.name = id;
        input.type = type;
        input.placeholder = placeholder;
        input.autocomplete = autocomplete;

        const error = createNode(
            'div',
            'invalid-feedback is-hidden'
        );

        error.id = `${id}-error`;
        error.setAttribute('aria-live', 'polite');

        input.setAttribute('aria-describedby', error.id);

        wrapper.append(fieldLabel, input, error);

        return { wrapper, input, error };
    }

    // Create a select field with its label and error message.
    function makeSelectField({ id, label, prompt }) {
        const wrapper = createNode('div', 'mb-3');

        const fieldLabel = createNode(
            'label',
            'form-label fw-semibold',
            label
        );

        fieldLabel.htmlFor = id;

        const select = createNode('select', 'form-select');

        select.id = id;
        select.name = id;

        const firstOption = createNode(
            'option',
            '',
            prompt
        );

        firstOption.value = '';
        select.append(firstOption);

        const error = createNode(
            'div',
            'invalid-feedback is-hidden'
        );

        error.id = `${id}-error`;
        error.setAttribute('aria-live', 'polite');

        select.setAttribute('aria-describedby', error.id);

        wrapper.append(fieldLabel, select, error);

        return { wrapper, select, error };
    }

    // Show a specific validation error next to a control.
    function displayError(field, message) {
        field.error.textContent = message;
        field.error.classList.remove('is-hidden');

        field.input?.classList.add('is-invalid');
        field.select?.classList.add('is-invalid');

        field.input?.setAttribute('aria-invalid', 'true');
        field.select?.setAttribute('aria-invalid', 'true');
    }

    // Clear an error after the field is corrected.
    function clearError(field) {
        field.error.textContent = '';
        field.error.classList.add('is-hidden');

        field.input?.classList.remove('is-invalid');
        field.select?.classList.remove('is-invalid');

        field.input?.removeAttribute('aria-invalid');
        field.select?.removeAttribute('aria-invalid');
    }

    // Main booking section
    const section = createNode(
        'section',
        'bg-white border rounded-4 shadow-sm p-3 p-md-4 mt-4'
    );

    section.id = 'js-appointment-module';

    section.setAttribute(
        'aria-labelledby',
        'js-appointment-title'
    );

    const title = createNode(
        'h2',
        'h3 text-primary',
        'Appointment and X-ray Request'
    );

    title.id = 'js-appointment-title';

    const intro = createNode(
        'p',
        'text-muted',
        `Clinic opening hours: ${clinicHours}. Select an X-ray area and any additional services, then choose a date and start time.`
    );

    // Patient name
    const nameField = makeField({
        id: 'js-patient-name',
        label: 'Patient full name',
        type: 'text',
        placeholder: 'Enter your full name',
        autocomplete: 'name'
    });

    nameField.input.minLength = 2;
    nameField.input.maxLength = 100;

    // Patient phone number
    const phoneField = makeField({
        id: 'js-patient-phone',
        label: 'Phone number',
        type: 'tel',
        placeholder: '+7 700 000 00 00',
        autocomplete: 'tel'
    });

    phoneField.input.inputMode = 'tel';
    phoneField.input.maxLength = 20;

    // X-ray checkboxes
    const xrayFieldset = createNode(
        'fieldset',
        'border rounded-3 p-3 mb-4'
    );

    xrayFieldset.id = 'js-xray-selection';

    const xrayLegend = createNode(
        'legend',
        'float-none w-auto px-2 h5 text-primary',
        'X-ray Selection'
    );

    const xrayHelper = createNode(
        'p',
        'small text-muted',
        'Lower jaw: 7,500 KZT. Upper jaw: 7,500 KZT. Selecting both totals 15,000 KZT.'
    );

    const xrayList = createNode('div', 'row g-2');
    const xrayCheckboxes = [];

    xrayServices.forEach((service) => {
        const column = createNode(
            'div',
            'col-12 col-md-6'
        );

        const wrapper = createNode(
            'div',
            'form-check border rounded-3 p-3 h-100'
        );

        const checkbox = createNode(
            'input',
            'form-check-input'
        );

        checkbox.type = 'checkbox';
        checkbox.id = `js-${service.id}`;
        checkbox.name = 'xray-selection';
        checkbox.value = service.id;

        const label = createNode(
            'label',
            'form-check-label fw-semibold',
            `${service.name} - ${formatKzt(service.price)}`
        );

        label.htmlFor = checkbox.id;

        wrapper.append(checkbox, label);
        column.append(wrapper);
        xrayList.append(column);

        xrayCheckboxes.push({
            service,
            checkbox,
            wrapper
        });
    });

    const xrayError = createNode(
        'p',
        'small text-danger is-hidden mt-2 mb-0'
    );

    xrayError.id = 'js-service-selection-error';
    xrayError.setAttribute('role', 'status');

    xrayFieldset.append(
        xrayLegend,
        xrayHelper,
        xrayList,
        xrayError
    );

    // Optional additional services with quantities
    const serviceFieldset = createNode(
        'fieldset',
        'border rounded-3 p-3 mb-4'
    );

    const serviceLegend = createNode(
        'legend',
        'float-none w-auto px-2 h5 text-primary',
        'Additional Services (Optional)'
    );

    const serviceNote = createNode(
        'p',
        'small text-muted',
        'Select any additional services. Use the quantity control when more than one unit is needed.'
    );

    const serviceList = createNode('div', 'row g-3');
    const serviceControls = [];

    otherServices.forEach((service) => {
        const column = createNode(
            'div',
            'col-12 col-md-6'
        );

        const card = createNode(
            'div',
            'border rounded-3 p-3 h-100'
        );

        const checkRow = createNode('div', 'form-check');

        const checkbox = createNode(
            'input',
            'form-check-input'
        );

        checkbox.type = 'checkbox';
        checkbox.id = `js-select-${service.id}`;
        checkbox.name = 'additional-service';
        checkbox.value = service.id;

        const label = createNode(
            'label',
            'form-check-label fw-semibold',
            `${service.name} - ${formatKzt(service.price)}`
        );

        label.htmlFor = checkbox.id;

        const description = createNode(
            'p',
            'small text-muted mt-2 mb-2',
            `${service.description} Estimated duration: ${service.durationMinutes} minutes.`
        );

        const quantityLabel = createNode(
            'label',
            'form-label small',
            'Quantity'
        );

        const quantity = createNode(
            'input',
            'form-control form-control-sm'
        );

        quantity.type = 'number';
        quantity.min = '1';
        quantity.max = '10';
        quantity.step = '1';
        quantity.value = '1';
        quantity.disabled = true;

        quantityLabel.htmlFor = `js-quantity-${service.id}`;
        quantity.id = `js-quantity-${service.id}`;

        quantity.setAttribute(
            'aria-label',
            `Quantity for ${service.name}`
        );

        checkRow.append(checkbox, label);

        card.append(
            checkRow,
            description,
            quantityLabel,
            quantity
        );

        column.append(card);
        serviceList.append(column);

        serviceControls.push({
            service,
            checkbox,
            quantity
        });
    });

    serviceFieldset.append(
        serviceLegend,
        serviceNote,
        serviceList
    );

    // Date and time selection button
    const scheduleButton = createNode(
        'button',
        'btn btn-outline-primary mb-3',
        'Choose Appointment Date and Time'
    );

    scheduleButton.type = 'button';

    scheduleButton.setAttribute(
        'aria-expanded',
        'false'
    );

    const schedulePanel = createNode(
        'div',
        'border rounded-3 p-3 mb-4 is-hidden'
    );

    // Appointment date
    const dateField = makeField({
        id: 'js-appointment-date',
        label: 'Appointment date',
        type: 'date'
    });

    dateField.input.min = getTodayString();

    // Appointment time
    const timeField = makeSelectField({
        id: 'js-appointment-time',
        label: 'Appointment start time',
        prompt: 'Choose a time'
    });

    // Add 30-minute time slots between 10:00 and 20:30.
    for (
        let minutes = clinicOpensAt;
        minutes <= clinicClosesAt - 30;
        minutes += 30
    ) {
        const hours = String(
            Math.floor(minutes / 60)
        ).padStart(2, '0');

        const mins = String(
            minutes % 60
        ).padStart(2, '0');

        const value = `${hours}:${mins}`;

        const option = createNode('option', '', value);
        option.value = value;

        timeField.select.append(option);
    }

    const scheduleHint = createNode(
        'p',
        'small text-muted mb-0',
        'Available start times are shown every 30 minutes from 10:00 to 20:30. The selected services must finish by 21:00.'
    );

    schedulePanel.append(
        dateField.wrapper,
        timeField.wrapper,
        scheduleHint
    );

    // Live selection summary
    const summary = createNode(
        'section',
        'card bg-light border-0 mb-4'
    );

    summary.setAttribute(
        'aria-labelledby',
        'js-appointment-summary-title'
    );

    const summaryBody = createNode('div', 'card-body');

    const summaryTitle = createNode(
        'h3',
        'h5 text-primary',
        'Selection Summary'
    );

    summaryTitle.id = 'js-appointment-summary-title';

    const selectedList = createNode('ul', 'mb-2');

    const emptySelection = createNode(
        'p',
        'text-muted mb-2',
        'No service selected yet.'
    );

    const durationLine = createNode(
        'p',
        'mb-1',
        'Estimated duration: 0 minutes'
    );

    const totalLine = createNode(
        'p',
        'h5 fw-bold mb-0',
        'Estimated total: 0 KZT'
    );

    summaryBody.append(
        summaryTitle,
        emptySelection,
        selectedList,
        durationLine,
        totalLine
    );

    summary.append(summaryBody);

    // Form actions
    const submitButton = createNode(
        'button',
        'btn btn-primary me-2',
        'Prepare Demo Request'
    );

    submitButton.type = 'submit';
    submitButton.id = 'js-submit-appointment';

    const resetButton = createNode(
        'button',
        'btn btn-outline-secondary',
        'Reset Form'
    );

    resetButton.type = 'reset';
    resetButton.id = 'js-reset-appointment';

    const result = createNode(
        'div',
        'alert alert-info is-hidden mt-4'
    );

    result.id = 'js-appointment-result';
    result.setAttribute('role', 'status');
    result.setAttribute('aria-live', 'polite');

    const disclaimer = createNode(
        'p',
        'small text-muted mt-3 mb-0',
        'This is a front-end demonstration only. No information is sent to a server, and no real appointment or payment is created.'
    );

    section.append(
        title,
        intro,
        nameField.wrapper,
        phoneField.wrapper,
        xrayFieldset,
        serviceFieldset,
        scheduleButton,
        schedulePanel,
        summary,
        submitButton,
        resetButton,
        result,
        disclaimer
    );

    // Build the module through DOM methods.
    form.append(section);

    // Return every selected service and its quantity.
    function getSelectedServices() {
        const selected = [];

        xrayCheckboxes.forEach(({ service, checkbox }) => {
            if (checkbox.checked) {
                selected.push({
                    id: service.id,
                    quantity: 1
                });
            }
        });

        serviceControls.forEach(
            ({ service, checkbox, quantity }) => {
                if (checkbox.checked) {
                    const count = Math.min(
                        10,
                        Math.max(
                            1,
                            Number.parseInt(quantity.value, 10) || 1
                        )
                    );

                    selected.push({
                        id: service.id,
                        quantity: count
                    });
                }
            }
        );

        return selected;
    }

    // Estimate appointment length from selected services.
    function calculateDuration(selectedItems) {
        const selectedXrayIds = selectedItems
            .filter((item) => item.id.startsWith('xray-'))
            .map((item) => item.id);

        const xrayDuration = selectedXrayIds.length === 2
            ? 20
            : selectedXrayIds.length === 1
                ? 15
                : 0;

        const otherDuration = selectedItems.reduce(
            (total, item) => {
                if (item.id.startsWith('xray-')) {
                    return total;
                }

                const service = findServiceById(item.id);

                return total + (
                    service
                        ? service.durationMinutes * item.quantity
                        : 0
                );
            },
            0
        );

        return xrayDuration + otherDuration;
    }

    // Update selected services, total price and duration.
    function updateSummary() {
        const selectedItems = getSelectedServices();

        const totalPrice = calculateTotal(selectedItems);
        const duration = calculateDuration(selectedItems);

        selectedList.replaceChildren();

        selectedItems.forEach((item) => {
            const service = findServiceById(item.id);

            if (!service) {
                return;
            }

            const lineTotal = service.price * item.quantity;

            const label = item.quantity > 1
                ? `${service.name} x ${item.quantity} - ${formatKzt(lineTotal)}`
                : `${service.name} - ${formatKzt(lineTotal)}`;

            selectedList.append(
                createNode('li', '', label)
            );
        });

        emptySelection.classList.toggle(
            'is-hidden',
            selectedItems.length > 0
        );

        selectedList.classList.toggle(
            'is-hidden',
            selectedItems.length === 0
        );

        durationLine.textContent =
            `Estimated duration: ${duration} minutes`;

        totalLine.textContent =
            `Estimated total: ${formatKzt(totalPrice)}`;

        xrayCheckboxes.forEach(({ checkbox, wrapper }) => {
            wrapper.classList.toggle(
                'is-selected',
                checkbox.checked
            );
        });

        serviceControls.forEach(({ checkbox, quantity }) => {
            quantity.disabled = !checkbox.checked;
        });
    }

    // Validate all required booking details.
    function validateForm() {
        let valid = true;
        let firstInvalid = null;

        [
            nameField,
            phoneField,
            dateField,
            timeField
        ].forEach(clearError);

        xrayError.textContent = '';
        xrayError.classList.add('is-hidden');
        result.classList.add('is-hidden');

        const patientName = nameField.input.value.trim();
        const phone = phoneField.input.value.trim();
        const date = dateField.input.value;
        const time = timeField.select.value;
        const selectedItems = getSelectedServices();

        function markInvalid(field, message) {
            displayError(field, message);

            firstInvalid = firstInvalid ||
                field.input ||
                field.select ||
                xrayCheckboxes[0]?.checkbox ||
                serviceControls[0]?.checkbox;

            valid = false;
        }

        // Validate the patient's name.
        if (patientName.length < 2) {
            markInvalid(
                nameField,
                'Enter your full name using at least two characters.'
            );
        } else if (/[<>]/.test(patientName)) {
            markInvalid(
                nameField,
                'Please remove invalid characters from the name.'
            );
        }

        // Validate the phone number.
        const phonePattern = /^\+?[0-9\s()-]{10,20}$/;
        const digitCount = phone.replace(/\D/g, '').length;

        if (
            !phonePattern.test(phone) ||
            digitCount < 10 ||
            digitCount > 15
        ) {
            markInvalid(
                phoneField,
                'Enter a valid phone number containing 10 to 15 digits.'
            );
        }

        // At least one service or X-ray area is required.
        if (selectedItems.length === 0) {
            xrayError.textContent =
                'Select at least one X-ray area or one additional service.';

            xrayError.classList.remove('is-hidden');

            firstInvalid = firstInvalid ||
                xrayCheckboxes[0]?.checkbox ||
                serviceControls[0]?.checkbox;

            valid = false;
        }

        // Reject missing and past dates.
        if (!date || date < getTodayString()) {
            markInvalid(
                dateField,
                'Choose today or a future date. Past dates are not allowed.'
            );
        }

        // Validate time, opening hours and appointment duration.
        if (!time) {
            markInvalid(
                timeField,
                'Choose an appointment start time.'
            );
        } else {
            const [hours, minutes] = time
                .split(':')
                .map(Number);

            const startMinutes = hours * 60 + minutes;

            const duration = calculateDuration(selectedItems);

            const now = new Date();

            const currentMinutes =
                now.getHours() * 60 + now.getMinutes();

            const pastTimeToday =
                date === getTodayString() &&
                startMinutes <= currentMinutes;

            const outsideOpeningHours =
                startMinutes < clinicOpensAt ||
                startMinutes >= clinicClosesAt;

            const finishesAfterClosing =
                startMinutes + duration > clinicClosesAt;

            if (
                outsideOpeningHours ||
                pastTimeToday ||
                finishesAfterClosing
            ) {
                markInvalid(
                    timeField,
                    'Choose a future start time within clinic hours. The selected services must finish by 21:00.'
                );
            }
        }

        // Reveal the schedule panel before focusing a hidden field.
        if (!valid && firstInvalid) {
            if (
                firstInvalid === dateField.input ||
                firstInvalid === timeField.select
            ) {
                schedulePanel.classList.remove('is-hidden');

                scheduleButton.setAttribute(
                    'aria-expanded',
                    'true'
                );
            }

            firstInvalid.focus();
        }

        return valid;
    }

    // Generate a demonstration reference, not a real booking ID.
    function makeDemoReference() {
        return `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Preselect items transferred from the service catalogue.
    function applyCartFromUrl() {
        const params = new URLSearchParams(
            window.location.search
        );

        const cartValue = params.get('cart');

        if (!cartValue) {
            updateSummary();
            return;
        }

        cartValue.split(',').forEach((entry) => {
            const [serviceId, quantityText] = entry.split(':');

            const service = findServiceById(serviceId);

            if (!service) {
                return;
            }

            const quantity = Math.min(
                10,
                Math.max(
                    1,
                    Number.parseInt(quantityText, 10) || 1
                )
            );

            const xrayControl = xrayCheckboxes.find(
                (item) => item.service.id === serviceId
            );

            if (xrayControl) {
                xrayControl.checkbox.checked = true;
                return;
            }

            const serviceControl = serviceControls.find(
                (item) => item.service.id === serviceId
            );

            if (serviceControl) {
                serviceControl.checkbox.checked = true;
                serviceControl.quantity.value = String(quantity);
                serviceControl.quantity.disabled = false;
            }
        });

        updateSummary();
    }

    // Open and close the date/time selector.
    scheduleButton.addEventListener('click', () => {
        const isOpening =
            schedulePanel.classList.contains('is-hidden');

        schedulePanel.classList.toggle(
            'is-hidden',
            !isOpening
        );

        scheduleButton.classList.toggle(
            'is-active',
            isOpening
        );

        scheduleButton.setAttribute(
            'aria-expanded',
            String(isOpening)
        );

        if (isOpening) {
            dateField.input.focus();

            if (
                typeof dateField.input.showPicker === 'function'
            ) {
                try {
                    dateField.input.showPicker();
                } catch (error) {
                    dateField.input.focus();
                }
            }
        }
    });

    // Update the estimate after selections change.
    form.addEventListener('change', (event) => {
        if (event.target.matches('input, select')) {
            updateSummary();
        }
    });

    form.addEventListener('input', () => {
        updateSummary();
    });

    // Validate the form and show a demo confirmation.
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const selectedItems = getSelectedServices();

        const reference = makeDemoReference();
        const selectedDate = dateField.input.value;
        const selectedTime = timeField.select.value;

        const requestTitle = createNode(
            'h3',
            'h5',
            'Demo Request Prepared'
        );

        const requestDetails = createNode(
            'p',
            '',
            `Reference: ${reference}. Appointment date: ${selectedDate}. Start time: ${selectedTime}.`
        );

        const requestPrice = createNode(
            'p',
            'fw-bold',
            `Estimated total: ${formatKzt(calculateTotal(selectedItems))}`
        );

        const selectedNames = selectedItems
            .map((item) => findServiceById(item.id)?.name)
            .filter(Boolean)
            .join(', ');

        const requestServices = createNode(
            'p',
            '',
            `Selected services: ${selectedNames}.`
        );

        const requestNotice = createNode(
            'p',
            'mb-0',
            'This is a demonstration only. No data was sent to a server, no appointment was confirmed, and no payment was taken. Please contact the clinic to arrange a real visit.'
        );

        result.replaceChildren(
            requestTitle,
            requestDetails,
            requestServices,
            requestPrice,
            requestNotice
        );

        result.classList.remove(
            'is-hidden',
            'alert-info'
        );

        result.classList.add('alert-success');

        result.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    });

    // Clear all fields and selections when the form is reset.
    form.addEventListener('reset', (event) => {
        if (
            !section.contains(event.target) &&
            event.target !== form
        ) {
            return;
        }

        window.setTimeout(() => {
            xrayCheckboxes.forEach(({ checkbox }) => {
                checkbox.checked = false;
            });

            serviceControls.forEach(({ checkbox, quantity }) => {
                checkbox.checked = false;
                quantity.value = '1';
                quantity.disabled = true;
            });

            dateField.input.value = '';
            timeField.select.value = '';

            schedulePanel.classList.add('is-hidden');
            scheduleButton.classList.remove('is-active');

            scheduleButton.setAttribute(
                'aria-expanded',
                'false'
            );

            result.replaceChildren();
            result.classList.add('is-hidden');
            result.classList.remove('alert-success');
            result.classList.add('alert-info');

            updateSummary();
        }, 0);
    });

    // Initialise the form, including a transferred service plan.
    applyCartFromUrl();
})();