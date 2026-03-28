export function generateBFSSteps(graph, start) {
    const visited = new Set();
    const queue = [];
    const steps = [];

    queue.push(start);
    visited.add(start);

    while (queue.length > 0) {
        const node = queue.shift();
        steps.push({type: "visit", node, queue: [...queue]});

        for (let neigh of graph[node]) {
            if (!visited.has(neigh)) {
                visited.add(neigh);
                queue.push(neigh);

                steps.push({
                    type: "enqueue",
                    from: node,
                    to: neigh,
                    queue: [...queue]
                });
            }
        }
    }

    return steps;
}