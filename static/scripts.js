document.addEventListener('DOMContentLoaded', function () {
    //localStorage.clear()
    const dateContainer = document.getElementById('date-container');
    const denominationContainer = document.getElementById('denomination-container');
    const totalBillElement = document.getElementById('total-bill');
    
    let costPerLitre = 0;
    let selectedDenomination = localStorage.getItem('selectedDenomination') || '';
    let lastSelectedDay = localStorage.getItem('lastSelectedDay') || '';
    //localStorage.setItem('totalBill', 0);
    let totalBill = parseFloat(localStorage.getItem('totalBill')) || 0.00;

    const isFirstDayOfMonth = isToday(getFirstDayOfMonth());
   
    totalBillElement.textContent = totalBill.toFixed(2);

    setInterval(updateDate, 60000);
    setInterval(checkNewDay, 60000);
    //setInterval(checkNewDay, 1000);

    if (isFirstDayOfMonth) {
        const previousMonthBill = totalBill;
        totalBill = 0.00;

        // Notify the user 
        alert(`Your Milk bill for the previous month was ₹${previousMonthBill.toFixed(2)}`);

        // Save the updated totalBill value to localStorage
        localStorage.setItem('totalBill', totalBill.toString());
    }


    function checkNewDay(){
        if (isToday(lastSelectedDay)) {
            // If it's the same day, check the previously selected denomination
            const radio = document.querySelector(`input[value="${selectedDenomination}"]`);
            if (radio) {
                radio.checked = true;
            }
        } else {
            // If it's a new day, update totalBill and reset the radio buttons
            if (!isNaN(selectedDenomination) && lastSelectedDay) {
                updateBill(selectedDenomination);
                lastSelectedDay = getCurrentDate();
                selectedDenomination = '';
                localStorage.setItem('lastSelectedDay', lastSelectedDay);
                localStorage.setItem('selectedDenomination', selectedDenomination);

            }
            resetRadioButtons();
        }
    }


    function isToday(dateString) {
        const today = getCurrentDate();
        return dateString === today;
    }    

    function resetRadioButtons() {
        const radios = document.querySelectorAll('input[name="denomination"]');
        radios.forEach(radio => (radio.checked = false));

    }


    // Update date dynamically
    function updateDate() {
        const currentDate = new Date();
        document.getElementById('current-day').textContent = currentDate.toLocaleString('en-IN', { weekday: 'long' });
        document.getElementById('current-date').textContent = currentDate.getDate();
        document.getElementById('current-month').textContent = currentDate.toLocaleString('en-IN', { month: 'long' });
        const formattedTime = currentDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: false});
        document.getElementById('current-time').textContent = formattedTime;
    }

    denominationContainer.addEventListener('change', function (event) {
        selectedDenomination = event.target.value;

        // Save the selected denomination and current day to localStorage
        localStorage.setItem('selectedDenomination', selectedDenomination);
        localStorage.setItem('lastSelectedDay', getCurrentDate());

    });

    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }    

    // Update bill based on denomination
    function updateBill(denomination) {
        getCostPerLitre();
        let cost = denomination * costPerLitre;

        totalBill += cost;

        localStorage.setItem('totalBill', totalBill.toString());

        totalBillElement.textContent = totalBill.toFixed(2);

          
    }

    function getFirstDayOfMonth() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}-01`;
    }


    function getCostPerLitre(){
        fetch('/get_costPerLitre')
        .then(response => response.text())
        .then(data => {
            //console.log(Number(data));
            costPerLitre = Number(data);
        });

    }
});
