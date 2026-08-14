let currentDate = new Date();
let selectedDate = "";
let selectedTime = "";


/* =========================
   KALENDAR
========================= */

function renderCalendar(){

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    let monthYear = document.getElementById("monthYear");
    let calendarDays = document.getElementById("calendarDays");

    if(!monthYear || !calendarDays){
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

    monthYear.innerHTML = months[month] + " " + year;

    calendarDays.innerHTML = "";

    let firstDay = new Date(year, month, 1).getDay();

    let daysInMonth = new Date(year, month + 1, 0).getDate();

    // Ponedeljak je prvi dan nedelje
    if(firstDay === 0){
        firstDay = 7;
    }

    // Prazna polja pre prvog dana
    for(let i = 1; i < firstDay; i++){

        let empty = document.createElement("div");

        calendarDays.appendChild(empty);
    }


    // Dani
    for(let day = 1; day <= daysInMonth; day++){

        let button = document.createElement("button");

        button.innerHTML = day;
        button.type = "button";


        let fullDate =
            year + "-" +
            String(month + 1).padStart(2,"0") + "-" +
            String(day).padStart(2,"0");


        // Onemogućavanje prošlih dana
        let today = new Date();

        today.setHours(0,0,0,0);

        let buttonDate = new Date(year, month, day);

        if(buttonDate < today){
            button.disabled = true;
            button.style.opacity = "0.3";
            button.style.cursor = "not-allowed";
        }


        button.onclick = function(){

            document
                .querySelectorAll(".calendar-days button")
                .forEach(btn => btn.classList.remove("selected"));

            button.classList.add("selected");

            selectedDate = fullDate;

            document.getElementById("date").value = fullDate;

            selectedTime = "";

            showTimes();
        };


        calendarDays.appendChild(button);
    }
}



/* =========================
   PRETHODNI MESEC
========================= */

function prevMonth(){

    currentDate.setMonth(currentDate.getMonth() - 1);

    renderCalendar();
}



/* =========================
   SLEDEĆI MESEC
========================= */

function nextMonth(){

    currentDate.setMonth(currentDate.getMonth() + 1);

    renderCalendar();
}



/* =========================
   VREMENA
========================= */

function showTimes(){

    let dateElement = document.getElementById("date");
    let times = document.getElementById("times");

    if(!dateElement || !times){
        return;
    }

    let date = dateElement.value;

    times.innerHTML = "";

    if(!date){

        times.innerHTML = "<p>Prvo izaberite datum</p>";

        return;
    }


    // Koristimo datum bez problema sa vremenskom zonom
    let parts = date.split("-");

    let day = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    ).getDay();


    let workingTimes = [];


    // Ponedeljak - Petak
    if(day >= 1 && day <= 5){

        workingTimes = [
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00"
        ];
    }


    // Subota
    else if(day === 6){

        workingTimes = [
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00"
        ];
    }


    // Nedelja
    else{

        times.innerHTML = "<p>Nedelja ne radimo</p>";

        return;
    }


    workingTimes.forEach(function(time){

        let btn = document.createElement("button");

        btn.type = "button";

        btn.className = "time-btn";

        btn.innerHTML = time;


        btn.onclick = function(){

            document
                .querySelectorAll(".time-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            selectedTime = time;
        };


        times.appendChild(btn);
    });
}



/* =========================
   ČUVANJE REZERVACIJE
========================= */

let bookingForm = document.getElementById("bookingForm");


if(bookingForm){

    bookingForm.addEventListener("submit", function(event){

        event.preventDefault();


        let name = document.getElementById("name").value.trim();

        let phone = document.getElementById("phone").value.trim();

        let service = document.getElementById("service").value;

        let date = document.getElementById("date").value;


        // Provera datuma
        if(!date){

            alert("Molimo vas izaberite datum.");

            return;
        }


        // Provera vremena
        if(!selectedTime){

            alert("Molimo vas izaberite vreme.");

            return;
        }


        // Kreiranje rezervacije
        let reservation = {

            name: name,

            phone: phone,

            service: service,

            date: date,

            time: selectedTime,

            status: "Rezervacija potvrđena"
        };


        // Čuvanje u browseru
        localStorage.setItem(
            "barberReservation",
            JSON.stringify(reservation)
        );


        alert("Termin je uspešno rezervisan!");


        // Otvori Moje rezervacije
        window.location.href = "moje-rezervacije.html";

    });
}



/* =========================
   POKRETANJE KALENDARA
========================= */

renderCalendar();
