document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // If going to planner section, reset to step 1
            if (sectionId === 'planner') {
                resetPlannerSteps();
            }
        });
    });
    
    // Workout tabs
    const workoutTabs = document.querySelectorAll('.equipment-tabs .tab-btn');
    const workoutCategories = document.querySelectorAll('.workout-category');
    
    workoutTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and categories
            workoutTabs.forEach(t => t.classList.remove('active'));
            workoutCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding category
            const categoryId = this.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });
    
    // Planner steps
    const plannerSteps = document.querySelectorAll('.planner-steps .step');
    const stepPanels = document.querySelectorAll('.step-panel');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const backStepBtns = document.querySelectorAll('.back-step');
    
    function resetPlannerSteps() {
        // Reset to step 1
        plannerSteps.forEach(step => step.classList.remove('active'));
        stepPanels.forEach(panel => panel.classList.remove('active'));
        
        plannerSteps[0].classList.add('active');
        stepPanels[0].classList.add('active');
        
        // Clear any existing selected exercises
        clearSelectedExercises();
    }
    
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            goToStep(nextStep);
        });
    });
    
    backStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });
    
    function goToStep(stepNumber) {
        // Validate step 1 (user details) before proceeding
        if (stepNumber === '2') {
            if (!validateUserDetails()) {
                return;
            }
        }
        
        // If going to step 3 (workout plan), generate the plan
        if (stepNumber === '3') {
            generateWorkoutPlan();
        }
        
        // Update steps
        plannerSteps.forEach(step => {
            if (step.getAttribute('data-step') === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update panels
        stepPanels.forEach(panel => {
            if (panel.getAttribute('data-step') === stepNumber) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }
    
    function validateUserDetails() {
        const name = document.getElementById('name').value;
        const level = document.getElementById('level').value;
        const focus = document.getElementById('focus').value;
        const time = document.getElementById('time').value;
        
        if (!name || !level || !focus || !time) {
            alert('Please fill in all fields before continuing.');
            return false;
        }
        
        return true;
    }
    
    // Planner exercise tabs
    const plannerTabs = document.querySelectorAll('.planner-equipment-tabs .tab-btn');
    const plannerCategories = document.querySelectorAll('.planner-category');
    
    plannerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and categories
            plannerTabs.forEach(t => t.classList.remove('active'));
            plannerCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding category
            const categoryId = 'planner-' + this.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });
    
    // Add exercises to plan
    const addToPlanBtns = document.querySelectorAll('.add-to-plan');
    const selectedList = document.querySelector('.selected-list');
    let selectedExercises = [];
    
    addToPlanBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseElement = this.closest('.planner-exercise');
            const exerciseId = exerciseElement.getAttribute('data-id');
            const exerciseName = exerciseElement.getAttribute('data-name');
            const exerciseMuscle = exerciseElement.getAttribute('data-muscle');
            
            // Check if exercise already exists in plan
            const existingExercise = selectedExercises.find(ex => ex.id === exerciseId);
            
            if (!existingExercise) {
                selectedExercises.push({
                    id: exerciseId,
                    name: exerciseName,
                    muscle: exerciseMuscle
                });
                
                updateSelectedExercises();
            }
        });
    });
    
    function updateSelectedExercises() {
        // Clear current list
        selectedList.innerHTML = '';
        
        if (selectedExercises.length === 0) {
            selectedList.innerHTML = '<p class="empty-message">No exercises selected yet</p>';
            return;
        }
        
        // Add each exercise to the list
        selectedExercises.forEach(exercise => {
            const exerciseElement = document.createElement('div');
            exerciseElement.className = 'selected-item';
            exerciseElement.innerHTML = `
                <span>${exercise.name} <small>(${exercise.muscle})</small></span>
                <button class="remove-exercise" data-id="${exercise.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            selectedList.appendChild(exerciseElement);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-exercise').forEach(btn => {
            btn.addEventListener('click', function() {
                const exerciseId = this.getAttribute('data-id');
                removeExerciseFromPlan(exerciseId);
            });
        });
    }
    
    function removeExerciseFromPlan(exerciseId) {
        selectedExercises = selectedExercises.filter(ex => ex.id !== exerciseId);
        updateSelectedExercises();
    }
    
    function clearSelectedExercises() {
        selectedExercises = [];
        updateSelectedExercises();
    }
    
    // Generate workout plan
    function generateWorkoutPlan() {
        const userPlanDetails = document.getElementById('user-plan-details');
        const workoutPlanExercises = document.getElementById('workout-plan-exercises');
        const confirmTotal = document.getElementById('confirm-total');
        
        // User details
        const name = document.getElementById('name').value;
        const level = document.getElementById('level').value;
        const focus = document.getElementById('focus').value;
        const time = document.getElementById('time').value;
        
        userPlanDetails.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Level:</strong> ${level.charAt(0).toUpperCase() + level.slice(1)}</p>
            <p><strong>Focus:</strong> ${getFocusName(focus)}</p>
            <p><strong>Duration:</strong> ${time} minutes</p>
        `;
        
        // Exercises
        workoutPlanExercises.innerHTML = '';
        
        if (selectedExercises.length === 0) {
            workoutPlanExercises.innerHTML = '<p>No exercises selected</p>';
            return;
        }
        
        // Generate sets/reps based on workout focus
        const setsReps = getSetsReps(focus);
        
        selectedExercises.forEach(exercise => {
            const exerciseElement = document.createElement('div');
            exerciseElement.className = 'plan-exercise';
            exerciseElement.innerHTML = `
                <h4>${exercise.name}</h4>
                <p><strong>Muscle Group:</strong> ${exercise.muscle}</p>
                <p><strong>Sets:</strong> ${setsReps.sets}</p>
                <p><strong>Reps:</strong> ${setsReps.reps}</p>
                <p><strong>Rest:</strong> ${setsReps.rest}</p>
            `;
            
            workoutPlanExercises.appendChild(exerciseElement);
        });
    }
    
    function getFocusName(focus) {
        const focusNames = {
            'strength': 'Strength',
            'hypertrophy': 'Muscle Growth',
            'endurance': 'Endurance',
            'fat-loss': 'Fat Loss'
        };
        return focusNames[focus] || focus;
    }
    
    function getSetsReps(focus) {
        switch(focus) {
            case 'strength':
                return { sets: '4-5', reps: '3-6', rest: '3-5 min' };
            case 'hypertrophy':
                return { sets: '3-4', reps: '8-12', rest: '60-90 sec' };
            case 'endurance':
                return { sets: '2-3', reps: '15-20', rest: '30-60 sec' };
            case 'fat-loss':
                return { sets: '3-4', reps: '10-15', rest: '30-45 sec' };
            default:
                return { sets: '3', reps: '10', rest: '60 sec' };
        }
    }
    
    // Print plan
    const printPlanBtn = document.querySelector('.print-plan');
    if (printPlanBtn) {
        printPlanBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Initialize first section
    document.querySelector('nav a[data-section="home"]').click();
});