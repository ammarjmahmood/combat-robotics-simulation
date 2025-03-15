# Combat Robot Calculator

An interactive web-based calculator for designing and optimizing combat robots. This tool helps robot builders calculate key parameters for weapon systems, drivetrain configurations, and armor design.

![Combat Robot Calculator](robot-icon.svg)

## Features

### Weapon System Calculator
- Calculate weapon energy storage, RPM, tip speed, and spinup time
- Visualize weapon dimensions and specs
- Support for various input units (metric and imperial)
- Adjust motor specs, gear ratios, and power ratings

### Drivetrain Designer
- Interactive wheel positioning interface
- Calculate top speed, pushing force, and acceleration
- Adjust motor quantity, power, and wheel diameter
- Evaluate different drive configurations with real-time feedback

### Armor & Structure Analysis
- Interactive armor plate sizing tool
- Calculate weight, impact resistance, and cost estimates
- Compare different materials (aluminum, steel, titanium, UHMW, Hardox)
- Visualize thickness and coverage area

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server-side components required - runs completely in the browser

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. No build process required - the application is ready to use immediately

```
git clone https://github.com/yourusername/combat-robot-calculator.git
cd combat-robot-calculator
```

Open `index.html` in your browser.

## Usage

### Weapon System
1. Enter weapon parameters (weight, radius, motor specifications)
2. Choose appropriate units from the dropdown menus
3. View calculated results for energy storage, RPM, tip speed, and spinup time

### Drivetrain
1. Input motor and wheel specifications
2. Drag wheels to adjust drive configuration
3. See real-time updates to speed, pushing force, and acceleration values

### Armor & Structure
1. Select material type from the dropdown menu
2. Enter thickness and drag corners to resize armor plate
3. View weight, impact resistance, and cost calculations

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and layout
- `calculator.js` - Core calculation and interactive functionality
- `robot-icon.svg` - SVG icon for the application
- `favicon.ico` - Favicon for browser tabs

## Customization

The calculator uses CSS variables for theming. To customize the appearance:

1. Open `styles.css`
2. Modify the values in the `:root` section at the top:

```css
:root {
    --primary: #2563eb;
    --primary-dark: #1d4ed8;
    --secondary: #475569;
    --accent: #f59e0b;
    --background: #f8fafc;
    --text: #1e293b;
    --border: #e2e8f0;
    --success: #22c55e;
    --error: #ef4444;
}
```

## Development

### Adding New Features
The calculator is built with vanilla JavaScript, HTML5, and CSS3. To extend functionality:

1. Add new UI elements to the appropriate section in `index.html`
2. Add styling in `styles.css`
3. Implement calculation logic in `calculator.js`
4. Bind event listeners in the initialization section of `calculator.js`

### Technical Details
- Canvas-based interactive components
- Responsive design for mobile and desktop use
- Real-time calculations using direct math formulas
- Event-driven architecture for UI updates

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by combat robotics communities worldwide
- Physics calculations based on simplified models for educational purposes
- Built with vanilla JavaScript, HTML5 Canvas, and CSS3