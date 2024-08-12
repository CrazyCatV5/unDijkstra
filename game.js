document.addEventListener('DOMContentLoaded', function () {
    const gameCanvas = document.getElementById('gameCanvas');
    const costCounter = document.getElementById('costCounter');
    const regenerateButton = document.createElement('button');
    const surrenderButton = document.createElement('button');

    let nodes = [];
    let edges = [];
    let nodePositions = {};
    let currentNode = 1;
    let currentCost = 0;

    regenerateButton.innerText = "Перегенерировать граф";
    regenerateButton.style.position = 'absolute';
    regenerateButton.style.bottom = '20px';
    regenerateButton.style.left = '40%';
    regenerateButton.style.transform = 'translateX(-50%)';
    regenerateButton.style.padding = '10px 20px';
    regenerateButton.style.fontSize = '16px';
    regenerateButton.addEventListener('click', () => {
        generateValidGraph();
        drawGraph();
    });
    document.body.appendChild(regenerateButton);

    surrenderButton.innerText = "Сдаться";
    surrenderButton.style.position = 'absolute';
    surrenderButton.style.bottom = '20px';
    surrenderButton.style.left = '60%';
    surrenderButton.style.transform = 'translateX(-50%)';
    surrenderButton.style.padding = '10px 20px';
    surrenderButton.style.fontSize = '16px';
    surrenderButton.addEventListener('click', () => {
        highlightShortestPath();
    });
    document.body.appendChild(surrenderButton);

    function generateValidGraph() {
        do {
            generateGraph();
        } while (!isPathAvailable(nodes[0].id, nodes[nodes.length - 1].id));
    }

    function generateGraph() {
        nodes = [];
        edges = [];
        nodePositions = {};
    
        const columns = 6;
        const minNodesPerColumn = 2;
        const maxNodesPerColumn = 4;
        const nodeCount = columns * maxNodesPerColumn;
    
        let nodeId = 1;
        let previousColumnNodes = [];
    
        for (let col = 0; col < columns; col++) {
            const x = col * (gameCanvas.clientWidth - 150) / (columns - 1) + 75; // Увеличиваем горизонтальное расстояние
    
            const nodesInColumn = col === 0 || col === columns - 1 ? 1 : Math.floor(Math.random() * (maxNodesPerColumn - minNodesPerColumn + 1)) + minNodesPerColumn;
            let currentColumnNodes = [];
    
            for (let i = 0; i < nodesInColumn && nodeId <= nodeCount; i++) {
                const y = (i + 1) * (gameCanvas.clientHeight - 250) / (nodesInColumn + 1) + 125; // Увеличиваем вертикальное расстояние
                nodes.push({ id: nodeId, x: x, y: y });
                nodePositions[nodeId] = { x: x, y: y };
                currentColumnNodes.push(nodeId);
                nodeId++;
            }
    
            if (col > 0) {
                previousColumnNodes.forEach(fromNodeId => {
                    const toNodeId = currentColumnNodes[Math.floor(Math.random() * currentColumnNodes.length)];
                    const cost = Math.floor(Math.random() * 10) + 1;
                    edges.push({ from: fromNodeId, to: toNodeId, cost: cost });
                });
            }
    
            previousColumnNodes = currentColumnNodes;
        }
    
        // Создаем путь от первого узла до последнего узла (гарантированно связанный граф)
        for (let i = 0; i < columns - 1; i++) {
            const fromNode = nodes[i];
            const toNode = nodes[i + 1];
            const cost = Math.floor(Math.random() * 10) + 1;
            edges.push({ from: fromNode.id, to: toNode.id, cost: cost });
        }
    
        nodes[0].isStart = true;
        nodes[nodes.length - 1].isEnd = true;
        currentNode = nodes[0].id;
    }
    

    function isPathAvailable(startId, endId, visited = new Set()) {
        if (startId === endId) return true;
        visited.add(startId);

        const adjacentNodes = edges
            .filter(edge => edge.from === startId || edge.to === startId)
            .map(edge => edge.from === startId ? edge.to : edge.from)
            .filter(nodeId => !visited.has(nodeId));

        for (let nodeId of adjacentNodes) {
            if (isPathAvailable(nodeId, endId, visited)) {
                return true;
            }
        }

        return false;
    }

    function drawGraph() {
        gameCanvas.innerHTML = '';
        
        let costLabels = [];
    
        edges.forEach((edge, index) => {
            const fromNode = nodePositions[edge.from];
            const toNode = nodePositions[edge.to];
    
            const edgeElement = document.createElement('div');
            edgeElement.style.position = 'absolute';
            edgeElement.style.width = `${Math.sqrt(Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2))}px`;
            edgeElement.style.height = '2px';
            edgeElement.style.backgroundColor = 'black';
            edgeElement.style.transformOrigin = '0 0';
            edgeElement.style.transform = `rotate(${Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)}rad)`;
            edgeElement.style.left = `${fromNode.x + 15}px`;
            edgeElement.style.top = `${fromNode.y + 15}px`;
            edgeElement.classList.add('edge');
            edgeElement.setAttribute('data-id', `${edge.from}-${edge.to}`); // Устанавливаем уникальный идентификатор ребра
    
            const existingLabel = costLabels.find(label => 
                (label.from === edge.from && label.to === edge.to) || 
                (label.from === edge.to && label.to === edge.from)
            );
    
            if (!existingLabel) {
                let labelX = (fromNode.x + toNode.x) / 2;
                let labelY = ((fromNode.y + toNode.y) / 2) - 10;
    
                while (costLabels.some(label => Math.abs(label.x - labelX) < 40 && Math.abs(label.y - labelY) < 20)) {
                    labelY -= 10;
                }
    
                costLabels.push({ from: edge.from, to: edge.to, x: labelX, y: labelY });
    
                const costLabel = document.createElement('div');
                costLabel.className = 'cost-label';
                costLabel.style.left = `${labelX}px`;
                costLabel.style.top = `${labelY}px`;
                costLabel.innerHTML = edge.cost;
    
                costLabel.addEventListener('click', () => {
                    highlightPath(edge.from, edge.to);
                });
    
                gameCanvas.appendChild(costLabel);
            }
    
            gameCanvas.appendChild(edgeElement);
        });
    
        nodes.forEach(node => {
            const nodeElement = document.createElement('div');
            nodeElement.className = `node ${node.isStart ? 'start' : node.isEnd ? 'end' : isNodeAccessible(node.id) ? 'accessible' : 'inaccessible'}`;
            nodeElement.style.left = `${node.x}px`;
            nodeElement.style.top = `${node.y}px`;
            nodeElement.setAttribute('data-id', node.id);
    
            if (isConnectedToEnd(node.id)) {
                nodeElement.classList.add('connected-to-end');
            }
    
            nodeElement.addEventListener('click', () => moveToNode(node.id));
            gameCanvas.appendChild(nodeElement);
        });
    }
    
    
    // Функция для подсветки пути между двумя узлами
    function highlightPath(fromId, toId) {
        // Сбрасываем предыдущую подсветку
        document.querySelectorAll('.edge').forEach(edge => {
            edge.style.backgroundColor = 'black';
            edge.style.height = '2px';
        });
        document.querySelectorAll('.node').forEach(node => {
            node.style.backgroundColor = '';
            node.style.border = '';
        });
    
        // Подсвечиваем узлы
        const fromNodeElement = document.querySelector(`.node[data-id="${fromId}"]`);
        const toNodeElement = document.querySelector(`.node[data-id="${toId}"]`);
    
        if (fromNodeElement) {
            fromNodeElement.style.backgroundColor = 'yellow';
        }
        if (toNodeElement) {
            toNodeElement.style.backgroundColor = 'yellow';
        }
    
        // Подсвечиваем ребро
        const edgeElement = document.querySelector(`.edge[data-id="${fromId}-${toId}"], .edge[data-id="${toId}-${fromId}"]`);
    
        if (edgeElement) {
            edgeElement.style.backgroundColor = 'red';
            edgeElement.style.height = '4px';
        }
    }
    
    
    
    

    function isNodeAccessible(nodeId) {
        return edges.some(edge => 
            (edge.from === currentNode && edge.to === nodeId) || 
            (edge.to === currentNode && edge.from === nodeId)
        );
    }

    function isConnectedToEnd(nodeId) {
        const endNode = nodes.find(n => n.isEnd);
        return edges.some(edge => 
            (edge.from === nodeId && edge.to === endNode.id) || 
            (edge.to === nodeId && edge.from === endNode.id)
        );
    }

    function moveToNode(nodeId) {
        const edge = edges.find(edge => 
            (edge.from === currentNode && edge.to === nodeId) || 
            (edge.to === currentNode && edge.from === nodeId)
        );

        if (edge) {
            currentCost += edge.cost;
            currentNode = nodeId;
            costCounter.innerHTML = `Текущая стоимость: ${currentCost}`;
            drawGraph();

            if (nodes.find(n => n.id === currentNode).isEnd) {
                displayVictoryMessage();
            }
        }
    }

    function displayVictoryMessage() {
        const shortestPathResult = findShortestPath();
        const minScore = shortestPathResult.cost; // Получаем минимальный скор
    
        const victoryMessage = document.createElement('div');
        victoryMessage.innerHTML = `Поздравляем! Вы достигли цели с общей стоимостью: ${currentCost}<br>Минимальная возможная стоимость: ${minScore}`;
        victoryMessage.style.position = 'absolute';
        victoryMessage.style.top = '50%';
        victoryMessage.style.left = '50%';
        victoryMessage.style.transform = 'translate(-50%, -50%)';
        victoryMessage.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
        victoryMessage.style.color = 'white';
        victoryMessage.style.padding = '20px';
        victoryMessage.style.borderRadius = '10px';
        victoryMessage.style.fontSize = '24px';
        victoryMessage.style.zIndex = '10';
        victoryMessage.style.textAlign = 'center';
    
        // Кнопка "Переиграть"
        const replayButton = document.createElement('button');
        replayButton.innerText = "Переиграть";
        replayButton.style.marginTop = '20px';
        replayButton.style.padding = '10px 20px';
        replayButton.style.fontSize = '16px';
        replayButton.style.cursor = 'pointer';
        replayButton.addEventListener('click', () => {
            currentCost = 0;
            currentNode = nodes[0].id; // Сбрасываем текущее положение игрока на начальный узел
            costCounter.innerHTML = `Текущая стоимость: ${currentCost}`;
            drawGraph(); // Перерисовываем тот же самый граф
            victoryMessage.remove(); // Убираем сообщение о победе
        });
    
        // Кнопка "Новая игра"
        const newGameButton = document.createElement('button');
        newGameButton.innerText = "Новая игра";
        newGameButton.style.marginTop = '10px';
        newGameButton.style.padding = '10px 20px';
        newGameButton.style.fontSize = '16px';
        newGameButton.style.cursor = 'pointer';
        newGameButton.addEventListener('click', () => {
            gameCanvas.innerHTML = ''; // Очистить холст
            currentCost = 0;
            costCounter.innerHTML = `Текущая стоимость: ${currentCost}`;
            generateValidGraph();
            drawGraph();
        });
    
        victoryMessage.appendChild(replayButton);
        victoryMessage.appendChild(newGameButton);
        gameCanvas.appendChild(victoryMessage);
    }
    
    
    function findShortestPath() {
        let distances = {};
        let prevNodes = {};
        let unvisited = new Set(nodes.map(node => node.id));
    
        nodes.forEach(node => {
            distances[node.id] = Infinity;
        });
        distances[nodes[0].id] = 0;
    
        while (unvisited.size > 0) {
            let currentNodeId = [...unvisited].reduce((minNodeId, nodeId) => 
                distances[nodeId] < distances[minNodeId] ? nodeId : minNodeId, [...unvisited][0]);
    
            if (distances[currentNodeId] === Infinity) break;
            unvisited.delete(currentNodeId);
    
            edges.filter(edge => edge.from === currentNodeId || edge.to === currentNodeId).forEach(edge => {
                let neighborId = edge.from === currentNodeId ? edge.to : edge.from;
                if (!unvisited.has(neighborId)) return;
    
                let newDist = distances[currentNodeId] + edge.cost;
                if (newDist < distances[neighborId]) {
                    distances[neighborId] = newDist;
                    prevNodes[neighborId] = currentNodeId;
                }
            });
        }
    
        let path = [];
        let currentNodeId = nodes[nodes.length - 1].id;
        while (currentNodeId !== nodes[0].id) {
            path.unshift(currentNodeId);
            currentNodeId = prevNodes[currentNodeId];
        }
        path.unshift(nodes[0].id);
    
        // Возвращаем путь и его общую стоимость
        return { path, cost: distances[nodes[nodes.length - 1].id] };
    }
    
    
    function highlightShortestPath() {
        const shortestPathResult = findShortestPath();
        const shortestPath = shortestPathResult.path;
        
        // Сбрасываем предыдущую подсветку
        document.querySelectorAll('.edge').forEach(edge => {
            edge.style.backgroundColor = 'black';
            edge.style.height = '2px';
        });
        document.querySelectorAll('.node').forEach(node => {
            node.style.backgroundColor = '';
            node.style.border = '';
        });
    
        // Подсвечиваем узлы и рёбра на кратчайшем пути
        for (let i = 0; i < shortestPath.length - 1; i++) {
            const fromId = shortestPath[i];
            const toId = shortestPath[i + 1];
    
            const fromNodeElement = document.querySelector(`.node[data-id="${fromId}"]`);
            const toNodeElement = document.querySelector(`.node[data-id="${toId}"]`);
    
            if (fromNodeElement) {
                fromNodeElement.style.backgroundColor = 'yellow';
            }
            if (toNodeElement) {
                toNodeElement.style.backgroundColor = 'yellow';
            }
    
            const edgeElement = document.querySelector(`.edge[data-id="${fromId}-${toId}"], .edge[data-id="${toId}-${fromId}"]`);
    
            if (edgeElement) {
                edgeElement.style.backgroundColor = 'red';
                edgeElement.style.height = '4px';
            }
        }
    }
    
    

    generateValidGraph();
    drawGraph();
});
