const layoutDagre = {name: 'dagre',
        rankDir: 'TB', 
        ranker: 'network-simplex',
        nodeSep: 25,
        avoidOverlap: true,
        fit: true,
}

const layoutKlay = {
    name: 'klay',
    klay: {
        direction: 'DOWN',
        layoutHierarchy: true,
        spacing: 50,
        edgeSpacingFactor: 0,
        fixedAlignment: 'RIGHTUP',
        nodeLayering:'INTERACTIVE',
      }

}

const layoutList = [layoutDagre, layoutKlay];