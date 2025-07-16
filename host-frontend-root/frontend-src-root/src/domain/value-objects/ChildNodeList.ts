export class ChildNodeList {
  private readonly nodes: Node[];

  constructor(nodeList: NodeList) {
    this.nodes = Array.from(nodeList);
  }

  appendAllTo(parentElement: Element): void {
    this.nodes.forEach(child => {
      parentElement.appendChild(child.cloneNode(true));
    });
  }

  static clearAllFrom(parentElement: Element): void {
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
  }

  get length(): number {
    return this.nodes.length;
  }
}
