import componentManager from "./lib/core/ComponentManager"
import Component from "brindille-component"
import "./styles/index.styl"

/* Layout */
import Markdown from "./views/layouts/markdown/Markdown"

componentManager.registerMultiple({
  /* Layout */
  Markdown
})

let rootComponent = new Component(document.body, componentManager.get)
componentManager.setRootComponent(rootComponent)
