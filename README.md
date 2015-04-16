## Requirements
1. Node.js - http://nodejs.org/
2. Ruby - https://www.ruby-lang.org/
3. Compass - http://compass-style.org/

## Setup & running
* Install Node.js modules

~~~~
    npm i
~~~~

* Install Bower components

~~~~
    bower i
~~~~

* Run in development mode

~~~~
    grunt serve
~~~~

* Make build for production environment (minified sources)

~~~~
    grunt build
~~~~

## Known issues
* Wiredep error - Missing component

    Fix: Install missing bower components
~~~~
    bower install
~~~~

* Compass fails to compile - Doesn't create CSS files

    Fix: Replace special characters that are present in the project's path. For example: [], {}, *.

* Bower unable to connect to github
    Fix: Define https as default protocol
~~~~
git config --global url."https://".insteadOf git://
~~~~
