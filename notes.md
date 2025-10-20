# CS 260 Notes

[My startup - Cotter](insertLinkHere)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

### Instance

My IP address is: 23.21.161.220

My server is running from the us-east-1 center in Virgina.

I have created an elastic IP address that and allocated it to my instance so that I will always have this same public IP.

I have attached an Amazon Machine Image (AMI) to the base of my server that was created previously for the CS260 class at BYU. This AMI has Ubuntu, Node.js, NVM, Caddy Server, and PM2 built in so I won't need to install them.

For this instance I have decided to go with a t3.micro instance type. This should be sufficient for my web app, but since I have allocated an elastic IP, I will not get a new IP address if I ever want to upgrade to a higher instance type.

In the network settings, I needed to create a security group. I needed to make sure that SSH, HTTP, and HTTPS traffic is allowed from anywhere. (I did not have this at first, and I was unable to load the webpage in my browser). A security group represent the rules for allowing access to my servers.

I was also able to ssh into my server using the following command: `➜  ssh -i [key pair file] ubuntu@[ip address]`
I needed to make sure that my private key was stored safely and that the permissions were only allowed for me using this command: `chmod  600 yourkeypairfile.pem`

### Domain Name

For this web application, I have decided to purchase my own domain name from AWS.

The domain name for my application is `http://outfishn.click`

In order to do this I navigated to the Route 53 section on the left hand side menu. I then followed these instructions:

Find an unused root domain that contains the appropriate suffix based on the price you want to pay. 

Purchase your new root domain. Then follow the following steps to ensure your root domain is tied to your public IP address from your instance:

* Open the AWS console in your browser and log in.
* Navigate to the Route 53 service.
* Select the Hosted zones option from the menu on the left.
* Click on your domain name to view the details. This should display existing DNS records with types such as NS, and SOA.
* Create the root domain DNS record. This will associate your domain name with your server's IP address
* In the Value box enter the public IP address of your server.
* Press Create records
* Create a DNS record that will map to your server for any subdomain of your root domain name. 
* In the Value box enter the public IP address of your server.
* Press Create records

After following these steps and ensuring the verification process was finished (including email verification), I was able to type my newly created domain name into my browser and see my webpage displayed.


## Midterm Preparation

**In the following code, what does the `<link>` element do?**

The `<link>` element is most commonly used to link an external CSS file to the HTML document, defining the visual style of the page. Example (Code):

`<link rel="stylesheet" href="styles.css">`

It tells the browser to load the styles.css file and apply the styles defined within it as the stylesheet for the current HTML document.

**In the following code, what does the `<div>` tag do?**

The `<div>` (division) tag is a generic container for flow content. It's used to group related elements together for styling (via CSS) or manipulation (via JavaScript). It doesn't have inherent semantic meaning. Example (Code):

```
<div class="header-group">
  <h1>Page Title</h1>
  <p>Subtitle</p>
</div>
```

It creates a block-level container to logically group the h1 and p elements, making it easy to apply styles (like a specific background or layout) to the group as a whole.

**In the following code, what is the difference between the `#title` and `.grid` selector?**

The difference lies in what they select:

*  `#title` is an ID selector. It selects the single HTML element whose `id` attribute is set to `title`. An ID must be unique on a page.
*  `.grid` is a class selector. It selects all HTML elements whose `class` attribute includes the value `grid`. A class can be used multiple times on a single page.

**In the following code, what is the difference between padding and margin?**

Both create space around an element's content, but in different areas:

* `padding` is the space inside the element, between the content and the element's border.

* `margin` is the space outside the element's border, separating it from other elements.

**Given this HTML and this CSS how will the images be displayed using flex?**

Assuming the images are inside a flex container (`display: flex;`), they will be displayed as flex items. By default, this means they will be arranged side-by-side in a row, starting from the left.

**What does the following padding CSS do?**

Example (Code): `padding: 10px 20px 5px 15px;` 
It sets the padding around the element. The values are applied in clockwise order starting from the top:

Top padding: `10px`

Right padding: `20px`

Bottom padding: `5px`

Left padding: `15px`

**How would you use CSS to change all the div elements to have a background color of red?**

You would use the element selector for the `div` tag. Example:

```
div {
  background-color: red;
}
```

**How would you display an image with a hyperlink in HTML?**

You nest the <img> tag inside the <a> (anchor) tag. Example:

```
<a href="https://example.com/target-page">
  <img src="my-image.jpg" alt="A descriptive image">
</a>
```

**In the CSS box model, what is the ordering of the box layers starting at the inside and working out?**

1. Content (The actual text/image)

2. Padding (Space between content and border)

3. Border (The line surrounding the padding)

4. Margin (Space outside the border, separating it from other elements)


**Given the following HTML, what CSS would you use to set the text "trouble" to green and leave the "double" text unaffected?**

Example (HTML):
`<p>double <span class="highlight">trouble</span></p>`

CSS:
```
.highlight {
  color: green;
}
```

**By default, the HTML span element has a default CSS display property value of:**

`inline`

**What does the following code using arrow syntax function declaration do?** 

Example: `const multiply = (a, b) => a * b;`

Answer: It defines a function named `multiply` that takes two parameters, `a` and `b`, and returns their product. The concise arrow syntax allows the omission of `return` and curly braces for single expressions.


**What does the following code using map with an array output?**

Example: `[1, 2, 3].map(x => x * 2);`

Answer: It outputs a new array where each original element has been doubled: `[2, 4, 6]`. The `map()` method creates a new array by calling a provided function on every element in the calling array.


**What does the following code output using getElementById and addEventListener?**

Example: 
```
document.getElementById('myButton').addEventListener('click', function() {
  console.log('Button clicked!');
});
// Assume the user clicks the element with id="myButton"
```

Answer: When the element with the ID `myButton` is clicked, the console will output the string: `Button clicked!`. The `addEventListener` sets up a function to execute when a specified event (in this case, `'click'`) occurs on that element.


**What does the following line of Javascript do using a # selector?**

Example: `document.querySelector('#user-name').textContent = 'Alice';`

Answer: It selects the first element in the document that has the `id` of `user-name` (using the CSS-style ID selector `#user-name`) and changes its text content to the string `Alice`.


**What will the following code output when executed using a for loop and console.log?**

Example: 
```
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

Answer: It will output the numbers 0,1, and 2, each on a new line. The loop iterates as long as i is less than 3.

Output: 
```
0
1
2
```


**How would you use JavaScript to select an element with the id of “byu” and change the text color of that element to green?**

Example/Answer:
```
document.getElementById('byu').style.color = 'green';

// OR using querySelector:
// document.querySelector('#byu').style.color = 'green';
```


**What is valid javascript syntax for if, else, for, while, switch statements?**

`if (condition) { /* code */ } else { /* code */ }`

`for (let i = 0; i < 5; i++) { /* code */ }`

`while (condition) { /* code */ }`

`switch (expression) { case value: /* code */ break; default: /* code */ }`


**What is the correct syntax for creating a javascript object?**

Example:
```
const person = {
  name: "John",
  age: 30,
  isStudent: false
};
```


**Is it possible to add new properties to javascript objects?**

Yes, JavaScript objects are dynamic and properties can be added, modified, or deleted at any time after creation. Example: `person.city = "Provo";`


**If you want to include JavaScript on an HTML page, which tag do you use?**

You use the `<script>` tag.


**Given the following HTML, what JavaScript could you use to set the text "animal" to "crow" and leave the "fish" text unaffected?**

Example (HTML): 

```
<p>
  The <span id="target-word">animal</span> is smaller than the fish.
</p>
```

Example (JavaScript/Answer): `document.getElementById('target-word').textContent = 'crow';`


**What will the following code using Promises output when executed?**

Example: 
```
new Promise((resolve, reject) => {
  resolve('First');
})
.then(result => {
  console.log(result);
  return 'Second';
})
.then(result => {
  console.log(result);
});
console.log('Synchronous');
```

Answer: Since Promises run asynchronously (after the synchronous code stack clears), the output will be:
```
Synchronous
First
Second
```


**Which of the following are true? (mark all that are true about the DOM)**

* The DOM (Document Object Model) is a programming interface for HTML and XML documents.

* It represents the page so that programs can change the document structure, style, and content.

* It represents the document as a tree of objects (nodes).


**Which of the following correctly describes JSON?**

JSON (JavaScript Object Notation) is a lightweight data-interchange format. It's easy for humans to read and write, and easy for machines to parse and generate. It is built on two structures: a collection of name/value pairs (like a JavaScript object) and an ordered list of values (like a JavaScript array).


**Port `443`, `80`, `22` is reserved for which protocol?**

* Port 443: HTTPS (Hypertext Transfer Protocol Secure)

* Port 80: HTTP (Hypertext Transfer Protocol)

* Port 22: SSH (Secure Shell)


**Is a web certificate is necessary to use HTTPS.**

Yes. An SSL/TLS certificate is necessary to enable HTTPS, as it provides the public key for the server to establish a secure, encrypted connection.


**Can a DNS A record can point to an IP address or another A record.**

A DNS A record can only point to an IPv4 address. It cannot point to another A record (though a CNAME record can point to another domain name).


**Which of the following is true for the domain name `banana.fruit.bozo.click`, which is the top level domain, which is a subdomain, which is a root domain?**

The root domain is the unnamed domain at the top of the hierarchy, represented by a single dot (.). The other parts are:

Top Level Domain (TLD): `.click`

Second Level Domain: `bozo` (i.e., `bozo.click` is the registrable domain)

Subdomains: `fruit` and `banana` (i.e., `banana.fruit.bozo.click` is a full address)


**What is the opening HTML tag for a paragraph, ordered list, unordered list, second level heading, first level heading, third level heading?** 

Paragraph: `<p>`
Ordered List: `<ol>`
Unordered List: `<ul>`
First Level Heading: `<h1>`
Second Level Heading: `<h2>`
Third Level Heading: `<h3>`


**How do you declare the document type to be html?**

Answer: `<!DOCTYPE html>`


**What does the console command `chmod`, `pwd`, `cd`, `ls`, `vim`, `nano`, `mkdir`, `mv`, `rm`, `man`, `ssh`, `ps`, `wget`, `sudo` do?**

`chmod`: Change file permissions (modes).
`pwd`: Print Working Directory (shows the current directory path).
`cd`:	Change Directory (navigates to a different directory).
`ls`:	List directory contents.
`vim`:	A powerful, command-line text editor.
`nano`:	A simpler, user-friendly command-line text editor.
`mkdir`:	Make Directory (creates a new directory).
`mv`:	Move a file or directory (also used to rename).
`rm`:	Remove (delete) files or directories.
`man`:	Displays the manual pages for a command.
`ssh`:	Secure Shell (creates a secure, remote shell connection).
`ps`:	Process Status (displays currently running processes).
`wget`:	Web Get (retrieves files from the web via HTTP, HTTPS, and FTP).
`sudo`:	Superuser Do (executes a command with superuser/root privileges).


**Which of the following console command creates a remote shell session?**
`ssh`


**Which of the following is true when the `-la` parameter is specified for the `ls` console command?**

The `-la` parameter combines:

* `-l` (long listing format): Displays file details including permissions, owner, size, and modification date.

* `-a` (all): Lists all files, including hidden files (those starting with a dot, e.g., .bashrc).

Example (Answer): It displays all files (including hidden ones) in the long listing format, showing detailed information like permissions, owner, size, and date.




## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

I learned that Caddy is what we will be using to act as a gateway to the different services and host our web application files. Basically all I did in this step was `ssh` into my server, and change the `Caddyfile` to use my domain. 

I used the following to `ssh` into my server:
`ssh -i [key pair file] ubuntu@[yourdomainnamehere]`

I edited the `Caddyfile` using the following:
`vi Caddyfile`

We replaced port 80 with the domain name as well as modified the other Caddy rules to the domain name. Finally, we restarted Caddy so that the changes would take effect.

Now our webpage is using HTTPS rather than HTTP.

## HTML

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

## CSS

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```
