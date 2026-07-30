let currentDate = new Date();

let selectedDate = "";


function renderCalendar(){

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();


    let monthYear = document.getElementById("monthYear");
    let calendarDays = document.getElementById("calendarDays");


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



    // pomeranje da ponedeljak bude prvi dan
    if(firstDay == 0){
        firstDay = 7;
    }



    for(let i = 1; i < firstDay; i++){

        let empty = document.createElement("div");

        calendarDays.appendChild(empty);

    }



    for(let day = 1; day <= daysInMonth; day++){


        let button = document.createElement("button");


        button.innerHTML = day;


        button.type = "button";



        button.onclick = function(){


            document
            .querySelectorAll(".calendar-days button")
            .forEach(btn => btn.classList.remove("selected"));



            button.classList.add("selected");


            let fullDate = 
            year + "-" +
            String(month + 1).padStart(2,"0") + "-" +
            String(day).padStart(2,"0");



            selectedDate = fullDate;


            document.getElementById("date").value = fullDate;


            showTimes();


        };



        calendarDays.appendChild(button);

    }

}



function prevMonth(){

    currentDate.setMonth(currentDate.getMonth() - 1);

    renderCalendar();

}



function nextMonth(){

    currentDate.setMonth(currentDate.getMonth() + 1);

    renderCalendar();

}

renderCalendar();

function showTimes(){

    let date = document.getElementById("date").value;

    let times = document.getElementById("times");

    times.innerHTML = "";


    if(!date){
        times.innerHTML = "<p>Prvo izaberite datum</p>";
        return;
    }


    let day = new Date(date).getDay();


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

        };


        times.appendChild(btn);

    });

}