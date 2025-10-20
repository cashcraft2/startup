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
