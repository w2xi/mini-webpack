import createHeader from './header.js';
import name from './bar.js'

const header = createHeader();

document.body.append(header);

console.log('bar name', name);