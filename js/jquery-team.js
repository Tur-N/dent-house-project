
'use strict';

$(document).ready(function () {

    if (!$('body').hasClass('team-page')) {
        return;
    }

    const storage = window.DentHouse;

    const $main = $('main').first();

    if (!$main.length || !storage) {
        return;
    }

    const STORAGE_KEY = storage.storageKeys.doctor;

    // Complete Dent House medical team.
    const doctors = [
        {
            id: 'mukhamedyarov',
            name: 'Мухамедьяров Канат Магауиянович',
            specialties: ['Implantologist', 'Prosthodontist'],
            experience: 25,
            focus: 'Implantology, prosthetic dentistry and full-arch restorations'
        },
        {
            id: 'tauershe',
            name: 'Тауерше Багжан Ордабаевич',
            specialties: ['Surgeon', 'Implantologist'],
            experience: 7,
            focus: 'Surgical dentistry and dental implant placement'
        },
        {
            id: 'kenzhe',
            name: 'Кенже Саржан Байжанович',
            specialties: [
                'Therapeutic Dentist',
                'Surgeon',
                'Implantologist',
                'Prosthodontist'
            ],
            experience: 9,
            focus: 'Therapeutic treatment, surgery, implants and prosthetics'
        },
        {
            id: 'sagimbayeva',
            name: 'Сагимбаева Зухра Бериковна',
            specialties: [
                'Therapeutic Dentist',
                'Microscopic Dentistry'
            ],
            experience: 10,
            focus: 'Therapeutic care and microscopic procedures'
        },
        {
            id: 'shalabay',
            name: 'Шалабай Жамиля Кайратовна',
            specialties: [
                'Therapeutic Dentist',
                'Microscopic Dentistry'
            ],
            experience: 6,
            focus: 'Therapeutic care and microscopic procedures'
        },
        {
            id: 'tukesheva',
            name: 'Тукешева Светлана Маратовна',
            specialties: [
                'Therapeutic Dentist',
                'Periodontist'
            ],
            experience: 15,
            focus: 'Therapeutic dentistry and periodontal care'
        },
        {
            id: 'abzhapbar',
            name: 'Абжапбар Сымбат Багдатовна',
            specialties: [
                'Pediatric Dentist',
                'Therapeutic Dentist',
                'Microscopic Dentistry'
            ],
            experience: 10,
            focus: 'Pediatric and microscopic therapeutic dentistry'
        },
        {
            id: 'otarbaeva',
            name: 'Отарбаева Алма Аманжоловна',
            specialties: ['Orthodontist'],
            experience: 10,
            focus: 'Orthodontic assessment and treatment planning'
        }
    ];

    let selectedDoctor = storage.readStorage(
        STORAGE_KEY,
        null
    );

    // Hide the original static four-doctor list.
    const $staticList = $('#static-doctor-list');

    $staticList.addClass('d-none');

    const $section = $('<section>', {
        id: 'jquery-doctor-finder',
        class: 'bg-white border rounded-4 shadow-sm p-4 mb-4'
    });

    const $title = $('<h2>', {
        class: 'h3 text-primary',
        text: 'Our Medical Specialists'
    });

    const $description = $('<p>', {
        class: 'text-muted',
        text: 'Explore eight medical specialists, compare their experience and select a preferred doctor.'
    });

    // Doctor search.
    const $searchLabel = $('<label>', {
        class: 'form-label fw-bold',
        for: 'doctor-search',
        text: 'Search by Name or Speciality'
    });

    const $search = $('<input>', {
        id: 'doctor-search',
        type: 'search',
        class: 'form-control',
        placeholder: 'Enter a name, speciality or keyword',
        autocomplete: 'off'
    });

    // Speciality filter.
    const $categoryLabel = $('<label>', {
        class: 'form-label fw-bold mt-3',
        for: 'doctor-speciality',
        text: 'Filter by Speciality'
    });

    const $category = $('<select>', {
        id: 'doctor-speciality',
        class: 'form-select'
    });

    $('<option>', {
        value: 'all',
        text: 'All Specialities'
    }).appendTo($category);

    const specialties = [
        ...new Set(
            doctors.flatMap(doctor => doctor.specialties)
        )
    ].sort();

    $.each(specialties, function (_, specialty) {

        $('<option>', {
            value: specialty,
            text: specialty
        }).appendTo($category);

    });

    // Sorting by name or years of experience.
    const $sortLabel = $('<label>', {
        class: 'form-label fw-bold mt-3',
        for: 'doctor-sort',
        text: 'Sort Doctors'
    });

    const $sort = $('<select>', {
        id: 'doctor-sort',
        class: 'form-select'
    });

    [
        ['name', 'Name: A-Z'],
        ['experience-desc', 'Most Experience'],
        ['experience-asc', 'Least Experience']
    ].forEach(function (option) {

        $('<option>', {
            value: option[0],
            text: option[1]
        }).appendTo($sort);

    });

    const $reset = $('<button>', {
        type: 'button',
        class: 'btn btn-outline-secondary mt-3 me-2',
        text: 'Reset Filters'
    });

    const $clearDoctor = $('<button>', {
        type: 'button',
        class: 'btn btn-outline-danger mt-3',
        text: 'Clear Selection'
    });

    const $count = $('<p>', {
        class: 'fw-bold mt-3',
        'aria-live': 'polite'
    });

    const $selection = $('<div>', {
        id: 'doctor-selection',
        class: 'alert alert-info mt-3',
        'aria-live': 'polite'
    });

    const $list = $('<div>', {
        id: 'jquery-doctor-list',
        class: 'row g-3'
    });

    const $empty = $('<p>', {
        class: 'alert alert-secondary',
        text: 'No doctors match your search. Change the filter or reset.'
    }).hide();

    $section.append(
        $title,
        $description,
        $searchLabel,
        $search,
        $categoryLabel,
        $category,
        $sortLabel,
        $sort,
        $reset,
        $clearDoctor,
        $count,
        $selection,
        $list,
        $empty
    );

    // Insert the dynamic section before the previous static doctor section.
    if ($staticList.length) {
        $staticList.before($section);
    } else {
        $main.append($section);
    }

    // Build one doctor card.
    function createDoctorCard(doctor) {

        const $column = $('<div>', {
            class: 'col-12 col-md-6 col-lg-4'
        });

        const $card = $('<article>', {
            class: 'card doctor-card h-100 shadow-sm'
        }).attr('data-doctor-id', doctor.id);

        const $body = $('<div>', {
            class: 'card-body d-flex flex-column'
        });

        const $badge = $('<span>', {
            class: 'badge text-bg-warning align-self-start mb-3',
            text: 'DENT HOUSE SPECIALIST'
        });

        const $name = $('<h3>', {
            class: 'h5 text-primary',
            text: doctor.name
        });

        const $experience = $('<p>', {
            class: 'fw-bold',
            text: 'Experience: more than ' + doctor.experience + ' years'
        });

        const $focus = $('<p>', {
            text: 'Clinical focus: ' + doctor.focus
        });

        const $specialtyContainer = $('<div>', {
            class: 'd-flex flex-wrap gap-2 mb-3'
        });

        doctor.specialties.forEach(function (specialty) {

            $('<span>', {
                class: 'badge text-bg-secondary',
                text: specialty
            }).appendTo($specialtyContainer);

        });

        const $hours = $('<p>', {
            class: 'small text-muted',
            text: 'Clinic hours: Monday-Friday 10:00-21:00; Saturday-Sunday 10:00-18:00.'
        });

        const $status = $('<p>', {
            class: 'small text-muted js-doctor-status',
            text: 'Not selected'
        });

        const $button = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-primary js-doctor-select mt-auto',
            text: 'Select Specialist'
        })
        .attr('data-doctor-id', doctor.id)
        .attr('aria-pressed', 'false');

        $body.append(
            $badge,
            $name,
            $experience,
            $focus,
            $specialtyContainer,
            $hours,
            $status,
            $button
        );

        $card.append($body);
        $column.append($card);

        return $column;
    }

    // Filter doctors by their name and speciality array.
    function filterDoctors() {

        const query = $search.val().trim().toLowerCase();

        const category = $category.val();

        return doctors.filter(function (doctor) {

            const searchableText = [
                doctor.name,
                doctor.focus,
                doctor.specialties.join(' ')
            ].join(' ').toLowerCase();

            const matchesSearch =
                searchableText.includes(query);

            const matchesCategory =
                category === 'all' ||
                doctor.specialties.includes(category);

            return matchesSearch && matchesCategory;
        });
    }

    // Sort the filtered doctor list.
    function sortDoctors(items) {

        const result = [...items];

        if ($sort.val() === 'experience-desc') {

            result.sort(
                (a, b) => b.experience - a.experience
            );

        } else if ($sort.val() === 'experience-asc') {

            result.sort(
                (a, b) => a.experience - b.experience
            );

        } else {

            result.sort(
                (a, b) => a.name.localeCompare(b.name)
            );
        }

        return result;
    }

    // Update the selected specialist banner.
    function renderSelection() {

        $selection.empty();

        if (!selectedDoctor) {

            $selection.text('No specialist selected.');

            return;
        }

        const doctor = doctors.find(
            item => item.id === selectedDoctor
        );

        if (!doctor) {

            selectedDoctor = null;

            storage.removeStorage(STORAGE_KEY);

            $selection.text('No specialist selected.');

            return;
        }

        $('<strong>', {
            text: 'Selected Specialist: '
        }).appendTo($selection);

        $selection.append(
            $('<span>').text(doctor.name)
        );

        $selection.append(
            $('<p>', {
                class: 'small mb-2',
                text: doctor.specialties.join(', ') +
                    ' — more than ' + doctor.experience + ' years of experience.'
            })
        );

        $('<a>', {
            href: 'contacts.html#booking-form',
            class: 'btn btn-primary btn-sm',
            text: 'Continue to Appointment'
        }).appendTo($selection);

    }

    // Render filtered doctors and restore selected state.
    function renderDoctors() {

        const filtered = sortDoctors(filterDoctors());

        $list.empty();

        $.each(filtered, function (_, doctor) {

            $list.append(createDoctorCard(doctor));

        });

        $count.text(
            filtered.length + ' specialists found'
        );

        if (filtered.length === 0) {
            $empty.stop(true, true).fadeIn(200);
        } else {
            $empty.stop(true, true).fadeOut(200);
        }

        // Select the first rendered column for the required :first filter.
        $list.children('.col-12').filter(':first')
            .addClass('active');

        // Restore the selected doctor's button appearance.
        $list.find('.js-doctor-select').each(function () {

            const $button = $(this);

            const isSelected =
                $button.attr('data-doctor-id') === selectedDoctor;

            $button
                .text(isSelected ? 'Selected' : 'Select Specialist')
                .attr('aria-pressed', String(isSelected));

            $button.closest('.doctor-card')
                .toggleClass('border-success', isSelected);

            $button.closest('.doctor-card')
                .find('.js-doctor-status')
                .text(isSelected ? 'Selected specialist' : 'Not selected');

        });

        renderSelection();
    }

    // Live doctor search.
    $section.on('input', '#doctor-search', function () {
        renderDoctors();
    });

    // Speciality and experience filters.
    $section.on('change', '#doctor-speciality, #doctor-sort', function () {
        renderDoctors();
    });

    // Reset filters only. Keep the selected doctor.
    $reset.on('click', function () {

        const $button = $(this);

        $search.val('');
        $category.val('all');
        $sort.val('name');

        renderDoctors();

        $button.addClass('active');
        $button.removeClass('active');
    });

    // Select or deselect a specialist.
    // Delegation is required because the buttons are created dynamically.
    $list.on('click', '.js-doctor-select', function (event) {

        event.preventDefault();

        const $button = $(this);
        const doctorId = $button.attr('data-doctor-id');

        const doctor = doctors.find(
            item => item.id === doctorId
        );

        if (!doctor) {
            return;
        }

        const alreadySelected = selectedDoctor === doctorId;

        if (alreadySelected) {

            selectedDoctor = null;

            storage.removeStorage(STORAGE_KEY);

        } else {

            selectedDoctor = doctorId;

            storage.writeStorage(
                STORAGE_KEY,
                doctorId
            );

        }

        // Chain: locate the card, change the border,
        // find its status, then update the button and accessibility state.
        $button
            .closest('.doctor-card')
            .toggleClass('border-success', !alreadySelected)
            .find('.js-doctor-status')
            .text(alreadySelected ? 'Not selected' : 'Selected specialist')
            .end()
            .find('.js-doctor-select')
            .text(alreadySelected ? 'Select Specialist' : 'Selected')
            .attr('aria-pressed', String(!alreadySelected));

        renderDoctors();
    });

    // Clear the selected specialist.
    $clearDoctor.on('click', function () {

        selectedDoctor = null;

        storage.removeStorage(STORAGE_KEY);

        renderDoctors();
    });

    // Display all eight doctors initially.
    renderDoctors();

});
