document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bmrForm');
    const bmrOutput = document.getElementById('bmrOutput');
    const caloriesOutput = document.getElementById('caloriesBurnedOutput'); // Create an element to display calories burned

    const mwLossRest = document.getElementById('mwLossRest');
    const mwLossWorkout = document.getElementById('mwLossWorkout');
    const swLossRest = document.getElementById('swLossRest');
    const swLossWorkout = document.getElementById('swLossWorkout');
    const maintenanceRest = document.getElementById('maintenanceRest');
    const maintenanceWorkout = document.getElementById('maintenanceWorkout');
    const swGainRest = document.getElementById('swGainRest');
    const swGainWorkout = document.getElementById('swGainWorkout');
    const mwGainRest = document.getElementById('mwGainRest');
    const mwGainWorkout = document.getElementById('mwGainWorkout');


    const activity = document.getElementById("activity");
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way

        const formData = new FormData(form);
        const gender = formData.get('gender');
        const age = parseInt(formData.get('age'), 10);
        const heightFeet = parseInt(formData.get('heightFeet'), 10);
        const heightInches = parseInt(formData.get('heightInches'), 10);
        const weight = parseInt(formData.get('weight'), 10);
        const duration = parseInt(formData.get('workoutDuration'), 10);
        const intensity = formData.get('intensity');

        const bmr = calculateBMR(gender, weight, heightFeet, heightInches, age);
        const caloriesBurned = calculateCaloriesBurned(duration, intensity);
        const totalCalories = bmr + caloriesBurned;
        updateChart(calorieChart, bmr, totalCalories);

        bmrOutput.innerHTML = `BMR: ${bmr.toFixed(0)} calories/day`;
        caloriesOutput.innerHTML = `Estimated calories Burned from Workout: ${caloriesBurned.toFixed(0)}`;

        mwLossRest.innerHTML = `<b>1</b> ${(bmr - 500).toFixed(0)}`;
        mwLossWorkout.innerHTML = `<b>2</b> ${(totalCalories - 500).toFixed(0)}`;

        swLossRest.innerHTML = `<b>3</b> ${(bmr - 250).toFixed(0)}`;
        swLossWorkout.innerHTML = `<b>4</b> ${(totalCalories - 250).toFixed(0)}`;

        maintenanceRest.innerHTML = `<b>5</b> ${bmr.toFixed(0)}`;
        maintenanceWorkout.innerHTML = `<b>6</b> ${totalCalories.toFixed(0)}`;

        swGainRest.innerHTML = `<b>7</b> ${bmr.toFixed(0)}`;
        swGainWorkout.innerHTML = `<b>8</b> ${(totalCalories + 250).toFixed(0)}`;

        mwGainRest.innerHTML = `<b>9</b> ${bmr.toFixed(0)}`;
        mwGainWorkout.innerHTML = `<b>10</b> ${(totalCalories + 500).toFixed(0)}`;

        activity.style.display = 'grid';
    });

    function calculateBMR(gender, weight, heightFeet, heightInches, age) {
        const weightInKg = weight * 0.453592;
        const heightInCm = ((heightFeet * 12) + heightInches) * 2.54;
        let bmr = 0;
        if (gender === 'Male') {
            bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
        } else if (gender === 'Female') {
            bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
        }
        return bmr;
    }

    function calculateCaloriesBurned(duration, intensity) {
        let caloriesPer30Min = 90; // Default for low intensity
        if (intensity === 'moderate') {
            caloriesPer30Min = 108; // Average of 90 and 126
        } else if (intensity === 'high') {
            caloriesPer30Min = 126; // Minimum for high intensity
        }
        return (duration / 30) * caloriesPer30Min;
    }

    function initChart() {
        const ctx = document.getElementById('calorieChart').getContext('2d');
        calorieChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Initial data
                    backgroundColor: [
                        'rgba(235, 120, 54, 0.4)',
                        'rgba(235, 120, 54, 0.4)',
                        'rgba(235, 90, 54, 0.2)',
                        'rgba(235, 90, 54, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(132, 192, 75, 0.2)',
                        'rgba(132, 192, 75, 0.2)',
                        'rgba(89, 192, 75, 0.4)',
                        'rgba(89, 192, 75, 0.4)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Calorie intake/day',
                            color: '#000',
                            font: {
                                size: 14,
                                weight: "bold"
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Goal',
                            color: '#000',
                            font: {
                                size: 14,
                                weight: "bold"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${Math.round(tooltipItem.raw)} calories/day`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function updateChart(chart, bmr, totalCalories) {
        chart.data.datasets[0].data = [
            bmr - 500, totalCalories - 500, // Moderate weight loss
            bmr - 250, totalCalories - 250, // Slow weight loss
            bmr, totalCalories,             // Maintenance
            bmr, totalCalories + 250, // Slow weight gain
            bmr, totalCalories + 500  // Moderate weight gain
        ];
        chart.update();
    }    

    initChart(); // Initialize the chart when the document is ready
});
