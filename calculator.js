function updateArmorVisualization(thicknessMm) {
    // Update thickness line visualization
    const thickness = thicknessMm / 2; // Scale down for visual purposes
    
    // Ensure minimum visible thickness
    const visibleThickness = Math.max(thickness, 3);
    
    // Update thickness line (space between vertical lines)
    const newX = armorPlateCorners[0].x + visibleThickness;
    if (newX !== armorThicknessLine.x) {
        armorThicknessLine.x = newX;
        drawArmorPlate();
    }
}// Armor plate configuration
let armorPlateCorners = [
    { x: 50, y: 50, isDragging: false },   // Top-left
    { x: 250, y: 50, isDragging: false },  // Top-right
    { x: 250, y: 150, isDragging: false }, // Bottom-right
    { x: 50, y: 150, isDragging: false }   // Bottom-left
];

let armorThicknessLine = { x: 60, y1: 70, y2: 130 };
let isArmorDragging = false;
let draggedCornerIndex = -1;
let armorStartX, armorStartY;

function drawArmorPlate() {
    const canvas = document.getElementById('armorCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw armor plate
    ctx.beginPath();
    ctx.moveTo(armorPlateCorners[0].x, armorPlateCorners[0].y);
    ctx.lineTo(armorPlateCorners[1].x, armorPlateCorners[1].y);
    ctx.lineTo(armorPlateCorners[2].x, armorPlateCorners[2].y);
    ctx.lineTo(armorPlateCorners[3].x, armorPlateCorners[3].y);
    ctx.closePath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw dashed line on top
    ctx.beginPath();
    ctx.moveTo(armorPlateCorners[0].x, armorPlateCorners[0].y);
    ctx.lineTo(armorPlateCorners[1].x, armorPlateCorners[1].y);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw plate label
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.font = '14px sans-serif';
    const centerX = (armorPlateCorners[0].x + armorPlateCorners[1].x) / 2;
    ctx.fillText('Armor Plate', centerX, armorPlateCorners[0].y - 10);
    
    // Draw thickness line
    ctx.beginPath();
    ctx.moveTo(armorThicknessLine.x, armorThicknessLine.y1);
    ctx.lineTo(armorThicknessLine.x, armorThicknessLine.y2);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw thickness label
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'left';
    ctx.fillText('Thickness', armorThicknessLine.x + 20, armorThicknessLine.y1 + 30);
    
    // Draw corner handles
    armorPlateCorners.forEach((corner, index) => {
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = corner.isDragging ? '#2563eb' : 'white';
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    });
    
    // Update area input based on drawn plate
    updateAreaFromPlate();
}

function updateAreaFromPlate() {
    // Calculate area of plate in square inches (simplified rectangle for now)
    const width = Math.abs(armorPlateCorners[1].x - armorPlateCorners[0].x);
    const height = Math.abs(armorPlateCorners[3].y - armorPlateCorners[0].y);
    
    const areaInSquareInches = (width * height) / 10; // Scaled for visual purposes
    
    // Update area input
    const areaUnit = document.getElementById('areaUnit').value;
    let areaValue;
    
    if (areaUnit === 'in2') {
        areaValue = areaInSquareInches;
    } else { // cm2
        areaValue = areaInSquareInches * 6.4516;
    }
    
    document.getElementById('armorArea').value = areaValue.toFixed(1);
    
    // Recalculate armor
    calculateArmor();
}

function initializeArmorCanvas() {
    const canvas = document.getElementById('armorCanvas');
    if (!canvas) return;
    
    function getMousePosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    function isNearCorner(mouseX, mouseY, corner) {
        const dx = mouseX - corner.x;
        const dy = mouseY - corner.y;
        return dx * dx + dy * dy < 100; // 10px radius squared
    }
    
    canvas.addEventListener('mousedown', function(e) {
        const mousePos = getMousePosition(canvas, e);
        
        // Check if mouse is on any corner
        armorPlateCorners.forEach((corner, index) => {
            if (isNearCorner(mousePos.x, mousePos.y, corner)) {
                isArmorDragging = true;
                draggedCornerIndex = index;
                corner.isDragging = true;
                armorStartX = mousePos.x - corner.x;
                armorStartY = mousePos.y - corner.y;
            }
        });
        
        drawArmorPlate();
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (!isArmorDragging) return;
        
        const mousePos = getMousePosition(canvas, e);
        
        if (draggedCornerIndex >= 0) {
            // Update corner position
            armorPlateCorners[draggedCornerIndex].x = mousePos.x - armorStartX;
            armorPlateCorners[draggedCornerIndex].y = mousePos.y - armorStartY;
            
            // Update opposite corner's coordinate to maintain rectangular shape
            if (draggedCornerIndex === 0) { // Top-left
                armorPlateCorners[1].y = armorPlateCorners[0].y; // Top-right y
                armorPlateCorners[3].x = armorPlateCorners[0].x; // Bottom-left x
            } else if (draggedCornerIndex === 1) { // Top-right
                armorPlateCorners[0].y = armorPlateCorners[1].y; // Top-left y
                armorPlateCorners[2].x = armorPlateCorners[1].x; // Bottom-right x
            } else if (draggedCornerIndex === 2) { // Bottom-right
                armorPlateCorners[3].y = armorPlateCorners[2].y; // Bottom-left y
                armorPlateCorners[1].x = armorPlateCorners[2].x; // Top-right x
            } else if (draggedCornerIndex === 3) { // Bottom-left
                armorPlateCorners[2].y = armorPlateCorners[3].y; // Bottom-right y
                armorPlateCorners[0].x = armorPlateCorners[3].x; // Top-left x
            }
            
            // Update thickness line position relative to left edge
            armorThicknessLine.x = armorPlateCorners[0].x + 10;
            
            drawArmorPlate();
        }
    });
    
    canvas.addEventListener('mouseup', function() {
        if (draggedCornerIndex >= 0) {
            armorPlateCorners[draggedCornerIndex].isDragging = false;
        }
        isArmorDragging = false;
        draggedCornerIndex = -1;
        drawArmorPlate();
    });
    
    canvas.addEventListener('mouseleave', function() {
        if (draggedCornerIndex >= 0) {
            armorPlateCorners[draggedCornerIndex].isDragging = false;
        }
        isArmorDragging = false;
        draggedCornerIndex = -1;
        drawArmorPlate();
    });
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mousePos = getMousePosition(canvas, touch);
        
        armorPlateCorners.forEach((corner, index) => {
            if (isNearCorner(mousePos.x, mousePos.y, corner)) {
                isArmorDragging = true;
                draggedCornerIndex = index;
                corner.isDragging = true;
                armorStartX = mousePos.x - corner.x;
                armorStartY = mousePos.y - corner.y;
            }
        });
        
        drawArmorPlate();
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!isArmorDragging) return;
        
        const touch = e.touches[0];
        const mousePos = getMousePosition(canvas, touch);
        
        if (draggedCornerIndex >= 0) {
            // Update corner position
            armorPlateCorners[draggedCornerIndex].x = mousePos.x - armorStartX;
            armorPlateCorners[draggedCornerIndex].y = mousePos.y - armorStartY;
            
            // Update opposite corner's coordinate to maintain rectangular shape
            if (draggedCornerIndex === 0) { // Top-left
                armorPlateCorners[1].y = armorPlateCorners[0].y; // Top-right y
                armorPlateCorners[3].x = armorPlateCorners[0].x; // Bottom-left x
            } else if (draggedCornerIndex === 1) { // Top-right
                armorPlateCorners[0].y = armorPlateCorners[1].y; // Top-left y
                armorPlateCorners[2].x = armorPlateCorners[1].x; // Bottom-right x
            } else if (draggedCornerIndex === 2) { // Bottom-right
                armorPlateCorners[3].y = armorPlateCorners[2].y; // Bottom-left y
                armorPlateCorners[1].x = armorPlateCorners[2].x; // Top-right x
            } else if (draggedCornerIndex === 3) { // Bottom-left
                armorPlateCorners[2].y = armorPlateCorners[3].y; // Bottom-right y
                armorPlateCorners[0].x = armorPlateCorners[3].x; // Top-left x
            }
            
            // Update thickness line position relative to left edge
            armorThicknessLine.x = armorPlateCorners[0].x + 10;
            
            drawArmorPlate();
        }
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (draggedCornerIndex >= 0) {
            armorPlateCorners[draggedCornerIndex].isDragging = false;
        }
        isArmorDragging = false;
        draggedCornerIndex = -1;
        drawArmorPlate();
    });
    
    // Initial draw
    drawArmorPlate();
}

// Wheel configuration
let wheels = [
    { x: 80, y: 40, radius: 20, isDragging: false },
    { x: 220, y: 40, radius: 20, isDragging: false },
    { x: 80, y: 160, radius: 20, isDragging: false },
    { x: 220, y: 160, radius: 20, isDragging: false }
];

let robotBody = { x: 50, y: 50, width: 200, height: 100 };
let isDragging = false;
let draggedWheelIndex = -1;
let startX, startY;

function drawWheelConfiguration() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw robot body
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(robotBody.x, robotBody.y, robotBody.width, robotBody.height);
    
    // Draw center of robot
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.font = '14px sans-serif';
    ctx.fillText('Drag wheels to position', canvas.width / 2, robotBody.y + robotBody.height / 2);
    
    // Draw wheels
    wheels.forEach((wheel, index) => {
        ctx.beginPath();
        ctx.arc(wheel.x, wheel.y, wheel.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Fill wheels with light color if being dragged
        if (wheel.isDragging) {
            ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
            ctx.fill();
        }
    });
}

function initializeWheelCanvas() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    
    function getMousePosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    function isInWheel(mouseX, mouseY, wheel) {
        const dx = mouseX - wheel.x;
        const dy = mouseY - wheel.y;
        return dx * dx + dy * dy < wheel.radius * wheel.radius;
    }
    
    canvas.addEventListener('mousedown', function(e) {
        const mousePos = getMousePosition(canvas, e);
        
        // Check if mouse is on any wheel
        wheels.forEach((wheel, index) => {
            if (isInWheel(mousePos.x, mousePos.y, wheel)) {
                isDragging = true;
                draggedWheelIndex = index;
                wheel.isDragging = true;
                startX = mousePos.x - wheel.x;
                startY = mousePos.y - wheel.y;
            }
        });
        
        drawWheelConfiguration();
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const mousePos = getMousePosition(canvas, e);
        
        if (draggedWheelIndex >= 0) {
            // Update wheel position
            wheels[draggedWheelIndex].x = mousePos.x - startX;
            wheels[draggedWheelIndex].y = mousePos.y - startY;
            
            drawWheelConfiguration();
        }
    });
    
    canvas.addEventListener('mouseup', function() {
        if (draggedWheelIndex >= 0) {
            wheels[draggedWheelIndex].isDragging = false;
        }
        isDragging = false;
        draggedWheelIndex = -1;
        drawWheelConfiguration();
        
        // After wheel positioning, recalculate drivetrain parameters
        calculateDrivetrainWithWheels();
    });
    
    canvas.addEventListener('mouseleave', function() {
        if (draggedWheelIndex >= 0) {
            wheels[draggedWheelIndex].isDragging = false;
        }
        isDragging = false;
        draggedWheelIndex = -1;
        drawWheelConfiguration();
    });
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mousePos = getMousePosition(canvas, touch);
        
        wheels.forEach((wheel, index) => {
            if (isInWheel(mousePos.x, mousePos.y, wheel)) {
                isDragging = true;
                draggedWheelIndex = index;
                wheel.isDragging = true;
                startX = mousePos.x - wheel.x;
                startY = mousePos.y - wheel.y;
            }
        });
        
        drawWheelConfiguration();
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const mousePos = getMousePosition(canvas, touch);
        
        if (draggedWheelIndex >= 0) {
            wheels[draggedWheelIndex].x = mousePos.x - startX;
            wheels[draggedWheelIndex].y = mousePos.y - startY;
            
            drawWheelConfiguration();
        }
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (draggedWheelIndex >= 0) {
            wheels[draggedWheelIndex].isDragging = false;
        }
        isDragging = false;
        draggedWheelIndex = -1;
        drawWheelConfiguration();
        
        // After wheel positioning, recalculate drivetrain parameters
        calculateDrivetrainWithWheels();
    });
    
    // Initial draw
    drawWheelConfiguration();
}

function calculateDrivetrainWithWheels() {
    // Calculate drive configuration based on wheel positions
    // This can affect turning radius, stability, etc.
    // For now, just call the regular calculation
    calculateDrivetrain();
}

// Unit conversion functions
function convertWeight(value, fromUnit, toUnit) {
    if (isNaN(value)) return 0;
    
    const conversions = {
        'lbs_to_kg': val => val * 0.453592,
        'kg_to_lbs': val => val * 2.20462
    };
    const key = `${fromUnit}_to_${toUnit}`;
    return conversions[key] ? conversions[key](value) : value;
}

function convertLength(value, fromUnit, toUnit) {
    if (isNaN(value)) return 0;
    
    const toMm = {
        'in': val => val * 25.4,
        'mm': val => val,
        'cm': val => val * 10,
        'm': val => val * 1000
    };
    const fromMm = {
        'in': val => val / 25.4,
        'mm': val => val,
        'cm': val => val / 10,
        'm': val => val / 1000
    };
    return fromMm[toUnit](toMm[fromUnit](value));
}

function convertSpeed(value, fromUnit, toUnit) {
    if (isNaN(value)) return 0;
    
    const toMps = {
        'mph': val => val * 0.44704,
        'kph': val => val * 0.277778,
        'mps': val => val
    };
    const fromMps = {
        'mph': val => val * 2.23694,
        'kph': val => val * 3.6,
        'mps': val => val
    };
    return fromMps[toUnit](toMps[fromUnit](value));
}

function convertEnergy(value, fromUnit, toUnit) {
    if (isNaN(value)) return 0;
    
    const conversions = {
        'J_to_kJ': val => val / 1000,
        'kJ_to_J': val => val * 1000
    };
    const key = `${fromUnit}_to_${toUnit}`;
    return conversions[key] ? conversions[key](value) : value;
}

function convertArea(value, fromUnit, toUnit) {
    if (isNaN(value)) return 0;
    
    const toCm2 = {
        'in2': val => val * 6.4516,
        'cm2': val => val
    };
    const fromCm2 = {
        'in2': val => val / 6.4516,
        'cm2': val => val
    };
    return fromCm2[toUnit](toCm2[fromUnit](value));
}

// Tab switching functionality is now handled directly in event listeners

// Update functions for unit changes
function updateWeightUnit() {
    const input = document.getElementById('weaponWeight');
    if (!input.value) return;
    
    const oldUnit = document.getElementById('weightUnit').value;
    const newUnit = oldUnit === 'kg' ? 'lbs' : 'kg';
    
    const newValue = convertWeight(parseFloat(input.value), oldUnit, newUnit);
    input.value = newValue.toFixed(2);
    
    calculateWeapon();
}

function updateLengthUnit() {
    const input = document.getElementById('weaponRadius');
    if (!input.value) return;
    
    const oldUnit = document.getElementById('lengthUnit').value;
    const newUnit = oldUnit;
    
    const newValue = convertLength(parseFloat(input.value), oldUnit, newUnit);
    input.value = newValue.toFixed(2);
    
    calculateWeapon();
}

function updateSpeedUnit() {
    calculateWeapon();
}

function updateEnergyUnit() {
    calculateWeapon();
}

function updateWheelUnit() {
    const input = document.getElementById('wheelDiameter');
    if (!input.value) return;
    
    const oldUnit = document.getElementById('wheelUnit').value;
    const newUnit = oldUnit;
    
    const newValue = convertLength(parseFloat(input.value), oldUnit, newUnit);
    input.value = newValue.toFixed(2);
    
    calculateDrivetrain();
}

function updateDriveSpeedUnit() {
    calculateDrivetrain();
}

function updateRobotWeightUnit() {
    const input = document.getElementById('robotWeight');
    if (!input.value) return;
    
    const oldUnit = document.getElementById('robotWeightUnit').value;
    const newUnit = oldUnit === 'kg' ? 'lbs' : 'kg';
    
    const newValue = convertWeight(parseFloat(input.value), oldUnit, newUnit);
    input.value = newValue.toFixed(2);
    
    calculateDrivetrain();
}

function updateThicknessUnit() {
    const input = document.getElementById('armorThickness');
    if (!input.value) return;
    
    const oldUnit = document.getElementById('thicknessUnit').value;
    const newUnit = oldUnit;
    
    const newValue = convertLength(parseFloat(input.value), oldUnit, newUnit);
    input.value = newValue.toFixed(oldUnit === 'mm' && newUnit === 'in' ? 3 : 2);
    
    calculateArmor();
}

function updateAreaUnit() {
    const input = document.getElementById('armorArea');
    if (!input.value) return;
    
    const oldUnit = document.getElementById('areaUnit').value;
    const newUnit = oldUnit;
    
    const newValue = convertArea(parseFloat(input.value), oldUnit, newUnit);
    input.value = newValue.toFixed(2);
    
    calculateArmor();
}

function updateArmorWeightUnit() {
    calculateArmor();
}

// Calculation functions
function calculateArmor() {
    console.log("Calculating armor...");
    const thickness = parseFloat(document.getElementById('armorThickness').value) || 0;
    const area = parseFloat(document.getElementById('armorArea').value) || 0;
    const material = document.getElementById('armorMaterial').value;
    
    console.log("Inputs:", thickness, area, material);
    
    // Convert to metric for calculations
    const thicknessMm = document.getElementById('thicknessUnit').value === 'in' ? thickness * 25.4 : thickness;
    const areaCm2 = document.getElementById('areaUnit').value === 'in2' ? area * 6.4516 : area;
    
    console.log("Converted:", thicknessMm, areaCm2);
    
    // Material properties (density in g/cm³, strength factor for impact rating, cost per kg in USD)
    const materials = {
        'aluminum': { density: 2.7, strengthFactor: 0.7, costPerKg: 15 },
        'steel': { density: 7.85, strengthFactor: 1.5, costPerKg: 10 },
        'titanium': { density: 4.5, strengthFactor: 2.0, costPerKg: 60 },
        'uhmw': { density: 0.93, strengthFactor: 0.5, costPerKg: 25 },
        'hardox': { density: 7.85, strengthFactor: 2.5, costPerKg: 20 }
    };
    
    // Calculate volume in cm³
    const volumeCm3 = areaCm2 * (thicknessMm / 10);
    console.log("Volume:", volumeCm3);
    
    // Calculate weight
    const weightKg = volumeCm3 * materials[material].density / 1000;
    console.log("Weight in kg:", weightKg);
    
    // Display weight in selected unit
    const weightUnit = document.getElementById('armorWeightUnit').value;
    const displayWeight = weightUnit === 'lbs' ? weightKg * 2.20462 : weightKg;
    document.getElementById('armorWeight').textContent = displayWeight.toFixed(2);
    
    // Calculate impact resistance (simplified model based on material and thickness)
    // This is a simplified model using thickness and material strength
    const impactRating = thicknessMm * thicknessMm * materials[material].strengthFactor * 10;
    document.getElementById('impactRating').textContent = Math.round(impactRating);
    
    // Calculate cost estimate
    const cost = weightKg * materials[material].costPerKg;
    document.getElementById('armorCost').textContent = cost.toFixed(2);
    
    console.log("Results:", displayWeight.toFixed(2), Math.round(impactRating), cost.toFixed(2));
    
    // Update armor visualization based on calculations
    updateArmorVisualization(thicknessMm);
}

function calculateWeapon() {
    const kv = parseFloat(document.getElementById('motorKV').value) || 0;
    const voltage = parseFloat(document.getElementById('voltage').value) || 0;
    const weight = parseFloat(document.getElementById('weaponWeight').value) || 0;
    const radius = parseFloat(document.getElementById('weaponRadius').value) || 0;
    const motorPower = parseFloat(document.getElementById('motorPower').value) || 0;
    const gearRatio = parseFloat(document.getElementById('gearRatio').value) || 1;

    // Convert units to standard units (kg, m) for calculations
    const weightKg = convertWeight(weight, document.getElementById('weightUnit').value, 'kg');
    const radiusM = convertLength(radius, document.getElementById('lengthUnit').value, 'm');

    // Calculate RPM
    const rpm = (kv * voltage) / gearRatio;
    document.getElementById('maxRPM').textContent = Math.round(rpm);

    // Calculate stored energy
    const radiansPerSec = rpm * 2 * Math.PI / 60;
    const momentOfInertia = weightKg * radiusM * radiusM / 2;  // Improved disk approximation
    const energyJoules = 0.5 * momentOfInertia * radiansPerSec * radiansPerSec;
    
    // Display energy in selected unit
    const energyUnit = document.getElementById('energyUnit').value;
    const displayEnergy = convertEnergy(energyJoules, 'J', energyUnit);
    document.getElementById('storedEnergy').textContent = displayEnergy.toFixed(1);

    // Calculate tip speed
    const tipSpeedMPS = radiansPerSec * radiusM;
    const speedUnit = document.getElementById('speedUnit').value;
    const displaySpeed = convertSpeed(tipSpeedMPS, 'mps', speedUnit);
    document.getElementById('tipSpeed').textContent = displaySpeed.toFixed(1);

    // Calculate spinup time (simplified)
    const spinupTime = energyJoules / (motorPower || 1); // Avoid division by zero
    document.getElementById('spinupTime').textContent = spinupTime.toFixed(2);
}

function calculateDrivetrain() {
    console.log("Calculating drivetrain...");
    const motorQuantity = parseInt(document.getElementById('motorQuantity').value) || 2;
    const motorPower = parseFloat(document.getElementById('drivePower').value) || 0;
    const wheelDiameter = parseFloat(document.getElementById('wheelDiameter').value) || 0;
    const voltage = parseFloat(document.getElementById('driveVoltage').value) || 0;
    const robotWeight = parseFloat(document.getElementById('robotWeight').value) || 0;
    
    console.log("Inputs:", motorQuantity, motorPower, wheelDiameter, voltage, robotWeight);
    
    // Convert to metric for calculations
    const wheelDiameterM = convertLength(wheelDiameter, document.getElementById('wheelUnit').value, 'm');
    const robotWeightKg = convertWeight(robotWeight, document.getElementById('robotWeightUnit').value, 'kg');
    
    console.log("Converted:", wheelDiameterM, robotWeightKg);
    
    // Total drive power
    const totalPower = motorPower * motorQuantity;
    
    // Simplified calculations
    // Assuming motor efficiency of 80% and considering wheel friction
    const efficiency = 0.8;
    const frictionCoefficient = 0.5; // Rubber on smooth surface
    
    // Calculate top speed (simplified model)
    const motorRPM = 100 * voltage; // Approximation for brushed motors
    const topSpeedMPS = (motorRPM / 60) * Math.PI * wheelDiameterM * efficiency;
    
    console.log("Top speed in m/s:", topSpeedMPS);
    
    // Display top speed in selected unit
    const speedUnit = document.getElementById('driveSpeedUnit').value;
    let displaySpeed;
    if (speedUnit === 'mph') {
        displaySpeed = topSpeedMPS * 2.23694;
    } else if (speedUnit === 'kph') {
        displaySpeed = topSpeedMPS * 3.6;
    } else {
        displaySpeed = topSpeedMPS;
    }
    document.getElementById('topSpeed').textContent = displaySpeed.toFixed(1);
    
    // Calculate pushing force
    const gravity = 9.81;
    const normalForce = robotWeightKg * gravity; // Normal force in Newtons
    const frictionForce = normalForce * frictionCoefficient; // Maximum friction force
    
    // Calculate torque from motors (simplified)
    const angularVelocity = (topSpeedMPS / (wheelDiameterM / 2)) || 1; // rad/s, avoid division by zero
    const totalTorque = (totalPower * efficiency) / angularVelocity; // Nm
    
    // Calculate force at wheels
    const wheelRadius = wheelDiameterM / 2 || 0.01; // Avoid division by zero
    const wheelForce = totalTorque / wheelRadius; // Newtons
    
    // Calculate turn radius based on wheel configuration
    // Get wheel positions relative to robot center
    const robotCenterX = robotBody.x + robotBody.width / 2;
    const robotCenterY = robotBody.y + robotBody.height / 2;
    
    // Calculate average distance from wheels to center
    let avgDistance = 0;
    wheels.forEach(wheel => {
        const dx = wheel.x - robotCenterX;
        const dy = wheel.y - robotCenterY;
        avgDistance += Math.sqrt(dx * dx + dy * dy);
    });
    avgDistance /= wheels.length;
    
    // Apply a scaling factor to the pushing force based on wheel configuration
    let wheelConfigMultiplier = 1.0;
    
    // If wheels are further apart, better stability, slightly less pushing force
    if (avgDistance > 80) {
        wheelConfigMultiplier = 0.95;
    } else if (avgDistance < 60) {
        wheelConfigMultiplier = 1.05; // Wheels close to center, more agility, slightly more force
    }
    
    // Pushing force is limited by either wheel force or friction
    const pushForce = Math.min(wheelForce, frictionForce) * wheelConfigMultiplier;
    document.getElementById('pushForce').textContent = Math.round(pushForce);
    
    // Calculate acceleration (F = ma)
    const acceleration = pushForce / (robotWeightKg || 1); // m/s², avoid division by zero
    document.getElementById('acceleration').textContent = acceleration.toFixed(2);
    
    console.log("Results:", displaySpeed.toFixed(1), Math.round(pushForce), acceleration.toFixed(2));
}

// Add event listeners and initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    
    // Add tab switching functionality
    document.getElementById('weapon-button').addEventListener('click', function() {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        // Remove active class from all buttons
        document.querySelectorAll('.tab').forEach(button => {
            button.classList.remove('active');
        });
        // Show weapon tab
        document.getElementById('weapon-tab').classList.add('active');
        this.classList.add('active');
    });
    
    document.getElementById('drivetrain-button').addEventListener('click', function() {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById('drivetrain-tab').classList.add('active');
        this.classList.add('active');
        
        // Force recalculation when tab is switched
        calculateDrivetrain();
        
        // Also redraw wheel configuration
        drawWheelConfiguration();
    });
    
    document.getElementById('armor-button').addEventListener('click', function() {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById('armor-tab').classList.add('active');
        this.classList.add('active');
        
        // Force recalculation when tab is switched
        calculateArmor();
        
        // Also redraw armor plate
        drawArmorPlate();
    });
    
    // Set up event listeners for the weapon tab
    document.getElementById('weaponWeight').addEventListener('input', calculateWeapon);
    document.getElementById('weaponRadius').addEventListener('input', calculateWeapon);
    document.getElementById('motorKV').addEventListener('input', calculateWeapon);
    document.getElementById('voltage').addEventListener('input', calculateWeapon);
    document.getElementById('motorPower').addEventListener('input', calculateWeapon);
    document.getElementById('gearRatio').addEventListener('input', calculateWeapon);
    document.getElementById('weightUnit').addEventListener('change', updateWeightUnit);
    document.getElementById('lengthUnit').addEventListener('change', updateLengthUnit);
    document.getElementById('energyUnit').addEventListener('change', updateEnergyUnit);
    document.getElementById('speedUnit').addEventListener('change', updateSpeedUnit);
    
    // Set up event listeners for the drivetrain tab
    document.getElementById('motorQuantity').addEventListener('input', calculateDrivetrain);
    document.getElementById('drivePower').addEventListener('input', calculateDrivetrain);
    document.getElementById('wheelDiameter').addEventListener('input', calculateDrivetrain);
    document.getElementById('driveVoltage').addEventListener('input', calculateDrivetrain);
    document.getElementById('robotWeight').addEventListener('input', calculateDrivetrain);
    document.getElementById('wheelUnit').addEventListener('change', updateWheelUnit);
    document.getElementById('robotWeightUnit').addEventListener('change', updateRobotWeightUnit);
    document.getElementById('driveSpeedUnit').addEventListener('change', updateDriveSpeedUnit);
    
    // Initialize wheel canvas
    initializeWheelCanvas();
    
    // Set up event listeners for the armor tab
    document.getElementById('armorThickness').addEventListener('input', calculateArmor);
    document.getElementById('armorArea').addEventListener('input', calculateArmor);
    document.getElementById('armorMaterial').addEventListener('change', calculateArmor);
    document.getElementById('thicknessUnit').addEventListener('change', updateThicknessUnit);
    document.getElementById('areaUnit').addEventListener('change', updateAreaUnit);
    document.getElementById('armorWeightUnit').addEventListener('change', updateArmorWeightUnit);
    
    // Initialize armor canvas
    initializeArmorCanvas();
    
    // Set default values
    document.getElementById('weaponWeight').value = '5.0';
    document.getElementById('weaponRadius').value = '8.0';
    document.getElementById('motorKV').value = '1000';
    document.getElementById('voltage').value = '12';
    document.getElementById('motorPower').value = '1000';
    document.getElementById('gearRatio').value = '1.0';
    
    document.getElementById('motorQuantity').value = '2';
    document.getElementById('drivePower').value = '750';
    document.getElementById('wheelDiameter').value = '4.0';
    document.getElementById('driveVoltage').value = '12';
    document.getElementById('robotWeight').value = '30';
    
    document.getElementById('armorThickness').value = '6.0';
    document.getElementById('armorArea').value = '200';
    
    // Initial calculations
    console.log("Running initial calculations");
    calculateWeapon();
    calculateDrivetrain();
    calculateArmor();
    
    console.log("Initialization complete");
});

// Run a check to ensure everything loaded
window.onload = function() {
    console.log("Window loaded");
    // Force calculations again
    calculateWeapon();
    calculateDrivetrain();
    calculateArmor();
};