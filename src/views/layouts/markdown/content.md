## About
Brindille is a collection of micro libraries intended to work together to build websites.

It was made for people like me who make websites that don't need reactivity or client side DOM rendering, and want minimal JS framework footprint.

### Components
Brindille is built around [brindille-component](https://github.com/brindille/brindille-component) which is a simple tool to recursively wrap Javascript objects around HTML elements. It does not handle any rendering, it needs to be plugged on an already existing DOM. It does however allows to bind logic and manipulate dom elements. Components could be used to create complex animations and user interactions.

### Routing
For multipage websites I've created [brindille-router](https://github.com/brindille/brindille-router) which uses [brindille-component](https://github.com/brindille/brindille-component) as a view system to allow you to change pages using the History API.

### Static generation
Although components and route system can be used on any type of preexisting html, Brindille provides a [starter](https://github.com/brindille/brindille-static) with a local server for rendering pages that is able to generate static HTML.

## How to start
To start using brindille you should install the [yeoman generator](https://github.com/brindille/generator-brindille)
```
npm i -g generator-brindille
```
Then you can create a new brindille project like this
```
mkdir my-brindille-project
cd my-brindille-project
yo brindille
```
Now you just have to start the local dev server
```
npm start
```

## Usage
### Components

```html
<!-- index.html -->
<body>
  <div data-component="MyCustomButton">click me</div>
</body>
```

```javascript
/* index.js */
import Component from 'brindille-component'

class MyCustomButton extends Component {
  constructor($el) {
    super($el)

    this.$el.addEventListener('click', this.onClick.bind(this))
  }

  onClick () {
    window.alert('Clicked')
  }
}

const app = new Component(document.body, { MyCustomButton })
```