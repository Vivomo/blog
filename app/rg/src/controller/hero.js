const HeroController = {
  init(app, hero) {
    const graph = hero.graph;
    const keyState = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    app.ticker.add(() => {
      updatePosition();
    })

    function handleKeyDown(event) {
      const keyCode = event.code;
      keyState[keyCode] = true;
    }

    function handleKeyUp(event) {
      const keyCode = event.code;
      keyState[keyCode] = false;
    }


    function updatePosition() {
      const moveDistance = 3;

      if (keyState.ArrowUp && keyState.ArrowLeft) {
        graph.x -= moveDistance;
        graph.y -= moveDistance;
      } else if (keyState.ArrowUp && keyState.ArrowRight) {
        graph.x += moveDistance;
        graph.y -= moveDistance;
      } else if (keyState.ArrowDown && keyState.ArrowLeft) {
        graph.x -= moveDistance;
        graph.y += moveDistance;
      } else if (keyState.ArrowDown && keyState.ArrowRight) {
        graph.x += moveDistance;
        graph.y += moveDistance;
      } else if (keyState.ArrowUp) {
        graph.y -= moveDistance;
      } else if (keyState.ArrowDown) {
        graph.y += moveDistance;
      } else if (keyState.ArrowLeft) {
        graph.x -= moveDistance;
      } else if (keyState.ArrowRight) {
        graph.x += moveDistance;
      }
    }

  }
}

export default HeroController;