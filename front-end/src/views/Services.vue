<template>
<div class="home">
  <div class="intro">
    <h1>Our Services</h1>
  </div>
  <div class="content">
    <div class="column">
      <ul>
        <li>We can put your lights up for an affordable price!</li>
        <li>We can use the lights you already own, use, and trust</li>
        <li>Or we can rent or sell lights to you for great prices</li>
        <li>We'll store your lights safely in the summer! saving you space!</li>
        <li>We offer a satisfaction guarantee on all our hard work</li>
      </ul>
    </div>
    <div class="column">
      <ul>
        <li>We can take your lights down whenever you want</li>
        <li>Or we can leave them up year round to save you money</li>
        <li>We can fix any problem that may arise with your lights immediately</li>
        <li>We can do trees and patios as well as rooftops!</li>
        <li>You can have your choice of colors style all personalized!</li>
    </ul>
    </div>
  </div>
  <div class="rates">
    <p>We will do your roof for just $3 a foot. (haggeling is accepted)</p>
    <p>(Price's are independent per constumer and may vary)</p>
  </div>
</div>
</template>

<style scoped>
.intro {
  text-align: center;
}
.column {
  float: left;
  width: 50%;
}

.column li {
  margin: 1em;
  list-style-type: none;
}

.column ul {
  border-style: solid;
  border-radius: 25px;
  margin-right: 2.5%;
  margin-left: 2.5%;
  background: #303740;
  color: #fff;
}

.content {
  margin-left: 15%;
  margin-right: 15%
}

.content:after {
  content: "";
  display: table;
  clear: both;
}

.rates {
  text-align: center;
  margin-top: 5%;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {

}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 820px) {
  .rates {
    margin-top: 2.5%;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 819px) {
  .rates {
    margin: 5px;
  }
  .column li {
    font-size: 10px;
  }
}
</style>
