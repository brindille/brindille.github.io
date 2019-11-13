## About
Brindille is a collection of micro libraries intended to work together to build websites.

It was made for people like me who make websites that don't need reactivity or client side DOM rendering, and want minimal JS framework footprint.

### Components
Brindille is built around [brindille-component](https://github.com/brindille/brindille-component) which is a script to recursively wrap Javascript objects around HTML elements. It does not handle any rendering, it needs to be plugged on an already existing DOM. It does however allows to bind logic and to manipulate dom elements. Components could be used to create complex animations and user interactions.

### Routing
For multipage websites we've created [brindille-router](https://github.com/brindille/brindille-router) which uses [brindille-component](https://github.com/brindille/brindille-component) as a view system to allow you to change pages using the History API.

### Static generation
Although components and route system can be used on any type of preexisting html, Brindille provides a [starter](https://github.com/brindille/brindille-static) with a local server for rendering pages that is able to generate static HTML.

## Getting Started
To start using brindille you should install the [yeoman generator](https://github.com/brindille/generator-brindille)
```bash
npm i -g generator-brindille
```
Then you can create a new brindille project like this
```bash
mkdir my-brindille-project
cd my-brindille-project
yo brindille
```
Now you just have to start the local dev server
```bash
npm start
```

## Add components
The basic structure from the starter is good enough to kick off a project but you will quickly need to add new components. For that just use our yeoman subgenerator and answer the prompts.
```bash
yo brindille:component
```

## Build
Just use our build task, the whole website will be generated in `dist`.
```bash
npm run build
```

## Technos
Here are the tools we use in the starter:
- [webpack](https://webpack.js.org/) for bundling
- [express](https://expressjs.com/) for local dev server
- [browser-sync](https://www.browsersync.io/) for HMR and various development goodies
- [nunjucks](https://mozilla.github.io/nunjucks/) for local templating
- [stylus](http://stylus-lang.com/) for styling
- [yaml](https://yaml.org/) for content files


## Configuration

### Routes
You need to define all the routes of your app in  `data/routes.yaml`. This will be used both by client, local server and build tool. Default page will be the first entry from the list. The id of a route will be used to identity it and to create the class name of this routes (pascalcase). The path will be used by client and server routers and uses the [same route format than Express](http://expressjs.com/en/guide/routing.html).

```yaml
- id: 'home'
  path: 'home'
- id: 'about'
  path: 'about'
- id: 'posts'
  path: 'post'
- id: 'post'
  path: 'post/:id'
```

### Languages
You need to define all the languages of your app in  `data/languages.yaml`. This will be used both by client, local server and build tool. Default lang will be the first entry from the list.

```yaml
- 'en'
- 'fr'
```

### Static datas
Each page template will be passed content from a `.yaml` file if it exists. 
Ex for Home page if you have the following `data/pages/home.yaml` file :
```yaml
title: 'Le Home Title'
```
You will be able to access the title variable from nunjucks using `{{ Home.title }}`

### Controllers
Each page of your app can use a server side controller to populate its data. This controller will be called on local dev by express server and by the build tool for the static site. Each controller must be placed in the section folder. Controllers should export a data and or a routes functions that each return promises. Ex for Post page `src/views/sections/post/controller.js`
```js 
module.exports = {
  data: (params) => {
    return new Promise(resolve => {
      resolve({
        foo: 'bar',
        a: 0
      })
    })
  },
  routes: () => {
    return new Promise(resolve => {
      resolve([
        'post/foo',
        'post/bar'
      ])
    })
  }
}
```

The `data` function should return a promise that resolves an object that will be available in nunjucks templates `{{ Home.foo }}` will render to `bar`. The function will be passed url params as an object, ex for a `post/:id` route and for a `post/toto` request, data will receive a `{id: 'toto'}` object. This method will be called each time the view is rendered (never on client side). Typically you could use this method to return content of a given post from your favorite CMS.

The `routes` function should return a promise that resolves an array of subroutes to be rendered. You will need this for routes with params like `post/:id` to tell the builder which value of `id` should be used for static rendering. This method will only be used on build. Typically you could use this method to return a list of post from your favorite CMS.

## Project Structure
```
.
├─ data
├─ dist
└─ src
```
The file structure is divided into three main folders : `data`, `dist` and `src`. The `data` folder contains YAML files we use for static content and configurations, `src` contains all source code files that we use to generate the website, and `dist` contains the generated site (bundles and html static files). We will try to have a more in depth look into each of these folder.

### data
```
data
├─ en
|  ├─ pages
|  |  ├─ home.yaml
|  |  ├─ about.yaml
|  |  └─ ...
|  └─ main.yaml
├─ fr
|  ├─ pages
|  |  ├─ home.yaml
|  |  ├─ about.yaml
|  |  └─ ...
|  └─ main.yaml
├─ languages.yaml
└─ routes.yaml
```
We use the data folder to store both configuration and content YAMLs. It contains two very important files: `languages.yaml` and `routes.yaml` which are used to configure Brindille. Then for each languages specified in `languages.yaml` we have a folder for the corresponding language containing translation content for this language. For each language we use a `main.yaml` that contains global translated contents, and a yaml for each route.

### dist
This folder contains the built version of the project, including bundles and html files for static hosting.

### src
```
src
├─ assets
├─ lib
├─ server
├─ styles
├─ views
└─ index.js
```
The `assets` folder will be served to your project's root and copied in the dist folder for export.

We use `lib` folder for storing code that is not meant to be specific for this project but that could be reused across different projects.

The `server` folder contains all files relative to local rendering and production bundling, feel free to dig into them to see how things work under the hoods. It also contains a global controller that is called each time a page of the site. The data it returns can be used in the templates.

In `styles` we have our main stylus files. Note that each component has its own stylus file in `src/views/[components|layouts|sections]/[component-name]`

`views` folder is where we store all our components, we dispatch them into three categories: `components` for components that can be used more than one, `layouts` for one-time specific component (like a header or footer) and `sections` for page components. In the `index.html` file is the root html file that is being rendered. Meaning that everytime our app is rendered it goes through this file which in turns call sub-components, layouts and sections depending on various parameters.
```
src
└─ views
   ├─ components
   ├─ layouts
   ├─ sections
   └─ index.html
```
Each component, no matter if they are layout, section or basic component needs a few thing to work: an html file containing the proper nunjucks template, a stylus file for styling and a Javascript class defining behaviour. It also need to be registed in `src/index.js`. Optionally for sections you can add a `controller.js` file that will be executed by local renderer or by the builder to fetch specific datas that you need in the template. Also you can add a yaml file for a section in `data/[lang]/pages` and its content will automatically be available in this section template under the section's namespace.
```
components
└─ mybutton
   ├─ mybutton.html
   ├─ mybutton.styl
   └─ Mybutton.js
```
```nunjucks
<!-- src/views/components/mybutton/mybutton.html -->
<button class="Mybutton" data-component="Mybutton">Click me</button>
```
```nunjucks
<!-- src/views/components/index.html -->
<body>
  <h1>here's a button :</h1> 
  {% include './components/mybutton/mybutton.html' %}
</body>
```
```stylus
/* src/views/components/mybutton/mybutton.styl */
.Mybutton
  color pink
```
```javascript
/* src/views/components/mybutton/Mybutton.js */
import Component from 'brindille-component'

class Mybutton extends Component {
  constructor($el) {
    super($el)

    this.$el.addEventListener('click', this.onClick.bind(this))
  }

  onClick () {
    window.alert('Clicked')
  }
}
```
```javascript
/* src/index.js */
import Mybutton from "./views/componenst/mybutton/Mybutton"
componentManager.registerMultiple({ Mybutton })
```
