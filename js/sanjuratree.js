const canvas = document.getElementById('familyTreeCanvas');
const ctx = canvas.getContext('2d');
const infoBox = document.getElementById('infoBox');
const nameInput = document.getElementById('nameInput');
const infoInput = document.getElementById('infoInput');
const imageInput = document.getElementById('imageInput');
canvas.width = canvas.getBoundingClientRect().width * devicePixelRatio;
canvas.height = canvas.getBoundingClientRect().height * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);

let nodes = [];
let connections = [];
let selectedNode = null;
let isDraggingNode = false;
let isDraggingCanvas = false;
let dragOffsetX = 0,
    dragOffsetY = 0;
let scale = 1;
let offsetX = 0,
    offsetY = 0;
let newNodeMode = false;
let startConnectNode = null;
const CIRCLE_RADIUS = 15;

class Node {
    constructor(x, y, name = "Name", info = "Info", imageSrc = null) {
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 60;
        this.name = name;
        this.info = info;
        this.imageSrc = imageSrc;
        this.image = new Image();
        if (imageSrc) {
            this.image.src = imageSrc;
        }
    }

    draw() {
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(this.name, this.x + 10, this.y + 20);

        if (this.image.src) {
            this.image.onload = () => {
                ctx.drawImage(this.image, this.x + this.width - 50, this.y + 5, 40, 40);
            };
        }

        this.drawConnectionPoints();
    }

    drawConnectionPoints() {
        const points = [{
                x: this.x + this.width / 2,
                y: this.y
            }, // Top
            {
                x: this.x + this.width,
                y: this.y + this.height / 2
            }, // Right
            {
                x: this.x + this.width / 2,
                y: this.y + this.height
            }, // Bottom
            {
                x: this.x,
                y: this.y + this.height / 2
            } // Left
        ];
        points.forEach(point => {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(point.x, point.y, CIRCLE_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    isClicked(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height;
    }

    showInfo() {
        infoBox.style.display = 'block';
        nameInput.value = this.name;
        infoInput.value = this.info;
        imageInput.value = this.imageSrc || '';
        selectedNode = this;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw connections
    for (const connection of connections) {
        ctx.beginPath();
        ctx.moveTo(connection.node1.x + connection.node1.width / 2, connection.node1.y + connection.node1.height / 2);
        ctx.lineTo(connection.node2.x + connection.node2.width / 2, connection.node2.y + connection.node2.height / 2);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    // Draw nodes
    for (const node of nodes) {
        node.draw();
    }

    ctx.restore();
}

canvas.addEventListener('mousedown', (event) => {
    const mouseX = (event.offsetX - offsetX) / scale;
    const mouseY = (event.offsetY - offsetY) / scale;

    if (newNodeMode) {
        nodes.push(new Node(mouseX, mouseY));
        draw();
        newNodeMode = false;
    } else {
        selectedNode = nodes.find(node => node.isClicked(mouseX, mouseY));
        if (selectedNode) {
            isDraggingNode = true;
            dragOffsetX = mouseX - selectedNode.x;
            dragOffsetY = mouseY - selectedNode.y;
            selectedNode.showInfo();
        } else {
            const pointClicked = checkConnectionPoint(mouseX, mouseY);
            if (pointClicked) {
                if (!startConnectNode) {
                    startConnectNode = pointClicked.node;
                } else {
                    connections.push({
                        node1: startConnectNode,
                        node2: pointClicked.node
                    });
                    startConnectNode = null; // Reset for the next connection
                }
            } else {
                isDraggingCanvas = true;
                dragOffsetX = event.offsetX;
                dragOffsetY = event.offsetY;
            }
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (isDraggingCanvas) {
        const dx = event.offsetX - dragOffsetX;
        const dy = event.offsetY - dragOffsetY;
        offsetX += dx;
        offsetY += dy;
        dragOffsetX = event.offsetX;
        dragOffsetY = event.offsetY;
        draw();
    } else if (isDraggingNode && selectedNode) {
        const mouseX = (event.offsetX - offsetX) / scale;
        const mouseY = (event.offsetY - offsetY) / scale;
        selectedNode.x = mouseX - dragOffsetX;
        selectedNode.y = mouseY - dragOffsetY;
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    isDraggingNode = false;
    isDraggingCanvas = false;
});

canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const zoomAmount = -event.deltaY * 0.001;
    scale = Math.min(Math.max(.125, scale + zoomAmount), 4); // Limit the zoom scale
    draw();
});

function checkConnectionPoint(mouseX, mouseY) {
    for (const node of nodes) {
        const points = [{
                x: node.x + node.width / 2,
                y: node.y
            }, // Top
            {
                x: node.x + node.width,
                y: node.y + node.height / 2
            }, // Right
            {
                x: node.x + node.width / 2,
                y: node.y + node.height
            }, // Bottom
            {
                x: node.x,
                y: node.y + node.height / 2
            } // Left
        ];
        for (const point of points) {
            if (Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2) < CIRCLE_RADIUS) {
                return {
                    node
                };
            }
        }
    }
    return null;
}

function startNewNode() {
    newNodeMode = true;
    infoBox.style.display = 'none';
}

function saveNode() {
    if (selectedNode) {
        selectedNode.name = nameInput.value;
        selectedNode.info = infoInput.value;
        selectedNode.imageSrc = imageInput.value;
        selectedNode.image = new Image();
        if (selectedNode.imageSrc) {
            selectedNode.image.src = selectedNode.imageSrc;
        }
        draw();
    }
}

function deleteNode() {
    if (selectedNode) {
        nodes = nodes.filter(node => node !== selectedNode);
        connections = connections.filter(connection => connection.node1 !== selectedNode && connection.node2 !== selectedNode);
        selectedNode = null;
        infoBox.style.display = 'none';
        draw();
    }
}

function closeInfoBox() {
    infoBox.style.display = 'none';
}

function saveData() {
    const data = {
        nodes: nodes.map(node => ({
            x: node.x,
            y: node.y,
            name: node.name,
            info: node.info,
            imageSrc: node.imageSrc
        })),
        connections: connections.map(connection => ({
            node1: nodes.indexOf(connection.node1),
            node2: nodes.indexOf(connection.node2)
        }))
    };
    localStorage.setItem('familyTreeData', JSON.stringify(data));
    alert('Data saved!');
    console.log(JSON.stringify(data));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('familyTreeData'));
    if (data) {
        nodes = data.nodes.map(nodeData => new Node(nodeData.x, nodeData.y, nodeData.name, nodeData.info, nodeData.imageSrc));
        connections = data.connections.map(connection => ({
            node1: nodes[connection.node1],
            node2: nodes[connection.node2]
        }));
        draw();
        alert('Data loaded!');
    } else {
        alert('No saved data found.');
        const manualPrompt = prompt('Enter');
        const manualData = JSON.parse(manualPrompt);
        if (manualPrompt) {
            nodes = manualData.nodes.map(nodeData => new Node(nodeData.x, nodeData.y, nodeData.name, nodeData.info, nodeData.imageSrc));
            connections = manualData.connections.map(connection => ({
                node1: nodes[connection.node1],
                node2: nodes[connection.node2]
            }));
        }
    }
}


draw(); // Initial draw