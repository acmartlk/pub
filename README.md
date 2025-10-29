# The Copper Barrel Pub - Website

A modern, responsive website for a luxurious pub featuring elegant design and a functional reservation system.

## Features

- **Responsive Design**: Beautiful layout that works on all devices
- **Interactive Elements**: Smooth animations, image slider, and reveal effects
- **Reservation Modal**: Professional booking form with all required fields
- **Email Integration**: Forms automatically send to your specified email address
- **Modern UI**: Dark theme with copper/gold accents and glass morphism effects

## Files Structure

```
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css      # All styling
│   └── js/
│       └── main.js         # JavaScript functionality
└── README.md               # This file
```

## How to Use

1. **Open the website**: Simply open `index.html` in any modern web browser

2. **Customize the content**:
   - Edit pub name, address, phone number in `index.html`
   - Update images by replacing the Unsplash URLs
   - Modify colors in CSS variables at the top of `styles.css`

3. **Email Configuration**:
   - The reservation form currently sends emails to: `acmartlk@gmail.com`
   - Uses FormSubmit.co service (free, no setup required)
   - Emails are sent to your specified address automatically

## Reservation Form Fields

The booking form includes:
- Date picker (calendar) - prevents past dates
- Time picker (24-hour format)
- Title dropdown (Mr, Mrs, Ms, Miss, Dr)
- First Name & Last Name
- Phone Number
- Email Address
- Special Notes (optional text area)
- Submit button with loading state

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## No Build Required

This website is fully static - no build process, no dependencies, no server configuration needed. Just open the HTML file and it works!

## Customization Tips

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --copper: #c2703d;        /* Primary accent color */
  --copper-strong: #e68a4a; /* Hover states */
}
```

### Change Email Address
In `main.js`, line 153, change the email:
```javascript
const response = await fetch('https://formsubmit.co/ajax/YOUR_EMAIL@example.com', {
```

### Add More Menu Items
Duplicate the `.card` structure in the Menu section and update images/descriptions.

## Support

For questions or customization help, refer to the code comments in each file.

---

**Note**: FormSubmit.co is a free service with no API keys required. For production use with high volume, consider upgrading to their paid plan or using a custom backend solution.

