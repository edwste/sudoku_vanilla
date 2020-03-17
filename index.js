
function generate_board(){
	let i=0;
	for(i=0;i<81;i++){
		var node = document.createElement("div");                 // Create a <li> node
		var textnode = document.createTextNode(i.toString());         // Create a text node
		node.appendChild(textnode);                              // Append the text to <li>
		node.classList.add("cell");
		document.getElementById("root").appendChild(node);     // Append <li> to <ul> with id="myList"
	}
}

generate_board();