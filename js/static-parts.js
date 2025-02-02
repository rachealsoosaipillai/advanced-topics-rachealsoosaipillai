// use this file to set constant elements that don't change
// across individual pages

let menuEntries = [
  {text: "Home",
   link: 'index.html'},
  {text: 'Oral History',
   link: 'oral-history/index.html'},
  {text: 'Mapping',
   link: 'spatial-history/index.html'},
  {text: 'Proposal',
   link: 'project-proposal/index.html'}
];


let authorName='Racheal Soosaipillai',
    footerHtml=`HTML projects by ${authorName}, originally written for <a href="https://digitalhistory.github.io/">HIS393: Digital History</a>`;


function makeMenu (items= menuEntries, path = location.pathname) {
  let allPaths = [],
      prefix = '',
      html = '',
      basedir = window.location.pathname.split(/\\\//g).splice(-2)[0]; // check which dir we're in
  if (basedir !== 'advanced-topics') {
    prefix = '../';
  }
  for (let i of items) {
    if (i.link !== 'index.html') {
      allPaths.push(i.link);
    }
  }
  for (let p of allPaths) {
    // if (path.includes(p)) {
    //   prefix= '../';
    //   break;
    // }
  }
  for (let i of items) {
    html += `<a href="${prefix}${i.link}">${i.text}</a>`;
  }
  html = '<div class="nav-right">' + html + "</div>";
  $('header.nav').append(html);
}

function makeFooter (html) {
  $('footer#page-footer').html(`<main>${html}</main>`);
}

makeMenu (menuEntries);
makeFooter (footerHtml);



