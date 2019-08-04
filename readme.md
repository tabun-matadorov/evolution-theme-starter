# Evolution Theme Starter

This project should serve as starting point for developing [Evolution](https://www.directadmin.com/evolution.php) skin themes. Custom themes allow you to override colors, menus, icons and apply custom styling to Evolution layouts.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1. DirectAdmin server with latest Evolution installed
2. Dev tools on your local environment: `node.js`, `git`, `npm`

### Installing
1. Edit `directadmin.conf` and set `referrer_check=0`; restart DirectAdmin service
2. Clone/Download this boilerplate

    `git clone git@github.com:tabun-matadorov/evolution-theme-starter.git my-awesome-theme`
3. Edit `package.json`: change `name`, `description`, `author` and `devHost` properties
4. Install all required for development software: `npm install`

### Development
1. Start local development server: `npm run dev`
2. Open `http://localhost:8080` in your browser
3. Open Skin Options and change theme to the one you're developing now.

#### Development: colors.json
You are able to override some of main Evolution colors with providing custom `src/colors.json` file. There is four possible colors to override: `primary-dark`, `safe`, `danger` and `neutral`, each could be skipped (defaults will be used). Colors should be provided in HSL format(you could use this [converter](https://www.w3schools.com/colors/colors_converter.asp)) or extract color customization from `config.json`.

Sample color object:
```json
{
    "hue": 195,
    "saturation": 100,
    "lightness": 50
}
```

#### Development: menus
By editing `src/menu/admin|reseller|user.json` you could override default menu items. Menu file should contain array of category objects.

Sample category object:
```json
{
    "name": "Account Manager",
    "icon": "account-manager",
    "entries": [
        {
            "route": "/user/domains",
            "name": "Domains",
            "icon": "domains"
        },
        {
            "href": "http://example.net",
            "name": "Example",
            "icon": "domains",
            "newTab": true
        },
        {
            "route": "plugins"
        },
        {
            "href": "{{help}}",
            "name": "Help",
            "icon": "help"
        }
    ]
}
```
There are 4 possible entry types:
1. Standard route: this is served with vue-router inside Vue app, and will force refresh of the page.
2. External link: points to external page, and will leave Evolution when used. `newTab` property is optional, `false` by default.
3. Plugins entry: this is the marker, after which plugin entries will be placed. This entry itself will not be shown.
4. Help entry -- standard external link with `{{help}}` as href. This _magic_ word will be replaced with link to actual help article.

#### Development: icons
You could place your icon SVG files to `src/icons` folder. All files will be merged into `icons.svg` sprite and will be used for menu icons.

#### Development: styles
You could override Evolution styling by editing files in `src/styles` folder. They will be bundled into 4 separate layout style files and will be applied to corresponding layout - `standard.css`, `sidebar.css`, `grid.css`, `hybrid.css`.
You could use your own svg images in style files: place svg files into `src/images` folder and use them in your css:
```css
body {
    // using src/images/bg.svg as background
    background-image: url(/assets/themes/my-awesome-theme/images.svg#bg);
}
```


### Build & Deploy
* `npm run build`
* Upload resulting `my-awesome-theme.zip` archive to DA host

## License
This project is licensed under the MIT License
