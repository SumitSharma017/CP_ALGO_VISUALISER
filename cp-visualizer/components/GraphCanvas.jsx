function GraphCanvas({ nodePositions, visitedNodes, graph, activeEdges }) {
    return (
        <div style={{ position: "relative", width: "800px", height: "600px" }}>
            {/* EDGES*/}

            {Object.entries(graph).map(([node, neighbors]) =>
                neighbors
                    .filter((neigh) => Number(node) < neigh)
                    .map((neigh, idx) => {
                        const from = nodePositions[node];
                        const to = nodePositions[neigh];

                        const isActive = activeEdges.some(
                            (edge) =>
                                (edge.from === Number(node) && edge.to === neigh) ||
                                (edge.from === neigh && edge.to === Number(node)),
                        );

                        return (
                            <div
                                key={`${node}-${neigh}-${idx}`}
                                style={{...getLineStyle(from.x, from.y, to.x, to.y),
                                backgroundColor: isActive? "red" : "black",
                                }}
                            />
                        );
                    }),
            )}

            {/* NODES*/}
            {Object.entries(nodePositions).map(([node, pos]) => {
                const isVisited = visitedNodes.includes(Number(node));

                return (
                    <div
                        key={node}
                        style={{
                            position: "absolute",
                            left: pos.x,
                            top: pos.y,
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: isVisited ? "green" : "gray",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                        }}
                    >
                        {node}
                    </div>
                );
            })}
        </div>
    );
}

function getLineStyle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return {
        position: "absolute",
        left: x1 + 20,
        top: y1 + 20,
        width: length,
        height: 2,
        backgroundColor: "black",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "0 0",
    };
}

export default GraphCanvas;
