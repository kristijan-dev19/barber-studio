let currentDate = new Date();
let selectedDate = "";
let selectedTime = "";


/* =========================
   KALENDAR
========================= */

function renderCalendar() {

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    let monthYear =
        document.getElementById("monthYear");

    let calendarDays =
        document.getElementById("calendarDays");

    if (!monthYear || !calendarDays) {
        return;
    }


    let months = [
        "Januar",
        "Februar",
        "Mart",
        "April",
        "Maj",
        "Jun",
        "Jul",
        "Avgust",
        "Septembar",
        "Oktobar",
        "Novembar",
        "Decembar"
    ];


    monthYear.textContent =
        months[month] + " " + year;


    calendarDays.innerHTML = "";


    let firstDay =
        new Date(year, month, 1).getDay();


    let daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* Ponedeljak je prvi dan */

    if (firstDay === 0) {
        firstDay = 7;
    }


    /* Prazna mesta */

    for (let i = 1; i < firstDay; i++) {

        let empty =
            document.createElement("div");

        calendarDays.appendChild(empty);

    }


    /* Dani */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        let button =
            document.createElement("button");


        button.type = "button";

        button.textContent = day;


        let fullDate =
            year + "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");


        /* Provera prošlog datuma */

        let today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        let buttonDate =
            new Date(
                year,
                month,
                day
            );


        if (buttonDate < today) {

            button.disabled = true;

            button.style.opacity = "0.3";

            button.style.cursor =
                "not-allowed";

        }


        /* Klik na datum */

        button.onclick = function () {

            if (button.disabled) {
                return;
            }


            document
                .querySelectorAll(
                    ".calendar-days button"
                )
                .forEach(function (btn) {

                    btn.classList.remove(
                        "selected"
                    );

                });


            button.classList.add(
                "selected"
            );


            selectedDate = fullDate;

            selectedTime = "";


            document.getElementById(
                "date"
            ).value = fullDate;


            showTimes();

        };


        calendarDays.appendChild(button);

    }

}


/* =========================
   PRETHODNI MESEC
========================= */

function prevMonth() {

    let today = new Date();

    today.setDate(1);

    today.setHours(
        0,
        0,
        0,
        0
    );


    let currentMonth =
        new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );


    if (currentMonth <= today) {
        return;
    }


    currentDate.setMonth(
        currentDate.getMonth() - 1
    );


    renderCalendar();

}


/* =========================
   SLEDEĆI MESEC
========================= */

function nextMonth() {

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );


    renderCalendar();

}


/* =========================
   CENA USLUGE
========================= */

function getServicePrice(service) {

    if (service.includes("1000")) {
        return 1000;
    }


    if (service.includes("800")) {
        return 800;
    }


    if (service.includes("700")) {
        return 700;
    }


    if (service.includes("500")) {
        return 500;
    }


    return 0;

}


/* =========================
   VREMENA
   SVAKIH 30 MINUTA
========================= */

function showTimes() {

    let date =
        document.getElementById("date").value;


    let times =
        document.getElementById("times");


    if (!times) {
        return;
    }


    times.innerHTML = "";

    selectedTime = "";


    /* Ako datum nije izabran */

    if (!date) {

        times.innerHTML =
            "<p>Prvo izaberite datum</p>";

        return;

    }


    let day =
        new Date(
            date + "T00:00:00"
        ).getDay();


    let workingTimes = [];


    /* =========================
       PONEDELJAK - PETAK

       08:00 - 12:30
       15:00 - 19:30
    ========================= */

    if (day >= 1 && day <= 5) {

        workingTimes = [

            "08:00",
            "08:30",

            "09:00",
            "09:30",

            "10:00",
            "10:30",

            "11:00",
            "11:30",

            "12:00",
            "12:30",

            "15:00",
            "15:30",

            "16:00",
            "16:30",

            "17:00",
            "17:30",

            "18:00",
            "18:30",

            "19:00",
            "19:30"

        ];

    }


    /* =========================
       SUBOTA

       08:00 - 14:30
    ========================= */

    else if (day === 6) {

        workingTimes = [

            "08:00",
            "08:30",

            "09:00",
            "09:30",

            "10:00",
            "10:30",

            "11:00",
            "11:30",

            "12:00",
            "12:30",

            "13:00",
            "13:30",

            "14:00",
            "14:30"

        ];

    }


    /* =========================
       NEDELJA
    ========================= */

    else {

        times.innerHTML =
            "<p>Nedelja ne radimo</p>";

        return;

    }


    /* =========================
       POSTOJEĆE REZERVACIJE
    ========================= */

    let reservations = [];

    try {

        reservations =
            JSON.parse(
                localStorage.getItem(
                    "reservations"
                )
            ) || [];

    } catch (error) {

        reservations = [];

    }


    /* =========================
       ISPIS TERMINA
    ========================= */

    workingTimes.forEach(function (time) {

        let btn =
            document.createElement("button");


        btn.type = "button";

        btn.className = "time-btn";

        btn.textContent = time;


        /* =========================
           PROVERA ZAUZETOG TERMINA
        ========================= */

        let isBooked =
            reservations.some(
                function (reservation) {

                    return (
                        reservation.date === date &&
                        reservation.time === time &&
                        reservation.status !== "Otkazano"
                    );

                }
            );


        if (isBooked) {

            btn.disabled = true;

            btn.textContent =
                time + " - Zauzeto";

            btn.style.opacity = "0.4";

            btn.style.cursor =
                "not-allowed";

        }


        /* =========================
           PROVERA PROŠLOG VREMENA
           SAMO ZA DANAS
        ========================= */

        let now = new Date();


        let todayString =
            now.getFullYear() +
            "-" +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                now.getDate()
            ).padStart(2, "0");


        if (
            date === todayString &&
            time <=
            now.toTimeString().slice(0, 5)
        ) {

            btn.disabled = true;

            btn.textContent =
                time + " - Prošlo";

            btn.style.opacity = "0.3";

            btn.style.cursor =
                "not-allowed";

        }


        /* =========================
           IZBOR TERMINA
        ========================= */

        btn.onclick = function () {

            if (btn.disabled) {
                return;
            }


            document
                .querySelectorAll(
                    ".time-btn"
                )
                .forEach(function (b) {

                    b.classList.remove(
                        "active"
                    );

                });


            btn.classList.add(
                "active"
            );


            selectedTime = time;

        };


        times.appendChild(btn);

    });

}


/* =========================
   REZERVACIJA
========================= */

let bookingForm =
    document.getElementById(
        "bookingForm"
    );


if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =========================
               PODACI
            ========================= */

            let name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            let phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            let service =
                document
                    .getElementById("service")
                    .value;


            let date =
                document
                    .getElementById("date")
                    .value;


            /* =========================
               PROVERE
            ========================= */

            if (!name) {

                alert(
                    "Unesite ime i prezime."
                );

                return;

            }


            if (!phone) {

                alert(
                    "Unesite broj telefona."
                );

                return;

            }


            if (!service) {

                alert(
                    "Izaberite uslugu."
                );

                return;

            }


            if (!date) {

                alert(
                    "Izaberite datum."
                );

                return;

            }


            if (!selectedTime) {

                alert(
                    "Izaberite vreme."
                );

                return;

            }


            /* =========================
               UČITAJ REZERVACIJE
            ========================= */

            let reservations = [];

            try {

                reservations =
                    JSON.parse(
                        localStorage.getItem(
                            "reservations"
                        )
                    ) || [];

            } catch (error) {

                reservations = [];

            }


            /* =========================
               PONOVNA PROVERA
               DA NE DOĐE DO DUPLE
               REZERVACIJE
            ========================= */

            let alreadyBooked =
                reservations.some(
                    function (reservation) {

                        return (
                            reservation.date === date &&
                            reservation.time === selectedTime &&
                            reservation.status !== "Otkazano"
                        );

                    }
                );


            if (alreadyBooked) {

                alert(
                    "Ovaj termin je već zauzet."
                );


                showTimes();

                return;

            }


            /* =========================
               CENA
            ========================= */

            let price =
                getServicePrice(
                    service
                );


            /* =========================
               NOVA REZERVACIJA
            ========================= */

            let newReservation = {

                id: Date.now(),

                name: name,

                phone: phone,

                service: service,

                price: price,

                date: date,

                time: selectedTime,

                /* ODMAH POTVRĐENO */

                status: "Potvrđeno",

                createdAt:
                    new Date().toISOString()

            };


            /* =========================
               DODAVANJE
            ========================= */

            reservations.push(
                newReservation
            );


            /* =========================
               ČUVANJE
            ========================= */

            localStorage.setItem(
                "reservations",
                JSON.stringify(
                    reservations
                )
            );


            /* =========================
               PORUKA
            ========================= */

            alert(

                "Rezervacija je uspešno poslata!\n\n" +

                "Datum: " +
                date +

                "\nVreme: " +
                selectedTime +

                "\nUsluga: " +
                service +

                "\nCena: " +
                price +
                " RSD"

            );


            /* =========================
               RESET FORME
            ========================= */

            bookingForm.reset();


            selectedDate = "";

            selectedTime = "";


            document
                .querySelectorAll(
                    ".calendar-days button"
                )
                .forEach(function (btn) {

                    btn.classList.remove(
                        "selected"
                    );

                });


            document.getElementById(
                "times"
            ).innerHTML =
                "<p>Prvo izaberite datum</p>";

        }
    );

}


/* =========================
   POKRETANJE
========================= */

renderCalendar();
