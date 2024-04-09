// const create_character = require('./character_info.js');
// const generate_map = require('./generate_map.js');
// const create_party = require('./party.js');

// Reference to the location you want to read data from

var x_offset;
var y_offset;
var map_size = 1;

window.setup = setup;
window.draw = draw;
// window.windowResized = windowResized
window.mouseClicked = mouseClicked
window.keyPressed = keyPressed

var search_box;
var info_box;

var adjacency_list = {};
var locations = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  x_offset = windowWidth/2;
  y_offset = windowHeight/2;
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  search_box = {
    x: windowWidth / 2,
    y: 50,
    length: 300,
    width: 30,
    text: "",
    selected: false,
    highlighted_town: null,
  }
  info_box = {
      x: windowWidth - 160,
      y: windowHeight / 2,
      length: 150,
      width: 400
  }

  get_data();
}

async function get_data() {
  let options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: "abc",
  };
  let response = await fetch('/send_data', options);
  let json = await response.json();
  // console.log(json.body)
  var sending = JSON.parse(json.body);
  // console.log(sending.locations)
  adjacency_list = sending.adjacency_list
  locations = sending.locations
  // console.log(locations)
  // var adjacency_list = JSON.parse(json.body)["adjacency_list"];

  
}
function is_name_exists(list, newName) {
  return list.some(obj => obj.name === newName);
}

function draw() {
  background(220);
  push();
  scale(map_size);
  for (var i = 0; i < locations.length; i ++) {
    var alpha_val = 1;
    if (search_box.highlighted_town == locations[i]){

    }
    else if (search_box.highlighted_town != null && is_name_exists(adjacency_list[search_box.highlighted_town.name], locations[i].name)){
      alpha_val = 0.7;
    } else if (search_box.highlighted_town != null && locations[i].name != search_box.highlighted_town.name) {
      alpha_val = 0.2;
    }
    if (locations[i].type == "dungeon") {
      var width = locations[i].difficulty + 2;
      fill("rgba(255, 0, 0," + alpha_val +")");
      rect(locations[i].x + x_offset, locations[i].y + y_offset, width, width);
      fill ("rgba(0, 0, 0," + alpha_val +")");
      text(locations[i].name, locations[i].x + x_offset, locations[i].y + y_offset - width);
    } else {
      if (locations[i].type == "city") {
        fill("rgba(0, 141, 218, " + alpha_val + ")");
      } else if (locations[i].type == "town") {
        fill("rgba(65, 201, 226," + alpha_val + ")");
      } else {
        fill("rgba(172, 226, 225, " + alpha_val + ")");
      }
      var radius = log(locations[i]["population"]);
      ellipse(locations[i].x + x_offset, locations[i].y + y_offset, radius, radius);
      textSize(14 / map_size);
      fill ("rgba(0, 0, 0," + alpha_val +")");
      text(locations[i].name, locations[i].x + x_offset, locations[i].y + y_offset - radius);
    }
    

    var name = locations[i].name;
    if (adjacency_list[name] != null) {
      for (var c = 0; c < adjacency_list[name].length; c ++) {
        stroke("rgba(0, 0, 0, 0.1)");
        line(locations[i].x+ x_offset, locations[i].y+ y_offset, adjacency_list[name][c].x + x_offset, adjacency_list[name][c].y + y_offset);
        stroke("rgba(0, 0, 0, 0)");
      }
    }
    
  }
  pop();

  // drawing the search bar
  stroke("rgba(0, 0, 0, 1)");
  if (search_box.selected) {
    stroke("rgb(255, 0, 0)");
  }
  fill ("white");
  rect(search_box.x, search_box.y, search_box.length, search_box.width);
  fill("black");
  stroke("rgba(0, 0, 0, 0)");
  text("Search: " + search_box.text, search_box.x, search_box.y);
  // scale(map_size);

  if (search_box.highlighted_town != null) {
    stroke("rgba(0, 0, 0, 1)");
    fill ("white");
    rect(info_box.x, info_box.y, info_box.length, info_box.width);
    var location = search_box.highlighted_town;
    var info = location.name;
    info += "\n-----------";
    info += "\nType: " + location.type;
    info += "\nPopulation: " + location.population;
    info += "\nDifficulty: " + location.difficulty;
    if (location.services.length > 0) {
      info += "\n-----------";
      info += "\nServices:";
      for (var i = 0; i < location.services.length; i ++) {
        info += "\n" + location.services[i].name;
      }
    }
    // info += "\n-----------";
    // info += "\nAdjacent Locations:";
    // for (var i = 0; i < adjacency_list[location.name].length; i ++) {
    //   info += "\n" + adjacency_list[location.name][i].name;
    // }
    stroke("rgba(0, 0, 0, 0)");
    fill ("black")
    text(info, info_box.x, info_box.y)
  }

  if (search_box.selected) {

  } else {
    if (keyIsDown(87)) {
      y_offset += 12;
    } else if (keyIsDown(83)) {
      y_offset -= 12;
    }

    if (keyIsDown(68)){
      x_offset -= 12;
    } else if (keyIsDown(65)) {
      x_offset += 12;
    }
  }
  
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function mouseClicked() {
  if (search_box.x - search_box.length/2 <= mouseX&& mouseX <= search_box.x + search_box.length/2 
  && search_box.y - search_box.width/2 <= mouseY && mouseY <= search_box.y + search_box.width/2) {
    search_box.selected = true;
    return;
  } else {
    search_box.selected = false;
    let mouseXScaled = mouseX / map_size;
    let mouseYScaled = mouseY / map_size;
    for (var i = 0; i < locations.length; i ++) {
      if (distance(mouseXScaled, mouseYScaled, locations[i].x + x_offset, locations[i].y + y_offset) < 10) {
        search_box.highlighted_town = locations[i];
        return;
      }
    }
    search_box.highlighted_town = null;
  }
}

function get_location(location_name, locations) {
  for (var i = 0; i < locations.length; i ++) {
      if (location_name == locations[i].name) {
          return locations[i];
      }
  }
  return null;
}

function keyPressed() {
  if (search_box.selected) {
    if (key == "Enter") {
      var location = get_location(search_box.text, locations);
      if (location == null) {
        search_box.highlighted_town = null;
        return;
      } else {
        search_box.highlighted_town = location;
      }
      search_box.selected = false;
    } else if (key == "Backspace") {
      if (search_box.text.length > 0) {
        search_box.text = search_box.text.slice(0, -1);
      }
    } else if (key.length == 1){
      search_box.text += key;
    }
  } else {
    if (key == "o"){
      map_size *= 0.8;
    } else if (key == "i") {
      map_size *= 1.2;
    }
  }
  
}

// function test_character_creation () {
//   console.log(create_character());
// }
