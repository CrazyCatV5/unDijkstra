document.addEventListener('DOMContentLoaded', function () {
    const gameCanvas = document.getElementById('gameCanvas');
    const costCounter = document.getElementById('costCounter');
    const regenerateButton = document.createElement('button');
    const surrenderButton = document.createElement('button');
    const showAlgorithmButton = document.createElement('button');

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
        resetLevel();
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

    showAlgorithmButton.innerText = "Показать алгоритм";
    showAlgorithmButton.style.position = 'absolute';
    showAlgorithmButton.style.bottom = '60px';
    showAlgorithmButton.style.left = '50%';
    showAlgorithmButton.style.transform = 'translateX(-50%)';
    showAlgorithmButton.style.padding = '10px 20px';
    showAlgorithmButton.style.fontSize = '16px';
    showAlgorithmButton.addEventListener('click', () => {
        demonstrateAlgorithm();
    });
    document.body.appendChild(showAlgorithmButton);

    const levels = [
        {
            nodes: [
                { id: 1, x: 100, y: 100 },
                { id: 2, x: 300, y: 100 },
                { id: 3, x: 500, y: 100 },
                { id: 4, x: 300, y: 300 },
                { id: 5, x: 500, y: 200 },
                { id: 6, x: 700, y: 300 }
            ],
            edges: [
                { from: 1, to: 2, cost: 3 },
                { from: 2, to: 3, cost: 1 },
                { from: 2, to: 4, cost: 4 },
                { from: 3, to: 5, cost: 2 },
                { from: 4, to: 6, cost: 5 },
                { from: 5, to: 6, cost: 3 }
            ],
            startNode: 1,
            endNode: 6
        },
        {
            nodes: [
                { id: 1, x: 100, y: 200 },
                { id: 2, x: 250, y: 100 },
                { id: 3, x: 250, y: 300 },
                { id: 4, x: 400, y: 200 },
                { id: 5, x: 550, y: 100 },
                { id: 6, x: 550, y: 300 },
                { id: 7, x: 700, y: 200 }
            ],
            edges: [
                { from: 1, to: 2, cost: 2 },
                { from: 1, to: 3, cost: 4 },
                { from: 2, to: 4, cost: 3 },
                { from: 3, to: 4, cost: 1 },
                { from: 4, to: 5, cost: 2 },
                { from: 4, to: 6, cost: 5 },
                { from: 5, to: 7, cost: 3 },
                { from: 6, to: 7, cost: 2 }
            ],
            startNode: 1,
            endNode: 7
        },
        {
            nodes: [
                { id: 1, x: 100, y: 100 },
                { id: 2, x: 300, y: 100 },
                { id: 3, x: 300, y: 300 },
                { id: 4, x: 500, y: 200 },
                { id: 5, x: 700, y: 100 },
                { id: 6, x: 700, y: 300 },
                { id: 7, x: 900, y: 200 }
            ],
            edges: [
                { from: 1, to: 2, cost: 3 },
                { from: 1, to: 3, cost: 5 },
                { from: 2, to: 4, cost: 2 },
                { from: 3, to: 4, cost: 1 },
                { from: 4, to: 5, cost: 4 },
                { from: 4, to: 6, cost: 3 },
                { from: 5, to: 7, cost: 2 },
                { from: 6, to: 7, cost: 3 }
            ],
            startNode: 1,
            endNode: 7
        },
        {
            nodes: [
                { id: 1, x: 100, y: 150 },
                { id: 2, x: 300, y: 150 },
                { id: 3, x: 300, y: 350 },
                { id: 4, x: 500, y: 150 },
                { id: 5, x: 500, y: 350 },
                { id: 6, x: 700, y: 250 },
                { id: 7, x: 900, y: 250 }
            ],
            edges: [
                { from: 1, to: 2, cost: 2 },
                { from: 1, to: 3, cost: 4 },
                { from: 2, to: 4, cost: 3 },
                { from: 3, to: 5, cost: 1 },
                { from: 4, to: 6, cost: 5 },
                { from: 5, to: 6, cost: 2 },
                { from: 6, to: 7, cost: 3 }
            ],
            startNode: 1,
            endNode: 7
        },
        {
            nodes: [
                { id: 1, x: 150, y: 100 },
                { id: 2, x: 300, y: 200 },
                { id: 3, x: 150, y: 300 },
                { id: 4, x: 450, y: 150 },
                { id: 5, x: 450, y: 350 },
                { id: 6, x: 600, y: 100 },
                { id: 7, x: 600, y: 300 },
                { id: 8, x: 750, y: 200 }
            ],
            edges: [
                { from: 1, to: 2, cost: 3 },
                { from: 1, to: 3, cost: 4 },
                { from: 2, to: 4, cost: 2 },
                { from: 3, to: 5, cost: 3 },
                { from: 4, to: 6, cost: 2 },
                { from: 5, to: 7, cost: 1 },
                { from: 6, to: 8, cost: 4 },
                { from: 7, to: 8, cost: 2 }
            ],
            startNode: 1,
            endNode: 8
        }
    ];

    let currentLevelIndex = 0;
    let currentLevel = levels[currentLevelIndex];

    loadLevel(currentLevel);

    function loadLevel(level) {
        nodes = level.nodes;
        edges = level.edges;
        nodePositions = {};
    
        // Определяем размеры экрана
        const canvasWidth = gameCanvas.clientWidth;
        const canvasHeight = gameCanvas.clientHeight;
    
        // Определяем границы графа
        const graphBounds = {
            minX: Math.min(...nodes.map(node => node.x)),
            maxX: Math.max(...nodes.map(node => node.x)),
            minY: Math.min(...nodes.map(node => node.y)),
            maxY: Math.max(...nodes.map(node => node.y))
        };
    
        // Вычисляем коэффициенты масштабирования
        const scaleX = canvasWidth / (graphBounds.maxX - graphBounds.minX + 100);
        const scaleY = canvasHeight / (graphBounds.maxY - graphBounds.minY + 100);
        const scale = Math.min(scaleX, scaleY); // Выбираем минимальный коэффициент
    
        nodes.forEach(node => {
            nodePositions[node.id] = {
                x: (node.x - graphBounds.minX) * scale + 50,
                y: (node.y - graphBounds.minY) * scale + 50
            };
        });
    
        currentNode = level.startNode;
        currentCost = 0;
        drawGraph();
        costCounter.innerHTML = `Текущая стоимость: ${currentCost}`;
    }
    

    function nextLevel() {
        if (currentLevelIndex < levels.length - 1) {
            currentLevelIndex++;
            currentLevel = levels[currentLevelIndex];
            loadLevel(currentLevel);
        } else {
            alert('Все уровни пройдены!');
        }
    }

    function resetLevel() {
        currentNode = currentLevel.startNode;
        currentCost = 0;
        loadLevel(currentLevel);
    }

    function isConnectedToEnd(nodeId) {
        const endNode = nodes.find(n => n.id === currentLevel.endNode);

        if (!endNode) {
            console.error("End node is not defined");
            return false;
        }

        return edges.some(edge =>
            (edge.from === nodeId && edge.to === endNode.id) ||
            (edge.to === nodeId && edge.from === endNode.id)
        );
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
            edgeElement.setAttribute('data-id', `${edge.from}-${edge.to}`);
    
            const existingLabel = costLabels.find(label =>
                (label.from === edge.from && label.to === edge.to) ||
                (label.from === edge.to && label.to === edge.from)
            );
    
            if (!existingLabel) {
                let labelX = (fromNode.x + toNode.x) / 2;
                let labelY = ((fromNode.y + toNode.y) / 2) - 10;
    
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
            nodeElement.classList.add('node');
    
            if (node.id === currentLevel.startNode) {
                nodeElement.classList.add('start');
            } else if (node.id === currentLevel.endNode) {
                nodeElement.classList.add('end');
            } else if (node.id === currentNode) {
                nodeElement.classList.add('current');
            } else if (document.querySelector(`.node[data-id="${node.id}"]`)?.classList.contains('visited')) {
                nodeElement.classList.add('visited');
            } else if (isNodeAccessible(node.id)) {
                nodeElement.classList.add('accessible');
            } else {
                nodeElement.classList.add('default');
            }
    
            nodeElement.style.left = `${nodePositions[node.id].x}px`;
            nodeElement.style.top = `${nodePositions[node.id].y}px`;
            nodeElement.setAttribute('data-id', node.id);
    
            if (isConnectedToEnd(node.id)) {
                nodeElement.classList.add('connected-to-end');
            }
    
            nodeElement.addEventListener('click', () => moveToNode(node.id));
            gameCanvas.appendChild(nodeElement);
        });
    }
    
    
    

    function isNodeAccessible(nodeId) {
        return edges.some(edge =>
            (edge.from === currentNode && edge.to === nodeId) ||
            (edge.to === currentNode && edge.from === nodeId)
        );
    }

    function moveToNode(nodeId) {
        const edge = edges.find(edge =>
            (edge.from === currentNode && edge.to === nodeId) ||
            (edge.to === currentNode && edge.from === nodeId)
        );
    
        if (edge) {
            currentCost += edge.cost;
    
            // Отметить текущий узел как посещённый
            document.querySelector(`.node[data-id="${currentNode}"]`).classList.add('visited');
    
            currentNode = nodeId;
            costCounter.innerHTML = `Текущая стоимость: ${currentCost}`;
            drawGraph();
    
            if (currentNode === currentLevel.endNode) {
                displayVictoryMessage();
            }
        }
    }
    
    

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

        return { path, cost: distances[nodes[nodes.length - 1].id] };
    }

    function displayVictoryMessage() {
        const shortestPathResult = findShortestPath();
        const minScore = shortestPathResult.cost;

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
            nextLevel(); // Переходим на следующий уровень
        });

        victoryMessage.appendChild(replayButton);
        victoryMessage.appendChild(newGameButton);
        gameCanvas.appendChild(victoryMessage);
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

    function demonstrateAlgorithm() {
        let distances = {};
        let prevNodes = {};
        let unvisited = new Set(nodes.map(node => node.id));
    
        // Инициализация расстояний
        nodes.forEach(node => {
            distances[node.id] = Infinity;
        });
        distances[currentLevel.startNode] = 0;
    
        let step = 0;
    
        function stepThroughAlgorithm() {
            if (unvisited.size === 0) return;
    
            // Найти узел с минимальной дистанцией среди непосещённых
            let currentNodeId = [...unvisited].reduce((minNodeId, nodeId) =>
                distances[nodeId] < distances[minNodeId] ? nodeId : minNodeId, [...unvisited][0]);
    
            // Если расстояние бесконечно, алгоритм завершен
            if (distances[currentNodeId] === Infinity) return;
    
            unvisited.delete(currentNodeId);
    
            // Подсветка текущего узла
            document.querySelector(`.node[data-id="${currentNodeId}"]`).style.backgroundColor = 'blue';
    
            edges.filter(edge => edge.from === currentNodeId || edge.to === currentNodeId).forEach(edge => {
                let neighborId = edge.from === currentNodeId ? edge.to : edge.from;
    
                if (!unvisited.has(neighborId)) return;
    
                let newDist = distances[currentNodeId] + edge.cost;
    
                if (newDist < distances[neighborId]) {
                    distances[neighborId] = newDist;
                    prevNodes[neighborId] = currentNodeId;
    
                    // Подсветка ребра
                    const edgeElement = document.querySelector(`.edge[data-id="${edge.from}-${edge.to}"], .edge[data-id="${edge.to}-${edge.from}"]`);
                    if (edgeElement) {
                        edgeElement.style.backgroundColor = 'orange';
                        edgeElement.style.height = '4px';
                    }
    
                    // Подсветка соседнего узла
                    document.querySelector(`.node[data-id="${neighborId}"]`).style.backgroundColor = 'lightgreen';
                }
            });
    
            step++;
    
            // Пауза перед следующим шагом
            setTimeout(stepThroughAlgorithm, 1000);
        }
    
        stepThroughAlgorithm();
    }
    
});
