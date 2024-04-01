# OGX.OS
> Experimental browser based operating system based on OGX.JS

### Videos

[![OGXOS]](https://github.com/globules-io/OGX.OS/assets/13317159/a62ee8b5-8358-4358-8b51-bec60bb48973)

[![OGXOS2]](https://github.com/globules-io/OGX.OS/assets/13317159/cc712ebe-b0b2-48d0-95b1-a53da6227af2)

### Online Demo
> Online demo available [here](https://os.globules.io), might not be up to date.

### Running Locally
> Install OGX.CLI by running
 
     npm install @globules-io/ogx.cli -g

> Clone this repo in a folder of your webserver and set the `www` folder as root
> 
> Prepare the project by opening the CLI in the parent folder of `www` and type

     ogx prepare

> Navigate to `http://localhost`

#### Optional Step
> You can also reduce the app file by doing

    ogx pack all
    ogx prepare
    ogx compress

> To restore

    ogx restore
    ogx unpack all
    ogx prepare
    
> Note that if you are hosting on IIS, you need to add a `MIME type` of value `text/plain` for `.pak` files

### Participating
> Anybody can participate by creating programs for OGX.OS. Just check out how basis programs are built and create your own!
> Then create an issue explaining the motivations and if it checks out, we'll merge it as official program and link you up here.

#### Getting Started
> Create your program view + template by typing

     ogx create MyProgram MyProgram

> Open the files in VSCODE

     ogx open MyProgram

> Add `Program` to the `require` of the view (first line)

     require('Views.MyProgram', 'Program', 'View');

> Add a reference to your progam in `www/json/programs.json`, such as

     {"label" : "MyProgram", "icon" : "some_icon", "view" : "MyProgram", "type" : "MenuProgram"}

### Why
> OGX.OS brings the ultimate benchmark and test project for OGX.JS, the Javascript framework behind OGX.OS. This also showcases the power of OGX.JS and how you can build enterprise grade apps with ease.








